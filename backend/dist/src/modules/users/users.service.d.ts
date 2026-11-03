import { CreateUserInput, UpdateUserInput } from './users.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class UsersService {
    list(params: PaginationParams, role?: string, siteId?: string): Promise<{
        total: number;
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            role: {
                name: string;
                id: string;
                description: string | null;
            };
            site: {
                code: string;
                name: string;
                id: string;
            } | null;
        }[];
    }>;
    getById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        role: {
            name: string;
            id: string;
            permissions: {
                permission: {
                    id: string;
                    createdAt: Date;
                    description: string | null;
                    action: string;
                    resource: string;
                };
            }[];
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
    }>;
    create(input: CreateUserInput, actorId?: string, ipAddress?: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        createdAt: Date;
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
    }>;
    update(id: string, input: UpdateUserInput, actorId?: string, ipAddress?: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        isActive: boolean;
        updatedAt: Date;
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
    }>;
    updateRole(id: string, roleName: string, actorId?: string, ipAddress?: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isSystem: boolean;
        };
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
}
export declare const usersService: UsersService;
//# sourceMappingURL=users.service.d.ts.map