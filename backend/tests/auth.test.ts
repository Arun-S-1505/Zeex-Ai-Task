import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../src/modules/auth/auth.service.js';
import prisma from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

describe('Authentication Module Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('login - should fail with invalid credentials', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      authService.login({ email: 'nonexistent@sentinel.ai', password: 'WrongPassword!' })
    ).rejects.toThrow('Invalid email or password');
  });

  it('login - should succeed with valid credentials and return JWT tokens', async () => {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const mockUser: any = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'operator@sentinel.ai',
      passwordHash,
      firstName: 'Safety',
      lastName: 'Operator',
      isActive: true,
      deletedAt: null,
      role: { id: '22222222-2222-2222-2222-222222222222', name: 'OPERATOR' },
      site: null,
    };

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
    vi.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);
    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as any);

    const result = await authService.login({
      email: 'operator@sentinel.ai',
      password: 'Password123!',
    });

    expect(result.tokens).toHaveProperty('accessToken');
    expect(result.tokens).toHaveProperty('refreshToken');
    expect(result.user.email).toBe('operator@sentinel.ai');
  });

  it('refresh - should reject invalid or expired refresh token', async () => {
    await expect(authService.refresh('invalid-token')).rejects.toThrow('Invalid or expired refresh token');
  });

  it('getMe - should retrieve authenticated user profile with permissions', async () => {
    const mockUser: any = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'operator@sentinel.ai',
      firstName: 'Safety',
      lastName: 'Operator',
      isActive: true,
      deletedAt: null,
      role: { id: 'role-1', name: 'OPERATOR', permissions: [] },
      site: null,
    };

    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    const profile = await authService.getMe('11111111-1111-1111-1111-111111111111');
    expect(profile.email).toBe('operator@sentinel.ai');
    expect(profile.firstName).toBe('Safety');
  });
});
