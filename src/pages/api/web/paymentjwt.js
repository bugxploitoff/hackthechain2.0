import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  try {
    const { email, amount, callback } = req.body;

        const token = jwt.sign({ email, amount, walletid, merchant }, process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD);
        res.status(200).json({ message: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

