import qrcode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { orderId, amount, walletid, merchant, email, invoiceurl } = req.body;
  const upiString = {
    "id": orderId,
    "amount":  amount,
    "payto": walletid,
    "merchant_adress": merchant,
    "email": email,
    "ptyp" : "WEB",
    "invoiceurl" : invoiceurl 
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
