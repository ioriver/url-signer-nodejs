const fs = require("fs");
const UrlSigner = require("../urlSigner");

const privateKey = fs.readFileSync("./test/private_key.pem", "utf8");
const encryptionKey = "abcdef1234";
const providersKeyInfo = {
  cloudfront_key_id: "1234",
  fastly_key_id: "5678",
};

const signer = new UrlSigner(privateKey, encryptionKey, providersKeyInfo);

const policy = {
  resources: "https://www.example.com/*",
  condition: {
    endTime: 3313526400,
  },
};

const expectedSignature =
  "Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MzMxMzUyNjQwMH19fV19&Signature=wIFQbHL799IFPGSsf-etyXdOyAbl51sWE7Ab41petBrGJoj63vwKSuYp-vJUx9bjp3nRGgz-OkHDctp4pWgm4kW~ZaO6fZlnQWKnGuIWO4~ZTqXAbMbqnYHzvaiZSGZj0Ub6WER8jLC5sh7pl~7OXPMiBPots0EZM-8d8uyhQ4BNThUqOI5-fnE1~hxFPGvtqfNGu8xedygCZfrQZM6lEuf3B78Pex~9boBRxZ-vB~FYlp6tbGedpozPT0rgHOoOT6xpTzo0eJJPvjgBKoB5Hn5XZif4H6bwtZhtzW84MVjKgtjs-nFko8nUR5wsn~0iFt4K5YvMBY2iGnffEH8~qg__&Key-Pair-Id=1234&FS-Policy=cmVzb3VyY2VzPWh0dHBzJTNBJTJGJTJGd3d3LmV4YW1wbGUuY29tJTJGJTJBJmVuZF90aW1lPTMzMTM1MjY0MDA=&FS-Signature=Lh9LYj83zoX0fNH48eBmgciFsAQ7mDIZgDUfxgxfpPu8ZxDaocENvMMeHHMCEGjtzBnwm2+ESwHdW+4musaAcHKnqkylk7eGA2mPG1x9j9+pGMNg9ZpMaYl+dlZf3o2kjDCXdBgQsmPKvDYni4vT1PWH/5DRREqOTNQ5QVUIKzy6X+nXLzUlte75iqnlXyeZ3WPr/PWmIe3lQs/kKRIkMOjGOYJfFu3nKpdue0KRqOISr55ioaqi+B7+YGND05ko1frs1yq4eHECULZkbTaYpI9EqfGxbqlGL4V9FDZw/J23lO7tNjiaggO+yECo+Ozv8e/vRZ2s4D4KelNll5uOdA==&FS-Key-Id=5678";

test("should generate the correct signature", () => {
  const generatedSignature = signer.generateUrlSignature(policy);
  console.log(generatedSignature);
  expect(generatedSignature).toBe(expectedSignature);
});
