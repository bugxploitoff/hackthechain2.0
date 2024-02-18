// pages/protected-page.js
import React, { useEffect, useState, useRef } from "react";
import { withIronSession } from "next-iron-session";
import { useReactToPrint } from 'react-to-print';
import { ethers } from "ethers";
import bwipjs from 'bwip-js';
import html2canvas from 'html2canvas';

const PrintableComponent = React.forwardRef(({ qrCodeImage, name, cost, type, desc, details }, ref) => {
  return (
    <div className="flex w-full" ref={ref}>
      <img className="rounded-t-lg" src={qrCodeImage} alt="" />
      <canvas className="px-3" id="mycanvas"></canvas>
      <div className="p-4">
        <h2 className="text-2xl uppercase">{name}</h2>
        <p className="font-light text-gray-500 text-lg my-2">{cost} Rs (INR)</p>
        <p className="font-light text-gray-500 text-lg my-2">Product Type : {type}</p>
        <p className="font-light text-gray-500 text-lg my-2">Product Description : {desc}</p>
        <p className="font-light text-gray-500 text-lg my-2">Product Details : {details}</p>
      </div>
    </div>
  );
});

const ProtectedPage = ({ user }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get('p_id');
  const [name, setName] = useState('Product Name');
  const [cost, setCost] = useState('...');
  const [type, setType] = useState('...');
  const [desc, setDesc] = useState('...');
  const [details, setDetails] = useState('...');
  const [qrCodeImage, setQrCodeImage] = useState('...');

  const componentRef = useRef();

  useEffect(() => {
    try {
      let canvas = bwipjs.toCanvas('mycanvas', {
        bcid: 'code128',
        text: tokenId,
        scale: 2,
        height: 4,
        includetext: false,
        textxalign: 'center',
      });
    } catch (e) {
      console.error('Error generating barcode:', e);
    }
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/product-qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenId }),
    });

    const data = await response.json();

    if (response.ok) {
      setQrCodeImage(data.qrCodeImage);
    } else {
      console.error('Error generating QR code:', data.error);
    }

    try {
      const abiFilePath = '/usermerch.json';
      const response = await fetch(abiFilePath);
      const abi = await response.json();

      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
      const contractAddress = user.userMerchant;
      const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";

      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const existingDetails = await contract.getProductDetails(tokenId);

      setName(existingDetails[0]);
      setCost(existingDetails[2])
      setType(existingDetails[1])
      setDesc(existingDetails[3])
      setDetails(existingDetails[4])
    } catch (error) {
      console.error('Error fetching balance from the contract:', error);
    }
  }

  fetchData();

  const handleDownload = async () => {
    try {
      // Use html2canvas to convert the component to a canvas
      const canvas = await html2canvas(componentRef.current);

      // Convert the canvas to an image
      const dataUrl = canvas.toDataURL('image/png');

      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'product_id_'+tokenId+'.png';
      link.click();
    } catch (error) {
      console.error('Error converting component to canvas:', error);
    }
  };


  if (user) {
    return (
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          {/* Pass data to the PrintableComponent and set a ref */}
          <PrintableComponent
            ref={componentRef}
            qrCodeImage={qrCodeImage}
            name={name}
            cost={cost}
            type={type}
            desc={desc}
            details={details}
          />
          <button onClick={handleDownload} className="w-full block bg-gray-300 py-2 px-2 text-gray-600 text-center rounded shadow-lg uppercase font-light mt-6 hover:bg-gray-400 hover:text-white duration-300 ease-in-out">
            Download Label as Image
          </button>
        </div>
      </div>
    )
  }
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 401;
      res.end();
      return {};
    }

    return {
      props: { user }
    };
  },
  {
    cookieName: "merchant",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD
  }
);

export default ProtectedPage;
