import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tokenId } = req.body;

    try {
      // Replace 'your-secret-key' with the actual secret key used for signing the JWT
      const decodedToken = jwt.verify(tokenId,process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD);
      // You can now access the decoded payload
      const { email, amount, walletid, merchant, callback } = decodedToken;

      res.status(200).json({ decodedToken: { email, amount, walletid, merchant, callback } });
    } catch (error) {
      console.error('Error decoding JWT:', error.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
