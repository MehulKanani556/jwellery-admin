import React from 'react'
import { MdEmail } from 'react-icons/md'
import {  useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../reduxe/slice/auth.slice';

export default function ForgotPass() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),

    });
    const handleSubmit = (values, { resetForm }) => {
       
        dispatch(forgotPassword(values)).then(() => navigate('/verify-otp'));
        resetForm();
        // navigate('/verify-otp');
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
                                    initialValues={{ email: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {() => (
                                        <Form className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
                                            <h2 className="text-2xl font-bold mb-4 text-brown text-center">Forgot password</h2>
                                            <p className="mb-6 text-brown-50 text-center">Enter your mail to forgot your password.</p>
                                            <div className="mb-4 ">
                                                <div className="relative">

                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        className="border border-brown p-2 w-full rounded"
                                                        placeholder="Email"
                                                    />
                                                    <div className='absolute top-1/2 right-3 text-lg text-brown-50 -translate-y-1/2'>
                                                        <MdEmail />
                                                    </div>
                                                    <ErrorMessage name="email" component="div" className="text-red-500" />
                                                </div>

                                            </div>


                                            <button type="submit" className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">Login</button>
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
