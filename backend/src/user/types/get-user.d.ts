import { User } from '@prisma/client';

export type GetUserType = Pick<User, 'id' | 'role' | 'status'>;
