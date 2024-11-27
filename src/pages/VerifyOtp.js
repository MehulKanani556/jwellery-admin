import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {  verifyOtp } from '../reduxe/slice/auth.slice';

export default function VerifyOtp() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.auth.user);
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email');

    const validationSchema = Yup.object({
        otp: Yup.array()
           
            .test('is-complete', 'Please enter all 4 digits', 
                (value) => value && value.filter(digit => digit && digit.trim() !== '').length === 4
            )
    });

    const handleSubmit = (values, { resetForm }) => {
        // Join the otp array into a single string
        const otpString = values.otp.join('');
        
        console.log('Form submitted:', otpString); // Log the joined OTP

        dispatch(verifyOtp({ email, otp: otpString })); // Dispatch the joined OTP along with the email
        resetForm();
        navigate('/reset-password');
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
                                    initialValues={{ email,otp: ['', '', '', ''] }}
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
                                                        />
                                                    ))}
                                                </div>
                                                {errors.otp && touched.otp && (
                                                    <div className="text-red-500 text-center">{errors.otp}</div>
                                                )}
                                            </div>

                                            <button type="submit" className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">Verify</button>
                                            <p className="text-center mt-4 text-brown-50">Didn't receive code? <span className="text-brown font-medium cursor-pointer">Resend</span></p>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                        <div className='hidden md:absolute md:bottom-0 md:left-[50%] '>
                            <img src={require('../Images/login1.png')} alt="" />
                        </div>
                        <div className='hidden md:absolute md:top-0  md:right-0'>
                            <img src={require('../Images/login2.png')} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}