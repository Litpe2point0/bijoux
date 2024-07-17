import { CSpinner } from "@coreui/react";
import { Select, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from 'react-phone-number-input';

export default function CustomizationForm() {

    const [loading, setLoading] = useState(false);
    const [mountingTypes, setMountingTypes] = useState([]);
    const [selectedMountingType, setSelectedMountingType] = useState("");
    const [idea, setIdea] = useState("");
    const [additionalInfoShow, setAdditionalInfoShow] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState("");
    const [errPhone, setErrPhone] = useState();
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

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
        // setLoadingSubmit(true)
        // if (additionalInfoShow == true) {
        //     if (!phoneNumber || !address) {
        //         setLoadingSubmit(false)
        //         return showAlert('error', 'New Phone Number And Address Required', 'Your Account Need To Be Update To Use Our Features');

        //     }
        //     const new_account = {
        //         phone: phoneNumber,
        //         address: address,
        //     }
        //     const formData = new FormData();
        //     formData.append('new_account', JSON.stringify(new_account));
        //     const response = await update_self(formData, 'New Account', true);
        //     //alert('ok2')
        //     if (!response.success) {
        //         setLoadingSubmit(false)
        //         return showAlert('error', 'Error', 'Your account has not been updated');
        //     } else {
        //         const token = response.data.token;
        //         if (token) {
        //             const user = getUserFromToken(token);
        //             save_login(dispatch, token, user)

        //         } else {
        //             setLoadingSubmit(false)
        //             return showAlert('error', 'Error', 'Token Error');
        //         }
        //     }
        // }

        // const new_quote = {
        //     mounting_type_id: selectedMountingType.id,
        //     note: idea,
        // }
        // const formData = new FormData();
        // formData.append('new_quote', JSON.stringify(new_quote));
        // const response = await add_quote(formData, 'New Quote', true);
        // //alert('ok3')
        // if (response.success) {
        //     showAlert('success', 'Success', 'Your quote has been submitted successfully');
        //     handleClose();
        // } else {
        //     showAlert('error', 'Error', 'Your quote has not been submitted');
        // }

        // setLoadingSubmit(false)

    }


    return (
        <div className="flex flex-col items-center">
            <p className="my-5 text-4xl font-loraFont text-[#151542]">Submit your informations for Jewelry Customization</p>
            <p className="text-gray-500 text-sm text-center">Before making your own jewelry, please give us informations so that we can know more about you and your ideas !</p>
            {loading ? <CSpinner />
                :
                <div className="w-full flex flex-col items-center p-10">

                    {/* Chọn type */}
                    <div className="w-[828px] mb-5">
                        <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">What would you want to make ?</p>

                        <Select sx={{ width: '100%' }} value={JSON.stringify(selectedMountingType)} onChange={handleMountingTypeSelect}>
                            {mountingTypes.map((mountingType) => {
                                return <MenuItem value={JSON.stringify(mountingType)}>{mountingType.name}</MenuItem>
                            })}
                        </Select>

                    </div>

                    {/* Nhập Idea */}
                    <div className="w-[828px]">
                        <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">Let us hear more about your ideas !</p>
                        <TextField sx={{ width: '100%' }} multiline value={idea} onChange={(e) => setIdea(e.target.value)} />
                    </div>

                    {/* Nhập phone number với address */}
                    {additionalInfoShow &&
                        <div className="w-full flex flex-col items-center p-5">
                            {/* Phone */}
                            <div className="w-[828px] mb-5">
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

                            <div className="w-[828px]">
                                <p className="font-gantariFont text-gray-600 mb-2 text-lg font-semibold">Your address ?</p>
                                <TextField sx={{ width: '100%' }} type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>
                    }

                    <div className="mb-4 flex justify-center">
                        <button onClick={() => handleSubmit()} disabled={loadingSubmit} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">
                            {loadingSubmit ? 'Loading...' : 'Submit'}
                        </button>
                    </div>

                    <p className="text-xs italic text-gray-400">Please make sure that you confirm the correct informations</p>
                </div>
            }
        </div>
    )
}