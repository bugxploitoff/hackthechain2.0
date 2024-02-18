// pages/api/createInvoice.js

import { v4 as uuidv4 } from 'uuid';
import aws from 'aws-sdk';
import multer from 'multer';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

const upload = multer();

export default async function handler(req, res) {
    const invoiceid = uuidv4();
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { email, products, totalcost } = req.body;

    // Create a unique filename for the JSON file
    const fileName = `invoice-${invoiceid}.json`;

    // Create JSON content
    const jsonContent = JSON.stringify({
      email,
      products,
      totalcost,
      createdAt: new Date().toISOString(),
    });

    // Upload JSON file to S3
    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: jsonContent,
        ContentType: 'application/json',
        ACL: 'public-read', // Adjust the ACL based on your requirements
      })
      .promise();

      const emailData = {
        to: email,
        subject: `INVOICE GENERATED ${invoiceid}`,
        text: `
        Hi user, 
        This is to inform you that we have recived an order 
        Payment Status: Pending
        INVOICE ID : ${invoiceid}
        VIEW AT ${process.env.NEXT_PUBLIC_URL}/invoice?id=${invoiceid}`,
      };
      
      

      const response = await fetch(process.env.NEXT_SENDEMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });



    res.status(200).json({ success: true, message: invoiceid });
  } catch (error) {
    console.error('Error creating and uploading invoice:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
