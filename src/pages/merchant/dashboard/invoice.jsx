import React, { useState } from 'react';
import { ethers } from 'ethers';
import { withIronSession } from 'next-iron-session';
import QRScanner from '../../../lib/QRScanner';

const ProtectedPage = ({ user }) => {
  const webcamRef = React.useRef(null);
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([])
  const [qty, setQty] = useState(1);

  const abiFilePath = '/usermerch.json';
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL || '');
  const contractAddress = user.userMerchant; // Assuming user is defined somewhere
  const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY || '';

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(abiFilePath);
      const abi = await response.json();

      const signer = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const existingDetails = await contract.getProductDetails(productId);
      console.log(existingDetails)

      const newProduct = {
        id: productId,
        name: existingDetails[0],
        type: existingDetails[1],
        cost: existingDetails[2],
        description: existingDetails[3],
        details: existingDetails[4],
        qty: qty,
      };

      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setProductId(''); // Clear the input after adding the product
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const handleFetchDetails = () => {
    fetchProductDetails();
  };
  const handleDeleteProduct = (productIdToDelete) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === productIdToDelete) {
          // Decrement the quantity by 1
          const updatedQty = product.qty > 0 ? product.qty - 1 : 0;
  
          // If the quantity becomes 0, consider removing the product
          if (updatedQty === 0) {
            return null; // Remove the product from the array
          }
  
          return { ...product, qty: updatedQty };
        }
        return product;
      }).filter(Boolean); // Filter out null values (removed products)
    });
  };
  

  const getTotalProducts = () => {
    return products.reduce((total, product) => total + product.qty, 0);
  };

  const calculateTotalCost = () => {
    return products.reduce((total, product) => {
      return total + product.cost * product.qty;
    }, 0);
  };

  const handleFinishPurchase = async () => {
    const userEmail = prompt('Please enter your email:');
    
    if (!userEmail) {
      // User canceled or entered an empty email
      return;
    }
  
    try {
      const tcost = calculateTotalCost() ;
      const response = await fetch('/api/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          products: products,
          totalcost: tcost,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Invoice Sent to email")
        window.location.href = "/merchant/dashboard/payments_status/?id="+data.message
      } else {
        // Handle error
        alert("Server is down");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleQRCodeScanned = (value) => {
    const jsonObject = JSON.parse(value);
    const productId = jsonObject.productid;
    setProductId(productId);
    // Do whatever you need with the scanned QR code value
  };
  
  if (user) {
    return (
      <div className="flex flex-col md:flex-row w-screen h-full px-14 py-7">
  {/* My Cart */}
  <div className="w-full flex flex-col h-fit gap-4 p-4 ">
    <p className="text-blue-900 text-xl font-extrabold">Product Details</p>
    {/* Product */}
    <div className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
      {products.length > 0 && (
        <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="px-6 py-3">
                        Product Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Product name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Product Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Details
                    </th>
                    <th scope="col" className="px-6 py-3">
                        QTY
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Total Cost
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Delete
                    </th>
                </tr>
            </thead>
         
          {products.map((product) => (
          
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {product.id}
                </th>
                <td className="px-6 py-4">
                {product.name}
                </td>
                <td className="px-6 py-4">
                {product.type}
                </td>
                <td className="px-6 py-4">
                  {product.description}
                </td>
                <td className="px-6 py-4">
                  {product.details}
                </td>
                <td className="px-6 py-4">
                  {product.qty}
                </td>
                <td className="px-6 py-4">
                  {product.cost}
                </td>
                <td className="px-6 py-4">
                  {product.cost*product.qty}
                </td>
                <td className='px-6 py-4'>
                <div className="self-center">
          <button className="" onClick={() => handleDeleteProduct(product.id)}>
            <svg
              className=""
              height="24px"
              width="24px"
              id="Layer_1"
              style={{ enableBackground: "new 0 0 512 512" }}
              version="1.1"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g>
                <path d="M400,113.3h-80v-20c0-16.2-13.1-29.3-29.3-29.3h-69.5C205.1,64,192,77.1,192,93.3v20h-80V128h21.1l23.6,290.7   c0,16.2,13.1,29.3,29.3,29.3h141c16.2,0,29.3-13.1,29.3-29.3L379.6,128H400V113.3z M206.6,93.3c0-8.1,6.6-14.7,14.6-14.7h69.5   c8.1,0,14.6,6.6,14.6,14.7v20h-98.7V93.3z M341.6,417.9l0,0.4v0.4c0,8.1-6.6,14.7-14.6,14.7H186c-8.1,0-14.6-6.6-14.6-14.7v-0.4   l0-0.4L147.7,128h217.2L341.6,417.9z" />
                <g>
                  <rect height={241} width={14} x={249} y={160} />
                  <polygon points="320,160 305.4,160 294.7,401 309.3,401" />
                  <polygon points="206.5,160 192,160 202.7,401 217.3,401" />
                </g>
              </g>
            </svg>
          </button>
        </div>
                </td>
            </tr>
        </tbody>                      
          ))}
         </table>
          </div>   
      )}
       </div>
    </div>
  </div>
  {/* Purchase Resume */}
  <div className="flex flex-col w-full md:w-2/3 h-fit gap-4 p-4">
    <p className="text-blue-900 text-xl font-extrabold">Purchase Resume</p>
    <div className="flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm">
      <div className="flex flex-row justify-between">
        <p className="text-gray-600">Subtotal ({getTotalProducts()} Item)</p>
        <p className="text-end font-bold">Rs {calculateTotalCost()}</p>
      </div>
      <hr className="bg-gray-200 h-0.5" />
      {/* <div className="flex flex-row justify-between">
        <p className="text-gray-600">Additional Charges</p>
        <div>
          <p className="text-end font-bold">Rs .{process.env.NEXT_PUBLIC_ADDITINALCHARGES}</p>
        </div>
      </div> */}
      <hr className="bg-gray-200 h-0.5" />
      <div className="flex flex-row justify-between">
        <p className="text-gray-600">Total</p>
        <div>
          <p className="text-end font-bold">Rs. {calculateTotalCost()}</p>
        </div>
      </div>
      <QRScanner onQRCodeScanned={handleQRCodeScanned} />
      <label>
        Enter Product ID / Scan the prodcuct:
        <input type="text" value={productId} onChange={handleProductIdChange} />
      </label>
      <label>
        Qty
        <input type="number" value={qty} onChange={handleQtyChange} />
      </label>
      <br />
      <div className="flex gap-2">
        <button className="transition-colors text-sm bg-blue-600 hover:bg-blue-700 p-2 rounded-sm w-full text-white text-hover shadow-md" onClick={handleFinishPurchase}>
          Create Invoice
        </button>
        <button className="transition-colors text-sm bg-white border border-gray-600 p-2 rounded-sm w-full text-gray-700 text-hover shadow-md" onClick={handleFetchDetails}>
          ADD MORE PRODUCTS
        </button>
      </div>
    </div>
  </div>
</div>
    )
  }

  return null; // Return null if user is not defined
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      res.statusCode = 401;
      res.end();NEXT_PUBLIC_ADDITINALCHARGES
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
