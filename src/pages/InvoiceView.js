import React from 'react'

const InvoiceView = () => {
  return (
    <div>
  <section className="mb-5">
    <div>
      <div className="bg-[#F5F4F1] p-5">
        <h5 className="font-bold">LOGO</h5>
        <div className="flex flex-wrap justify-between">
          <div className="mt-4">
            <h5 className="font-semibold">Jhon Wick</h5>
            <h6 className="text-gray-500">example@gmail.com</h6>
            <h6 className="text-gray-500">+1 565 5656 565</h6>
          </div>
          <div className="flex justify-between mt-4 w-full sm:w-auto">
            <div>
              <p className="text-gray-500 mb-0">Invoice No</p>
              <p className="text-gray-500 mb-0">Invoice Date</p>
              <p className="text-gray-500 mb-0">Order ID</p>
              <p className="text-gray-500 mb-0">GSTIN</p>
            </div>
            <div className="text-right">
              <p className="text-dark font-semibold">#123456</p>
              <p className="text-dark font-semibold">26/09/2024</p>
              <p className="text-dark font-semibold">#1123456789654</p>
              <p className="text-dark font-semibold">CGHCJU554451JH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="border-r border-gray-400 pr-3">
          <p className="text-gray-500 font-semibold mb-2">SOLD BY</p>
          <p className="font-semibold text-gray-800 mb-0">COCOBLU RETAIL LIMITED</p>
          <p className="text-gray-600">Renaissance industrial smart city, Kalyan Sape road, Thane, Maharashtra, 421302 IN</p>
        </div>
        <div className="border-r border-gray-400 pr-3">
          <p className="text-gray-500 font-semibold mb-2">BILLED TO</p>
          <p className="font-semibold text-gray-800 mb-0">Alex Shroff</p>
          <p className="text-gray-600">Ehrenkranz 13 Washington Square S, New York, Washington Square, NY 10012, USA</p>
        </div>
        <div>
          <p className="text-gray-500 font-semibold mb-2">SHIPPED TO</p>
          <p className="font-semibold text-gray-800 mb-0">Alex Shroff</p>
          <p className="text-gray-600">Ehrenkranz 13 Washington Square S, New York, Washington Square, NY 10012, USA</p>
        </div>
      </div>

      <div className="bg-gray-400 h-[1px] my-3"></div>

      <div className="overflow-auto mt-4">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-gray-700">Item</th>
              <th className="text-left py-2 text-gray-700">Qty.</th>
              <th className="text-left py-2 text-gray-700">Price</th>
              <th className="text-left py-2 text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">
                <div className="font-semibold">Dual Tone Halo Diamond Finger Ring</div>
                <p className="text-gray-500 mb-0">Size: <span className="font-semibold">5</span></p>
                <p className="text-gray-500">Metal: <span className="font-semibold">925 Silver</span></p>
              </td>
              <td className="font-semibold">1</td>
              <td className="font-semibold">₹1200.00</td>
              <td className="font-semibold">₹1200.00</td>
            </tr>
            <tr>
              <td className="py-2">
                <div className="font-semibold">Dual Tone Halo Diamond Finger Ring</div>
                <p className="text-gray-500 mb-0">Size: <span className="font-semibold">5</span></p>
                <p className="text-gray-500">Metal: <span className="font-semibold">925 Silver</span></p>
              </td>
              <td className="font-semibold">1</td>
              <td className="font-semibold">₹1200.00</td>
              <td className="font-semibold">₹1200.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-400 h-[1px] my-5"></div>

      <div className="flex flex-wrap justify-between items-end">
        <div className="mt-4">
          <h6 className="text-gray-500 font-semibold">Payment Method</h6>
          <p className="text-gray-800">Bank Name: Bank Central Asia (BCA)</p>
          <p className="text-gray-800">Card No.: 1234 5678 9123 4567</p>
          <p className="text-gray-800">Name: Jhon Wick</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-5">
          <div>
            <p className="text-gray-500">Sub Total</p>
            <p className="text-gray-500">Discount</p>
            <p className="text-gray-500">SGST</p>
            <p className="text-gray-500">CGST</p>
            <h6 className="font-bold text-gray-800">Total Amount</h6>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">₹2400.00</p>
            <p className="font-semibold text-green-600">-₹40.00</p>
            <p className="font-semibold text-gray-800">₹3.50</p>
            <p className="font-semibold text-gray-800">₹6.50</p>
            <h6 className="font-bold text-gray-800">₹2470.00</h6>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-gray-700 font-semibold">Thank you for shopping with us!</p>
        <p className="text-gray-700">Have a nice day 😊</p>
      </div>

      <div className="bg-[#4D1F08] py-5 text-center">
        <p className="text-white text-sm max-w-md mx-auto">
          If you have any questions, feel free to call customer care at +1 565 5656 565 or use Contact Us section.
        </p>
      </div>
    </div>
  </section>
</div>

  )
}

export default InvoiceView
