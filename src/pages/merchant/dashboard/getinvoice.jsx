import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';  // Added useEffect for asynchronous operations
import { withIronSession } from 'next-iron-session';

const getinvoice = ({ user }) => {
  const [invoice, setInvoice] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
    const tokenId = urlParams.get("c_id");
  useEffect(() => {

    const getPaymentStatus = async () => {
      try {
        const abiFilePath = '/usermerch.json';
        const response = await fetch(abiFilePath);
        const abi = await response.json();
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
        const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
        const signer = new ethers.Wallet(privateKey, provider);

        const merch =  user.userMerchant; // Replace with your actual contract address
        const contract = new ethers.Contract(merch, abi, signer);
        const tx = await contract.getAllUserInvoice(tokenId);
        setInvoice(tx);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    getPaymentStatus();
  }, []); // Added empty dependency array for useEffect

  const handleItemClick = (clickedInvoice) => {
    window.location.href='/invoice?id='+clickedInvoice+'&merch='+user.userMerchant;

  };

  if (!user) {
    // User is not defined
    return <h1>User not defined</h1>;
  }

  return (
    <div class="mt-32">
    <div class="px-4 sm:px-8 max-w-5xl m-auto">
        <h1 class="text-center font-semibold text-sm">Invoice List</h1>
        <p class="mt-2 text-center text-xs mb-4 text-gray-500">For user {tokenId}</p>
        <ul class="border border-gray-200 rounded overflow-hidden shadow-md">
        {invoice.map((invoice, index) => (
            <li onClick={() => handleItemClick(invoice)} key={index} class="px-4 py-2 bg-white hover:bg-sky-100 hover:text-sky-900 border-b last:border-none border-gray-200 transition-all duration-300 ease-in-out">{invoice}</li>
            ))}
        </ul>
    </div>
</div>
  );
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
      secure: process.env.NODE_ENV === "production", // simplified conditional
    },
    password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD || "fallback_password", // Added fallback_password
  }
);

export default getinvoice;  // Changed export name to match the function name
