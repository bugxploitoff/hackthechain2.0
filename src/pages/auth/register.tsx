import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateUsername } from 'friendly-username-generator';


const register = () => {
    const currentYear = new Date().getFullYear();
    const [button, setButton] = useState('Register with email');
    const [newUsername, setNewUsername] = useState(generateUsername());
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        const abiFilePath = '/abi.json';
        const response = await fetch(abiFilePath);
        const abi = await response.json();

      
        // Connect to the Polygon Mumbai testnet
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
      
        // Replace with the address of your deployed contract on Mumbai testnet
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT || "";
      
        // Replace with your private key or use Metamask to sign transactions
        const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
      
        // Create a signer using the private key
        const signer = new ethers.Wallet(privateKey, provider);
      
        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, abi, signer);
      
        try {
        const existingDetails = await contract.getSubContractDetails(formData.email);
        if (existingDetails[2] === '') {
            try {
              // Deploy the contract and wait for the transaction to be mined
              const deploymentTx = await contract.deploySubContract(
                formData.name,
                formData.email,
                formData.location,
                newUsername,
                newUsername,
                formData.password,
                formData.email,
              );
              
            
              // Wait for the transaction to be mined
              const receipt = await deploymentTx.wait();
              if(receipt.status === 1){
                try {
                  const response = await fetch('/api/sendEmail', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailData),
                  });
            
                  const data = await response.json();
                  console.log(data);
                  toast.success('Account register Sucessfully', {
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
                  setButton("Account registered")
                } catch (error) {
                  toast.success('Contact Admin', {
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
                  setButton("Account pending")
                }
              } 
              
            } catch (error) {
                setButton("Oops something went wrong")
              console.error('Contract deployment error:', error);
            }
          } else {
            //stop loader
            setButton("We found you are already in")
            toast.error('Account already register', {
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
        } catch (error) {
          console.error('Contract deployment error:', error);
        }
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
                Enter your account and discover new experiences
              </h1>
              <p className="text-lg">Already have an account?</p>
              <a href="/auth/login">
                <button className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                  Signin to wallet
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
                  href="/auth/login"
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
                  Sign up or log in to place the order, no password require!
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
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
              <p className="font-bold mb-1">Built by SGT</p>
            </div>
          </div>
        </div>
      </div>
      {/* Example */}
    </>
  )
}

export default register