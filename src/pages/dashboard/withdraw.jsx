// pages/protected-page.js
import React, { useState } from "react";
import { ethers } from 'ethers';
import { withIronSession } from "next-iron-session";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedPage = ({ user }) => {
    const [button, setButton] = useState("Withdraw");
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        token: '',
        password: '',
        upi: '',
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
    setButton("Trasaction under process");
    const abiFilePath = '/userdeploy.json';
    const response = await fetch(abiFilePath);
    const abi = await response.json();
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = user.userAddress;
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.burn(formData.token, formData.password, user.email);
    
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
    if (receipt.status === 1) {
    const chatId = process.env.NEXT_PUBLIC_TEL_WITHDRAWCHAT; // Replace with your Telegram chat ID
    const botToken = process.env.NEXT_PUBLIC_TEL_BOT; // Replace with your Telegram bot token
  
    // Format the message with the transactionId
    const message = `New withdraw request: \nfor account: ${user.userAddress},\namount: ${formData.token}, \nuseremail: ${user.email} \nupi: ${formData.upi} `;

    // Make the API call to the Telegram Bot API
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if(data.ok){
          setButtonDisabled(false);
          setButton("Tranaction successfull");
          toast.success('Payment withdraw request sucessful', {
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
      })
      .catch(error => {
        setButtonDisabled(false);
        setButton("Something went wrong");
        toast.error('Something Went wrong ! contact admin', {
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
        console.error('Telegram API Error:', error);
      });
      } else {
        throw new Error('Transaction failed'); 
        // Explicitly throw an error if the transaction status is not 1
      }
    } catch (error) {
      toast.error('Error in transferring', {
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
      setButtonDisabled(false);
      setButton("Amount can't be transferred");
    }
}


  if (user) {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <span className="inline-block bg-gray-200 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
              </svg>
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">WITHDRAW AMOUNT</h2>
          <p className="text-gray-600 text-center mb-6">1 LKH PER DAY</p>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
              <input
                type="number"
                id="token"WITHDRAW
                className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
                required
                placeholder="100"
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
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
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">UPI ID</label>
              <input
                type="text"
                id="upi"
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
              By clicking withdraw, you can't redo the action, Withdraw can take maximun of 3 Hrs
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
    cookieName: "session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD
  }
);

export default ProtectedPage;
