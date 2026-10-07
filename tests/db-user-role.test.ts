import { describe, it, expect } from 'vitest';
import { prisma } from '../src/lib/db';

describe('Database User and Role Models', () => {
  it('should query roles from database', async () => {
    // @ts-ignore
    const roles = await prisma.role.findMany();
    expect(Array.isArray(roles)).toBe(true);
    expect(roles.length).toBeGreaterThanOrEqual(3);
    const roleNames = roles.map((r: any) => r.name);
    expect(roleNames).toContain('ADMIN');
    expect(roleNames).toContain('STAFF');
    expect(roleNames).toContain('CUSTOMER');
  });

  it('should query users with role relation from database', async () => {
    // @ts-ignore
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(3);
    const adminUser = users.find((u: any) => u.email === 'admin@glowseoul.vn');
    expect(adminUser).toBeDefined();
    expect(adminUser.role.name).toBe('ADMIN');
    expect(adminUser.password).toBeDefined();

    const staffUser = users.find((u: any) => u.email === 'staff@glowseoul.vn');
    expect(staffUser).toBeDefined();
    expect(staffUser.role.name).toBe('STAFF');

    const customerUser = users.find((u: any) => u.email === 'customer@glowseoul.vn');
    expect(customerUser).toBeDefined();
    expect(customerUser.role.name).toBe('CUSTOMER');
  });
});
