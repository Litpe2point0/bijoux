import React, { useEffect } from "react";
import { demoFinalMain, demoFinalRelated1, demoFinalRelated2, gold } from "../../../assets/images/index";
import { useState } from 'react'
import { Carousel } from 'primereact/carousel';
import numeral from 'numeral';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { RiVipDiamondLine } from "react-icons/ri";
import { GiDiamondRing } from "react-icons/gi";
import { FiTruck } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { CgSandClock } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { CSpinner } from "@coreui/react";
import { get_final_checkout } from "../../../api/main/items/Model_api";
import { add_order_template } from "../../../api/main/orders/Order_api";
import ThanksPage from "../../../components/home/ThanksPage/ThanksPage";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { TextField } from "@mui/material";

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};

// const finalCheckout = {
//     model_id: 2,
//     mounting_type: { id: 1, name: "Ring" },
//     main_image: demoFinalMain,
//     related_image: [
//         demoFinalRelated1,
//         demoFinalRelated2,
//     ],
//     metalList: [
//         { id: 1, name: "Gold", image_Url: gold, price: 2000000 },
//         { id: 2, name: "Gold", image_Url: gold, price: 1000000 },
//     ],
//     diamondList: [
//         {
//             id: 1,
//             image_Url: "https://ion.bluenile.com/sgmdirect/photoID/32025442/Diamond/19751585/nl/Diamond-heart-1.01-Carat_3_first_.jpg",
//             diamond_origin: { id: 1, name: "Natural-created" },
//             diamond_clarity: { id: 1, name: "IF" },
//             diamond_cut: { id: 1, name: "Excellent" },
//             diamond_color: { id: 1, name: "D" },
//             diamond_shape: { id: 4, name: "Heart" },
//             diamond_size: 6,
//             price: 20000000,
//             count: 1
//         },
//         {
//             id: 2,
//             image_Url: "https://ion.bluenile.com/sgmdirect/photoID/34296365/Diamond/21001361/nl/Diamond-round-1-Carat_3_first_.jpg",
//             diamond_origin: { id: 1, name: "Natural-created" },
//             diamond_clarity: { id: 1, name: "IF" },
//             diamond_cut: { id: 1, name: "Excellent" },
//             diamond_color: { id: 1, name: "D" },
//             diamond_shape: { id: 1, name: "Round" },
//             diamond_size: 3.6,
//             price: 28000000,
//             count: 6
//         }
//     ],
//     production_Price: 2000000,
//     total_Price: 500000000
// }
const finalCheckout = {
    "model_id": 1,
    "mounting_type": {
        "id": 2,
        "name": "Solitaire",
        "min_size": 4.5,
        "max_size": 8.5
    },
    main_image: demoFinalMain,
    related_image: [
        demoFinalRelated1,
        demoFinalRelated2,
    ],
    "metal": {
        "name": "24k Gold - 1k Silver Two Stone Engagement Ring with East-West",
        "price": 120000000
    },
    "diamond_list": [
        {
            "id": 201,
            "name": "3.6 (mm) D-IF1 Round Shape Excellent Cut Diamond",
            "imageUrl": "http://localhost:8000/image/Diamond/D1_VVS1.jpg",
            "diamond_size": 0.5,
            "diamond_color": {
                "id": 301,
                "name": "D"
            },
            "diamond_origin": {
                "id": 401,
                "name": "Natural"
            },
            "diamond_clarity": {
                "id": 501,
                "name": "VVS1"
            },
            "diamond_cut": {
                "id": 601,
                "name": "Excellent"
            },
            "price": 5000000,
            "diamond_shape": {
                "id": 701,
                "name": "Round",
                "drawing_path": "http://localhost:8000/image/shapes/round.jpg"
            },
            "count": 2,
            "is_editable": 1
        },
        {
            "id": 202,
            "name": "6 (mm) D-IF1 Heart Shape Excellent Cut Diamond",
            "imageUrl": "http://localhost:8000/image/Diamond/D2_VVS2.jpg",
            "diamond_size": 0.75,
            "diamond_color": {
                "id": 302,
                "name": "E"
            },
            "diamond_origin": {
                "id": 402,
                "name": "Lab-Created"
            },
            "diamond_clarity": {
                "id": 502,
                "name": "VVS2"
            },
            "diamond_cut": {
                "id": 602,
                "name": "Very Good"
            },
            "price": 7500000,
            "diamond_shape": {
                "id": 702,
                "name": "Princess",
                "drawing_path": "http://localhost:8000/image/shapes/princess.jpg"
            },
            "count": 1,
            "is_editable": 0
        }
    ],
    total_price: 20000000000,
    production_price: 323232323

}

