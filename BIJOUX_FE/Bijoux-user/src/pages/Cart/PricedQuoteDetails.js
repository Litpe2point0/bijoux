import React from "react";
import { useLocation } from "react-router-dom";
import { gold, silver } from "../../assets/images/index";
import PricedMetalCard from "../../components/Cart/Quotes/pricedMetalCard";
import PricedDiamondCard from "../../components/Cart/Quotes/pricedDiamondCard";
import { useNavigate } from "react-router-dom";
import numeral from 'numeral';
import Swal from 'sweetalert2';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export default function PricedQuoteDetails() {
    const id = useQuery().get("id");

    //Gọi API để lấy ra quote details theo id
    const quoteDetail = {
        id: id,
        product: {
            id: 233,
            imageUrl: "https://i.pinimg.com/564x/12/c8/a6/12c8a62897324571559d599af41f4cea.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: null,
            mounting_size: 8,
            product_diamond: [
                {
                    id: 1,
                    product_id: 233,
                    diamond: {
                        id: 1,
                        imageUrl: "https://ion.bluenile.com/sgmdirect/photoID/34405154/Diamond/20959769/nl/Diamond-round-1.03-Carat_3_first_.jpg",
                        size: 6,
                        diamond_color: { id: 1, name: "D" },
                        diamond_origin: { id: 1, name: "Natural-Created" },
                        diamond_clarity: { id: 1, name: "IF" },
                        diamond_cut: { id: 1, name: "Excellent" },
                        price: 20000000,
                        deactivated: false,
                        created: "20/03/2022"
                    },
                    diamond_shape: { id: 1, name: "Round", drawing_path: "M 6.1 1.001 c 2.95 0.083 5.287 3.735 5.233 8.148 S 8.852 17.08 5.9 16.999 S 0.614 13.265 0.668 8.85 S 3.148 0.92 6.1 1.001 Z M 9.559 14.73 H 7.542 l -1.406 2.128 c 1.32 -0.051 2.52 -0.848 3.423 -2.128 Z m -5.099 0 H 2.441 c 0.908 1.288 2.122 2.09 3.462 2.129 l -0.039 -0.002 L 4.46 14.73 Z M 6 13.78 l -1.413 0.896 l 1.414 2.139 l 1.412 -2.14 Z m 3.613 -2.292 l -1.432 0.909 l -0.59 2.19 h 2.022 Z m -7.225 0 v 3.099 h 2.02 l -0.588 -2.19 Z m 1.599 1.015 l 0.55 2.042 l 1.333 -0.847 Z m 4.026 0 L 6.13 13.698 l 1.334 0.847 Z M 0.801 9.192 c 0.032 2.037 0.58 3.887 1.454 5.258 v -3.058 Z m 10.398 0 l -1.453 2.2 v 3.058 c 0.878 -1.377 1.428 -3.24 1.454 -5.303 Z m -5.2 -4.824 L 3.926 5.664 L 3.038 8.97 l 0.896 3.334 L 6 13.617 l 2.067 -1.312 l 0.896 -3.333 l -0.887 -3.308 Z m -3.03 4.86 l -0.566 2.107 l 1.364 0.865 Z m 6.063 0.002 l -0.798 2.969 l 1.363 -0.864 Z M 2.298 6.735 L 0.813 8.963 l 1.485 2.249 l 0.601 -2.24 Z m 7.405 0 L 9.1 8.973 l 0.601 2.24 l 1.486 -2.249 Z m 0.042 -3.185 v 3.006 l 1.453 2.178 c -0.044 -2.007 -0.588 -3.83 -1.453 -5.184 Z m -7.49 0 C 1.377 4.927 0.827 6.79 0.8 8.854 l 0.002 -0.12 l 1.452 -2.178 Z m 1.504 2.217 l -1.355 0.847 l 0.564 2.1 Z m 4.482 0 l 0.79 2.947 l 0.566 -2.1 Z m -3.85 -2.355 H 2.388 V 6.46 l 1.424 -0.889 Z m 5.222 0 H 7.609 l 0.58 2.16 l 1.424 0.888 Z m -5.092 0.032 l -0.544 2.023 L 5.87 4.286 Z m 2.959 0 l -1.349 0.841 l 1.892 1.182 Z M 6 1.184 L 4.578 3.316 L 6 4.204 l 1.422 -0.888 Z m 0.137 -0.04 L 7.556 3.27 h 2.003 C 8.65 1.983 7.437 1.18 6.097 1.143 Z m -0.273 0 c -1.318 0.05 -2.52 0.848 -3.422 2.127 h 2.003 l 1.419 -2.128 Z" },
                    count: 1,
                    price: 20000000,
                    status: { id: 1, name: "Available" }
                }
            ],
            product_metal: [
                {
                    product_id: 233,
                    metal: { id: 1, name: "Silver", buy_price_per_gram: 1000000, sell_price_per_gram: 2000000, imageUrl: silver, specific_weight: 10.49, deactivated: false, created: "20/03/2022" },
                    volume: 20,
                    weight: 50,
                    status: { id: 1, name: "Available" },
                    price: 10000000
                },
                {
                    product_id: 233,
                    metal: { id: 3, name: "Gold", buy_price_per_gram: 1800000, sell_price_per_gram: 2500000, imageUrl: gold, specific_weight: 9.80, deactivated: false, created: "20/03/2022" },
                    volume: 10,
                    weight: 23,
                    status: { id: 1, name: "Available" },
                    price: 7500000
                }
            ]
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        quote_status: { id: 3, name: "Priced" },
        product_price: 37500000,
        production_price: 1000000,
        profit_rate: 0.4,
        sale_staff: {
            id: 1,
            username: "salestaff",
            image_Url: "https://i.pinimg.com/564x/b6/b7/44/b6b744d0daf9801934df73466939c520.jpg",
            dob: "10/03/2004",
            email: "salestaff@gmail.com",
            fullname: "Sale Staff",
            role: { id: 2, name: "Sale Staff" },
            phone: "0987654321",
            address: "Hà Nội",
            order_count: 12,
            deactivated: false,
            deactivated_date: null
        },
        design_staff: {
            id: 1,
            username: "designstaff",
            image_Url: "https://i.pinimg.com/564x/2e/56/d6/2e56d67bf952b7ea61d04b278c51bf72.jpg",
            dob: "10/03/2004",
            email: "designstaff@gmail.com",
            fullname: "Design Staff",
            role: { id: 3, name: "Design Staff" },
            phone: "0987654321",
            address: "Hà Nội",
            order_count: 12,
            deactivated: false,
            deactivated_date: null
        },
        production_staff: {
            id: 1,
            username: "productionstaff",
            image_Url: "https://i.pinimg.com/564x/5d/d9/a7/5dd9a7fc0a9b2395acfd197ec30b5f2c.jpg",
            dob: "10/03/2004",
            email: "productionstaff@gmail.com",
            fullname: "Production Staff",
            role: { id: 4, name: "Production Staff" },
            phone: "0987654321",
            address: "Hà Nội",
            order_count: 12,
            deactivated: false,
            deactivated_date: null
        },
        note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
        total_price: (37500000 + 1000000) * 1.4,
        created_date: "15/06/2024",
    }

    const updateProductionPrice = quoteDetail.total_price - quoteDetail.product_price;
    const deposit = quoteDetail.total_price / 2;
    const navigate = useNavigate();
    const handleApprove = () => {
        // Gọi API để update trạng thái của quote thành Completed
        Swal.fire({
            icon: "success",
            title: "Approve Succesfully!",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            navigate("/cart/priced-quote");
        });
    }

    const handleDecline = () => {
        // Gọi API để update trạng thái của quote thành Declined
        Swal.fire({
            title: "Are you sure you want to decline this quote?",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, decline it!"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/cart/priced-quote");
                Swal.fire({
                    title: "Declined!",
                    text: "The quote has been declined.",
                    icon: "success"
                });
            }
        });
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center items-center mb-5">
                <p className="font-rootFont text-4xl text-[#151542] font-semibold">Price Quote Details</p>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="w-full">
                    <div className="w-3/4 flex justify-center items-center">
                        <p className="font-rootFont text-[#151542] text-xl">IMAGE OF PRODUCT</p>
                    </div>
                    <div className="w-3/4 h-0.5 bg-[#151542] mb-5"></div>
                    <div className="w-3/4">
                        <img src={quoteDetail.product.imageUrl} alt="product" className="w-full rounded-lg" />
                    </div>
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="w-3/4 flex justify-center items-center">
                        <p className="font-rootFont text-[#151542] text-xl">INFORMATIONS OF PRODUCT</p>
                    </div>
                    <div className="w-3/4 h-0.5 bg-[#151542] mb-5"></div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Quote ID:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-rootFont text-[#151542] font-medium text-base ml-2">{quoteDetail.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Product ID:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-rootFont text-[#151542] font-medium text-base ml-2">{quoteDetail.product.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Quote Type:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-rootFont text-[#151542] font-medium text-base ml-2">Customization</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Created:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-rootFont text-[#151542] font-medium text-base ml-2">{quoteDetail.created_date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Mounting Type:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                {quoteDetail.product.mounting_type.name
                                    ? (
                                        <p className="font-rootFont text-[#151542] font-medium text-base ml-2">{quoteDetail.product.mounting_type.name}</p>
                                    )
                                    : (
                                        <p className="font-rootFont text-[#151542] font-medium text-base ml-2">null</p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-rootFont text-[#151542] font-bold text-base mr-2">Mounting Size:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                {quoteDetail.product.mounting_size
                                    ? (
                                        <p className="font-rootFont text-[#151542] font-medium text-base ml-2">{quoteDetail.product.mounting_size}.0 (mm)</p>
                                    )
                                    : (
                                        <p className="font-rootFont text-[#151542] font-medium text-base ml-2">null</p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-3/4 flex flex-col">
                <p className="font-rootFont text-2xl text-[#151542] font-bold">Metals:</p>
                {quoteDetail.product.product_metal.map((metal, index) => (
                    <PricedMetalCard metal={metal} />
                ))}
            </div>

            <div className="w-3/4 flex flex-col mt-10">
                <p className="font-rootFont text-2xl text-[#151542] font-bold">Diamonds:</p>
                {quoteDetail.product.product_diamond.map((diamond, index) => (
                    <PricedDiamondCard diamond={diamond} />
                ))}
            </div>

            <div className="w-11/12 h-0.5 bg-[#151542] mt-5 mb-5"></div>

            <div className="flex w-3/4">
                <div className="w-[483px] flex items-center">
                    <p className="font-rootFont text-2xl text-[#151542] font-bold mr-3">Materials Price:</p>
                    <div className="flex-1"></div>
                    <div className="pl-4 w-64 bg-zinc-200 rounded-md">
                        <p className="font-rootFont text-lg font-semibold text-green-900"><CurrencyFormatter value={quoteDetail.product_price} /></p>
                    </div>
                </div>
            </div>

            <div className="flex w-3/4">
                <div className="w-[483px] flex items-center">
                    <p className="font-rootFont text-2xl text-[#151542] font-bold mr-3">Production Price:</p>
                    <div className="flex-1"></div>
                    <div className="pl-4 w-64 bg-zinc-200 rounded-md">
                        <p className="font-rootFont text-lg font-semibold text-green-900"><CurrencyFormatter value={updateProductionPrice} /></p>
                    </div>
                </div>
            </div>

            <div className="flex w-3/4 mt-5">
                <div className="w-[483px] flex items-center">
                    <p className="font-rootFont text-3xl text-red-400 font-bold mr-3">Total Price:</p>
                    <div className="flex-1"></div>
                    <div className="pl-4 w-64 bg-zinc-200 rounded-md">
                        <p className="font-rootFont text-xl font-semibold text-green-900"><CurrencyFormatter value={quoteDetail.total_price} /></p>
                    </div>
                </div>
            </div>

            <div className="flex w-3/4 mt-2">
                <div className="w-[483px] flex items-center">
                    <p className="font-rootFont text-2xl text-indigo-500 font-bold mr-3">Deposit:</p>
                    <div className="flex-1"></div>
                    <div className="pl-4 w-64 bg-zinc-200 rounded-md">
                        <p className="font-rootFont text-lg font-semibold text-green-900"><CurrencyFormatter value={deposit} /></p>
                    </div>
                </div>
            </div>

            <div className="flex w-1/2 mt-9 justify-around">
                <button onClick={() => handleApprove()} className="font-rootFont text-white pt-2 pb-2 pr-5 pl-5 rounded-lg bg-sky-400 hover:bg-sky-900">Approve</button>

                <button onClick={() => handleDecline()} className="font-rootFont text-white pt-2 pb-2 pr-5 pl-5 rounded-lg bg-red-400 hover:bg-red-900">Decline</button>
            </div>
        </div>
    );
}