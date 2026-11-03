import fs from 'fs';
import path from 'path';
import { env } from './env.js';
class LocalStorageAdapter {
    basePath;
    constructor(basePath) {
        this.basePath = path.resolve(basePath);
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }
    async save(file, fileName, folder) {
        const dir = path.join(this.basePath, folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(folder, fileName);
        const fullPath = path.join(this.basePath, filePath);
        fs.writeFileSync(fullPath, file);
        return filePath;
    }
    async get(filePath) {
        const fullPath = path.join(this.basePath, filePath);
        return fs.readFileSync(fullPath);
    }
    async delete(filePath) {
        const fullPath = path.join(this.basePath, filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
    getUrl(filePath) {
        return `/uploads/${filePath}`;
    }
}
class S3StorageAdapter {
    async save(_file, _fileName, _folder) {
        throw new Error('S3 adapter not configured. Set S3 environment variables.');
    }
    async get(_filePath) {
        throw new Error('S3 adapter not configured.');
    }
    async delete(_filePath) {
        throw new Error('S3 adapter not configured.');
    }
    getUrl(filePath) {
        return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${filePath}`;
    }
}
export function createStorageAdapter() {
    if (env.STORAGE_TYPE === 's3') {
        return new S3StorageAdapter();
    }
    return new LocalStorageAdapter(env.STORAGE_LOCAL_PATH);
}
export const storage = createStorageAdapter();
//# sourceMappingURL=storage.js.map