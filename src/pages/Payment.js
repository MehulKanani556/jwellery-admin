import { Button } from '@mui/material';
import React, { useEffect } from 'react';

// Add Razorpay script


// Function to handle payment
const handlePayment = () => {
  const options = {
    key: 'rzp_test_BGs2X1r93VBRzc', // Replace with your Razorpay key
    amount:1000, // Amount in paise (50000 paise = ₹500)
    currency: 'INR',

    name: 'Jewellery',
    description: 'Test Transaction',
    image: 'https://example.com/your_logo',
    handler: function (response) {
      alert(`Payment successful: ${response.razorpay_payment_id}`);
    },
    prefill: {
      name: 'Akshay',
      email: 'akshay@example.com',
      contact: '234567890',
    },
    notes: {
      address: 'Customer Address',
    },
    theme: {
      color: '#523C34',
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export default function Payment() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }, []);
      
  return (
    <div>
      <Button onClick={handlePayment}>Pay Now</Button>
    </div>
  )
}
