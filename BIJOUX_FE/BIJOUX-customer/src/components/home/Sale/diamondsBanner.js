import React, { useEffect, useState } from "react";
import { get_shape_list } from "../../../api/main/items/Diamond_api";


export default function DiamondBanner() {
    const roundShape = "m 9.017 0 l 0.132 0.001 m 0 0 A 8 8 0 1 1 8.85 16 A 8 8 0 0 1 9.15 0 Z M 6.707 13.565 l -3.141 0.113 a 7.83 7.83 0 0 0 5.287 2.18 h 0.007 Z m 4.607 -0.01 l -2.142 2.303 a 7.83 7.83 0 0 0 5.284 -2.202 Z m -2.316 -0.97 l -2.169 0.904 l 2.186 2.33 l 2.172 -2.333 Z m -5.414 -2.23 l -0.101 3.184 l 3.17 -0.113 l -0.91 -2.182 Z m 10.84 -0.031 l -2.175 0.907 l -0.9 2.185 l 3.19 0.102 Z M 1.144 8.172 a 7.83 7.83 0 0 0 2.201 5.285 l 0.1 -3.143 Z m 15.714 -0.03 l -2.292 2.15 l 0.113 3.142 a 7.83 7.83 0 0 0 2.18 -5.287 Z M 5.928 11.32 l 0.85 2.037 l 2.036 -0.849 Z m 6.137 -0.013 l -2.882 1.2 l 2.041 0.841 Z M 8.98 3.538 L 5.84 4.847 L 4.543 7.994 l 1.309 3.141 l 3.147 1.297 l 3.14 -1.31 l 1.297 -3.147 l -1.309 -3.141 Z m -4.513 4.64 l -0.84 2.042 l 2.04 0.84 Z m 9.046 -0.018 l -1.188 2.886 l 2.037 -0.849 Z M 3.494 5.846 L 1.182 8.016 l 2.312 2.153 l 0.896 -2.175 Z m 10.988 -0.037 l -0.893 2.167 l 0.91 2.184 l 2.319 -2.176 Z M 3.322 2.567 a 7.83 7.83 0 0 0 -2.18 5.287 v 0.006 l 2.292 -2.151 Z m 11.333 -0.022 l -0.1 3.142 l 2.301 2.142 a 7.83 7.83 0 0 0 -2.201 -5.284 Z m -9.001 2.38 l -2.037 0.848 l 0.849 2.037 Z m 6.658 -0.015 l 1.2 2.881 l 0.84 -2.04 Z m -8.85 -2.427 l 0.112 3.155 l 2.157 -0.899 l 0.887 -2.156 Z m 11.055 -0.022 l -3.178 0.113 l 0.896 2.152 l 2.182 0.899 Z m -7.762 0.16 l -0.84 2.041 l 2.881 -1.2 Z m 4.447 -0.008 l -2.036 0.849 l 2.886 1.188 Z M 8.984 0.182 L 6.828 2.499 l 2.153 0.887 l 2.164 -0.902 Z m -0.156 -0.039 a 7.83 7.83 0 0 0 -5.284 2.202 l 3.142 0.1 Z m 0.319 0 H 9.14 l 2.151 2.292 l 3.142 -0.113 a 7.83 7.83 0 0 0 -5.287 -2.18 Z";
    const [diamondShapes, setDiamondShapes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const setAttributes = async () => {
            const res = await get_shape_list();
            if (res.success) {
                setDiamondShapes(res.data);
            }
            setLoading(false);
        }
        setAttributes();
    }, [])
    return (
        <div className="w-full flex flex-col bg-[#FFF8EF] font-loraFont text-[#151542] items-center mt-20 p-8">
            <p className="font-loraFont text-[#151542] text-3xl mb-5">Diamonds</p>
            <div className="w-full flex justify-around">
                {/* GỌI API ở đây với mỗi một diamond shape thì gọi ra path và tên như sau: */}
                {!loading && diamondShapes.map((shape, index) => {
                    console.log(shape)
                    return(
                        <div className="flex flex-col items-center">
                        <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                            <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                        </svg>
                        <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">{shape.name}</p>
                    </div>
                    )
                    
                }
                )
                }
                {/* <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div>
                <div className="flex flex-col items-center">
                    <svg fill='none' viewBox="0 0 18 18" height="50" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={roundShape} />
                    </svg>
                    <p className="text-[#151542] hover:font-semibold font-loraFont text-lg font-medium">Round</p>
                </div> */}
            </div>
        </div>
    );
}