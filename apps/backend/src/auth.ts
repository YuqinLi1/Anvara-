import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from './db.js';

// TODO: Add sponsorId and publisherId to the user interface
// These are needed to scope queries to the user's own data
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'SPONSOR' | 'PUBLISHER';
    // FIXME: Missing sponsorId and publisherId fields
    sponsorId?: string;
    publisherId?: string;
  };
}

// TODO: This middleware doesn't actually validate anything!
// It should:
// 1. Check for Authorization header or session cookie
// 2. Validate the token/session
// 3. Look up the user in the database
// 4. Attach user info to req.user
// 5. Return 401 if invalid
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  // Better Auth will handle validation via headers
  // This is a placeholder for protected routes
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req as any).cookies?.['better-auth.session-token'];

  // 5. Return 401 if token is missing
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No session token found' });
  }

  const dbToken = token.includes('.') ? token.split('.')[0] : token;

  try {
    // 2 & 3. Validate token and look up user with profiles in the database
    const session = await prisma.session.findUnique({
      where: { token: dbToken },
      include: {
        user: {
          include: { sponsor: true, publisher: true },
        },
      },
    });

    // 5. Return 401 if session is invalid or expired
    if (!session || new Date() > session.expiresAt) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    }

    // 4. Attach user info, role, and profile IDs to req.user
    req.user = {
      id: session.user.id,
      email: session.user.email,
      // Logic to determine role based on which record exists
      role: session.user.publisher ? 'PUBLISHER' : 'SPONSOR',
      sponsorId: session.user.sponsor?.id,
      publisherId: session.user.publisher?.id,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
