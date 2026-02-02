import { prisma } from '../db.js';

export const getSessionUser = async (req: any) => {
  // 1. access token
  const token =
    req.headers.authorization?.split(' ')[1] || req.cookies?.['better-auth.session-token'];

  if (!token) return null;

  // 2. check prisma session
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }, // access user information
  });

  // 3. check if expire
  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return session.user;
};
