import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Loader from "../components/Loader";
import { getAllTerms } from "../reduxe/slice/terms.slice";

export default function TermsConditionView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { terms, loading } = useSelector(state => state.terms);
    useEffect(() => {
        dispatch(getAllTerms())
    }, [dispatch]);

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brown">View Terms & Condition</h1>
                        <p className="text-brown-50">
                            <Link to="/dashboard">Dashboard</Link>  /{" "} <Link to="/tc"> Terms & Condition</Link>  / {" "}
                            <span className="text-brown font-medium">View Terms & Condition</span>
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div>
                            <button
                                className=" text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2"
                                onClick={() => navigate('/tc')}
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
                    {terms.map(term => (
                        <div key={term.id} className="mb-4 text-brown">
                            <h2 className="text-xl font-semibold">{term.title}</h2>
                            <ul className="list-disc">
                                <li className="text-gray-700 mt-1 ms-5">{term.description}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
    );
}
