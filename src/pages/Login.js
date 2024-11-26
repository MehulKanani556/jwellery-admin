import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div>
            <div>
                <div>
                    <div className="row relative">
                        <div className="col-md-6">
                            <div className='h-[100vh]'>
                                <img src={require('../Images/login.png')} className='h-full' alt="" />
                            </div>
                        </div>
                        <div className="col-md-6 flex items-center justify-center flex-1 absolute h-screen left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:relative md:top-auto md:left-auto md:translate-x-0 md:translate-y-0">
                            <div className='flex items-center justify-center'>
                                <form className="bg-white p-8 rounded-lg shadow-md w-80 md:w-96">
                                    <h2 className="text-2xl font-bold mb-4 text-brown text-center">Login</h2>
                                    <p className="mb-6 text-brown-50 text-center">Login to your existing account!</p>
                                    <div className="mb-4 relative">
                                        <input
                                            type="email"
                                            id="email"
                                            className="border  border-brown p-2 w-full rounded"
                                            placeholder="Email"
                                        />
                                        <div className='absolute top-1/2 right-3 text-lg text-brown-50 -translate-y-1/2'>
                                            <MdEmail />
                                        </div>
                                    </div>
                                    <div className="mb-4 relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className="border border-brown p-2 w-full rounded"
                                            placeholder="Password"
                                        />
                                        <div className='absolute top-1/2 right-3 text-lg text-brown-50 -translate-y-1/2 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                                        </div>
                                    </div>
                                    <div className="mb-4 text-sm font-semibold text-right text-red-500">
                                        <Link to="#">Forgot Password?</Link>
                                    </div>
                                    <button className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full">Login</button>
                                </form>
                            </div>
                        </div>
                        <div className='absolute bottom-0 left-[40%]'>
                            <img src={require('../Images/login1.png')} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
