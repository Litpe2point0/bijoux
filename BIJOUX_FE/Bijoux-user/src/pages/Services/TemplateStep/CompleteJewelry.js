import React from "react";
import { demoFinalMain, demoFinalRelated1, demoFinalRelated2, gold } from "../../../assets/images/index";
import { useState } from 'react'
import { Carousel } from 'primereact/carousel';
import numeral from 'numeral';
import { RiVipDiamondLine } from "react-icons/ri";
import { GiDiamondRing } from "react-icons/gi";
import { FiTruck } from "react-icons/fi";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { CgSandClock } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};



export default function CompleteRing() {

    const navigate = useNavigate();
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

    const handleChangeMetal = () => {
        navigate(`/mounting-detail/${finalProduct.model.id}`);
    }

    const handleChangeDiamond = () => {
        window.location.href = '/template?step=2&mountingType=' + finalProduct.model.mounting_type.name + '&model_id=' + finalProduct.model.id;
    }

    const handleRestart = () => {
        const mounting_type = finalProduct.model.mounting_type.name;
        window.location.href = `/template?step=1&mountingType=${mounting_type}`;
        localStorage.removeItem('finalProduct');
    }

    const calculateSumOfMetalPrice = (metalList) => {
        let sum = 0;
        metalList.forEach(metal => {
            sum += metal.price;
        });
        return sum;
    }

    const totalMetalPrice = calculateSumOfMetalPrice(finalCheckout.metalList);

    return (
        <div className="flex flex-col items-center text-[#151542] mb-20">
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
                <div className=" w-full flex flex-col">
                    <div className="w-full flex flex-col">
                        <p className="text-3xl text-[#151542] font-loraFont font-light">
                            Two Stone Engagement Ring With East-West Pear Shaped Diamond In 14k (1/2 Ct. Tw.) 1.48 Carat H-VS2 Princess Cut Diamond
                        </p>
                        <div className="w-11/12 h-0.5 bg-gray-200 my-5"></div>
                    </div>

                    <div className="w-full flex flex-col mb-3">
                        <p className="font-gantariFont text-[#151542] font-semibold ">Complete Jewelry:</p>
                    </div>

                    <div className="w-full flex mb-3">
                        <div className="w-[15px] flex justify-center">
                            <RiVipDiamondLine size={13} className="mt-1" />
                        </div>
                        <div className="w-[306px] flex flex-col ml-2 mt-0">
                            <div className="w-[306px] font-gantariFont">
                                <p>
                                    6 (mm) D-IF1 Heart Cut Diamond
                                    Ideal Cut • D Color • IF Clarity • Origin
                                </p>
                            </div>
                            <p> ID: #21360695</p>
                            <p className="font-gantariFont font-semibold text-sm"><CurrencyFormatter value={finalCheckout.diamondList[0].price} /></p>
                        </div>
                        <div className="flex-1 flex items-center justify-start">
                            {finalProduct.model.model_diamond[0].Is_editable === true && <button onClick={() => handleChangeDiamond()} className="text-xs ml-10 font-semibold underline hover:text-sky-500">Change Diamond</button>}
                        </div>
                    </div>

                    <div className="w-full flex mb-3">
                        <div className="w-[15px] flex justify-center">
                            <RiVipDiamondLine size={13} className="mt-1" />
                        </div>
                        <div className="w-[306px] flex flex-col ml-2 mt-0">
                            <div className="w-[306px] font-gantariFont">
                                <p>
                                    3.6 (mm) D-IF1 Round Cut Diamond
                                    Ideal Cut • D Color • IF Clarity • Origin
                                </p>
                            </div>
                            <p>ID: #21360679</p>
                            <p className="font-gantariFont font-semibold text-sm"><CurrencyFormatter value={finalCheckout.diamondList[1].price} /></p>
                        </div>
                        <div className="flex-1 flex items-center justify-start">
                            {finalProduct.model.model_diamond[1].Is_editable === true && <button className="text-xs ml-10 font-semibold underline hover:text-sky-500">Change Diamond</button>}
                        </div>
                    </div>

                    <div className="w-full flex mb-5">
                        <div className="w-[15px] flex justify-center">
                            <GiDiamondRing size={13} className="mt-1" />
                        </div>
                        <div className="w-[306px] flex flex-col ml-2 mt-0">
                            <div className="w-[306px] font-gantariFont">
                                <p>
                                    Two Stone Engagement Ring with East-West Pear Shaped Diamond in 24k Gold
                                </p>
                            </div>
                            <p>ID: #503200w14</p>
                            <p className="font-gantariFont font-semibold text-sm"><CurrencyFormatter value={totalMetalPrice} /></p>
                        </div>
                        <div className="flex-1 flex items-center justify-start">
                            <button onClick={() => handleChangeMetal()} className="text-xs ml-10 font-semibold underline hover:text-sky-500">Change Settings</button>
                        </div>
                    </div>

                    <div className="w-full flex items-start text-xl font-semibold font-gantariFont mb-5">
                        <CurrencyFormatter value={finalCheckout.total_Price} />
                    </div>

                    <div className="w-full h-[48px] flex items-center justify-center text-xl text-white bg-[#151542] hover:cursor-pointer hover:bg-[#29296b] mb-6">
                        <p>CONFIRM ORDER</p>
                    </div>

                    <div onClick={() => handleRestart()} className="w-full h-[48px] flex items-center justify-center text-xl text-[#151542] bg-white border-2 border-[#151542] hover:cursor-pointer hover:text-[#29296b] mb-6">
                        <p>RESTART SELECT</p>
                    </div>

                    <div>
                        <p className="font-gantariFont text-[#151542] font-semibold">Our Policies:</p>
                    </div>

                    <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center mb-5">
                        <div className="w-[100px] h-[100px] flex items-center justify-center">
                            <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                <FiTruck size={40} />
                            </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                            <p className="font-gantariFont text-[#151542] font-semibold">Free Shipping</p>
                            <div className="w-[550px]">
                                <p className="font-gantariFont text-sm">Trang sức của bạn sẽ được vận chuyển miễn phí toàn quốc với thời gian nhất. Chúng tôi cam kết đảm bảo tính bảo mật và nguyên vẹn của sản phẩm trong quá trình vận chuyển.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center mb-5">
                        <div className="w-[100px] h-[100px] flex items-center justify-center">
                            <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                <AiOutlineDollarCircle size={40} />
                            </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                            <p className="font-gantariFont text-[#151542] font-semibold">Material's Price Changing</p>
                            <div className="w-[550px]">
                                <p className="font-gantariFont text-sm">Giá của trang sức có thể sẽ thay đổi do sự thay đổi giá của các nguyên vật liệu trước khi bạn đặt cọc. Vì vậy hãy đặt cọc sớm nhất để có mức giá tốt nhất.</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[100px] bg-gray-100 rounded-lg flex items-center">
                        <div className="w-[100px] h-[100px] flex items-center justify-center">
                            <div className="bg-gray-200 h-3/4 w-3/4 flex items-center justify-center rounded-xl ">
                                <CgSandClock size={40} />
                            </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                            <p className="font-gantariFont text-[#151542] font-semibold">Lifetime warranty</p>
                            <div className="w-[550px]">
                                <p className="font-gantariFont text-sm">Trang sức của bạn được bảo hành trọn đời từ Bijoux, mọi vấn đề liên quan đến vật liệu làm nên trang sức sẽ được chúng tôi khắc phục cho bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}