export default function CompleteRing() {

    const navigate = useNavigate();
    const [finalProduct, setFinalProduct] = useState(null);
    const [checkoutProduct, setCheckoutProduct] = useState(null);


    const [loading, setLoading] = useState(1);
    const [loadingComplete, setLoadingComplete] = useState(false);

    const [showImage, setShowImage] = useState(null);
    const [imageList, setImageList] = useState([]);

    //note đây
    const [note, setNote] = useState('');

    const [checkPhoneAndAddress, setCheckPhoneAndAddress] = useState(false);
    const [phone, setPhone] = useState('');
    const [errPhone, setErrPhone] = useState();
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const handlePhone = (value) => {
        setPhone(value);
        if (value) {
            const isValid = isValidPhoneNumber(value);
            setIsPhoneNumberValid(isValid);
            if (isValid) {
                setErrPhone("");
            } else {
                setErrPhone("Enter a valid phone number");
            }
        } else {
            setIsPhoneNumberValid(true); // Giả sử giá trị trống là hợp lệ
            setErrPhone("");
        }
    };

    const [address, setAddress] = useState('');
    const handleAddress = (event) => {
        setAddress(event.target.value);
    };


    const productTemplate = (product) => {
        return (
            <div className="hover:border">
                <div onClick={() => handleChangeImage(product)} className="mb-3 flex justify-center">
                    <img src={`${product}`} className="w-2/3" />
                </div>

            </div>
        );
    };

    useEffect(() => {
        const setAttribute = async () => {
            const finalProduct = JSON.parse(localStorage.getItem('finalProduct'));

            if (!finalProduct || !finalProduct.model || !finalProduct.model.id) {
                console.log('không tồn tại finalProduct hoặc finalProduct.model == null ')
                alert('ok')
                window.location.href = "/services";
            }
            setFinalProduct(finalProduct);
            const template_information = {
                model_id: finalProduct.model.id,
                diamond_shape_id: finalProduct.diamond_shape.id,
                metal_1_id: finalProduct.metal_1.id,
                metal_2_id: finalProduct.metal_2 ? finalProduct.metal_2.id : null,
                mounting_size: finalProduct.mounting_size,
                diamond_origin_id: finalProduct.diamond_origin.id,
                diamond_clarity_id: finalProduct.diamond_clarity.id,
                diamond_color_id: finalProduct.diamond_color.id,
                diamond_cut_id: finalProduct.diamond_cut.id,
                diamond_size: finalProduct.diamond_size,
            }
            console.log("COMPLETE FINAL PRODUCT", template_information)
            const formData = new FormData();
            formData.append('template_information', JSON.stringify(template_information));
            const finalCheckout = await get_final_checkout(formData);
            if (!finalCheckout.success) {
                setLoading(3)

            } else {
                setCheckoutProduct(finalCheckout.data);
                setShowImage(finalCheckout.data.main_image)
                setImageList([finalCheckout.data.main_image, ...finalCheckout.data.related_image])
                //console.log("WENFOWNFOEWNFOWFNEWONFEWO", finalCheckout.data.diamond_list)
                setLoading(0)
            }


        }
        setAttribute();
    }, []);

    const handleChangeImage = (image) => {
        setShowImage(image);
    }

    const handleChangeMetal = () => {

        navigate(`/mounting-detail/${checkoutProduct.model_id}`);
    }

    const handleChangeDiamond = () => {
        window.location.href = '/template?step=2&mountingType=' + checkoutProduct.mounting_type.id + '&model_id=' + checkoutProduct.model_id;
    }

    const handleRestart = () => {
        const mounting_type = JSON.parse(localStorage.getItem('mountingType'));
        window.location.href = `/template?step=1&mountingType=${mounting_type.id}`;
        localStorage.removeItem('finalProduct');
    }

    const handleOrderAdding = async () => {
        setLoadingComplete(true);
        const finalProduct = JSON.parse(localStorage.getItem('finalProduct'));
        if (!finalProduct) {
            setLoadingComplete(false);
            setLoading(3);
        }
        const new_order = {
            model_id: finalProduct.model.id,
            diamond_shape_id: finalProduct.diamond_shape.id,
            diamond_origin_id: finalProduct.diamond_origin.id,
            diamond_clarity_id: finalProduct.diamond_clarity.id,
            diamond_color_id: finalProduct.diamond_color.id,
            diamond_cut_id: finalProduct.diamond_cut.id,
            diamond_size: finalProduct.diamond_size,
            metal_1_id: finalProduct.metal_1.id,
            metal_2_id: finalProduct.metal_2 ? finalProduct.metal_2.id : null,
            mounting_size: finalProduct.mounting_size,
            note: note,
        }
        const formData = new FormData();
        formData.append('new_order', JSON.stringify(new_order));
        const response = await add_order_template(formData, "New Order Has Been Add To Your Account", true);
        if (response.success) {

            localStorage.removeItem('finalProduct');
            setLoading(2);
            // navigate('/services');
        }
        setLoadingComplete(false);
    }

    return (
        <div className="flex flex-col items-center text-[#151542] mb-20">
            <p className="text-[#151542] text-4xl font-loraFont font-semibold">Your Final Jewelry Has Been Complete !</p>
            <div className="w-3/4 h-0.5 bg-slate-500 mb-20 mt-5"></div>
            {loading == 1 && <CSpinner color="primary" />}
            {loading == 2 && <ThanksPage />}
            {loading == 3 &&


                <div className="w-full flex flex-col items-center justify-center mb-10">
                    <span className="w-full flex flex-col items-center justify-center ">
                        <p className="text-[#151542] text-2xl font-loraFont font-light">Something went wrong with your customization</p>
                        <br />
                        <p className="text-[#151542] text-2xl font-loraFont font-light">Please try again !</p>
                        <br />
                    </span>

                    <div onClick={() => handleRestart()} className="w-50 h-[30px] flex items-center justify-center text-xl text-[#151542] bg-white border-2 border-[#151542] hover:cursor-pointer hover:text-[#29296b] mb-6">
                        <p>RESTART SELECT</p>
                    </div>
                </div>

            }
            {loading == 0 &&
                <div className="w-10/12 grid grid-cols-2 gap-5">
                    <div className="w-3/4">
                        <div className="w-full flex justify-center mb-10">

                            <img src={showImage} alt="diamond" className="w-3/4 border-2 drop-shadow-xl" />

                        </div>
                        <div className="w-full">
                            <Carousel value={imageList} numVisible={2} autoplayInterval={3000} numScroll={1} responsiveOptions={[
                                {
                                    breakpoint: '1400px',
                                    numVisible: 2,
                                    numScroll: 1
                                },
                                {
                                    breakpoint: '1199px',
                                    numVisible: 3,
                                    numScroll: 1
                                },
                                {
                                    breakpoint: '767px',
                                    numVisible: 2,
                                    numScroll: 1
                                },
                                {
                                    breakpoint: '575px',
                                    numVisible: 1,
                                    numScroll: 1
                                }
                            ]} itemTemplate={productTemplate} />

                        </div>
                    </div>
                    <div className=" w-full flex flex-col">
                        <div className="w-full flex flex-col">
                            <p className="text-3xl text-[#151542] font-loraFont font-light">
                                {checkoutProduct.name}
                            </p>
                            <div className="w-11/12 h-0.5 bg-gray-200 my-5"></div>
                        </div>

                        <div className="w-full flex flex-col mb-3">
                            <p className="font-gantariFont text-[#151542] font-semibold ">Complete Jewelry:</p>
                        </div>

                        {
                            loading == 0 && checkoutProduct.diamond_list.map((diamond, index) => (

                                <div className="w-full flex justify-between mb-3">
                                    <div className="flex">
                                        <div className="w-[15px] flex justify-center">
                                            <RiVipDiamondLine size={13} className="mt-1" />
                                        </div>
                                        <div className="w-[306px] flex flex-col ml-2 mt-0">
                                            <div className="w-[400px] font-gantariFont">
                                                <p>
                                                    {diamond.name}
                                                </p>
                                            </div>
                                            <div className="w-[400px] font-gantariFont">
                                                <p>
                                                    [{diamond.count} Piece{diamond.count > 1 ? 's' : ''}]
                                                </p>
                                            </div>
                                            <div className="w-[400px] font-gantariFont">
                                                <p>
                                                    {diamond.diamond_cut.name} Cut • {diamond.diamond_color.name} Color • {diamond.diamond_clarity.name} Clarity • {diamond.diamond_origin.name} Origin
                                                </p>
                                            </div>
                                            <p> ID: #{diamond.id}</p>
                                            <p className="font-gantariFont font-semibold text-sm"><CurrencyFormatter value={diamond.price} /></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start">
                                        {diamond.is_editable == 1 && <button onClick={() => handleChangeDiamond()} className="text-xs ml-10 font-semibold underline hover:text-sky-500">Change Diamond</button>}
                                    </div>
                                </div>
                            ))
                        }

                        <div className="w-full flex justify-between mb-5">
                            <div className="flex">
                                <div className="w-[15px] flex justify-center">
                                    <GiDiamondRing size={13} className="mt-1" />
                                </div>
                                <div className="w-[306px] flex flex-col ml-2 mt-0">
                                    <div className="w-[400px] font-gantariFont">
                                        <p>
                                            {checkoutProduct.metal.name}
                                        </p>
                                    </div>
                                    <p className="font-gantariFont font-semibold text-sm"><CurrencyFormatter value={checkoutProduct.metal.price} /></p>
                                </div>
                            </div>

                            <div className="flex items-center justify-start">
                                <button onClick={() => handleChangeMetal()} className="text-xs ml-10 font-semibold underline hover:text-sky-500">Change Settings</button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col mb-3">
                            <p className="font-gantariFont text-[#151542] font-semibold ">Production Price: <CurrencyFormatter value={checkoutProduct.production_price} /></p>
                        </div>

                        <div className="w-full flex items-start text-xl font-semibold font-gantariFont mb-5">
                            Total: <CurrencyFormatter value={checkoutProduct.total_price} />
                        </div>

                        <div onClick={() => handleOrderAdding()} className="w-full h-[48px] flex items-center justify-center text-xl text-white bg-[#151542] hover:cursor-pointer hover:bg-[#29296b] mb-6">
                            {loadingComplete ?
                                <CSpinner color="primary" />
                                :
                                <p>CONFIRM ORDER</p>
                            }
                        </div>

                        <div onClick={() => handleRestart()} className="w-full h-[48px] flex items-center justify-center text-xl text-[#151542] bg-white border-2 border-[#151542] hover:cursor-pointer hover:text-[#29296b] mb-6">
                            <p>RESTART SELECT</p>
                        </div>

                        {/* Button để test open submit Phone&Address */}
                        {/* <div onClick={() => setCheckPhoneAndAddress(true)} className="w-full h-[48px] flex items-center justify-center text-xl text-[#151542] bg-white border-2 border-[#151542] hover:cursor-pointer hover:text-[#29296b] mb-6">
                            <p>OPEN CHECK ADDRESS</p>
                        </div> */}


                        <div>
                            <p className="font-gantariFont text-[#151542] font-semibold">Our Policies:</p>
                        </div>

                        <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center mb-5">
                            <div className="w-[100px] h-[100px] flex items-center justify-center">
                                <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                    <FiTruck size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col">
                                <p className="font-gantariFont text-[#151542] font-semibold">Free Shipping</p>
                                <div className="w-[550px]">
                                    <p className="font-gantariFont text-sm">Trang sức của bạn sẽ được vận chuyển miễn phí toàn quốc với thời gian nhất. Chúng tôi cam kết đảm bảo tính bảo mật và nguyên vẹn của sản phẩm trong quá trình vận chuyển.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center mb-5">
                            <div className="w-[100px] h-[100px] flex items-center justify-center">
                                <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                    <AiOutlineDollarCircle size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col">
                                <p className="font-gantariFont text-[#151542] font-semibold">Material's Price Changing</p>
                                <div className="w-[550px]">
                                    <p className="font-gantariFont text-sm">Giá của trang sức có thể sẽ thay đổi do sự thay đổi giá của các nguyên vật liệu trước khi bạn đặt cọc. Vì vậy hãy đặt cọc sớm nhất để có mức giá tốt nhất.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center">
                            <div className="w-[100px] h-[100px] flex items-center justify-center">
                                <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                    <CgSandClock size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col">
                                <p className="font-gantariFont text-[#151542] font-semibold">Lifetime warranty</p>
                                <div className="w-[550px]">
                                    <p className="font-gantariFont text-sm">Trang sức của bạn được bảo hành trọn đời từ Bijoux, mọi vấn đề liên quan đến vật liệu làm nên trang sức sẽ được chúng tôi khắc phục cho bạn.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Modal
                open={checkPhoneAndAddress}
                onClose={() => setCheckPhoneAndAddress(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[400px] h-[350px]" sx={{ border: 'none' }}>
                    <div className="bg-sky-800 text-white font-gantariFont flex flex-col items-center justify-center h-[80px]">
                        <p className="font-bold">Opps, seems like we don't have your contact yet!</p>
                        <p className="text-xs italic text-center">Please submit your phone number and Address to complete step</p>
                    </div>
                    <div className="flex flex-col p-4">
                        <p className="font-titleFont text-base font-semibold text-gray-600">Your Phone Number</p>
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={handlePhone} />

                        {errPhone && (
                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                <span className="font-bold italic mr-1">!</span>
                                {errPhone}
                            </p>
                        )}

                        <p className="font-titleFont text-base font-semibold text-gray-600 mt-5">Your Address</p>
                        <TextField
                            id="outlined-controlled"
                            label="Address"
                            value={address}
                            onChange={(event) => handleAddress(event)}
                            fullWidth
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center mt-2">
                        <button className="w-[150px] h-[40px] text-white font-semibold font-gantariFont bg-sky-800 hover:bg-sky-500 rounded-sm">Submit</button>
                        <p className="text-xs text-center text-gray-500 font-gantariFont mt-4">Please make sure that you submit correct informations.</p>
                    </div>
                </Box>
            </Modal>

        </div>
    );
}