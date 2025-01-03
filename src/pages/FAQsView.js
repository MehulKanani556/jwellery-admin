import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Loader from "../components/Loader";
import { getAllFaqs } from "../reduxe/slice/faqs.slice";
import { getAllSubFaqs } from "../reduxe/slice/subFaqs.slice";

export default function FAQsView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { faqs } = useSelector(state => state.faqs);
    const { subFaqs, loading } = useSelector(state => state.subfaqs);


    useEffect(() => {
        dispatch(getAllFaqs())
        dispatch(getAllSubFaqs())
    }, [dispatch]);

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brown">View FAQs</h1>
                        <p className="text-brown-50">
                            <Link to="/dashboard">Dashboard</Link>  /{" "} <Link to="/faqs">FAQs</Link>  / {" "}
                            <span className="text-brown font-medium">View FAQs</span>
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div>
                            <button
                                className=" text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2"
                                onClick={() => navigate('/faqs')}
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
                    {faqs.map(faq => (
                        <div key={faq.id} className="mb-4">
                            <h2 className="text-xl font-semibold mb-4 text-brown">{faq.name}</h2>
                            <div className="space-y-1">
                                {subFaqs && subFaqs
                                    .filter(subfaq => subfaq.faq_id == faq.id)
                                    .map(subfaq => (
                                        <Accordion 
                                            key={subfaq.id}
                                            sx={{
                                                boxShadow: 'none',
                                                border: 'none',
                                                '&:before': {
                                                    display: 'none',
                                                },
                                                '& .MuiAccordionSummary-root': {
                                                    flexDirection: 'row-reverse',
                                                    minHeight: "32px"
                                                },
                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                    marginRight: '8px',
                                                },
                                                padding: "0px"
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel-${subfaq.id}-content`}
                                                id={`panel-${subfaq.id}-header`}
                                                sx={{
                                                    padding: 0,
                                                    '& .MuiAccordionSummary-content':{
                                                        margin: "0px !important"
                                                    }
                                                }}
                                            >
                                                <span className="font-medium text-base text-black ">{subfaq.question}</span>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{padding:0}}>
                                                <div className="text-base font-normal ms-8">
                                                    {subfaq.answer}
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    );
}
