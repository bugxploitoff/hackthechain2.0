import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import Web3 from 'web3';

const index = () => {

  const [product, setproduct] = useState([]);
  const [paymentstatus, setPaymentstatus] = useState("Not paid");
  const [createdAt, setcreatedAt] = useState(null);
  const [email, setEmail] = useState(null);
  const [tprice, setTprice] = useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get("id")
  const merch = urlParams.get("merch");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://sbtokens.s3.ap-south-1.amazonaws.com/invoice-${tokenId}.json`);
        const data = await response.json();
        setEmail(data.email);
        setcreatedAt(data.createdAt)
        setproduct(data.products)
        setTprice(data.totalcost)
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };

    fetchData();
  }, []); 

  
  const handlePrint = () => {
    window.print();
  };

  const getPaymentStatus = async (invoice) => {
    const abiFilePath = '/usermerch.json';
    const response = await fetch(abiFilePath);
    const abi = await response.json();
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(merch, abi, signer);
    const tx = await contract.paymentStatus(tokenId);
    if(tx != ''){
      setPaymentstatus("Paid");
    }
  };

  getPaymentStatus()

  
  return (
    <div class="flex h-screen w-full items-center justify-center bg-gray-600">
  <div class="w-80 rounded bg-gray-50 px-6 pt-8 shadow-lg">
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="chippz" class="mx-auto w-16 py-4" />
    <div class="flex flex-col justify-center items-center gap-2">
        <h4 class="font-semibold">SBT INVOICE</h4>
        <p class="text-xs">SAFE SECURE TRANSAPRENT MARKETPLACE</p>
    </div>
    <div class="flex flex-col gap-3 border-b py-6 text-xs">
      <p class="flex justify-between">
        <span class="text-gray-400">Receipt No. :</span>
      </p>
      <p class="flex justify-between">
      <span>{tokenId}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-gray-400">Invoice To</span>
      </p>
      <p class="flex justify-between">
        <span>{email}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-gray-400">Invoice date</span>
      </p>
      <p class="flex justify-between">
        <span>{createdAt}</span>
      </p>
      <p class="flex justify-between">
        <span class="text-gray-400">Payment Status</span>
      </p>
      <p class="flex justify-between">
        <span>{paymentstatus}</span>
      </p>
    </div>
    <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
      <table class="w-full text-left">
        <thead>
          <tr class="flex">
            <th class="w-full py-2">Product</th>
            <th class="min-w-[44px] py-2">QTY</th>
            <th class="min-w-[44px] py-2">Total</th>
          </tr>
        </thead>
        <tbody>
        {product.map((product, index) => (
            <tr key={index} className="flex">
              <td className="flex-1 py-1">{product.name}</td>
              <td className="min-w-[44px]">{product.qty}</td>
              <td className="min-w-[44px]">${product.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div class=" border-b border border-dashed"></div>
      <div class="py-4 justify-center items-center flex flex-col gap-2">
        <p class="flex gap-2">Total Price</p>
        <p class="flex gap-2"> Rs. {tprice}</p>
      </div>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePrint}>
          Print Bill
        </button>
    </div>
  </div>
</div>
  )
}

export default index