import React, { useEffect } from "react";
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirm_delivery } from "../../../api/main/orders/Order_api";

const CurrencyFormatter = ({ value }) => {
    const formattedValue = '$' + numeral(value).format('0,0');
    return <span>{formattedValue}</span>;
};


export default function OrderCard({ order, onCancel, handleDataChange }) {
    const newProductionPrice = order.total_price - order.product_price;
    const navigate = useNavigate();
    const handleViewDetails = () => {
        //Navigate đến trang order detail
        navigate(`/cart/order-detail/${order.id}`);

    }
    useEffect(() => {
        console.log("--->", order);
    }, [order]);
    // const templateImage = "https://i.pinimg.com/564x/d0/65/b0/d065b0f511204401fe8af162372091a6.jpg";




    const handleConfirmReceived = async (orderID) => {
        Swal.fire({
            title: "Please make sure that you have received the order before clicked confirm",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, i have received the jewelry!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('order_id', orderID);
                const response = await confirm_delivery(formData, 'confirm delivery', true);
                if (response.success) {
                    Swal.fire({
                        title: "Success",
                        text: "Enjoy your jewelry! Thank you for choosing us!",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: response.mess,
                        icon: "error"
                    });
                }
                handleDataChange();
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-10/12 h-[200px] items-center bg-white  p-4 border-b border-black">
                <div className="md:border-2 md:w-[150px] md:h-[150px] my-5 sm:w-0 flex items-center justify-center overflow-hidden">
                    {/* {order.product.imageUrl ? (
                        <img src={order.product.imageUrl} alt="product" className="h-full" />
                    ) : (
                        <img src={templateImage} alt="product" className="h-full" />
                    )} */}
                    <img src={order.product.imageUrl} alt="product" className="w-full h-full object-cover object-center" />

                </div>

                <div className="flex flex-col h-full ml-5 w-1/3">
                    <div className="flex">
                        <p className="font-semibold font-gantariFont  md:text-2xl sm:text-lg">Order ID: </p>
                        <p className="ml-1 font-semibold font-gantariFont md:text-2xl sm:text-lg">#{order.id}</p>
                    </div>
                    <div className="flex mt-1">
                        <p className="font-gantariFont">Created Date: {order.created}</p>
                    </div>
                    <div className="flex-col mt-1 hidden md:flex">
                        <p className="font-gantariFont">Note:</p>
                        {/* <div className="w-10/12 h-[75px] bg-slate-200 overflow-y-auto">
                            <p className="font-gantariFont ml-2 mt-2 mr-2 mb-1">{order.note}</p>
                        </div> */}
                        <textarea className="w-10/12 h-[75px] bg-slate-200 overflow-y-auto font-gantariFont p-2 border-2 border-gray-200 rounded-md">
                            {order.note}
                        </textarea>
                    </div>
                </div>

                <div className="mx-1 h-full w-0.5 bg-black"> </div>

                <div className="flex-1 flex flex-col h-full ml-5">
                    {order.total_price ? (
                        <p className="font-gantariFont text-xl font-semibold"><CurrencyFormatter value={order.total_price} /></p>
                    ) : (
                        <p className="font-gantariFont text-xl font-semibold">Unpriced yet</p>
                    )}

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Order Status: </p>
                        <p className={
                            order.order_status.id === 1 ? "text-indigo-700 font-gantariFont font-semibold" :
                                order.order_status.id === 2 ? "text-sky-700 font-gantariFont font-semibold" :
                                    order.order_status.id === 3 ? "text-orange-700 font-gantariFont font-semibold" :
                                        order.order_status.id === 4 ? "text-indigo-700 font-gantariFont font-semibold" :
                                            order.order_status.id === 5 ? "text-cyan-700 font-gantariFont font-semibold" :
                                                order.order_status.id === 6 ? "text-green-700 font-gantariFont font-semibold" :
                                                    order.order_status.id === 7 ? "text-red-700 font-gantariFont font-semibold" :
                                                        ""
                        }>{order.order_status.name}
                        </p>

                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Materials Price: </p>
                        {order.product_price ? (
                            <p className="font-gantariFont"><CurrencyFormatter value={order.product_price} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Production Price: </p>
                        {order.production_price ? (
                            <p className="font-gantariFont"><CurrencyFormatter value={newProductionPrice} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="w-full h-[65px] flex items-center justify-around">
                        <button onClick={() => handleViewDetails(order.id)} className="md:w-[130px] sm:w-[100px] h-[35px] bg-[#0024A4] text-white hover:bg-[#071E6F]">DETAILS</button>
                        {
                            order.order_status.id === 5 ? (
                                <button
                                    onClick={() => handleConfirmReceived(order.id)}
                                    className="md:w-[130px] sm:w-[100px] h-[35px] bg-sky-500 text-white text-xs hover:bg-[#071E6F]"
                                >
                                    CONFIRM RECEIVED
                                </button>
                            ) : order.order_status.id === 6 ? (
                                <button
                                    disabled
                                    className="md:w-[130px] sm:w-[100px] h-[35px] bg-gray-500 text-white text-xs"
                                >
                                    CONFIRM RECEIVED
                                </button>
                            ) : order.order_status.id === 7 ? (
                                <button
                                    disabled
                                    className="md:w-[130px] sm:w-[100px] h-[35px] bg-gray-500 text-white"
                                >
                                    CANCEL
                                </button>
                            ) :
                                (
                                    <button
                                        onClick={onCancel}
                                        className="md:w-[130px] sm:w-[100px] h-[35px] bg-[#CD0B2A] text-white hover:bg-[#8B1023]"
                                    >
                                        CANCEL
                                    </button>
                                )
                        }
                    </div>

                </div>

            </div>
        </div >

    );
}