import React from "react";


export default function JewelryBanner() {
    return (
        <div className="w-full flex flex-col font-loraFont text-[#151542] items-center my-8">
            <p className="font-loraFont text-[#151542] text-3xl mb-5">Jewelry For Every Occassions</p>
            <div className="w-full grid grid-cols-6 p-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/564x/3e/c4/31/3ec4313ff62cda151c51fdf5298c9d34.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Engagement Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/564x/4b/2a/87/4b2a87c06629585cd07e1937121f7e84.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Wedding Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/564x/dc/5c/e4/dc5ce431d5daae117f97eda8c8173f78.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Valentine Rings</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/564x/49/d8/0e/49d80ed998feda7cae4c1d65f79d5840.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Pendant</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/564x/be/5f/44/be5f4489bbc0f49dbd0c08db4475484c.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Band</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-[210px] h-[210px] bg-gray-200 rounded-full">
                        <img src="https://i.pinimg.com/736x/6a/35/fd/6a35fd4a6cb4c758d77284573454687e.jpg" alt="" className="w-[210px] h-[210px] rounded-full object-cover" />
                    </div>
                    <p>Custom Jewelry</p>
                </div>
            </div>
        </div>
    );
}