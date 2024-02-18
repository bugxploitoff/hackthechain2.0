// pages/api/logout.js
import { withIronSession } from 'next-iron-session';

const handler = async (req, res) => {    
  try {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default withIronSession(handler, {
  password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax', // Adjust based on your security requirements
  },
});
