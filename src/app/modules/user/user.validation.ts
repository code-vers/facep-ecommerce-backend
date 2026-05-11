import { z } from 'zod';

const changeRole = z.object({
  body: z
    .object({
      role: z.enum(['USER', 'MANAGER', 'ADMIN'], {
        message: 'Invalid role. Must be USER, MANAGER, or ADMIN.'
      })
    })
    .strict()
});

export const UserValidation = {
  changeRole
};
