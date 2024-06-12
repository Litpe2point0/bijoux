import React from "react";
import { demoFinalMain, demoFinalRelated1, demoFinalRelated2, gold } from "../../../assets/images/index";
import { useState } from 'react'
import { Carousel } from 'primereact/carousel';




export default function CompleteRing() {

    const finalProduct = JSON.parse(localStorage.getItem('finalProduct'));
    const fingerSize = finalProduct.mounting_size;

    const finalCheckout = {
        main_image: demoFinalMain,
        related_image: [
            demoFinalRelated1,
            demoFinalRelated2,
        ],
        metalList: [
            { id: 1, name: "Gold", image_Url: gold, price: 2000000 },
            { id: 2, name: "Gold", image_Url: gold, price: 1000000 },
        ],
        diamondList: [
            {
                id: 1,
                image_Url: "https://ion.bluenile.com/sgmdirect/photoID/32025442/Diamond/19751585/nl/Diamond-heart-1.01-Carat_3_first_.jpg",
                diamond_origin: { id: 1, name: "Natural-created" },
                diamond_clarity: { id: 1, name: "IF" },
                diamond_cut: { id: 1, name: "Excellent" },
                diamond_color: { id: 1, name: "D" },
                diamond_shape: { id: 4, name: "Heart" },
                diamond_size: 6,
                price: 20000000,
                count: 1
            },
            {
                id: 2,
                image_Url: "https://ion.bluenile.com/sgmdirect/photoID/34296365/Diamond/21001361/nl/Diamond-round-1-Carat_3_first_.jpg",
                diamond_origin: { id: 1, name: "Natural-created" },
                diamond_clarity: { id: 1, name: "IF" },
                diamond_cut: { id: 1, name: "Excellent" },
                diamond_color: { id: 1, name: "D" },
                diamond_shape: { id: 1, name: "Round" },
                diamond_size: 3.6,
                price: 28000000,
                count: 6
            }
        ],
        production_Price: 2000000,
        total_Price: 500000000
    }

    const [showImage, setShowImage] = useState(finalCheckout.main_image);
    const imageList = [finalCheckout.main_image, ...finalCheckout.related_image];

    const productTemplate = (product) => {
        return (
            <div className="hover:border">
                <div onClick={() => handleChangeImage(product)} className="mb-3 flex justify-center">
                    <img src={`${product}`} className="w-2/3" />
                </div>

            </div>
        );
    };

    const handleChangeImage = (image) => {
        setShowImage(image);
    }


    return (
        <div className="flex flex-col items-center">
            <p className="text-[#151542] text-4xl font-loraFont font-semibold">Your Final Jewelry Has Been Complete !</p>
            <div className="w-3/4 h-0.5 bg-slate-500 mb-20 mt-5"></div>
            <div className="w-10/12 grid grid-cols-2 gap-5">
                <div className="w-3/4">
                    <div className="w-full flex justify-center mb-10">
                        <img src={showImage} alt="diamond" className="w-3/4 border-2 drop-shadow-xl" />
                    </div>
                    <div className="w-full">
                        <Carousel value={imageList} numVisible={2} autoplayInterval={3000} numScroll={1} responsiveOptions={[
                            {
                                breakpoint: '1400px',
                                numVisible: 2,
                                numScroll: 1
                            },
                            {
                                breakpoint: '1199px',
                                numVisible: 3,
                                numScroll: 1
                            },
                            {
                                breakpoint: '767px',
                                numVisible: 2,
                                numScroll: 1
                            },
                            {
                                breakpoint: '575px',
                                numVisible: 1,
                                numScroll: 1
                            }
                        ]} itemTemplate={productTemplate} />

                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl text-[#151542] font-loraFont font-semibold">Product Informations:</p>
                    {finalCheckout.metalList.map((metal) => (
                        <div className="w-full h-20 bg-slate-100 rounded-md flex relative items-center mb-5">
                            <img src={metal.image_Url} alt="anh" className="w-16 ml-5 mr-20"></img>
                            <p className="font-bold text-yellow-600 text-xl mr-20 font-loraFont">{metal.name}</p>
                            <div className="flex items-center">
                                <p className="font-bold text-red-500 text-xl mr-5 font-loraFont">Price:</p>
                                <p className="font-semibold text-green-800 text-xl font-loraFont">{metal.price} (VND)</p>
                            </div>
                        </div>
                    )
                    )}
                    {finalCheckout.diamondList.map((diamond) => (
                        <div className="w-full bg-slate-100 rounded-md mb-5">
                            <div className="w-full h-24 bg-slate-100 rounded-md flex relative items-center">
                                <img src={diamond.image_Url} alt="anh" className="w-16 ml-5 mr-5"></img>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542] font-loraFont">Origin:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.diamond_origin.name}</p>
                                </div>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542]font-loraFont">Clarity:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.diamond_clarity.name}</p>
                                </div>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542] font-loraFont">Color:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.diamond_color.name}</p>
                                </div>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542]font-loraFont">Cut:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.diamond_cut.name}</p>
                                </div>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542]font-loraFont">Size:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.diamond_size} (mm)</p>
                                </div>
                                <div className="flex flex-col items-center mr-5">
                                    <p className="font-bold text-[#151542] font-loraFont">Count:</p>
                                    <p className="font-semibold text-[#151542] font-loraFont">{diamond.count}</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-center">
                                <div className="w-10/12 h-0.5 bg-gray-500"></div>
                            </div>
                            <div className="w-full flex flex-col items-center">
                                <p className="font-bold text-red-500 text-xl mr-5 font-loraFont">Price:</p>
                                <p className="font-semibold text-green-800 text-xl font-loraFont">{diamond.price} (VND)</p>
                            </div>


                        </div>
                    ))}

                    <div className="w-full ml-5 flex items-center mb-5 mt-5">
                        <p className="text-2xl font-bold text-red-800 mr-5">Production Price: </p>
                        <p className="text-xl font-bold text-green-800">{finalCheckout.production_Price}</p>
                    </div>

                    <div className="w-full ml-5 flex items-center mb-5 mt-5">
                        <p className="text-4xl font-bold text-red-500 mr-5">Total Price: </p>
                        <p className="text-2xl font-bold text-green-500">{finalCheckout.total_Price}</p>
                    </div>

                    <div className="w-full flex justify-center mb-5">
                        <button className="bg-[#151542] hover:bg-cyan-900 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Payment</button>
                    </div>

                </div>
            </div>
        </div>
    );
}