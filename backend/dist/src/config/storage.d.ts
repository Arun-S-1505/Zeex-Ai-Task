export interface StorageAdapter {
    save(file: Buffer, fileName: string, folder: string): Promise<string>;
    get(filePath: string): Promise<Buffer>;
    delete(filePath: string): Promise<void>;
    getUrl(filePath: string): string;
}
export declare function createStorageAdapter(): StorageAdapter;
export declare const storage: StorageAdapter;
//# sourceMappingURL=storage.d.ts.map