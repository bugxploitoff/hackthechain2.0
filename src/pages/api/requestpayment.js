import qrcode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { tokenId, address, Meraddress, email } = req.body;

  const response = await fetch(`https://sbtokens.s3.ap-south-1.amazonaws.com/invoice-${tokenId}.json`);
  const data = await response.json();
  const upiString = {
    "payto": address,
    "amount":  data.totalcost,
    "id": tokenId,
    "merchant_adress": Meraddress,
    "email": email,
  }
  const jsonString = JSON.stringify(upiString);

  try {
    const qrCodeImage = await qrcode.toDataURL(jsonString);
    res.json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
