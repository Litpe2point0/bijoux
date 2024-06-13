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
                <div className=" w-full flex flex-col items-center">
                    <p className="text-2xl text-[#151542] font-loraFont font-semibold mb-10">Product Informations:</p>
                    <div className="w-full ml-20 font-loraFont text-[#151542]">
                        <p className="text-xl font-semibold">Metal List:</p>
                        {finalCheckout.metalList.map((metal, index) => (
                            <div className="ml-5">
                                <div className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <p className="ml-2 font-bold">Metal {index + 1}:</p>
                                </div>
                                <ul class="max-w-md space-y-1 text-[#151542] list-disc list-inside ml-6">
                                    <li>
                                        Material: {metal.name}
                                    </li>
                                    <li>
                                        Price: {metal.price} (VND)
                                    </li>
                                </ul>

                            </div>
                        )
                        )}
                    </div>
                    <div className="w-full ml-20 justify-center mb-5 mt-5">
                        <div className="w-3/4 h-0.5 bg-[#151542]"></div>
                    </div>
                    <div className="w-full ml-20 font-loraFont text-[#151542]">
                        <p className="text-xl font-semibold">Diamond List:</p>
                        {finalCheckout.diamondList.map((diamond, index) => (
                            <div className="ml-5">
                                <div className="flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <p className="ml-2 font-bold">Diamond {index + 1}</p>
                                </div>
                                <ul class="max-w-md space-y-1 text-[#151542] list-disc list-inside ml-6">
                                    <li>
                                        Diamond ID: {diamond.id}
                                    </li>
                                    <li>
                                        Count: {diamond.count}
                                    </li>
                                    <li>
                                        Cut: {diamond.diamond_cut.name}
                                    </li>
                                    <li>
                                        Clarity: {diamond.diamond_clarity.name}
                                    </li>
                                    <li>
                                        Color: {diamond.diamond_color.name}
                                    </li>
                                    <li>
                                        Price: {diamond.price} (VND)
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="w-full ml-5 flex items-center mt-5">
                        <p className="text-2xl font-bold text-[#151542] mr-3">Production Price: </p>
                        <p className="text-xl font-semibold text-green-800">{finalCheckout.production_Price} (VND)</p>
                    </div>

                    <div className="w-full ml-5 flex items-center mb-5 mt-2">
                        <p className="text-4xl font-bold text-[#151542] mr-5">Total Price: </p>
                        <p className="text-2xl font-semibold text-green-800">{finalCheckout.total_Price} (VND)</p>
                    </div>

                    <div className="w-full flex flex-col justify-center mb-5">
                        <button className="bg-sky-600 hover:bg-white hover:text-sky-600 border-sky-600 hover:border-2 w-full text-white pl-5 pr-5 pt-2 pb-2 rounded-sm mb-2">Check Out</button>
                        <button className="text-sky-600 hover:text-white hover:bg-sky-600 border-sky-600 border-2 w-full bg-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Restart</button>
                    </div>

                </div>
            </div>
        </div>
    );
}