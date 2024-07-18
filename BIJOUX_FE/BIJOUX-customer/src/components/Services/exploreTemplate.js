import React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography, Link, Box, CircularProgress } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material'
import ModelTypeOptionCard
    from "./Template/modelTypeOptionCard";
import { CSpinner } from "@coreui/react";
import { get_mounting_type_list } from '../../api/main/items/Model_api'
import { templateBanner, et_1, et_2, et_3, et_4 } from "../../assets/images";



export default function ExploreTemplate() {
    const [open, setOpen] = useState(false);
    const [modelTypes, setModelTypes] = useState("Ring");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setAttribute = async () => {
            const mountingTypes = await get_mounting_type_list();
            //alert('ok4')
            setModelTypes(mountingTypes.data);
            console.log(mountingTypes)
            setLoading(false)
        }
        setAttribute();
    }, []);
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
                    <h1 className="md:text-5xl xs:text-4xl mt-5 font-loraFont font-light text-[#151542] ">Explore Template</h1>
                    <div className="w-full grid grid-cols-2 mt-5 mb-10 gap-3">
                        <div className="w-full flex flex-col justify-center items-end">
                            <p className="text-lg text-start w-[624px] font-gantariFont text-gray-400 mt-2 mb-5"> Choose from our extensive collection of templates to create stunning jewelry pieces. Our pre-designed options offer a blend of elegance and affordability, perfect for any occasion.</p>
                            <div className="w-[624px] flex justify-start">
                                <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Get Started</button>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <img src={templateBanner} alt="Image" className="w-[622px] h-[350px] border-1 border-gray-800 shadow-lg object-cover rounded-md" />
                        </div>
                    </div>
                    <div className="flex justify-around w-full gap-5">
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={et_1}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 1: Select Jewelry Type</h1>
                            <p className="mt-2 text-sm ml-4">Choose the type of jewelry you would like to create. We offer options such as Rings / Bands / Pendants.</p>

                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={et_2}
                                alt="Ảnh"
                                className="w-full  h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 2: Select Mounting</h1>
                            <p className="mt-2 text-sm ml-4">Select the jewelry frame you prefer, along with the material, width, and view the frame from multiple angles in photos.</p>
                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={et_3}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 3: Select Diamonds</h1>
                            <p className="mt-2 text-sm ml-4">Choose the type of diamond to mount on the jewelry frame, customized according to the 4C standards: Cut, Color, Clarity, Carat, and the diamond shape.</p>
                        </div>
                        <div className="w-[330px] h-[400px] overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src={et_4}
                                alt="Ảnh"
                                className="w-full h-[260px] object-cover"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 4: Checkout jewelry</h1>
                            <p className="mt-2 text-sm m-4"> View your creation from every angle and proceed to payment to complete your purchase.</p>
                        </div>
                    </div>
                    <div className="flex justify-around w-96 items-center mt-5">
                        {/* <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Get Started</button> */}
                        <Dialog open={open} onClose={handleClose}>
                            <div className="flex justify-center bg-cyan-800 text-white">
                                <DialogTitle >Choose Your Jewelry Type</DialogTitle>
                            </div>
                            <DialogContent className="flex gap-5">
                                {loading ?
                                    <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                                        <CircularProgress color="inherit" />
                                    </Box>
                                    : modelTypes.map((modelType) => (
                                        <ModelTypeOptionCard
                                            modelType={modelType}
                                            modelTypeImage={
                                                (modelType.id === 1 && "https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") ||
                                                (modelType.id === 2 && "https://images.unsplash.com/photo-1565206077212-4eb48d41f54b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") ||
                                                (modelType.id === 3 && "https://images.unsplash.com/photo-1610661022658-5068c4d8f286?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")


                                            }
                                        />

                                    ))}

                                {/* <ModelTypeOptionCard modelType="Ring" modelTypeImage="https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                                <ModelTypeOptionCard modelType="Band" modelTypeImage="https://images.unsplash.com/photo-1565206077212-4eb48d41f54b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                                <ModelTypeOptionCard modelType="Pendant" modelTypeImage="https://images.unsplash.com/photo-1610661022658-5068c4d8f286?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" /> */}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    );
}