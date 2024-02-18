import React, { useEffect, useState } from 'react'
import { withIronSession } from "next-iron-session";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers';

const ProtectedPage = ({ user }) => {
  const [button, setButton] = useState("Check Payment Status");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const tokenId = urlParams.get("id")
  const address = user.userAddress;
  const Meraddress = user.userMerchant;
  const email = user.email;
  console.log(address)
  const [qrCodeImage, setQrCodeImage] = useState('https://staveapps.com/wp-content/uploads/2021/03/1792-1.png');
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await fetch('/api/requestpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId,  address, Meraddress, email}),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setQrCodeImage(data.qrCodeImage);
      } else {
        console.error('Error generating QR code:', data.error);
      }
    }
    fetchUserInfo();
  }, []);


  const handleApiCall = async () => {
    setButton(true)
    setButton("Under Process")
    const abiFilePath = '/usermerch.json';
    const response = await fetch(abiFilePath);
    const abi = await response.json();

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || "");
    const contractAddress = user.userMerchant;
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || "";

    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const existingDetails = await contract.getInvoice(tokenId);
    if(existingDetails === '' ){
      toast.error('Payment Not success', {
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
      setButton(false)
    setButton("Payment not completed")
    }else{
      toast.success('Payment sucessfull', {
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
      setButton(true)
      window.location.href='/invoice?id='+tokenId+'&merch='+Meraddress
    }
    

  };


    if (user) {
  return (
    <section className="body-font h-screen bg-gray-100 pt-10 text-gray-600">
       <ToastContainer />
    <div className="container mx-auto mt-10 flex max-w-3xl flex-wrap justify-center rounded-lg bg-white px-5 py-24">
      <div className="flex-wrap md:flex">
        <div className="mx-auto">
          <img className="mx-auto mt-12 h-52 w-52 rounded-lg border p-2 md:mt-0" src={qrCodeImage} alt="step" />
          <div>
            <h1 className="font-laonoto mt-4 text-center text-xl font-bold">PAYMENT QR</h1>
            <p className="mt-2 text-center font-semibold text-gray-600">ONCE COMPLETED THE PAYMENT</p>
            <p className="mt-1 text-center font-medium text-red-500">CLICK THE BELLOW BUTTON</p>
          </div>
          <button
        onClick={handleApiCall}
        className="w-full mx-auto block rounded-md border bg-blue-500 px-6 py-2 text-white outline-none"
        disabled={isButtonDisabled}
      >
        {button}
      </button>
        </div>
        <div className="mt-8 max-w-sm md:mt-0 md:ml-10 md:w-2/3">
          <div className="relative flex pb-12">
            <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
              <div className="pointer-events-none h-full w-1 bg-gray-200"></div>
            </div>
            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="flex-grow pl-4">
              <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">STEP 1</h2>
              <p className="font-laonoto leading-relaxed">
                OPEN ANY SBT APP <br />
                <b>SCAN THE GENERATED QR</b> FOR PAYMENT
              </p>
            </div>
          </div>
          <div className="relative flex pb-12">
            <div className="absolute inset-0 flex h-full w-10 items-center justify-center">
              <div className="pointer-events-none h-full w-1 bg-gray-200"></div>
            </div>
            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="flex-grow pl-4">
              <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">STEP 2</h2>
              <p className="font-laonoto leading-relaxed">PAY THE GENERATED AMOUNT<b> WAIT FOR PAYMENT SUCCESS </b>CONFORMATION EMAIL WILL BE SEND.</p>
            </div>
          </div>
          <div className="relative flex pb-12">
            <div className="relative z-10 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="3"></circle>
                <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
              </svg>
            </div>
            <div className="flex-grow pl-4">
              <h2 className="title-font mb-1 text-sm font-medium tracking-wider text-gray-900">NOTE</h2>
              <p className="font-laonoto leading-relaxed">
                PLEASE DONOT REFRESH THE PAGE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.staaddfundtusCode = 404;
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