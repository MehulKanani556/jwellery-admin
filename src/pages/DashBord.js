import React, { useEffect } from 'react'
import IndiaMap from '../components/IndiaMap'
import Aa from '../components/Aa'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard } from '../reduxe/slice/dashboard.slice';
import { GoDotFill } from 'react-icons/go';
import { FaStar } from 'react-icons/fa';
const isVideo = (filename) => {
  const videoExtensions = [
    '.mp4',
    '.mov',
    '.avi',
    '.wmv',
    '.flv',
    '.mkv',
    '.webm',
    '.m4v',
    '.mpeg',
    '.3gp'
  ];
  return videoExtensions.some(ext =>
    filename.toLowerCase().endsWith(ext)
  );
};
export default function DashBord() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard)
  

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch])

  const payMethodData = {
    cash: 100,
    debit: 50,
    credit: 30,
    transfer: 20
  };
  return (
    <div className='container flex flex-col p-4'>
      <h1 className='text-2xl font-bold mb-4 text-brown'>Dashboard</h1>
      {/* sec 1 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center border-s-4 border-[#527cbf] hover:shadow-lg transition-shadow duration-300'>
          <div className='p-2 rounded-full mr-4'>
            <img src={require('../Images/1.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Revenue</h2>
            <p className='text-2xl text-end'>₹{dashboardData?.total_revenue}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#66948f]  hover:shadow-lg transition-shadow duration-300 '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/2.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Orders</h2>
            <p className='text-2xl text-end'>{dashboardData?.total_orders}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#6a6bba]  hover:shadow-lg transition-shadow duration-300'>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/3.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Customers</h2>
            <p className='text-2xl text-end'>{dashboardData?.total_customers}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#a16482]  hover:shadow-lg transition-shadow duration-300'>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/4.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Products</h2>
            <p className='text-2xl text-end'>{dashboardData?.total_products?.total_products}</p>
          </div>
        </div>
      </div>
      {/* sec 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 '>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Sales Location</h2>
          <div className='p-4 px-6'>
            <IndiaMap stateNames={dashboardData?.top_sales_location} />
          </div>
        </div>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Products</h2>
          <div className='p-4 overflow-hidden'>
            {dashboardData?.top_products.map((ele) => (
              <>
                <div className='mb-3'>
                  <div className='flex justify-between items-center mb-2'>
                    <span>{ele.product_name}</span>
                    <span>{ele?.sales_percentage}%</span>
                  </div>
                  <div className='bg-gray-200 rounded-full h-2'>
                    <div className={`h-2 rounded-full`} style={{ width: `${ele?.sales_percentage}%`, backgroundColor: ['#59A1FF', '#219F5A', '#612DB9', '#B131C5', '#A1574D', '#9B68F4'][dashboardData?.top_products.indexOf(ele) % 6] }}></div>
                  </div>
                </div>
              </>
            ))}

          </div>
        </div>
      </div>
      {/* sec 3 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 '>
        <div className='bg-white py-4 rounded shadow'>
          <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Top Categories</h2>
          <div className='p-4 '>
            <Aa data={dashboardData?.top_category} />
            <div className='pt-3'>
              <div className='flex flex-wrap justify-between  gap-4'>
                {dashboardData?.top_category.map((ele, index) => (
                  <div className='text-center border p-3 w-[45%] sm:w-[28%]  xl:w-[30%] rounded-md' key={index}>
                    <div className='font-semibold text-3xl' style={{ color: ["#639993", "#364F77", "#5558AF", "#AF5280", "#F0BA48"][index % 5] }}>{ele.product_count}</div>
                    <div className='flex items-center justify-center gap-1'>
                      <span style={{ color: ["#639993", "#364F77", "#5558AF", "#AF5280", "#F0BA48"][index % 5] }}>
                        <GoDotFill />
                      </span>
                      <span className='font-semibold text-center'>{ele.category_name}</span>
                    </div>
                  </div>
                ))}
              </div>
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
            <div className='overflow-y-auto'>
              {dashboardData?.reviews.slice(0,5).map((review,index) => (
                <>
                  <div className={`p-3 px-4 ${index !== 4 ? 'border-b' : ''}`}>
                    <div className='flex justify-between items-center '>
                      <div className='flex gap-2 items-center'>
                        <div>
                          <div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#523C34', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {review.customer_name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className='font-semibold'>{review.customer_name}</div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span className='text-yellow-300'>
                          <FaStar />
                        </span>
                        <span className='font-semibold text-xl '>
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <div className='text-gray-500 mt-2'>
                      {review.description}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white py-4  rounded shadow mb-4'>
        <h2 className='text-lg pb-3 border-b px-4 font-semibold text-brown'>Stock Report</h2>
        <div className='py-4 overflow-auto'>
          <table className='min-w-full px-4'>
            <thead>
              <tr>
                <td className='font-semibold text-brown py-2  px-4'>ID</td>
                <td className='font-semibold text-brown py-2  px-4'>Category</td>
                <td className='font-semibold text-brown py-2  px-4 text-nowrap'>Sub Category</td>
                <td className='font-semibold text-brown py-2  px-4 text-nowrap'>Product Name</td>
                <td className='font-semibold text-brown py-2  px-4 text-nowrap'>Update Date</td>
                <td className='font-semibold text-brown py-2  px-4 text-nowrap'>Stock Status</td>
                <td className='font-semibold text-brown py-2  px-4'>Qty</td>
              </tr>
            </thead>
            <tbody>

              {dashboardData?.stock.length > 0 ? (
                dashboardData?.stock.map((ele, index) => (
                  <tr key={index} className="hover:bg-gray-100 border-t">
                    <td className="py-2 px-4 ">{ele.id}</td>
                    <td className="py-2 px-4 ">{ele.category_name}</td>
                    <td className="py-2 px-4 ">{ele.sub_category_name}</td>
                    {/* <td className="py-2 px-4 ">{ele.product_name}</td> */}
                    <td className="py-2 px-4 flex items-center">
                      {ele.product_image && isVideo(ele.product_image) ? (
                        <video
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                          src={ele.product_image}
                        >
                          <source src={ele.product_image} />
                        </video>
                      ) : (
                        <img
                          src={ele.product_image}
                          alt="Product"
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                        />
                      )}
                      {ele.product_name}
                    </td>
                    <td className="py-2 px-4 ">{new Date(ele.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                    <td className="py-2 px-4  ">
                      <span className={`font-bold p-1 px-2  block text-center text-sm rounded text-nowrap w-28 ${ele?.status === 'out-stock' ? 'text-red-600 bg-red-100' : ele?.status === 'in-stock' ? 'text-green-600 bg-green-100' : ele?.status === 'low-stock' ? 'text-yellow-600 bg-yellow-100' : ''}`}>
                        {ele?.status === 'out-stock' ? 'Out Of Stock' : ele?.status === 'in-stock' ? 'In Stock' : ele?.status === 'low-stock' ? 'Low Stock' : ''}
                      </span>
                    </td>
                    <td className={`py-2 px-4 ${ele?.status === 'out-stock' ? 'text-red-600 ' : ''}`}>{ele.qty}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 text-center text-gray-500 border-t">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}
