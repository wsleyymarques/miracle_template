export interface PasswordGenerateConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export const DEFAULT_PASSWORD_CONFIG: PasswordGenerateConfig = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true,
};

export function generatePassword(config: Partial<PasswordGenerateConfig> = {}): string {
  const finalConfig = { ...DEFAULT_PASSWORD_CONFIG, ...config };
  
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*';
  const similar = 'Il1O0';
  
  let charset = '';
  if (finalConfig.includeUppercase) charset += uppercase;
  if (finalConfig.includeLowercase) charset += lowercase;
  if (finalConfig.includeNumbers) charset += numbers;
  if (finalConfig.includeSymbols) charset += symbols;
  if (finalConfig.excludeSimilar) {
    charset = charset.split('').filter(c => !similar.includes(c)).join('');
  }
  
  if (charset.length === 0) {
    throw new Error('At least one character type must be enabled');
  }
  
  let password = '';
  const randomBytes = crypto.getRandomValues(new Uint8Array(finalConfig.length));
  
  for (let i = 0; i < finalConfig.length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}

// Use Web Crypto API for Node.js compatibility
const crypto = globalThis.crypto || require('crypto').webcrypto;