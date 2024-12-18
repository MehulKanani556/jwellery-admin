import { Modal } from "@mui/material";
import ReactOwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProducts } from "../reduxe/slice/product.slice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsPlayCircle } from "react-icons/bs";
import Loader from "../components/Loader";



const ProductView = React.memo(() => {

    const dispatch = useDispatch();
    const { id } = useLocation().state;
    console.log(id);

    const { products, loading } = useSelector((state) => state.products);



    useEffect(() => {
        if (id) {
            dispatch(getSingleProducts(id));
        }
    }, [id]);

    useEffect(() => {
        setMainImage(products?.images);
    }, [products])

    const [mainImage, setMainImage] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isMagnifying, setIsMagnifying] = useState(false);
    const magnifierRef = useRef(null);
    const [magnifyStyle, setMagnifyStyle] = useState({});
    const imageRefs = useRef([]);

    const thumbnailOptions = {
        items: 6,
        loop: true,
        // loop: products?.images?.length > 1, // Update this line
        margin: 25,
        nav: true,
        dots: false,
        navSpeed: 500,
        smartSpeed: 1500,
        dots: true,
        navText: [
            '<i class="bi bi-chevron-left text-white  font-bold"></i>',
            '<i class="bi bi-chevron-right text-white font-bold"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: { items: 2 },
            600: { items: 4 },
            1000: { items: 6 }
        }
    };

    const isVideoFile = (url) => {
        return url?.match(/\.(mp4|webm|ogg)$/i);
    };

    function handleMediaClick(event, url) {
        if (event.target.tagName === 'svg' || event.target.tagName === 'path') {
            setSelectedMedia(url);
            setIsModalOpen(true);
        }
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMedia(null);
    };

    const handleClick = (thumb) => {
        console.log(thumb);
        setMainImage(prev => [thumb, ...prev]);
    }

    const handleMouseMove = (index, e) => {
        const img = imageRefs.current[index];
        if (!img) return;

        const { left, top, width, height } = img.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;

        setMagnifyStyle(prev => ({
            ...prev,
            [index]: {
                transformOrigin: `${x}% ${y}%`,
                transform: 'scale(2)',
                zIndex: 10
            }
        }));
    };

    const handleMouseLeave = (index) => {
        setMagnifyStyle(prev => ({
            ...prev,
            [index]: {
                transform: 'scale(1)',
                zIndex: 1
            }
        }));
    };

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container p-5 md:p-10">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brown">View Product</h1>
                        <p className="text-brown-50">
                            <Link to="/dashboard">Dashboard</Link>  / <Link to="/products">Product </Link>  / {' '}
                            <span className="text-brown font-medium">View product</span>
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md max-w-[1500px]">

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Left side - Images */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
                            {[0, 1, 2, 3].map((index) => (
                                <div 
                                    key={index} 
                                    className="relative aspect-square w-full h-auto overflow-hidden group"
                                >
                                    {mainImage?.[index] ? (
                                        isVideoFile(mainImage[index]) ? (
                                            <div className="relative group cursor-pointer w-full h-full">
                                            <video
                                                src={mainImage[index]}
                                                className="w-full h-full object-cover"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                                                onClick={(event) => handleMediaClick(event, mainImage[index])}
                                            >
                                                <BsPlayCircle
                                                    size={48}
                                                    className="text-white hover:scale-110 transition-transform duration-200"
                                                />
                                            </div>
                                        </div>
                                        ) : (
                                            <div 
                                                className="relative w-full h-full"
                                                onMouseMove={(e) => handleMouseMove(index, e)}
                                                onMouseLeave={() => handleMouseLeave(index)}
                                            >
                                                <img
                                                    ref={el => imageRefs.current[index] = el}
                                                    src={mainImage[index]}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300"
                                                    style={magnifyStyle[index] || {}}
                                                />
                                                <div 
                                                    className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-10 transition-all duration-300"
                                                />
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-gray-100"></div>
                                    )}
                                </div>
                            ))}

                            <div className="col-span-2 h-[100px] w-full relative">
                                <ReactOwlCarousel className="product-thumbs-carousel w-full h-full" {...thumbnailOptions}>
                                    {products?.images?.length === 1 ? (
                                        <>
                                            {products.images.map((thumb, index) => (
                                                <div
                                                    key={index}
                                                    className={`aspect-square cursor-pointer h-full w-full relative`}
                                                    onClick={() => handleClick(thumb)}
                                                >
                                                    {isVideoFile(thumb) ? (
                                                        <div className="relative w-full h-full">
                                                            <video
                                                                src={thumb}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                                <BsPlayCircle
                                                                    size={24}
                                                                    className="text-white hover:scale-110 transition-transform duration-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={thumb || '/placeholder-image.jpg'}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {/* Duplicate the second image */}
                                            {products.images.map((thumb, index) => (
                                                <div
                                                    key={index + products.images.length} // Ensure unique key
                                                    className={`aspect-square cursor-pointer h-full w-full relative`}
                                                    onClick={() => handleClick(thumb)}
                                                >
                                                    {isVideoFile(thumb) ? (
                                                        <div className="relative w-full h-full">
                                                            <video
                                                                src={thumb}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                                <BsPlayCircle
                                                                    size={24}
                                                                    className="text-white hover:scale-110 transition-transform duration-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={thumb || '/placeholder-image.jpg'}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        products?.images?.map((thumb, index) => (
                                            <div
                                                key={index}
                                                className={`aspect-square cursor-pointer h-full w-full relative`}
                                                onClick={() => handleClick(thumb)}
                                            >
                                                {isVideoFile(thumb) ? (
                                                    <div className="relative w-full h-full">
                                                        <video
                                                            src={thumb}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                            <BsPlayCircle
                                                                size={24}
                                                                className="text-white hover:scale-110 transition-transform duration-200"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={thumb || '/placeholder-image.jpg'}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </ReactOwlCarousel>
                            </div>
                        </div>
                        {console.log(products)}

                        {/* Video Modal */}
                        <Modal
                            open={isModalOpen}
                            onClose={handleCloseModal}
                            className="flex items-center justify-center"
                        >
                            <div className="bg-black bg-opacity-90 p-4 rounded-lg max-w-4xl w-[90%] aspect-video">
                                <video
                                    src={selectedMedia}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                />
                            </div>
                        </Modal>

                        {/* Right side - Product Details */}
                        <div className="px-2">
                            <h2 className="font-[500] text-[18px] sm:text-[24px] leading-[30px]">{products?.product_name || "Dual Tone Halo Diamond Finger Ring"}</h2>
                            <div className="text-[20px] sm:text-[26px] text-[500] mt-[18px]"> <span className="text-[20px] sm:text-[26px] text-[700]">₹</span>{products?.price || "141268.00"}</div>

                            <p className="text-[16px] sm:text-[18px] text-[400] leading-[27px] my-[20px]">{products?.description || "Make a statement with this 18 Karat white and rose gold Finger Ring, featuring a dazzling central Diamond surrounded by two halos of real Diamonds.Perfect for engagements or special occasions, this real Diamond Finger Ring brings together modern sophistication and classic charm, making it a truly memorable piece."}</p>

                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Metal Color:</span>
                                    {products?.metal_color === "gold" ?
                                        <div className="flex items-center gap-2"> <div className="w-[15px] h-[15px] bg-[#EDCD90] rounded-full"></div> <span className="ak-product-value">Gold</span> </div>
                                        : products?.metal_color === "rose" ?
                                            <div className="flex items-center gap-2"> <div className="w-[15px] h-[15px] bg-[#F1C3A6] rounded-full"></div> <span className="ak-product-value">Rose</span> </div>
                                            : null}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Metal:</span>
                                    <span className="ak-product-value">{products?.metal}{products?.metal_color === "gold" ? " Gold" : products?.metal_color === "rose" ? " Rose" : null}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Gender:</span>
                                    <span className="ak-product-value">{products?.gender}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <span className="ak-product-key">Size:</span>
                                    <span className="ak-product-value w-[100%] pr-6">
                                        {products?.size_name?.split(',').map((size, index, array) => (
                                            <React.Fragment key={index}>
                                                {size.trim()}{index < array.length - 1 ? ', ' : ''}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Quantity:</span>
                                    <span className="ak-product-value">{products?.qty}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Discount :</span>
                                    <span className="ak-product-value">{products?.discount}%</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Diamond Quality :</span>
                                    <span className="ak-product-value">{products?.diamond_quality}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">No of views :</span>
                                    <span className="ak-product-value">{products?.discount || " "}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Weight :</span>
                                    <span className="ak-product-value">{products?.weight} Gm</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Diamond Setting :</span>
                                    <span className="ak-product-value">{products?.diamond_setting}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Diamond Shape :</span>
                                    <span className="ak-product-value">{products?.diamond_shape}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">No of Daimonds : :</span>
                                    <span className="ak-product-value">{products?.no_of_diamonds}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <span className="ak-product-key">Collection :</span>
                                    <span className="ak-product-value">{products?.collection}</span>
                                </div>
                                {
                                    products?.gram &&
                                    (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <span className="ak-product-key">Stone Weight :</span>
                                            <span className="ak-product-value">{parseFloat(products?.gram).toFixed(0)} Gm</span>
                                        </div>
                                    )
                                }
                                {
                                    products?.stone_price &&
                                    (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <span className="ak-product-key">Stone Price :</span>
                                            <span className="ak-product-value">{parseFloat(products?.stone_price).toFixed(0)}₹ </span>
                                        </div>
                                    )
                                }
                             
                                {
                                    products?.making_charge &&
                                    (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <span className="ak-product-key">Making charge :</span>
                                            <span className="ak-product-value">{parseFloat(products?.making_charge).toFixed(0)}%</span>
                                        </div>
                                    )
                                }
                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
});

export default ProductView;
