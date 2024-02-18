import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datamodel from './Datamodel';


const index = () => {
    const [token, setToken] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [button, setButton] = useState("Submit");
    const [formData, setFormData] = useState({
        username: '',
        amount: '',
        callback: '',
      });
    
      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };
    
      const handleSubmit = async () => {
        setButton("Processing ..")
        try {
          const response = await fetch('/api/web/createbutton', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.username,
              amount: formData.amount,
              callback: formData.callback,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setToken(data.message);
            setModalIsOpen(true);
            setButton("Submit")
          } else {
            toast.error('No user found, Register your account first', {
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
              setButton("Error")
          }
        } catch (error) {
          console.error('Error during login API call:', error);
        }
      };
      
      const closeModal = () => {
        setModalIsOpen(false);
      };
    
  return (
    <>
    <ToastContainer />
    <Datamodel
        isOpen={modalIsOpen}
        onClose={closeModal}
        data={{ token }} // Pass any data you want to display in the modal
      />
    <div className="container px-6 mx-auto">
  <div className="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center">
    <div className="flex flex-col w-full">
      <div>
        <svg
          className="w-20 h-20 mx-auto md:float-left fill-stroke text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </div>
      <h1 className="text-5xl text-gray-800 font-bold">Client Area</h1>
      <p className="w-5/12 mx-auto md:mx-0 text-gray-500">
        Control and monitorize your website with out webpay.
      </p>
    </div>
    <div className="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
      <div className="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-left mb-5">
          Payments Button
        </h2>
        <form action="" className="w-full">
          <div id="input" className="flex flex-col w-full my-5">
            <label htmlFor="username" className="text-gray-500 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Please insert your username"
              onChange={handleChange}
              className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
              required
            />
          </div>
          <div id="input" className="flex flex-col w-full my-5">
            <label htmlFor="amount" className="text-gray-500 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              onChange={handleChange}
              placeholder="Please inster your Amount"
              className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
              required
            />
          </div>
          <div id="input" className="flex flex-col w-full my-5">
            <label htmlFor="callback" className="text-gray-500 mb-2">
              Callback url
            </label>
            <input
              type="url"
              id="callback"
              onChange={handleChange}
              placeholder="callback url"
              className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
              required
            />
          </div>
          <div id="button" className="flex flex-col w-full my-5">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-green-600 rounded-lg text-green-100"
            >
              <div className="flex flex-row items-center justify-center">
                <div className="mr-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div className="font-bold">{button}</div>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</>
  )
}

export default index