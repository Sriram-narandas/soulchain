'use client';

import CryptoJS from 'crypto-js';

export class SoulCrypto {
  private static getEncryptionKey(walletAddress: string): string {
    // Derive encryption key from wallet address
    return CryptoJS.SHA256(walletAddress + 'SoulChain').toString();
  }

  static encrypt(text: string, walletAddress: string): string {
    try {
      const key = this.getEncryptionKey(walletAddress);
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText: string, walletAddress: string): string {
    try {
      const key = this.getEncryptionKey(walletAddress);
      const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}