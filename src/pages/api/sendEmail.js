import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract email data from the request body
      const { to, subject, text } = req.body;

      // Create a nodemailer transporter with your SMTP configuration
      const transporter = nodemailer.createTransport({
        host: process.env.NEXT_PUBLIC_SMTPHOST,
        port: process.env.NEXT_PUBLIC_SMTPPORT,
        secure: process.env.NEXT_PUBLIC_SMTPSECURE,
        auth: {
          user: process.env.NEXT_PUBLIC_SMTPUSER,
          pass: process.env.NEXT_PUBLIC_SMTPPASS,
        },
      });

      // Send the email
      const info = await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_SMTPEMAIL,
        to,
        subject,
        text,
      });

      console.log('Email sent:', info);

      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
