// pages/api/login.js
import { withIronSession } from 'next-iron-session';
import { ethers } from 'ethers';

const handler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ethereum contract interaction code...
    const abiFilePath = process.env.NEXT_PUBLIC_MERCHABHI || "";
    const response = await fetch(abiFilePath);
    const abi = await response.json();

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = process.env.NEXT_PUBLIC_MERCHANT || "";
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const existingDetails = await contract.getMerContractDetails(email);
      if (existingDetails[1] !== '') {
        const abiFilePath = process.env.NEXT_PUBLIC_ABHI || "";
    const response = await fetch(abiFilePath);
    const abi = await response.json();
    const contractAddress1 = process.env.NEXT_PUBLIC_CONTRACT || "";
    const contract = new ethers.Contract(contractAddress1, abi, signer);
    const existingDetail = await contract.getSubContractDetails(email);
    const userAddress = existingDetail[6];


        const userabiFilePath = process.env.NEXT_PUBLIC_MERCHUSERABHI || "";
        const userresponse = await fetch(userabiFilePath);
        const userabi = await userresponse.json();
        const userMerchant = existingDetails[4];
        console.log(userMerchant)
        const name = existingDetails[0];
        const signer1 = new ethers.Wallet(privateKey, provider);
        const usercontract = new ethers.Contract(userMerchant, userabi, signer1);

        try {
          const isLoginSuccessful = await usercontract.login(password, email);

          if (isLoginSuccessful) {
            // If login is successful, set the user information in the session
            const user = { userAddress, name, email, userMerchant }; // You can include more user details if needed
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
  cookieName: 'merchant',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
