'use client';

import { create } from 'ipfs-http-client';

const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001';
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.infura.io/ipfs';

export class IPFSService {
  private static client = create({
    url: IPFS_API_URL,
    headers: {
      authorization: process.env.NEXT_PUBLIC_IPFS_AUTH_TOKEN || '',
    },
  });

  static async uploadJson(data: any): Promise<string> {
    try {
      const result = await this.client.add(JSON.stringify(data));
      return result.path;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  static async uploadText(text: string): Promise<string> {
    try {
      const result = await this.client.add(text);
      return result.path;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  static async fetchData(hash: string): Promise<any> {
    try {
      const response = await fetch(`${IPFS_GATEWAY}/${hash}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from IPFS');
      }
      return await response.json();
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw new Error('Failed to fetch from IPFS');
    }
  }

  static async fetchText(hash: string): Promise<string> {
    try {
      const response = await fetch(`${IPFS_GATEWAY}/${hash}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from IPFS');
      }
      return await response.text();
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw new Error('Failed to fetch from IPFS');
    }
  }

  static getGatewayUrl(hash: string): string {
    return `${IPFS_GATEWAY}/${hash}`;
  }
}