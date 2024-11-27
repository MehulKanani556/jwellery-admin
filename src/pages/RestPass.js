import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../reduxe/slice/auth.slice';

export default function RestPass() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector(state => state.auth.user);


    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });
    const handleSubmit = (values,{resetForm}) => {
        // Here you can make API call or perform any other logic
        dispatch(resetPassword(values));
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
                                    initialValues={{ password: '', confirmPassword: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {() => (
                                        <Form className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
                                            <h2 className="text-2xl font-bold mb-4 text-brown text-center">Reset password</h2>
                                            <p className="mb-6 text-brown-50 text-center">Reset your password here!</p>
                                            <div className='mb-4'>

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
                                                <ErrorMessage name="password" component="div" className="text-red-500 " />
                                            </div>
                                            <div className="mb-4">


                                                <div className=" relative">
                                                    <Field
                                                        type={showPassword1 ? "text" : "password"}
                                                        name="confirmPassword"
                                                        className="border border-brown p-2 w-full rounded"
                                                        placeholder="Password"
                                                    />
                                                    <div className='absolute top-1/2 right-3 text-lg text-brown-50 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword1(!showPassword1)}>
                                                        {showPassword1 ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                                    </div>
                                                </div>
                                                <ErrorMessage age name="confirmPassword" component="div" className="text-red-500 " />
                                            </div>


                                            <button type="submit" className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">Reset password</button>
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
