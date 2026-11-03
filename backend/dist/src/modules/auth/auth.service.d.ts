import { RegisterInput, LoginInput } from './auth.validation.js';
export declare class AuthService {
    register(input: RegisterInput, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            role: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isSystem: boolean;
            };
            site: {
                code: string;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                latitude: number | null;
                longitude: number | null;
                timezone: string;
            } | null;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            roleId: string;
            siteId: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<{
        user: {
            role: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isSystem: boolean;
            };
            site: {
                code: string;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                latitude: number | null;
                longitude: number | null;
                timezone: string;
            } | null;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            roleId: string;
            siteId: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string, ipAddress?: string, userAgent?: string): Promise<void>;
    refresh(refreshToken: string): Promise<{
        user: {
            role: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isSystem: boolean;
            };
            site: {
                code: string;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                address: string | null;
                city: string | null;
                state: string | null;
                country: string | null;
                latitude: number | null;
                longitude: number | null;
                timezone: string;
            } | null;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            roleId: string;
            siteId: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getMe(userId: string): Promise<{
        role: {
            permissions: ({
                permission: {
                    id: string;
                    createdAt: Date;
                    description: string | null;
                    action: string;
                    resource: string;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isSystem: boolean;
        };
        site: {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            timezone: string;
        } | null;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        roleId: string;
        siteId: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private generateTokens;
    private updateRefreshToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map