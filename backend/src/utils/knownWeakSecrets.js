export const KNOWN_WEAK_SECRETS = [
  "secret",
  "your-256-bit-secret",
  "your-secret-key",
  "changeme",
  "change_me",
  "supersecret",
  "supersecretkey",
  "jwt_secret",
  "jwtsecret",
  "mysecretkey",
  "secretkey",
  "12345678",
  "password",
  "test",
  "default",
  "shhhh",
  "keyboard cat",
  "node-jsonwebtoken-secret",
  "express-secret",
  "abc123",
  "qwerty123",
  "letmein",
  "admin123",
  "demo-secret",
  "sample-secret",
  "my-secret-key-12345",
];

export const WEAK_PATTERNS = [
  { regex: /^(.)\1+$/, label: "Caractère répété!!" },
  { regex: /^(0123456789|123456789|abcdefgh)/i, label: "Séquence prévisible" },
  { regex: /^(.{1,4})\1+$/, label: "Motif répétitif court" },
  { regex: /^(password|secret|admin|test|demo|jwt|token|key)[\d_-]*$/i, label: "Mot commun + suffixe numérique" },
  { regex: /^\d{4}(-\d{2}){0,2}$/, label: "Ressemble à une date" },
];

export const SENSITIVE_PAYLOAD_KEYS = [
  "password", "pwd", "ssn", "social_security", "credit_card", "card_number",
  "cvv", "secret", "api_key", "apikey", "private_key", "pin", "bank_account",
];
