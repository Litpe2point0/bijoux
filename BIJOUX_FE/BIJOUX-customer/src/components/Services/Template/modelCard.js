import React from "react";
import { Skeleton, Avatar, AvatarGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';



export default function ChooseMounting({ model }) {

    const navigate = useNavigate();

    const handleModelClick = (modelId) => {
        localStorage.removeItem("finalProduct");
        navigate(`/mounting-detail/${modelId}`);
    };


    return (
        <div className="md:w-full flex flex-col xs:w-auto hover:border border-black mb-10" onClick={() => handleModelClick(model.id)}>
            <div className="w-full flex items-center justify-center">
                {model.imageUrl ? (
                    <img
                        className="md:w-[220px] md:h-[220px] sm:w-[150px] sm:h-[150px] object-cover"
                        alt={model.name}
                        src={model.imageUrl}
                    />
                ) : (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                )}

            </div>
            <div className="flex w-full justify-start ml-2 mr-2 items-center">
                {model.name ? (
                    <p className="font-semibold text-base sm:text-sm font-loraFont text-[#151542]">{model.name}</p>
                ) : (
                    <Skeleton width="100%" height="100%" />
                )}

            </div>
            <div className="flex justify-start ml-2 mr-2 items-center h-auto">
                {model.model_diamond_shape ? (
                    <AvatarGroup
                        max={4}
                        componentsProps={{
                            additionalAvatar: {
                                sx: { bgcolor: '#e6e7e8', color: '#8f8888', width: 30, height: 30, fontSize: "15px" }  // Thay đổi màu nền và màu chữ của "+x"
                            }
                        }}
                    >
                        {model.model_diamond_shape.map((shape, index) => (
                            <Avatar sx={{ bgcolor: "#e6e7e8", width: 30, height: 30 }}>
                                <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                                </svg>
                            </Avatar>
                        ))}
                    </AvatarGroup>
                ) : (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                )}
            </div>
        </div>
    );
}