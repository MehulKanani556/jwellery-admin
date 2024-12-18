import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Loader from "../components/Loader";
import { getAllPrivacyPolicies } from "../reduxe/slice/privacy.slice";

export default function PrivacyView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { policies, loading } = useSelector((state) => state.privacy)
   
    useEffect(() => {
        dispatch(getAllPrivacyPolicies());
    }, [dispatch]);
    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brown">View Privacy Policy</h1>
                        <p className="text-brown-50">
                            <Link to="/dashboard">Dashboard</Link>  /{" "} <Link to="/privacy">Privacy Policy </Link>  / {" "}
                            <span className="text-brown font-medium">View Privacy Policy</span>
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div>
                            <button
                                className=" text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2"
                                onClick={() => navigate('/privacy')}
                            >
                                <span>
                                    <FiArrowLeft />
                                </span>
                                <span>
                                    Back
                                </span>
                            </button>
                        </div>

                    </div>


                </div>

                <div className="mt-6 bg-white p-5 shadow rounded">
                    {policies.map(ele => (
                        <div key={ele.id} className="mb-4 text-brown">
                            <h2 className="text-xl font-semibold">{ele.title}</h2>
                            <ul className="list-disc">
                                <li className="text-gray-700 mt-1 ms-5">{ele.description}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
    );
}
