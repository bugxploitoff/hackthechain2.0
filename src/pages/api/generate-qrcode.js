import qrcode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { tokenId,  address } = req.body;

  // Validate amount and UPI ID here if needed
  const upiString = `upi://pay?pa=${encodeURIComponent(process.env.NEXT_PUBLIC_MAIN)}&pn=${encodeURIComponent('SBT')}&mc=${encodeURIComponent(address)}&am=${tokenId}&cu=INR`;

  try {
    const qrCodeImage = await qrcode.toDataURL(upiString);
    res.json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
