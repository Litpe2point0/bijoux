import React from "react";
import { Card as MUICard, CardActionArea, CardContent, CardMedia, Typography as MUITypography } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material'
import { useState } from "react";


export default function ExploreCustomization() {
    const [open, setOpen] = useState(false);
    const [jewelryType, setJewelryType] = useState('');
    const [material, setMaterial] = useState('');
    const [idea, setIdea] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                            <p className="mt-2 ml-4"> Nhập thông tin của bạn và chúng tôi sẽ liên hệ sớm nhất có thể</p>

                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://img.freepik.com/free-photo/business-brainstorming-graph-chart-report-data-concept_53876-31213.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 2: Planning</h1>
                            <p className="mt-2 ml-4">Chúng tôi cung cấp đội ngũ tư vấn viên chuyên nghiệp, giúp bạn lên ý tưởng về trang sức của mình</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://t3.ftcdn.net/jpg/05/45/25/44/360_F_545254467_ls0i5SlQprMEBbdy7iMUvxpGMkUJCsMp.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 3: Designing</h1>
                            <p className="mt-2 ml-4">Từ những ý tưởng, chúng tôi sẽ thiết kế trên file 3D để cho bạn có cái nhìn tổng quát và có thể thay đổi.</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://static8.depositphotos.com/1177973/842/i/450/depositphotos_8423176-stock-photo-pendant-in-form-of-rings.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 4: Compliting</h1>
                            <p className="mt-2 m-4">  Sản phẩm của bạn sẽ được hoàn thiện trong thời gian sớm nhất và giao tới tận tay để bạn tận hưởng tác phẩm nghệ thuật của riêng mình</p>
                        </div>
                    </div>

                    <div className="flex justify-around w-96 items-center mt-5">
                        <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Contact Now</button>
                    </div>

                    <Dialog open={open} onClose={handleClose}>
                        <div className="flex justify-center bg-cyan-800 text-white">
                            <DialogTitle >Submit Quote Informations</DialogTitle>
                        </div>
                        <DialogContent>
                            <div className="mb-4">
                                <label className="mr-5">What you want to make ?</label>
                                <Select value={jewelryType} onChange={(e) => setJewelryType(e.target.value)}>
                                    <MenuItem value="Ring">Ring</MenuItem>
                                    <MenuItem value="Band">Band</MenuItem>
                                    <MenuItem value="Pendant">Pendant</MenuItem>
                                </Select>
                            </div>
                            <div className="mb-4">
                                <label className="mr-5">Main material of Jewelry ?</label>
                                <Select value={material} onChange={(e) => setMaterial(e.target.value)}>
                                    <MenuItem value="Gold">Gold</MenuItem>
                                    <MenuItem value="Silver">Silver</MenuItem>
                                    <MenuItem value="Platinum">Platinum</MenuItem>
                                    <MenuItem value="Rose-gold">Rose-gold</MenuItem>
                                </Select>
                            </div>
                            <div className="mb-4 flex flex-col">
                                <labe className="mr-5">Lets us hear more about your ideas !</labe>
                                <TextField multiline value={idea} onChange={(e) => setIdea(e.target.value)} />
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label>Your Phone Number</label>
                                <TextField value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="mb-4 flex flex-col">
                                <label>Your Email</label>
                                <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-4 flex justify-center">
                                <button className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Submit</button>
                            </div>

                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}