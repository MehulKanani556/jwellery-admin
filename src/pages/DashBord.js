import React, { useEffect } from 'react'
import IndiaMap from '../components/IndiaMap'
import Aa from '../components/Aa'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard } from '../reduxe/slice/dashboard.slice';
import { GoDotFill } from 'react-icons/go';
import { FaStar } from 'react-icons/fa';

export default function DashBord() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard)


  console.log(dashboardData)

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
    <div className='flex flex-col p-4'>
      <h1 className='text-2xl font-bold mb-4 text-brown'>Dashboard</h1>
      {/* sec 1 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#527cbf] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/1.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Revenue</h2>
            <p className='text-2xl'>₹{dashboardData?.total_revenue}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#66948f] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/2.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Orders</h2>
            <p className='text-2xl'>{dashboardData?.total_orders}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#6a6bba] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/3.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Customers</h2>
            <p className='text-2xl'>{dashboardData?.total_customers}</p>
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow flex justify-between items-center  border-s-4 border-[#a16482] '>
          <div className=' p-2 rounded-full mr-4'>
            <img src={require('../Images/4.png')} className='min-w-10' alt="" />
          </div>
          <div>
            <h2 className='text-lg text-gray-400'>Total Products</h2>
            <p className='text-2xl'>{dashboardData?.total_products?.total_products}</p>
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
            <Aa data={dashboardData?.top_category} />
            <div className='pt-3'>
              <div className='flex flex-wrap  gap-4'>
                {dashboardData?.top_category.map((ele, index) => (
                  <div className='text-center border p-3 w-1/3 rounded-md' key={index}>
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
              {dashboardData?.reviews.map((review) => (
                <>
                  <div className='p-3 px-4 border-b'>
                    <div className='flex justify-between items-center '>
                      <div className='flex gap-2 items-center'>
                        <div>
                          <img src={review.image} className='w-[40px] h-[40px] rounded-full object-cover' alt={review.customer_name} />
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
        <div className='py-4 '>
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
                    <td className="py-2 px-4 ">{ele.customer_name}</td>
                    <td className="py-2 px-4 ">{ele.product_name}</td>
                    <td className="py-2 px-4 ">{ele.date}</td>
                    <td className="py-2 px-4 ">{ele.description}</td>

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
