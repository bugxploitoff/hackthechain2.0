import React from 'react'

const index = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-green-900 min-h-screen overflow-auto">
    <div className="container max-w-5xl mx-auto px-4">
      <div className="w-4/5">
        <h1 className="mt-32 text-white text-6xl font-bold">
          The fastest, most secure payment merchants <br />
          <span className="text-blue-400">on the planet.</span>
        </h1>
      </div>
      <div className="w-5/6 my-10 ml-6">
        <h3 className="text-gray-300">
          Recharge, Send &amp; Recive fullstack transparent with <br />
          <strong className="text-white">
            Easy recovery &amp; no wallets
          </strong>
          <br />
          required to connect
        </h3>
      </div>
      <div className="hidden sm:block opacity-50 z-0">
        <div className="shadow-2xl w-96 h-96 rounded-full -mt-72" />
        <div className="shadow-2xl w-96 h-96 rounded-full -mt-96" />
        <div className="shadow-xl w-80 h-80 rounded-full ml-8 -mt-96" />
      </div>
      <div className="text-white relative">
        <h3 className="text-uppercase font-semibold">
          Take a action
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-5 uppercase">
          <a href="/auth/login">
          <div className="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <img
              className="w-9"
              src="/login.svg"
              alt=""
            />
            <div>
              <span>Signin</span>
              <span className="text-xs text-blue-300 block">User Login</span>
            </div>
            <div>
              <i className="fa fa-chevron-right opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 block transition" />
            </div>
          </div>
          </a>
          <a href='/merchant/login'>
          <div className="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <img
              className="w-9"
              src="/login.svg"
              alt=""
            />
            <div>
              <span>Signin</span>
              <span className="text-xs text-blue-300 block">Merchant Login</span>
            </div>
            <div>
              <i className="fa fa-chevron-right opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 block transition" />
            </div>
          </div>
          </a>
          <a href='/web'>
          <div className="group flex items-center bg-indigo-900 bg-opacity-40 shadow-xl gap-5 px-6 py-5 rounded-lg ring-2 ring-offset-2 ring-offset-blue-800 ring-cyan-700 mt-5 cursor-pointer hover:bg-blue-900 hover:bg-opacity-100 transition">
            <img
              className="w-9"
              src="/login.svg"
              alt=""
            />
            <div>
              <span>Signin</span>
              <span className="text-xs text-blue-300 block">Webadmin</span>
            </div>
            <div>
              <i className="fa fa-chevron-right opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 block transition" />
            </div>
          </div>
          </a>
        </div>
      </div>
    </div>
  </div>
  )
}

export default index