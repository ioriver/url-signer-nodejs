// urlSigner.js

const crypto = require("crypto");
const EdgeAuth = require("akamai-edgeauth");

class UrlSigner {
  constructor(privateKey, encryptionKey, providersKeyInfo) {
    this.privateKey = privateKey;
    this.encryptionKey = encryptionKey;
    this.providersKeyInfo = new KeyInfo();
    this.providersKeyInfo.fromDict(providersKeyInfo);
  }

  generateUrlSignature(policyData) {
    const policy = new Policy();
    policy.fromDict(policyData);

    let signatures = [];
    if (this.providersKeyInfo.cloudfrontKeyId !== null) {
      signatures.push(this._generateCloudfrontSignedUrl(policy));
    }
    if (this.providersKeyInfo.fastlyKeyId !== null) {
      signatures.push(this._generateFastlySignedUrl(policy));
    }
    if (this.providersKeyInfo.akamaiKeyId !== null) {
      signatures.push(this._generateAkamaiSignedUrl(policy));
    }

    return signatures.join("&");
  }

  _generateAsymmetricSignature(message) {
    const sign = crypto.createSign("RSA-SHA1");
    sign.update(message);
    return sign.sign(this.privateKey);
  }

  _generateCloudfrontSignedUrl(policy) {
    const cfPolicy = this._makeCloudfrontPolicy(policy);
    const signature = this._generateAsymmetricSignature(Buffer.from(cfPolicy, "utf-8"));

    return (
      `Policy=${this._urlBase64EncodeCf(Buffer.from(cfPolicy, "utf-8"))}&` +
      `Signature=${this._urlBase64EncodeCf(signature)}&` +
      `Key-Pair-Id=${this.providersKeyInfo.cloudfrontKeyId}`
    );
  }

  _generateFastlySignedUrl(policy) {
    const params = {
      resources: policy.resources,
    };

    if (policy.condition) {
      if (policy.condition.startTime) params.start_time = policy.condition.startTime;
      if (policy.condition.endTime) params.end_time = policy.condition.endTime;
      if (policy.condition.ipAddresses) params.ip_addresses = policy.condition.ipAddresses;
    }

    const policyUrlEncoded = new URLSearchParams(params).toString().replace(/\*/g, "%2A");
    const signature = this._generateAsymmetricSignature(Buffer.from(policyUrlEncoded, "utf-8"));

    return (
      `FS-Policy=${this._urlBase64Encode(Buffer.from(policyUrlEncoded, "utf-8"))}&` +
      `FS-Signature=${this._urlBase64Encode(signature)}&` +
      `FS-Key-Id=${this.providersKeyInfo.fastlyKeyId}`
    );
  }

  _generateAkamaiSignedUrl(policy) {
    const akamaiPolicy = {
      key: this.encryptionKey,
      endTime: policy.condition.endTime,
    };

    if (policy.condition.startTime !== null) {
      akamaiPolicy.startTime = policy.condition.startTime;
    }

    if (policy.condition.ipAddresses !== null) {
      akamaiPolicy.ip = policy.condition.ipAddresses;
    }

    const et = new EdgeAuth(akamaiPolicy);
    const token = et.generateACLToken(policy.resources);
    return `AK-Signature-${this.providersKeyInfo.akamaiKeyId}=${token}`;
  }

  _makeCloudfrontPolicy(policy) {
    const awsPolicy = {
      Statement: [
        {
          Resource: policy.resources,
          Condition: {
            DateLessThan: {
              "AWS:EpochTime": policy.condition.endTime,
            },
          },
        },
      ],
    };

    if (policy.condition.startTime !== null) {
      awsPolicy.Statement[0].Condition.DateGreaterThan = {
        "AWS:EpochTime": policy.condition.startTime,
      };
    }

    if (policy.condition.ipAddresses !== null) {
      awsPolicy.Statement[0].Condition.IpAddress = {
        "AWS:SourceIp": policy.condition.ipAddresses,
      };
    }

    return JSON.stringify(awsPolicy).replace(/\s/g, "");
  }

  _urlBase64EncodeCf(data) {
    return data.toString("base64").replace(/\+/g, "-").replace(/=/g, "_").replace(/\//g, "~");
  }

  _urlBase64Encode(data) {
    return data.toString("base64");
  }
}

class KeyInfo {
  fromDict(dict) {
    this.cloudfrontKeyId = dict.cloudfront_key_id;
    this.fastlyKeyId = dict.fastly_key_id;
    this.akamaiKeyId = dict.akamai_key_id;
  }
}

class Policy {
  fromDict(data) {
    this.resources = data.resources;
    this.condition = data.condition;
  }
}

module.exports = UrlSigner;
