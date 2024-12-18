import React, { useState, useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import { Formik, Form, Field,  } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { verifyOtp, forgotPassword } from '../reduxe/slice/auth.slice';

export default function VerifyOtp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email');
    const [resendMessage, setResendMessage] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        let timer;
        if (countdown > 0 && isResendDisabled) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [countdown, isResendDisabled]);

    const validationSchema = Yup.object({
        otp: Yup.array()

            .test('is-complete', 'Please enter all 4 digits',
                (value) => value && value.filter(digit => digit && digit.trim() !== '').length === 4
            )
    });

    const handleSubmit = (values, { resetForm, setErrors }) => {
        // Join the otp array into a single string
        const otpString = values.otp.join('');

        console.log('Form submitted:', otpString); // Log the joined OTP

        // Dispatch the joined OTP along with the email
        dispatch(verifyOtp({ otp: otpString }))
            .then(response => {
                if (response.error) {
                    // Handle error (e.g., set form errors)
                    setErrors({ otp: response.error.message });
                } else {
                    resetForm();
                    navigate('/reset-password', { state: { otp: otpString } }); // Pass OTP to reset-password
                }
            });
    }

    const handleChange = (index, event, setFieldValue) => {
        const { value } = event.target;
        setFieldValue(`otp[${index}]`, value);
        if (value.length === 1) {
            // Move focus to the next input
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        } else if (value.length === 0) {
            // Move focus to the previous input if current is empty
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    }

    const handleKeyDown = (index, event, setFieldValue) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            setFieldValue(`otp[${index}]`, '');
            // Move focus to the previous input
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    }

    const handleResend = () => {
        if (!isResendDisabled) {
            dispatch(forgotPassword({ email }))
                .then(response => {
                    if (response.error) {
                        console.error('Error resending OTP:', response.error);
                        setResendMessage('Failed to resend OTP. Please try again.');
                    } else {
                        console.log('OTP resent successfully');
                        setResendMessage('OTP has been resent successfully!');
                    }
                });
            setCountdown(60);
            setIsResendDisabled(true);
        }
    }

    const handlePaste = (event, setFieldValue) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        
        // Fill all inputs with pasted data
        [...Array(4)].forEach((_, index) => {
            setFieldValue(`otp[${index}]`, pastedData[index] || '');
        });

        // Focus the last filled input or the next empty input
        const lastFilledIndex = Math.min(pastedData.length, 4);
        const nextInput = document.getElementById(`otp-input-${lastFilledIndex}`);
        if (nextInput) {
            nextInput.focus();
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: '#fcf3ed' }}>
                <div>
                    <div className="row relative">
                        <div className="col-md-6">
                            <div className='h-[100vh]'>
                                <img src={require('../Images/login.png')} className='h-full w-full' alt="" />
                            </div>
                        </div>
                        <div className="col-md-6 flex items-center justify-center flex-1 absolute h-screen left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:relative md:top-auto md:left-auto md:translate-x-0 md:translate-y-0">
                            <div className='flex items-center justify-center'>
                                <Formik
                                    initialValues={{ email, otp: ['', '', '', ''] }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ setFieldValue, errors, touched }) => (
                                        <Form className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
                                            <h2 className="text-2xl font-bold mb-4 text-brown text-center">Verify OTP</h2>
                                            <p className="mb-6 text-brown-50 text-center">Code has been successfully sent to {email}</p>
                                            <div className="mb-4 ">
                                                <div className="mb-4 flex justify-center space-x-2">
                                                    {[...Array(4)].map((_, index) => (
                                                        <Field
                                                            key={index}
                                                            id={`otp-input-${index}`}
                                                            name={`otp[${index}]`}
                                                            type="text"
                                                            maxLength="1"
                                                            className="border border-brown p-2 w-12 text-center rounded"
                                                            placeholder=""
                                                            onChange={(event) => handleChange(index, event, setFieldValue)}
                                                            onKeyDown={(event) => handleKeyDown(index, event, setFieldValue)}
                                                            onPaste={(event) => handlePaste(event, setFieldValue)}
                                                        />
                                                    ))}
                                                </div>
                                                {errors.otp && touched.otp && (
                                                    <div className="text-red-500 text-center">{errors.otp}</div>
                                                )}
                                            </div>

                                            {resendMessage && (
                                                <div className={`text-center mb-2 ${resendMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                                                    {resendMessage}
                                                </div>
                                            )}
                                            <button type="submit" className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">
                                                Verify
                                            </button>
                                            <p className="text-center mt-4 text-brown-50">
                                                Didn't receive code? 
                                                <span 
                                                    className={`text-brown font-medium ${
                                                        isResendDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                                    onClick={handleResend}
                                                >
                                                    Resend {isResendDisabled && `(${countdown}s)`}
                                                </span>
                                            </p>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                        <div className='hidden  md:block  md:absolute md:bottom-0 md:left-[50%] '>
                            <img src={require('../Images/login1.png')} alt="" />
                        </div>
                        <div className='hidden  md:block  md:absolute md:top-0  md:right-0'>
                            <img src={require('../Images/login2.png')} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}