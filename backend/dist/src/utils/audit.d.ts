export declare function createAuditLog(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    beforeState?: any;
    afterState?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string | null;
    ipAddress: string | null;
    action: string;
    entityType: string;
    entityId: string | null;
    beforeState: import("@prisma/client/runtime/library").JsonValue | null;
    afterState: import("@prisma/client/runtime/library").JsonValue | null;
    userAgent: string | null;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
}>;
//# sourceMappingURL=audit.d.ts.map