import React, { useEffect } from "react";
import { Card as MUICard, CardActionArea, CardContent, CardMedia, Typography as MUITypography, Box, CircularProgress } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material'
import { useState } from "react";
import { get_mounting_type_list } from "../../api/main/items/Model_api";
import { getUserFromPersist, loginRequiredAlert } from "../../api/instance/axiosInstance";
import { CForm, CSpinner } from "@coreui/react";
import { add_quote } from "../../api/main/orders/Order_api";
import { get_update_account_detail, update_self } from "../../api/main/accounts/Account_api";
import Swal from "sweetalert2";
import './alert.css';
import { useDispatch } from "react-redux";
import { save_login } from "../../pages/Account/Login";
import { getUserFromToken } from "../../api/main/accounts/Login";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { customBanner, ec_1, ec_2, ec_3, ec_4 } from "../../assets/images";

export default function ExploreCustomization() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [additionalInfoShow, setAdditionalInfoShow] = useState(false);
    const [mountingTypes, setMountingTypes] = useState([]);
    //const [material, setMaterial] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [selectedMountingType, setSelectedMountingType] = useState(null);
    const [idea, setIdea] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(null);


    const [errPhone, setErrPhone] = useState();
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

    const handlePhone = (value) => {
        setPhoneNumber(value);
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

    const [address, setAddress] = useState(null);

    useEffect(() => {
        const account = getUserFromPersist();
        // if (!account) {
        //     return loginRequiredAlert();
        // } else 
        // if (account && (!account.phone || !account.email)) {
        //     setAdditionalInfoShow(true);
        // }

        const setAttribute = async () => {
            const mountingTypes = await get_mounting_type_list();
            //alert('ok1')
            setMountingTypes(mountingTypes.data);
            setSelectedMountingType(mountingTypes.data[0]);
            setLoading(false);
        }
        setAttribute();
    }, []);

    const emptyInput = () => {
        setIdea('');
        setPhoneNumber(null);
        setAddress(null);
    }

    const handleOpen = async () => {

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
        } else if (account && (!account.phone || !account.address)) {
            setAdditionalInfoShow(true);
        } else {
            setAdditionalInfoShow(false)
        }


        setOpen(true);
    };

    const handleClose = () => {
        emptyInput();
        setOpen(false);
    };

    const handleMountingTypeSelect = (e) => {
        const mounting_type = e.target.value;
        setSelectedMountingType(JSON.parse(mounting_type));
    }
    const handleSubmit = async () => {
        setLoadingSubmit(true)
        if (additionalInfoShow == true) {
            if (!phoneNumber || !address) {
                setLoadingSubmit(false)
                return showAlert('error', 'New Phone Number And Address Required', 'Your Account Need To Be Update To Use Our Features', false);

            }
            const new_account = {
                phone: phoneNumber,
                address: address,
            }
            const formData = new FormData();
            formData.append('new_account', JSON.stringify(new_account));
            const response = await update_self(formData, 'New Account', true);
            //alert('ok2')
            if (!response.success) {
                setLoadingSubmit(false)
                return showAlert('error', 'Error', 'Your account has not been updated', false);
            } else {
                const token = response.data.token;
                if (token) {
                    const user = getUserFromToken(token);
                    save_login(dispatch, token, user)

                } else {
                    setLoadingSubmit(false)
                    return showAlert('error', 'Error', 'Token Error', false);
                }
            }
        }

        const new_quote = {
            mounting_type_id: selectedMountingType.id,
            note: idea,
        }
        const formData = new FormData();
        formData.append('new_quote', JSON.stringify(new_quote));
        const response = await add_quote(formData, 'New Quote', true);
        //alert('ok3')
        if (response.success) {
            showAlert('success', 'Success', 'Your quote has been submitted successfully', true);
            handleClose();
        } else {
            showAlert('error', 'Error', 'Your quote has not been submitted', false);
        }

        setLoadingSubmit(false)

    }
    const showAlert = (icon, title, text, updateResult) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Got It',
            customClass: {
                popup: 'swal2-custom-zindex'
            }
        }).then((result) => {
            if (result.isConfirmed && additionalInfoShow == true && phoneNumber && address && updateResult) {
                Swal.fire({
                    title: 'Success',
                    html: "Your Account Infomation Has Been Update <br>*Phone Number: " + phoneNumber + '<br>*Address: ' + address,
                    icon: "success",
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Got It',
                    customClass: {
                        popup: 'swal2-custom-zindex'
                    }
                })
            }
        })
    };
    return (
        <>
            <div class="w-full lg:h-full md:h-full xs:h-full bg-cover bg-center flex flex-col">
                <div className="flex flex-col m-10 items-center ">
                    <h1 className="md:text-5xl xs:text-4xl mt-5 font-loraFont font-light text-[#151542]">Explore Customization</h1>
                    <div className="w-full grid grid-cols-2 mt-5 mb-10 gap-3">
                        <div className="w-full flex justify-end">
                            <img src={customBanner} alt="Image" className="w-[622px] h-[350px] border-1 border-gray-800 shadow-lg object-cover rounded-md" />
                        </div>
                        <div className="w-full flex flex-col justify-center items-center">
                            <p className="text-lg text-start w-[624px] font-gantariFont text-gray-400 mt-2 mb-5"> We offer personalized jewelry services, allowing you to design unique pieces that reflect your individual style and personality. Create bespoke rings, necklaces, and bracelets tailored just for you.</p>
                            <div className="w-[624px] flex justify-start">
                                <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Contact Now</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around w-full gap-5">
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={ec_1}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 1: Contact</h1>
                            <p className="mt-2 text-sm ml-4">Enter your information and we will contact you as soon as possible.</p>

                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={ec_2}
                                alt="Ảnh"
                                className="w-full  h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 2: Planning</h1>
                            <p className="mt-2 text-sm ml-4">We provide a team of professional consultants to help you brainstorm ideas for your jewelry.</p>
                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={ec_3}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 3: Designing</h1>
                            <p className="mt-2 text-sm ml-4">From those ideas, we will design a 3D file to give you a comprehensive view and allow for modifications.</p>
                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={ec_4}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 4: Compliting</h1>
                            <p className="mt-2 text-sm m-4"> Your product will be completed as soon as possible and delivered to your doorstep so you can enjoy your own piece of art.</p>
                        </div>
                    </div>

                    {/* <div className="flex justify-around w-96 items-center mt-5">
                        <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Contact Now</button>
                    </div> */}

                    <Dialog sx={{ zIndex: '999 !important' }} open={open} onClose={handleClose}>
                        <div className="flex justify-center bg-cyan-800 text-white">
                            <DialogTitle >Submit Quote Informations</DialogTitle>
                        </div>

                        {loading ? <CSpinner color="primary" />
                            :
                            <DialogContent  >
                                <div className="mb-4">
                                    <label className="mr-5">What you want to make ?</label>
                                    <Select value={JSON.stringify(selectedMountingType)} onChange={handleMountingTypeSelect}>
                                        {mountingTypes.map((mountingType) => {
                                            return <MenuItem value={JSON.stringify(mountingType)}>{mountingType.name}</MenuItem>
                                        })}
                                    </Select>
                                </div>

                                <div className="mb-4 flex flex-col">
                                    <labe className="mr-5">Lets us hear more about your ideas !</labe>
                                    <TextField multiline value={idea} onChange={(e) => setIdea(e.target.value)} />
                                </div>
                                {additionalInfoShow &&
                                    <>
                                        <div className="mb-4 flex flex-col">
                                            <label>Your Phone Number</label>
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                value={phoneNumber}
                                                onChange={handlePhone} />

                                            {errPhone && (
                                                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                                    <span className="font-bold italic mr-1">!</span>
                                                    {errPhone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-4 flex flex-col">
                                            <label>Your Address</label>
                                            <TextField type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                    </>
                                }

                                <div className="mb-4 flex justify-center">
                                    <button onClick={() => handleSubmit()} disabled={loadingSubmit} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">
                                        {loadingSubmit ?
                                            <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                <CircularProgress color="inherit" size={25} />
                                            </Box>
                                            : 'Submit'}
                                    </button>
                                </div>

                                <p className="text-xs italic text-gray-400">Please make sure that you confirm the correct informations</p>

                            </DialogContent>
                        }


                    </Dialog>
                </div>
            </div>
        </>
    );
}