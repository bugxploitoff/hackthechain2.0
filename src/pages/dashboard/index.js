// pages/protected-page.js
import React, { useState } from "react";
import { ethers } from 'ethers';
import { withIronSession } from "next-iron-session";

const ProtectedPage = ({ user }) => {
  const [balance, setBalance] = useState('....');
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


const [loggingOut, setLoggingOut] = useState(false);

const handelRed = () => {
  window.location.href = process.env.NEXT_PUBLIC_TRANS + "/address/" + user.userAddress + "#tokentxns";
}


  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await fetch('/api/logout', { method: 'POST' });

      if (response.status === 200) {
        // Redirect to login page or any other page after successful logout
        window.location.href = "/auth/login";
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

    const [isPopupOpen, setPopupOpen] = useState(false);
  
    const handleAddAmountClick = () => {
      setPopupOpen(true);
    };
  
    const handleClosePopup = () => {
      setPopupOpen(false);
    };
    const [tokenValue, setTokenValue] = useState('');
    const handleGeneratePayment = () => {
      const generatedToken = '123456';
      setTokenValue(generatedToken);
      setPopupOpen(false);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      window.location.href = `/dashboard/addfund?amount=${tokenValue}`
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
    <div aria-label="navigation" class="py-2">
      <nav class="grid gap-1">
        <div
          onClick={handleAddAmountClick}
          class="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
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
            <path d="M21 12.5V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V17C3 18.1046 3.89543 19 5 19H13" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.5 15V17.5M18.5 20V17.5M18.5 17.5H16M18.5 17.5H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 10H20.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 15H9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Add Amount</span>
        </div>
        {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="z-10 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add Amount</h2>
            <input
  type="number"
  value={tokenValue}  // Use the current value from the state
  onChange={(e) => setTokenValue(e.target.value)}  // Handle the change and update the state
  name="number"
  placeholder="No of token"
  className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder-font-normal"
/>

          <br />
          <button
            onClick={handleSubmit}
              className="w-full bg-indigo-500 text-white p-2 pb-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
            >
              Generate Payment
            </button>
          <br />
          <br />
            <button
              onClick={handleClosePopup}
              className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
        <a
          href="/dashboard/sendfund"
          class="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="w-7 h-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
             <path d="M17.0020048,13 C17.5542895,13 18.0020048,13.4477153 18.0020048,14 C18.0020048,14.5128358 17.6159646,14.9355072 17.1186259,14.9932723 L17.0020048,15 L5.41700475,15 L8.70911154,18.2928932 C9.0695955,18.6533772 9.09732503,19.2206082 8.79230014,19.6128994 L8.70911154,19.7071068 C8.34862757,20.0675907 7.78139652,20.0953203 7.38910531,19.7902954 L7.29489797,19.7071068 L2.29489797,14.7071068 C1.69232289,14.1045317 2.07433707,13.0928192 2.88837381,13.0059833 L3.00200475,13 L17.0020048,13 Z M16.6128994,4.20970461 L16.7071068,4.29289322 L21.7071068,9.29289322 C22.3096819,9.8954683 21.9276677,10.9071808 21.1136309,10.9940167 L21,11 L7,11 C6.44771525,11 6,10.5522847 6,10 C6,9.48716416 6.38604019,9.06449284 6.88337887,9.00672773 L7,9 L18.585,9 L15.2928932,5.70710678 C14.9324093,5.34662282 14.9046797,4.77939176 15.2097046,4.38710056 L15.2928932,4.29289322 C15.6533772,3.93240926 16.2206082,3.90467972 16.6128994,4.20970461 Z"/>
          </svg>
          <span>Send funds</span>
        </a>
        <a
          href="/dashboard/withdraw"
          class="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="w-7 h-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path fill="#444" d="M8 0l2 3h-1v2h-2v-2h-1l2-3z"></path>
<path fill="#444" d="M15 7v8h-14v-8h14zM16 6h-16v10h16v-10z"></path>
<path fill="#444" d="M8 8c1.657 0 3 1.343 3 3s-1.343 3-3 3h5v-1h1v-4h-1v-1h-5z"></path>
<path fill="#444" d="M5 11c0-1.657 1.343-3 3-3h-5v1h-1v4h1v1h5c-1.657 0-3-1.343-3-3z"></path>
          </svg>
          <span>Withdraw funds</span>
        </a>
        <a
          href="/dashboard/scanme"
          class="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            class="w-7 h-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
           <path d="M4,4h6v6H4V4M20,4v6H14V4h6M14,15h2V13H14V11h2v2h2V11h2v2H18v2h2v3H18v2H16V18H13v2H11V16h3V15m2,0v3h2V15H16M4,20V14h6v6H4M6,6V8H8V6H6M16,6V8h2V6H16M6,16v2H8V16H6M4,11H6v2H4V11m5,0h4v4H11V13H9V11m2-5h2v4H11V6M2,2V6H0V2A2,2,0,0,1,2,0H6V2H2M22,0a2,2,0,0,1,2,2V6H22V2H18V0h4M2,18v4H6v2H2a2,2,0,0,1-2-2V18H2m20,4V18h2v4a2,2,0,0,1-2,2H18V22Z"/>
</svg>
          <span>Scan to pay</span>
        </a>
        <a
          href="/dashboard/resetpass"
          class="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
        >
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
          <path d="M11 14C7.13401 14 4 17.134 4 21H10.5M18.5 20.2361C17.9692 20.7111 17.2684 21 16.5 21C14.8431 21 13.5 19.6569 13.5 18C13.5 16.3431 14.8431 15 16.5 15C17.8062 15 18.9175 15.8348 19.3293 17M20 14.5V17.5H17M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
          <span>Reset Password</span>
        </a>
      </nav>
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
        >
          View Statement
        </button>
      </div>
    </div>
    <div aria-label="footer" class="pt-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        class="flex items-center space-x-3 py-3 px-4 w-full leading-6 text-lg text-gray-600 focus:outline-none hover:bg-gray-100 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="w-7 h-7"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
          ></path>
          <path d="M9 12h12l-3 -3"></path>
          <path d="M18 15l3 -3"></path>
        </svg>
        <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
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
