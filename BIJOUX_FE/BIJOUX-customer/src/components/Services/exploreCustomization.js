import React, { useEffect } from "react";
import { Card as MUICard, CardActionArea, CardContent, CardMedia, Typography as MUITypography } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material'
import { useState } from "react";
import { get_mounting_type_list } from "../../api/main/items/Model_api";
import { getUserFromPersist, loginRequiredAlert } from "../../api/instance/axiosInstance";
import { CForm, CSpinner } from "@coreui/react";
import { add_quote } from "../../api/main/orders/Order_api";
import { update_self } from "../../api/main/accounts/Account_api";
import Swal from "sweetalert2";
import './alert.css';
import { useDispatch } from "react-redux";
import { save_login } from "../../pages/Account/Login";
import { getUserFromToken } from "../../api/main/accounts/Login";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input';


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

    const handleOpen = () => {
        const account = getUserFromPersist();
        if (!account) {
            return loginRequiredAlert();
        } else if (account && (!account.phone || !account.email)) {
            setAdditionalInfoShow(true);
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
                return showAlert('error', 'New Phone Number And Address Required', 'Your Account Need To Be Update To Use Our Features');

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
                return showAlert('error', 'Error', 'Your account has not been updated');
            } else {
                const token = response.data.token;
                if (token) {
                    const user = getUserFromToken(token);
                    save_login(dispatch, token, user)

                } else {
                    setLoadingSubmit(false)
                    return showAlert('error', 'Error', 'Token Error');
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
            showAlert('success', 'Success', 'Your quote has been submitted successfully');
            handleClose();
        } else {
            showAlert('error', 'Error', 'Your quote has not been submitted');
        }

        setLoadingSubmit(false)

    }
    const showAlert = (icon, title, text,) => {
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
            if (result.isConfirmed && additionalInfoShow == true && phoneNumber && address) {
                Swal.fire({
                    title: 'Success',
                    text: "Your Account Infomation Has Been Update \n*Phone Number: " + phoneNumber + '\n*Address: ' + address,
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
                    <h1 className="md:text-5xl xs:text-4xl mt-5 font-loraFont font-light text-[#151542] mb-10">Explore Customization</h1>
                    <div className="grid md:grid-cols-4 xs:grid-cols-1 gap-5">
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://media.istockphoto.com/id/1331493599/photo/shot-of-a-businessman-using-a-computer-while-working-in-a-call-center.jpg?s=612x612&w=0&k=20&c=ocaFzVRnDARFnANjyd6CMrwAI0Ua6I0Na_MKej8IysA="
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 1: Contact</h1>
                            <p className="mt-2 ml-4"> Enter your information and we will contact you as soon as possible.</p>

                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://img.freepik.com/free-photo/business-brainstorming-graph-chart-report-data-concept_53876-31213.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 2: Planning</h1>
                            <p className="mt-2 ml-4">We provide a team of professional consultants to help you brainstorm ideas for your jewelry.</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://t3.ftcdn.net/jpg/05/45/25/44/360_F_545254467_ls0i5SlQprMEBbdy7iMUvxpGMkUJCsMp.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 3: Designing</h1>
                            <p className="mt-2 ml-4">From those ideas, we will design a 3D file to give you a comprehensive view and allow for modifications.</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://static8.depositphotos.com/1177973/842/i/450/depositphotos_8423176-stock-photo-pendant-in-form-of-rings.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4  nnn">Step 4: Compliting</h1>
                            <p className="mt-2 m-4">Your product will be completed as soon as possible and delivered to your doorstep so you can enjoy your own piece of art.</p>
                        </div>
                    </div>

                    <div className="flex justify-around w-96 items-center mt-5">
                        <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Contact Now</button>
                    </div>

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
                                        {loadingSubmit ? 'Loading...' : 'Submit'}
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