import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateUsername } from 'friendly-username-generator';

const register = () => {
    const currentYear = new Date().getFullYear();
    const [button, setButton] = useState('Request Merchant account');
    const [newUsername, setNewUsername] = useState(generateUsername());
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        location: '',
        contactNumber: '',
      });

      

      
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Wallet Account Details',
    text: '',
  });

  useEffect(() => {
    setEmailData((prevEmailData) => ({
      ...prevEmailData,
      to: formData.email,
      text: `Your username for the account is ${newUsername} and password: is the provided password`, // Added a colon after "password"
    }));
  }, [formData.email, newUsername]);
  

      
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      
      
    
      const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setButtonDisabled(true);
        setButton("Connecting to server ...")
        const chatId = process.env.NEXT_PUBLIC_TEL_MINTCHAT; // Replace with your Telegram chat ID
        const botToken = process.env.NEXT_PUBLIC_TEL_BOT; // Replace with your Telegram bot token
      
        // Format the message with the transactionId
        const message = `New Merchant request: ${formData.email},\nBusiness name: ${formData.name},\nBusiness type: ${formData.location}, \ncontact: ${formData.contactNumber} `;
    
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
              toast.success('Merchat account under verification', {
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
              setButton("Request sucessful")
            }
          })
          .catch(error => {
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
            setButtonDisabled(false);
            setButton("Something went wrong")
          });    
      };
          
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
        html, body{
          font-family: 'Roboto', sans-serif;
        }
        .break-inside {
          -moz-column-break-inside: avoid;
          break-inside: avoid;
        }
        body {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          min-height: 100vh;
          line-height: 1.5;
        }
      `,
        }}
      />
      {/* Example */}
      <div className="flex min-h-screen">
        {/* Container */}
        <div className="flex flex-row w-full">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg">
            <div className="flex items-center justify-start space-x-3">
              <span className="bg-black rounded-full w-8 h-8" />
              <a href="/" className="font-medium text-xl">
                SBT
              </a>
            </div>
            <div className="space-y-5">
              <h1 className="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">
                Boost your business with us
              </h1>
              <p className="text-lg">Already have an account?</p>
              <a href="/merchant/login">
                <button className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                  Signin to Account
                </button>
              </a>
            </div>
            <p className="font-medium">©{currentYear} SBT</p>
          </div>
          {/* Login */}
          <div className="flex flex-1 flex-col items-center justify-center px-10 relative">
            <div className="flex lg:hidden justify-between items-center w-full py-4">
              <div className="flex items-center justify-start space-x-3">
                <span className="bg-black rounded-full w-6 h-6" />
                <a href="/" className="font-medium text-lg">
                  SBT
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>Already a member? </span>
                <a
                  href="/mrechant/login"
                  className="underline font-medium text-[#070eff]"
                >
                  singin
                </a>
              </div>
            </div>
            {/* Login box */}
            <div className="flex flex-1 flex-col justify-center space-y-5 max-w-md">
              <div className="flex flex-col space-y-2 text-center">
              <ToastContainer />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Sign up to account
                </h2>
                <p className="text-md md:text-xl">
                  Get your merchant account as early as possible
                </p>
              </div>
              <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col max-w-md space-y-5">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Business name"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Business type"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <button className="flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white" disabled={isButtonDisabled}>
            {button}
          </button>
        </div>
      </form>
            </div>
            {/* Footer */}
            <div className="flex justify-center flex-col m-auto mb-16 text-center text-lg dark:text-slate-600 ">
              <p className="font-bold mb-1">Built by SBT</p>
            </div>
          </div>
        </div>
      </div>
      {/* Example */}
    </>
  )
}

export default register