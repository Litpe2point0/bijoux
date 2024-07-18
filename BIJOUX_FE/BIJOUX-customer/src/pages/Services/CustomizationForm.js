import { CSpinner } from "@coreui/react";
import { Select, MenuItem, TextField, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from 'react-phone-number-input';
import { get_update_account_detail, update_self } from "../../api/main/accounts/Account_api";
import { getUserFromPersist, loginRequiredAlert } from "../../api/instance/axiosInstance";
import { get_mounting_type_list } from "../../api/main/items/Model_api";
import { save_login } from "../Account/Login";
import { getUserFromToken } from "../../api/main/accounts/Login";
import { useDispatch } from "react-redux";
import { add_quote } from "../../api/main/orders/Order_api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CustomizationForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [mountingTypes, setMountingTypes] = useState([]);
    const [selectedMountingType, setSelectedMountingType] = useState("");
    const [idea, setIdea] = useState("");
    const [additionalInfoShow, setAdditionalInfoShow] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState("");
    const [errPhone, setErrPhone] = useState();
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

    useEffect(() => {
        const setAttribute = async () => {
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

            const mountingTypes = await get_mounting_type_list();
            setMountingTypes(mountingTypes.data);
            setSelectedMountingType(mountingTypes.data[0]);
            setLoading(false);
        }
        setAttribute()
    }, [])

    const handleMountingTypeSelect = (e) => {
        const mounting_type = e.target.value;
        setSelectedMountingType(JSON.parse(mounting_type));
    }

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
            empty_input();
        } else {
            showAlert('error', 'Error', 'Your quote has not been submitted', false);
        }

        setLoadingSubmit(false)

    }
    const empty_input = () => {
        setIdea("");
        setPhoneNumber("");
        setAddress("");
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
                setAdditionalInfoShow(false);
            }
        })
    };


    return (
        <div className="flex flex-col items-center">
            <p className="my-5 md:text-4xl sm:text-2xl font-loraFont text-[#151542]">Submit your informations for Jewelry Customization</p>
            <p className="text-gray-500 text-sm md:pl-0 md:pr-0 sm:pl-5 sm:pr-5 text-center">Before making your own jewelry, please give us informations so that we can know more about you and your ideas !</p>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <div className="w-full flex flex-col items-center p-10">

                    {/* Chọn type */}
                    <div className="md:w-[828px] sm:w-full mb-5">
                        <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">What would you want to make ?</p>

                        <Select sx={{ width: '100%' }} value={JSON.stringify(selectedMountingType)} onChange={handleMountingTypeSelect}>
                            {mountingTypes.map((mountingType) => {
                                return <MenuItem value={JSON.stringify(mountingType)}>{mountingType.name}</MenuItem>
                            })}
                        </Select>

                    </div>

                    {/* Nhập Idea */}
                    <div className="md:w-[828px] sm:w-full">
                        <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">Let us hear more about your ideas !</p>
                        <TextField sx={{ width: '100%' }} multiline value={idea} onChange={(e) => setIdea(e.target.value)} />
                    </div>

                    {/* Nhập phone number với address */}
                    {additionalInfoShow &&
                        <div className="w-full flex flex-col items-center p-5">
                            {/* Phone */}
                            <div className="md:w-[828px] sm:w-full mb-5">
                                <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">Your Phone Number ?</p>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={handlePhone}
                                />
                                {errPhone && (
                                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                                        <span className="font-bold italic mr-1">!</span>
                                        {errPhone}
                                    </p>
                                )}
                            </div>

                            {/* Address */}

                            <div className="md:w-[828px] sm:w-full">
                                <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">Your address ?</p>
                                <TextField sx={{ width: '100%' }} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>
                    }

                    <div className="my-4  flex justify-center">
                        <button onClick={() => handleSubmit()} disabled={loadingSubmit} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">
                            {loadingSubmit ?
                                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <CircularProgress color="inherit" size={25} />
                                </Box>
                                : 'Submit'}
                        </button>
                    </div>

                    <p className="text-xs italic text-gray-400">Please make sure that you confirm the correct informations</p>
                </div>
            }
        </div>
    )
}