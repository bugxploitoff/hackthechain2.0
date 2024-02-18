// pages/protected-page.js
import React, { useState } from "react";
import { ethers } from 'ethers';
import { withIronSession } from "next-iron-session";
import QRScanner from '../../lib/PaymentScanner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedPage = ({ user }) => {
  const [button, setButton] = useState("Continue to pay");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [balance, setBalance] = useState('Scan Qr');
  const [payto, setPayto] = useState('Scan Qr');
  const [amount, setAmount] = useState('Scan Qr');
  const [id, setId] = useState('Scan Qr');
  const [merchant, setMerchant] = useState('Scan Qr');
  const [ptyp, setPtype] = useState('Merchant')
  const [uuid, setUuid] = useState('');
  const [invoiceurl, setInvoiceurl] = useState('')
const fetchData = async () => {
  try {
    const abiFilePath = '/userdeploy.json';
    const response = await fetch(abiFilePath);
    const abi = await response.json();
    
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    
    // Replace with the address of your deployed contract on Mumbai testnet
    const contractAddress = user.userAddress;

    // Replace with your private key or use Metamask to sign transactions
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";

    // Create a signer using the private key
    const signer = new ethers.Wallet(privateKey, provider);

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const existingDetails = await contract.balance();
    const bigNumberValue = existingDetails._hex;
    const balance = parseInt(bigNumberValue.toString(), 16);
    setBalance(balance);
    // Handle the existingDetails data as needed
  } catch (error) {
    console.error('Error fetching balance from the contract:', error);
    // Handle the error, e.g., display a user-friendly message or redirect
  }
}


// Call the async function
fetchData();

const handleScan = (result) => {
  const scannedData = JSON.parse(result);
  setPayto(scannedData.payto);
  setAmount(scannedData.amount);
  setId(scannedData.id);
  setMerchant(scannedData.merchant_adress);
  setUuid(scannedData.email)
  if(scannedData.ptyp != null){
    setPtype("WEB");
    setInvoiceurl(scannedData.invoiceurl);
  }

};

const handelRed = async () => {
  if(payto === 'Scan Qr'){
   alert("Scan the qr first");
  }else{
  let password = "";
  
  // Keep prompting until a non-empty password is provided
  while (!password) {
    setButtonDisabled(true);
    setButton('Transaction under process');
    // Prompt the user for the password
    password = prompt("Enter your password:");

    // If the user cancels the prompt, break out of the loop
    if (password === null) {
      console.error("Password input canceled.");
      return;
    }

    // Ensure the user entered a password
    if (!password) {
      console.error("Password is required.");
    }
  }
  const abi1FilePath = '/userdeploy.json';
  const response1 = await fetch(abi1FilePath);
  const abi1 = await response1.json();

  // Replace with the address of your deployed contract on Mumbai testnet
  const contractAddress = user.userAddress;

  // Replace with your private key or use Metamask to sign transactions
  const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");

  // Create a signer using the private key
  const signer = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, abi1, signer);

  try {
    const tx = await contract.transfer(payto, amount, password, user.email );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(receipt);
    if (receipt.status === 1) {
      const transactionHash = receipt.transactionHash;
      const merchants = '/usermerch.json';
  const responsemerch = await fetch(merchants);
  const abimerch = await responsemerch.json();

  // Replace with the address of your deployed contract on Mumbai testnet
  const contractAddress = merchant;
  const url = process.env.NEXT_PUBLIC_URL+'/invoice?id='+id

  // Replace with your private key or use Metamask to sign transactions
  const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");

  // Create a signer using the private key
  const signer = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, abimerch, signer);

  try {
    
    if(ptyp == "WEB"){
      const tx = await contract.generateInvoice(transactionHash, id, user.email, uuid, invoiceurl);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      toast.success('Payment Successfully', {
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
      setButton("Payment successfull");      
    }
    else{
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
      setButton("Unable to process");
      console.error("Error:", error);
    }


  }else{
    const tx = await contract.generateInvoice(transactionHash, id, user.email, uuid, url);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    if (receipt.status === 1) {
    
        const emailData = {
          to: user.email,
          subject: `${id} : Sucessfully paid`,
          text: `
          Hi user, 
          This is to inform you that we have recived your payment 
          Payment Status: Sucessfull
          INVOICE ID : ${id}
          VIEW AT ${process.env.NEXT_PUBLIC_URL}/invoice?id=${id}`,
        };
        
        
  
        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });
      

      toast.success('Payment Successfully', {
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
      setButton("Payment successfull");      
    }else{
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
      setButton("Unable to process");
      console.error("Error:", error);
    }
  }
  }catch(error){
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
    setButton("Unable to process");
    console.error("Error:", error);
  }
      
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
    setButton("Unable to process");
    console.error("Error:", error);
  }
}
};


  
  if (user) {
    return (
      <>
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
    class="w-full max-w-sm rounded-lg bg-white p-3 drop-shadow-xl divide-y divide-gray-200"
  >
    <div aria-label="header" class="flex space-x-4 items-center p-4">
      <div aria-label="avatar" class="flex mr-auto items-center space-x-4">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
          alt="avatar user"
          class="w-16 h-16 shrink-0 rounded-full"
        />
        <div class="space-y-2 flex flex-col flex-1 truncate">
          <div class="font-medium relative text-xl leading-tight text-gray-900">
          <ToastContainer />
            <span class="flex">
              <span class="truncate relative pr-8">
                {user.name}
                <span
                  aria-label="verified"
                  class="absolute top-1/2 -translate-y-1/2 right-0 inline-block rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    class="w-6 h-6 ml-1 text-cyan-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                      stroke-width="0"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
              </span>
            </span>
          </div>
          <p class="font-normal text-base leading-tight text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        class="w-6 h-6 text-gray-400 shrink-0"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M8 9l4 -4l4 4"></path>
        <path d="M16 15l-4 4l-4 -4"></path>
      </svg>
    </div>
    <QRScanner onQRCodeScanned={handleScan} />
    <br />
    <div className="bg-blue-500 text-white p-4 rounded-md" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Pay to: {payto}</p>
  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Invoice Id: {id}</p>
  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Amount to pay: {amount}</p>
  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Payment from: {merchant}</p>
</div>


    <div aria-label="account-upgrade" class="px-4 py-6">
      <div class="flex items-center space-x-3">
        <div class="mr-auto space-y-2">
          <p class="font-medium text-xl text-gray-900 leading-none">
            Balance
          </p>
          <p class="font-normal text-lg text-gray-500 leading-none">
            {balance} SBT
          </p>
        </div>
        
        <button
          type="button"
          onClick={handelRed}
          class="inline-flex px-6 leading-6 py-3 rounded-md bg-indigo-50 hover:bg-indigo-50/80 transition-colors duration-200 text-indigo-500 font-medium text-lg"
          disabled={isButtonDisabled}
        >
          {button}
        </button>
      </div>
    </div>
  </div>
  </div>
      </>
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
