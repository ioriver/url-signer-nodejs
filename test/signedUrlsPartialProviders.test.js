const fs = require("fs");
const UrlSigner = require("../urlSigner");

const privateKey = fs.readFileSync("./test/private_key.pem", "utf8");
const encryptionKey = "abcdef1234";

// key info doesn't include Akamai
const providersKeyInfo = {
  cloudfront_key_id: "1234",
  fastly_key_id: "5678",
};

const signer = new UrlSigner(privateKey, encryptionKey, providersKeyInfo);

const policy = {
  resources: "https://www.example.com/streams/*",
  condition: {
    startTime: 1234000,
    endTime: 1235000,
    ipAddresses: "192.0.2.0/24",
  },
};

const expectedSignature =
  "Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vc3RyZWFtcy8qIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxMjM1MDAwfSwiRGF0ZUdyZWF0ZXJUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjEyMzQwMDB9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMTkyLjAuMi4wLzI0In19fV19&Signature=ZcV5KvY27PJl4uefiDVWaFIGSFTLNLgMWyzj40lDejorggJAh0sq6L55Nb2MwETZGUNXDxdpby0uHmP~eOFWB6UJyh1AMKaQxMlFKyWXLS-3GJfnukNtcR6YgPf7k43hapbiylqwitpcojAQhGzrtbRM~QzU2s9exDoR7TTNx4WH77yVkW~1fb3QQQ7d5IiMfeTi7oKlnH1TgRD0zKVHsxDSaUkC9Tp2SLNsQqbbACrFwdK-qb6c9IKxSH70VSpEw0Atx3UuPyNpU8hBVxpEOQyiHCPTpDiNdcSkcL5dMDu86SmqvG8arP2SJ3Cr6q1oyLYby4ce1EtHPxMCnOrzwA__&Key-Pair-Id=1234&FS-Policy=cmVzb3VyY2VzPWh0dHBzJTNBJTJGJTJGd3d3LmV4YW1wbGUuY29tJTJGc3RyZWFtcyUyRiUyQSZzdGFydF90aW1lPTEyMzQwMDAmZW5kX3RpbWU9MTIzNTAwMCZpcF9hZGRyZXNzZXM9MTkyLjAuMi4wJTJGMjQ=&FS-Signature=ED+iPaYgX+tMP/WJrlzAOOOhMZMMOInJWvHGBk3AGPWFl+n5AaUDQiHq3uSZOvM4JreRvOVadj+teyQzdrs8LubyCDFUmHOysgyLaT9CfjHVSinjVKuoPUdTKFgLZbO5nHu0M7Ryq6Mfj3l4yXiNnAv+ekUDyW4Xw+PXe5BWLX+Udwow2HCDqQiUFqrrnR36Ohm2+Z20JkeTrp1yRWLDHRxOPRveFk+4vGSTatkb3km+laO2PdS+ylQ21g4SFAWtYFM5JVMaqQ+jwP2evLywq1/9QwPg+K68FcQVabD6iEBF/tbYBKOoIoTA7/P3DmG0cMAODia3V0GE+4fRhuhGFw==&FS-Key-Id=5678";

test("should generate the correct signature", () => {
  const generatedSignature = signer.generateUrlSignature(policy);
  expect(generatedSignature).toBe(expectedSignature);
});
