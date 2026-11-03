import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database.js';
import { env } from '../../config/env.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors.js';
import { RegisterInput, LoginInput } from './auth.validation.js';
import { createAuditLog } from '../../utils/audit.js';

export class AuthService {
  async register(input: RegisterInput, ipAddress?: string, userAgent?: string) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const role = await prisma.role.findUnique({
      where: { name: input.roleName },
    });

    if (!role) {
      throw new NotFoundError(`Role ${input.roleName}`);
    }

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
      include: { role: true, site: true },
    });

    await createAuditLog({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
      afterState: { email: user.email, role: role.name },
    });

    const tokens = this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, refreshToken: __, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { role: true, site: true },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    const { passwordHash: _, refreshToken: __, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async logout(userId: string, ipAddress?: string, userAgent?: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    await createAuditLog({
      userId,
      action: 'USER_LOGOUT',
      entityType: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId, isActive: true, deletedAt: null },
        include: { role: true, site: true },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid or revoked refresh token');
      }

      const tokens = this.generateTokens(user.id);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      const { passwordHash: _, refreshToken: __, ...safeUser } = user;
      return { user: safeUser, tokens };
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        site: true,
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new NotFoundError('User');
    }

    const { passwordHash: _, refreshToken: __, ...safeUser } = user;
    return safeUser;
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}

export const authService = new AuthService();
