import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reduxe/slice/auth.slice';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector(state => state.auth.user);


    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
    });
    const handleSubmit = (values,{resetForm}) => {
        // Here you can make API call or perform any other logic
        dispatch(login(values));
        resetForm();
        console.log('Form submitted:', values);
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
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {() => (
                                        <Form className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
                                            <h2 className="text-2xl font-bold mb-4 text-brown text-center">Login</h2>
                                            <p className="mb-6 text-brown-50 text-center">Login to your existing account!</p>
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
                                                </div>
                                                <ErrorMessage name="email" component="div" className="text-red-500" />
                                            </div>
                                            <div className="mb-4">

                                                <div className=" relative">
                                                    <Field
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        className="border border-brown p-2 w-full rounded"
                                                        placeholder="Password"
                                                    />
                                                    <div className='absolute top-1/2 right-3 text-lg text-brown-50 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                                    </div>
                                                </div>
                                                <ErrorMessage name="password" component="div" className="text-red-500" />
                                            </div>

                                            <div className="mb-4 text-sm font-semibold text-right text-red-500">
                                                <Link to="/forgot-password">Forgot Password?</Link>
                                            </div>
                                            <button type="submit" className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">Login</button>
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
