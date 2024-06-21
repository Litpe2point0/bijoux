import React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography, Link } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, Button } from '@mui/material'
import ModelTypeOptionCard
    from "./Template/modelTypeOptionCard";
import { CSpinner } from "@coreui/react";
import { get_mounting_type_list } from '../../api/main/items/Model_api'

// const mountingTypes = [
//     {
//         id: 1,
//         name: "Ring",
//     },
//     {
//         id: 2,
//         name: "Band",
//     },
//     {
//         id: 3,
//         name: "Pendant",
//     },
// ];


export default function ExploreTemplate() {
    const [open, setOpen] = useState(false);
    const [modelTypes, setModelTypes] = useState("Ring");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setAttribute = async () => {
            const mountingTypes= await get_mounting_type_list();
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
                    <h1 className="md:text-5xl xs:text-4xl mt-5 font-loraFont font-light text-[#151542] mb-10">Explore Template</h1>
                    <div className="grid md:grid-cols-4 xs:grid-cols-1 gap-5">
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://st2.depositphotos.com/1613350/8401/i/450/depositphotos_84014742-stock-photo-gold-silver-rings-and-chains.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 1: Select Jewelry Type</h1>
                            <p className="mt-2 ml-4">Chọn loại trang sức bạn muốn tạo, chúng tôi cung cấp các loại trang sức như Nhẫn / Mặt dây chuyền / Vòng tay.</p>

                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://www.pasternakfindings.com/content/images/thumbs/1000956_four-prong-setting_630.jpeg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 2: Select Mounting</h1>
                            <p className="mt-2 ml-4">Chọn khung trang sức bạn yêu thích cũng như chất liệu của khung, độ rộng, xem ảnh khung ở nhiều góc độ.</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://yadav-stage-storage.sfo3.digitaloceanspaces.com/cms_pages_images/AdobeStock_263272792-53ce9abdc8f8d15a4181.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 3: Select Diamonds</h1>
                            <p className="mt-2 ml-4">Chọn loại kim cương gắn lên khung trang sức, tùy biến theo tiêu chuẩn 4C: Cut, Color, Clarity, Carat và hình dạng đá</p>
                        </div>
                        <div className="w-auto h-96 overflow-hidden shadow-lg hover:bg-slate-100">
                            <img
                                src="https://static8.depositphotos.com/1177973/842/i/450/depositphotos_8423176-stock-photo-pendant-in-form-of-rings.jpg"
                                alt="Ảnh"
                                className="w-full h-44"
                            />
                            <h1 className="text-xl font-semibold mt-4 ml-4">Step 4: View completed jewelry and checkout</h1>
                            <p className="mt-2 m-4"> Xem tác phẩm của bạn ở mọi góc độ và thanh toán để hoàn tất.</p>
                        </div>
                    </div>
                    <div className="flex justify-around w-96 items-center mt-5">
                        <button onClick={handleOpen} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Get Started</button>
                        <Dialog open={open} onClose={handleClose}>
                            <div className="flex justify-center bg-cyan-800 text-white">
                                <DialogTitle >Choose Your Jewelry Type</DialogTitle>
                            </div>
                            <DialogContent className="flex gap-5">
                                {loading ? <CSpinner color='primary' /> : modelTypes.map((modelType) => (
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