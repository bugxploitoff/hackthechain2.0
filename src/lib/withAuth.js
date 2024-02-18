import { withIronSession } from 'next-iron-session';

export const withAuth = (handler) =>
  withIronSession(handler, {
    password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD,
    cookieName: 'session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
