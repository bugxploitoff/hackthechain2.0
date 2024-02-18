import qrcode from 'qrcode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { tokenId } = req.body;

  // Validate amount and UPI ID here if needed
  const upiString = `{"productid" : "${tokenId}"}`;

  try {
    const qrCodeImage = await qrcode.toDataURL(upiString);
    res.json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
