import prisma from '../../utils/prisma';
import { AuthService } from './auth.service';

jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() }
  }
}));

describe('Authentication account status', () => {
  it('blocks login for a deactivated account', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hash',
      role: 'BUYER',
      isActive: false
    });

    await expect(
      AuthService.login({ email: 'user@example.com', password: 'password' })
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
