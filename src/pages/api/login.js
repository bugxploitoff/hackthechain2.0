
import { withIronSession } from 'next-iron-session';
import { ethers } from 'ethers';

const handler = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Ethereum contract interaction code...
    const abiFilePath = process.env.NEXT_PUBLIC_ABHI || "";
    const response = await fetch(abiFilePath);
    const abi = await response.json();

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT || "";
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);
    const contracts = new ethers.Contract(contractAddress, abi, signer);

    try {
      const existingDetails = await contracts.getSubContractDetails(email);
      const abiFilePath = process.env.NEXT_PUBLIC_ABHI || "";
    const response = await fetch(abiFilePath);
    const abi = await response.json();

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT || "";
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer)
    
      if (existingDetails[2] !== '') {
        const userabiFilePath = process.env.NEXT_PUBLIC_USER || "";
        const userresponse = await fetch(userabiFilePath);
        const userabi = await userresponse.json();
        const userAddress = existingDetails[6];
        const name = existingDetails[0];
        const usercontract = new ethers.Contract(userAddress, userabi, signer);

        try {
          const isLoginSuccessful = await usercontract.login(password, username);

          if (isLoginSuccessful) {
            // If login is successful, set the user information in the session
            const user = { userAddress, name, email }; // You can include more user details if needed
            req.session.set('user', user);
            await req.session.save();

            res.status(200).json({ message: 'Login successful', user });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } catch (error) {
          console.error('Error during Ethereum contract login:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
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
