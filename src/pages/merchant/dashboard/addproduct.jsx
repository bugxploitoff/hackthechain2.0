// pages/protected-page.js
import React, { useState } from "react";
import { ethers } from 'ethers';
import { withIronSession } from "next-iron-session";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedPage = ({ user }) => {
    console.log(user.userMerchant)
    const [button, setButton] = useState("Register a product");
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        pid: '',
        pname: '',
        ptype: '',
        pcost: '',
        pdesc: '',
        pdetails: '',
        password: '',
      });

      const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);
    setButton("Checking Sender Details")
    const abiFilePath = '/usermerch.json';
    const response = await fetch(abiFilePath);
    const abi = await response.json();
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = user.userMerchant;
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.registerProduct(formData.pid,formData.pname,formData.ptype,formData.pcost,formData.pdesc,formData.pdetails,user.email,formData.password);
    const recipt = await tx.wait();
    if(recipt.status === 1){
      toast.success('Product Register Sucessful', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: 'light',
      });
    }
    else{
      toast.error('Unable to register your product', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: 'light',
      });
    }
    
}


  if (user) {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-gray-200 rounded-full p-3">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="w-7 h-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
           <path d="M20.5 7.27783L12 12.0001M12 12.0001L3.49997 7.27783M12 12.0001L12 21.5001M14 20.889L12.777 21.5684C12.4934 21.726 12.3516 21.8047 12.2015 21.8356C12.0685 21.863 11.9315 21.863 11.7986 21.8356C11.6484 21.8047 11.5066 21.726 11.223 21.5684L3.82297 17.4573C3.52346 17.2909 3.37368 17.2077 3.26463 17.0893C3.16816 16.9847 3.09515 16.8606 3.05048 16.7254C3 16.5726 3 16.4013 3 16.0586V7.94153C3 7.59889 3 7.42757 3.05048 7.27477C3.09515 7.13959 3.16816 7.01551 3.26463 6.91082C3.37368 6.79248 3.52345 6.70928 3.82297 6.54288L11.223 2.43177C11.5066 2.27421 11.6484 2.19543 11.7986 2.16454C11.9315 2.13721 12.0685 2.13721 12.2015 2.16454C12.3516 2.19543 12.4934 2.27421 12.777 2.43177L20.177 6.54288C20.4766 6.70928 20.6263 6.79248 20.7354 6.91082C20.8318 7.01551 20.9049 7.13959 20.9495 7.27477C21 7.42757 21 7.59889 21 7.94153L21 12.5001M7.5 4.50008L16.5 9.50008M19 21.0001V15.0001M16 18.0001H22" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">Register A product</h2>
          <ToastContainer />
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-between">
  <div className="mb-4 w-full md:w-48">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Id</label>
    <input
      type="text"
      id="pid"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Id"
      onChange={handleChange}
    />
  </div>
  <div className="mb-4 w-full md:w-48">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Name</label>
    <input
      type="text"
      id="pname"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Name"
      onChange={handleChange}
    />
  </div>
  <div className="mb-4 w-full md:w-48">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Type</label>
    <input
      type="text"
      id="ptype"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Type"
      onChange={handleChange}
    />
  </div>
  <div className="mb-4 w-full md:w-48">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Cost</label>
    <input
      type="number"
      id="pcost"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Cost"
      onChange={handleChange}
    />
  </div>
  <div className="mb-4 w-full ">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Description</label>
    <input
      type="text"
      id="pdesc"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Description"
      onChange={handleChange}
    />
  </div>
  <div className="mb-4 w-full ">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Product Details</label>
    <input
      type="text"
      id="pdetails"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder="Product Details"
      onChange={handleChange}
    />
  </div>
  <div className="mb-6 w-full ">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
    <input
      type="password"
      id="password"
      className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
      required
      placeholder=""
      onChange={handleChange}
    />
  </div>
  <button
    type="submit"
    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    disabled={isButtonDisabled}
  >
    {button}
  </button>

  <p className="text-gray-600 text-xs text-center mt-4">
    By clicking Tranfer, you can't redo the action.
  </p>
</form>

        </div>
      </div>
    ) 
  }
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 404;
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
