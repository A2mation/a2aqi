import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { beforeEach } from 'vitest';

// Create a deep mock of the Prisma client
export const prismaMock = mockDeep<PrismaClient>();

// Reset the mocks before each test to ensure isolation
beforeEach(() => {
    mockReset(prismaMock);
});
