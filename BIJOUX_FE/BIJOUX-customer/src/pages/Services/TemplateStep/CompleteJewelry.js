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
import { CircularProgress, TextField } from "@mui/material";
import { getTokenFromPersist, getUserFromPersist, instantAlertMaker, loginRequiredAlert } from "../../../api/instance/axiosInstance";
import { save_login } from "../../Account/Login";
import { getUserFromToken } from "../../../api/main/accounts/Login";
import { get_update_account_detail, update_self } from "../../../api/main/accounts/Account_api";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};

export default function CompleteRing() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [finalProduct, setFinalProduct] = useState(null);
    const [checkoutProduct, setCheckoutProduct] = useState(null);


    const [loading, setLoading] = useState(1);
    const [loadingUpdateSelf, setLoadingUpdateSelf] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);

    const [showImage, setShowImage] = useState(null);
    const [imageList, setImageList] = useState([]);

    //note đây
    const [note, setNote] = useState('');


    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [checkPhoneAndAddress, setCheckPhoneAndAddress] = useState(false);
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

    const handleUpdateSelf = async () => {
        setLoadingUpdateSelf(true);
        if (!phone || !address) {
            setLoadingUpdateSelf(false)
            return instantAlertMaker('error', 'New Phone Number And Address Required', 'Your Account Need To Be Update To Use Our Features');

        }
        const new_account = {
            phone: phone,
            address: address,
        }
        const formData = new FormData();
        formData.append('new_account', JSON.stringify(new_account));
        const response = await update_self(formData, 'New Account', true);
        if (!response.success) {
            setLoadingUpdateSelf(false)
            return instantAlertMaker('error', 'Error', 'Your account has not been updated');
        } else {
            const token = response.data.token;
            if (token) {
                const user = getUserFromToken(token);
                save_login(dispatch, token, user)
                setLoadingUpdateSelf(false)
                setCheckPhoneAndAddress(false);
                return (
                    Swal.fire({
                        title: 'Success',
                        html: "Your Account Infomation Has Been Update <br>*Phone Number: " + phone + '<br>*Address: ' + address,
                        icon: "success",
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Got It',
                        customClass: {
                            popup: 'swal2-custom-zindex'
                        }
                    })
                );
            } else {
                setLoadingUpdateSelf(false)
                return instantAlertMaker('error', 'Error', 'Token Error');
            }
        }
    }
    const handleOrderAdding = async () => {
        setLoadingComplete(true);
        let account = getUserFromPersist();
        if (!account) {
            return loginRequiredAlert();
        }
        const formData_update_account_detail = new FormData();
        formData_update_account_detail.append('account_id', account.id);

        const response_update_account_detail = await get_update_account_detail(formData_update_account_detail, "Get Account Detail", true);
        if (response_update_account_detail.success) {
            const user = response_update_account_detail.data.account_detail;
            account = user;
        } else {
            return loginRequiredAlert();
        }
        if (!account) {
            return loginRequiredAlert();
        } else if (account && (!account.phone || !account.email)) {
            setLoadingComplete(false)
            return setCheckPhoneAndAddress(true);
        } else {
            setCheckPhoneAndAddress(false);
        }

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
        } else {
            setLoading(3)
        }
        setLoadingComplete(false);
    }


    return (
        <div className="flex flex-col items-center text-[#151542] mb-20">
            <p className="text-[#151542] md:text-4xl sm:text-2xl font-loraFont font-semibold">Your Final Jewelry Has Been Complete !</p>
            <div className="w-3/4 h-0.5 bg-slate-500 mb-20 mt-5"></div>
            {loading == 1 &&
                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
            }
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
                <div className="w-10/12 grid md:grid-cols-2 sm:grid-cols-1 gap-5">
                    <div className="w-3/4 sm:w-full sm:flex sm:flex-col sm:items-center sm:justify-center">
                        <div className="w-full flex justify-center mb-10">

                            <img src={showImage} alt="diamond" className="w-10/12 border-2 drop-shadow-xl rounded-md" />

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
                                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                                    <CircularProgress color="inherit" />
                                </Box>
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

                        <div className="w-full md:h-[120px] sm:h-[120px] bg-gray-100 rounded-lg flex items-center mb-5">
                            <div className="md:w-[100px] h-full sm:w-[50px] flex md:items-center sm:items-start md:p-0 sm:p-5 justify-center">
                                <div className="md:bg-gray-200 sm:bg-transparent sm:h-[35px] sm:w-[35px] md:h-[78px] md:w-[78px] flex items-center justify-center rounded-xl ">
                                    <FiTruck size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col h-full flex-1 justify-center">
                                <p className="font-gantariFont text-[#151542] font-semibold">Free Shipping</p>
                                <div className="w-full">
                                    <p className="font-gantariFont text-sm">Your jewelry will be shipped nationwide free of charge with the utmost expediency. We are committed to ensuring the security and integrity of your product throughout the shipping process.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:h-[120px] sm:h-[120px] bg-gray-100 rounded-lg flex items-center mb-5">
                            <div className="md:w-[100px] h-full sm:w-[50px] flex md:items-center sm:items-start md:p-0 sm:p-5 justify-center">
                                <div className="md:bg-gray-200 sm:bg-transparent sm:h-[35px] sm:w-[35px] md:h-[78px] md:w-[78px] flex items-center justify-center rounded-xl ">
                                    <AiOutlineDollarCircle size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col h-full flex-1 justify-center">
                                <p className="font-gantariFont text-[#151542] font-semibold">Material's Price Changing</p>
                                <div className="w-full">
                                    <p className="font-gantariFont text-sm">Jewelry prices may vary due to changes in the prices of raw materials before you place a deposit. Therefore, place your deposit early to lock in the best price.</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:h-[120px] sm:h-[120px] bg-gray-100 rounded-lg flex items-center mb-5">
                            <div className="md:w-[100px] h-full sm:w-[50px] flex md:items-center sm:items-start md:p-0 sm:p-5 justify-center">
                                <div className="md:bg-gray-200 sm:bg-transparent sm:h-[35px] sm:w-[35px] md:h-[78px] md:w-[78px] flex items-center justify-center rounded-xl ">
                                    <CgSandClock size={40} />
                                </div>
                            </div>
                            <div className="ml-3 flex flex-col h-full flex-1 justify-center">
                                <p className="font-gantariFont text-[#151542] font-semibold">Lifetime warranty</p>
                                <div className="w-full">
                                    <p className="font-gantariFont text-sm">Your jewelry is covered by a lifetime warranty from Bijoux. Any issues related to the materials used in the jewelry will be resolved by us.</p>
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

                        <button disabled={loadingUpdateSelf} onClick={() => handleUpdateSelf()} className="w-[150px] h-[40px] text-white font-semibold font-gantariFont bg-sky-800 hover:bg-sky-500 rounded-sm">
                            {loadingUpdateSelf ?
                                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <CircularProgress color="inherit" />
                                </Box>
                                :
                                'Submit'
                            }
                        </button>


                        <p className="text-xs text-center text-gray-500 font-gantariFont mt-4">Please make sure that you submit correct informations.</p>
                    </div>
                </Box>
            </Modal>

        </div>
    );
}