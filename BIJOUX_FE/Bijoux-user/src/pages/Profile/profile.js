import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Upload, Phone, IdentificationCard } from 'phosphor-react';
export default function Profile() {

    const AccountDetail = {
        id: 1,
        username: "lockthepoet000",
        imageUrl: "https://i.pinimg.com/736x/22/b0/b0/22b0b07aae48b2ffbf659d821525c038.jpg",
        dob: "03/10/2004",
        email: "lochmse182366@fpt.edu.vn",
        fullname: "Hoàng Minh Lộc",
        role: { id: 1, name: "Customer" },
        address: "123 Trần Phú, Quận Từ Liêm, Hà Nội",
        order_count: 0,
        order_history: []
    }

    const [username, setUserName] = useState(AccountDetail.username);
    const [imageUrl, setImageUrl] = useState(AccountDetail.imageUrl);
    const [dob, setDateOfBirth] = useState(AccountDetail.dob);
    const [email, setEmail] = useState(AccountDetail.email);
    const [fullname, setFullName] = useState(AccountDetail.fullname);
    const [address, setAddress] = useState(AccountDetail.address);


    return (
        <>
            <div className="w-full flex flex-col items-center">
                <p className="font-loraFont text-4xl font-semibold text-[#151542] mb-5 mt-5">Your Profile</p>
                <div className="w-10/12 h-0.5 bg-[#151542] rounded-sm mb-5"></div>
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
                            <p className="text-2xl font-bold text-gray-500">#{username}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {/* Change Full Name */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <IdentificationCard size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>

                        {/* Change Phone number */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <Phone size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <IdentificationCard size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <IdentificationCard size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <IdentificationCard size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <IdentificationCard size={28} />
                                <p className="ml-2 text-xl font-bold text-[#151542] font-loraFont">Full Name:</p>
                            </div>
                            <TextField id="outlined-basic" defaultValue={fullname} variant="outlined" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}