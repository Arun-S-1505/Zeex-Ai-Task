import fs from 'fs';
import path from 'path';
import { env } from './env.js';

export interface StorageAdapter {
  save(file: Buffer, fileName: string, folder: string): Promise<string>;
  get(filePath: string): Promise<Buffer>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}

class LocalStorageAdapter implements StorageAdapter {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = path.resolve(basePath);
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async save(file: Buffer, fileName: string, folder: string): Promise<string> {
    const dir = path.join(this.basePath, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(folder, fileName);
    const fullPath = path.join(this.basePath, filePath);
    fs.writeFileSync(fullPath, file);
    return filePath;
  }

  async get(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return fs.readFileSync(fullPath);
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  getUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }
}

class S3StorageAdapter implements StorageAdapter {
  async save(_file: Buffer, _fileName: string, _folder: string): Promise<string> {
    throw new Error('S3 adapter not configured. Set S3 environment variables.');
  }
  async get(_filePath: string): Promise<Buffer> {
    throw new Error('S3 adapter not configured.');
  }
  async delete(_filePath: string): Promise<void> {
    throw new Error('S3 adapter not configured.');
  }
  getUrl(filePath: string): string {
    return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${filePath}`;
  }
}

export function createStorageAdapter(): StorageAdapter {
  if (env.STORAGE_TYPE === 's3') {
    return new S3StorageAdapter();
  }
  return new LocalStorageAdapter(env.STORAGE_LOCAL_PATH);
}

export const storage = createStorageAdapter();

