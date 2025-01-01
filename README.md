# url-signer-nodejs

[![npm version](https://img.shields.io/npm/v/url-signer-nodejs)](https://www.npmjs.com/package/url-signer-nodejs)
[![Build Status](https://github.com/ioriver/url-signer-nodejs/actions/workflows/test.yml/badge.svg)](https://github.com/ioriver/url-signer-nodejs/actions)

## Overview

**url-signer-nodejs** is a Node.js library designed to generate signatures for URLs. These signatures can be used by the IO River service with Signed-URLs enabled to secure access to content. The library generates signatures for all CDN providers associated with the service.

---

## Installation

Install the library via npm:

```bash
npm install url-signer-nodejs
```

Or via yarn:

```bash
yarn add url-signer-nodejs
```

## Usage

Below is some example to help you get started:

### Step 1: Create URL Signer

```javascript
const UrlSigner = require("url-signer-nodejs");

const privateKey = "YourPrivateKey";
const encryptionKey = "YourEncryptionKey";

// use the provider key information copied from your service
providersKeyInfo = {
  cloudfront_key_id: "1234",
  fastly_key_id: "5678",
};

// Initialize the UrlSigner
const signer = new UrlSigner(privateKey, encryptionKey, providersKeyInfo);
```

### Step 2: Generate Signature

```javascript
# the policy to be signed
const policy = {
  resources: "https://example.com/*",
  condition: {
    endTime: 1733356800,
  },
};

# generate signature for all CDNs
const signature = singer.generateUrlSignature(policy);
```

## API Reference

### UrlSigner Constructor

#### Parameters

- **`privateKey`** (string): The private key for signing the URL.
- **`encryptionKey`** (string): The encryption key for signing the URL.
- **`providersKeyInfo`** (object): Information about the keys deployed within the CDN providers (copied from your service).

### generateUrlSignature(policy)

#### Attributes for policy

- **`resources`** (required):
  A string specifying the URL or URL pattern the policy applies to.

- **`condition`** (required):  
  A dictionary containing conditions for the policy.

  - **`endTime`** (required):  
    An integer specifying the UNIX timestamp when the signature will expire.

  Additional optional attributes in the `condition` dictionary include:

  - **`startTime`**:  
    An integer specifying the UNIX timestamp when the signature becomes valid. Default: None.

## Requirements

This library requires:

- Node.js 12 or later.
- Dependencies listed in package.json.

## Testing

```bash
npm test
```

## Support

If you encounter any issues, please [open an issue](https://github.com/ioriver/url-signer-nodejs/issues) on GitHub or contact us at support@ioriver.io.
