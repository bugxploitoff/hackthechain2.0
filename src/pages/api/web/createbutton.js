import { withIronSession } from 'next-iron-session';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  try {
    const { email, amount, callback } = req.body;

    // Ethereum contract interaction code...
    const abiFilePath = process.env.NEXT_PUBLIC_MERCHABHI || "";
    const response = await fetch(abiFilePath);
    const abi = await response.json();

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = process.env.NEXT_PUBLIC_MERCHANT || "";
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);
    const contracts = new ethers.Contract(contractAddress, abi, signer);

    try {
      const existingDetails = await contracts.getMerContractDetails(email);
      console.log(existingDetails);
      if (existingDetails[4] !== '') {
        const merchant = existingDetails[4];
        const abiFilePath = process.env.NEXT_PUBLIC_ABHI || "";
        const response = await fetch(abiFilePath);
        const abi = await response.json();
        const contractAddress1 = process.env.NEXT_PUBLIC_CONTRACT || "";
        const contract = new ethers.Contract(contractAddress1, abi, signer);
        const existingDetail = await contract.getSubContractDetails(email);
        const walletid = existingDetail[6];
        const token = jwt.sign({ email, amount, walletid, merchant, callback }, process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD);
        res.status(200).json({ message: token });
      } else {
        res.status(404).json({ error: 'No account found' });
      }
    } catch (error) {
      console.error('Contract deployment error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default withIronSession(handler, {
  password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
