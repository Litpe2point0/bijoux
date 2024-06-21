import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Upload, Phone, IdentificationCard, CalendarBlank, EnvelopeSimple, MapPin } from 'phosphor-react';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css'; // Import theme CSS
import 'primereact/resources/primereact.min.css'; // Import PrimeReact CSS
import 'primeicons/primeicons.css'; // Import PrimeIcons
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { get_account_detail } from "../../api/main/accounts/Account_api";
import { getUserFromPersist } from "../../api/instance/axiosInstance";
import { CSpinner } from "@coreui/react";

const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export default function Profile() {

    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [username, setUserName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [dob, setDateOfBirth] = useState(null);
    const [email, setEmail] = useState(null);
    const [fullname, setFullName] = useState(null);
    const [address, setAddress] = useState(null);
    const [checkChange, setCheckChange] = useState(false);
    const [checkAlert, setCheckAlert] = useState(false);

    useEffect(() => {
        const setAttribute = async () => {
            const user = getUserFromPersist();
            const formData = new FormData();
            formData.append("account_id", user.id);
            const account_detail_data = await get_account_detail(formData, "Get account detail", true);
            const account_detail = account_detail_data.data.account_detail;
            //console.log("detail  nef",account_detail);
            setId(account_detail.id);
            setUserName(account_detail.username);
            setPhone(account_detail.phone);
            setImageUrl(account_detail.imageUrl);
            setDateOfBirth(account_detail.dob);
            setEmail(account_detail.email);
            setFullName(account_detail.fullname);
            setAddress(account_detail.address);
            setLoading(false);
        }
        setAttribute()
    }, [])

    const handleChangeFullName = (event) => {
        setFullName(event.target.value);
        setCheckChange(true);
    }

    const handleChangePhone = (event) => {
        setPhone(event.target.value);
        setCheckChange(true);
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
        setCheckChange(true);
    }

    const handleChangeAddress = (event) => {
        setAddress(event.target.value);
        setCheckChange(true);
    }

    const handleSaveChange = () => {
        // Call API to save change
        setCheckChange(false);
        setCheckAlert(true);

    }

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <p className="font-loraFont text-4xl font-semibold text-[#151542] mb-5 mt-5">Your Profile</p>
                <div className="w-10/12 h-0.5 bg-[#151542] rounded-sm mb-5"></div>
                {loading ? <CSpinner color="primary" />
                    :
                    <div className="w-10/12 grid grid-cols-2">
                        <div className="w-full flex flex-col items-center">
                            {/* Avatar Control */}
                            <div className="w-3/4">
                                <img className="md:w-[500px] md:h-[500px] xs:w-[200px] xs:h-[200px] rounded-full object-cover object-top shadow-xl" src={imageUrl}></img>
                            </div>
                            <div className="flex items-center mt-2 text-sky-400 hover:text-sky-900">
                                <button
                                    className=" mr-3 font-medium underline underline-offset-1 "
                                >
                                    Change Avatar
                                </button>
                                <Upload size={20} />
                            </div>

                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-500">#{id}</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {/* Change Full Name */}
                            <div className="flex flex-col mb-5">
                                <div className="flex items-center">
                                    <IdentificationCard size={28} />
                                    <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                                </div>
                                <TextField onChange={(e) => handleChangeFullName(e)} id="outlined-basic" defaultValue={fullname} variant="outlined" />
                            </div>

                            {/* Change Phone number */}
                            <div className="flex flex-col mb-5">
                                <div className="flex items-center">
                                    <Phone size={28} />
                                    <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Phone Number:</p>
                                </div>
                                <TextField onChange={(e) => handleChangePhone(e)} id="outlined-basic" defaultValue={phone} variant="outlined" />
                            </div>

                            <div className="flex flex-col mb-5">
                                <div className="flex items-center">
                                    <EnvelopeSimple size={28} />
                                    <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Email:</p>
                                </div>
                                <TextField onChange={(e) => handleChangeEmail(e)} id="outlined-basic" defaultValue={email} variant="outlined" />
                            </div>

                            <div className="flex flex-col mb-5">
                                <div className="flex items-center">
                                    <MapPin size={28} />
                                    <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Address:</p>
                                </div>
                                <TextField onChange={(e) => handleChangeAddress(e)} id="outlined-basic" defaultValue={address} variant="outlined" />
                            </div>


                            {/* <div className="flex flex-col mb-5">
                                <div className="flex items-center">
                                    <CalendarBlank size={28} />
                                    <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Date Of Birth:</p>
                                </div>
                                <Calendar
                                    value={dob}
                                    dateFormat="dd/mm/yy"
                                    onChange={(e) => {
                                        const selectedDate = e.value;
                                        const formattedDate = formatDate(selectedDate);
                                        setDateOfBirth(formattedDate);
                                    }}
                                />
                            </div> */}

                            {checkChange && (
                                <div className="flex justify-center">
                                    <button onClick={() => handleSaveChange()} className="w-full bg-[#151542] text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                                </div>
                            )}

                            {checkAlert && (
                                <Collapse in={checkAlert}>
                                    <Alert
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setCheckAlert(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        Update successfully!
                                    </Alert>
                                </Collapse>
                            )}
                        </div>
                    </div>
                }

            </div>
        </>
    )
}