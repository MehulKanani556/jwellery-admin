import React from 'react'
import IndiaMap from '../components/IndiaMap'
import Aa from '../components/Aa'
import { Link } from 'react-router-dom';

export default function DashBord() {
  const payMethodData = {
    cash: 100,
    debit: 50,
    credit: 30,
    transfer: 20
  };
  return (
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-bold mb-4 text-brown'>Dashboard</h1>
      {/* sec 1 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#527cbf] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/1.png')} alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Revenue</h2>
            <p className='text-2xl'>₹1200000</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#66948f] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/2.png')} alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Orders</h2>
            <p className='text-2xl'>300</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#6a6bba] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/3.png')} alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Customers</h2>
            <p className='text-2xl'>6569</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#a16482] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/4.png')} alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Products</h2>
            <p className='text-2xl'>278</p>
          </div>
        </div>
      </div>
      {/* sec 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 '>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Sales Location</h2>
          <div className='p-4 px-6'>
            <IndiaMap stateNames={["Mumbai", "Delhi", "Surat", "rajkot", "kolkata"]} />
          </div>
        </div>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Products</h2>
          <div className='p-4'>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-2'>
                <span>Diamond Ring</span>
                <span>93%</span>
              </div>
              <div className='bg-gray-200 rounded-full h-2'>
                <div className='bg-blue-500 h-2 rounded-full' style={{ width: '93%' }}></div>
              </div>
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-2'>
                <span>Engagement Ring</span>
                <span>84%</span>
              </div>
              <div className='bg-gray-200 rounded-full h-2'>
                <div className='bg-green-500 h-2 rounded-full' style={{ width: '84%' }}></div>
              </div>
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-2'>
                <span>Bronze Earrings</span>
                <span>79%</span>
              </div>
              <div className='bg-gray-200 rounded-full h-2'>
                <div className='bg-yellow-500 h-2 rounded-full' style={{ width: '79%' }}></div>
              </div>
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-2'>
                <span>Platinum Necklace</span>
                <span>75%</span>
              </div>
              <div className='bg-gray-200 rounded-full h-2'>
                <div className='bg-purple-500 h-2 rounded-full' style={{ width: '75%' }}></div>
              </div>
            </div>






          </div>
        </div>
      </div>
      {/* sec 3 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 '>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Categories</h2>
          <div className='p-4 '>
            <Aa data={payMethodData} />
            <div>
              <div></div>
            </div>
          </div>
        </div>
        <div className='bg-white py-4 rounded shadow'>
          <div className=' pb-3 border-b px-4 flex justify-between items-center'>

            <h2 className='text-lg font-semibold text-brown'>Review </h2>
            <p>
              <Link className='text-brown' to={'/review'}> View all</Link>
            </p>
          </div>
          <div className='p-4'>

          </div>
        </div>
      </div>
      <div className='bg-white p-4 rounded shadow mb-4'>
        <h2 className='text-lg'>Stock Report</h2>
        <table className='min-w-full'>
          <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Update Date</td>
              <td>Amount</td>
              <td>Stock Status</td>
              <td>Quantity</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Diamond Ring</td>
              <td>21-01-2024</td>
              <td>₹1200</td>
              <td className='text-red-500'>Low Stock</td>
              <td>5</td>
            </tr>
            {/* More rows can be added here */}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}
