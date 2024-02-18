import { ethers } from 'ethers';

export default async function handler(req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Preflight request, respond with 200 OK
    res.status(200).end();
    return;
  }
  if (req.method === 'POST') {
    try {
      const { email, orderid } = req.body;

      const abiFilePath = process.env.NEXT_PUBLIC_MERCHABHI || "";
      const response = await fetch(abiFilePath);
      const abi = await response.json();

      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
      const contractAddress = process.env.NEXT_PUBLIC_MERCHANT || "";
      const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        // Call the 'getMerContractDetails' function on the smart contract
        const existingDetails = await contract.getMerContractDetails(email);

        if (existingDetails[1] !== '') {
          // Use the provided contract address, no need to redefine 'contract' and 'provider'
          const invoiceContractAddress = process.env.NEXT_PUBLIC_MERCHUSERABHI || "";
          const invoiceResponse = await fetch(invoiceContractAddress);
          const invoiceAbi = await invoiceResponse.json();

          // Create a contract instance for the 'invoice' contract
          const invoiceContract = new ethers.Contract(existingDetails[4], invoiceAbi, provider);

          // Call a function on the 'invoice' smart contract
          const result = await invoiceContract.getInvoice(orderid);

          if (result === '') {
            res.status(200).json({ "message": "Not paid" });
          } else {
            res.status(200).json({ "message": "success", result });
          }
        } else {
          res.status(200).json({ "message": "No contract details found for the provided email" });
        }
      } catch (error) {
        console.error('Error calling smart contract:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error fetching ABI file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
