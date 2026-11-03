import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
export class UsersService {
    async list(params, role, siteId) {
        const where = { deletedAt: null };
        if (params.search) {
            where.OR = [
                { firstName: { contains: params.search, mode: 'insensitive' } },
                { lastName: { contains: params.search, mode: 'insensitive' } },
                { email: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = { name: role };
        }
        if (siteId) {
            where.siteId = siteId;
        }
        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                ...buildPrismaQuery(params),
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    avatar: true,
                    isActive: true,
                    lastLoginAt: true,
                    createdAt: true,
                    role: { select: { id: true, name: true, description: true } },
                    site: { select: { id: true, name: true, code: true } },
                },
            }),
        ]);
        return { total, users };
    }
    async getById(id) {
        const user = await prisma.user.findUnique({
            where: { id, deletedAt: null },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        permissions: { select: { permission: true } },
                    },
                },
                site: true,
            },
        });
        if (!user)
            throw new NotFoundError('User');
        return user;
    }
    async create(input, actorId, ipAddress) {
        const existing = await prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (existing)
            throw new ConflictError('Email already in use');
        const role = await prisma.role.findUnique({ where: { name: input.roleName } });
        if (!role)
            throw new NotFoundError(`Role ${input.roleName}`);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.password, salt);
        const user = await prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                passwordHash,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                roleId: role.id,
                siteId: input.siteId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                site: true,
                createdAt: true,
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'USER_CREATED',
            entityType: 'User',
            entityId: user.id,
            ipAddress,
            afterState: { email: user.email, role: input.roleName },
        });
        return user;
    }
    async update(id, input, actorId, ipAddress) {
        const user = await prisma.user.findUnique({ where: { id, deletedAt: null } });
        if (!user)
            throw new NotFoundError('User');
        const updated = await prisma.user.update({
            where: { id },
            data: input,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isActive: true,
                role: true,
                site: true,
                updatedAt: true,
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'USER_UPDATED',
            entityType: 'User',
            entityId: id,
            ipAddress,
            beforeState: { firstName: user.firstName, lastName: user.lastName, isActive: user.isActive },
            afterState: input,
        });
        return updated;
    }
    async updateRole(id, roleName, actorId, ipAddress) {
        const user = await prisma.user.findUnique({ where: { id, deletedAt: null }, include: { role: true } });
        if (!user)
            throw new NotFoundError('User');
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role)
            throw new NotFoundError(`Role ${roleName}`);
        const updated = await prisma.user.update({
            where: { id },
            data: { roleId: role.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'USER_ROLE_CHANGED',
            entityType: 'User',
            entityId: id,
            ipAddress,
            beforeState: { role: user.role.name },
            afterState: { role: roleName },
        });
        return updated;
    }
    async delete(id, actorId, ipAddress) {
        const user = await prisma.user.findUnique({ where: { id, deletedAt: null } });
        if (!user)
            throw new NotFoundError('User');
        await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        await createAuditLog({
            userId: actorId,
            action: 'USER_DELETED',
            entityType: 'User',
            entityId: id,
            ipAddress,
        });
    }
}
export const usersService = new UsersService();
//# sourceMappingURL=users.service.js.map