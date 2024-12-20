import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    const styles = {
        errorWrapper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 64px)',
            textAlign: 'center',
        },
        h1: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            color: ' #523C34',
            margin: 0,
        },
        p: {
            color: '#523C34',
            fontSize: '2.5rem',
            marginTop: 0,
        },
        img: {
            width: '200px',
        },
        link: {
            background: '#fff',
            display: 'inline-block',
            textDecoration: 'none',
            color: '#000',
            padding: '0.5rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            marginTop: '3rem',
            transition: '0.3s all ease-in',
            border: '1px solid #fff',
        },
        linkHover: {
            background: '#000',
            color: '#fff',
        },
        span:{
            color: '#523C34',
            fontSize: '1.5rem',
        }
    };

    return (
        <div style={styles.errorWrapper}>
            <h1 style={styles.h1}>4
                <div style={styles.img}>

                    <video className="loader-video" autoPlay loop muted playsInline>
                        <source src={require("../Images/aa.mp4")} type="video/mp4" style={styles.img} />
                        Your browser does not support the video tag.
                    </video>
                </div>

                4</h1>
            <p style={styles.p} data-splitting>ERROR </p>
            <p style={styles.span} data-splitting>PAGE NOT FOUND </p>
            <Link className='border border-brown rounded-2xl mt-5' to='/dashboard' >
                <button className="bg-white text-center w-48 rounded-2xl h-14 relative text-brown text-xl font-semibold group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-brown" type="button">
                    <div className="bg-brown rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[182px] z-10 duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#fff" />
                            <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#fff" />
                        </svg>
                    </div>
                    <p className="translate-x-2">Go Back</p>
                </button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
