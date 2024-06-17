import React, { useState } from "react";
import numeral from 'numeral';
import { useNavigate } from "react-router-dom";
import { Collapse } from '@mui/material';
import { Envelope, Phone } from 'phosphor-react';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function OrderCard({ order }) {
    const newProductionPrice = order.total_price - order.product_price;
    const deposit_left = order.total_price / 2 - order.deposit_has_paid;
    const [checkOpen, setCheckOpen] = useState(false);
    const handleOpenClose = () => {
        setCheckOpen(!checkOpen);
    }
    const templateImage = "https://i.pinimg.com/564x/03/1a/45/031a45adc4efa1deedc50732c477bceb.jpg";

    const navigate = useNavigate();
    const handleViewDetails = (id) => {
        navigate(`/cart/priced-order-details?id=${id}`);
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-10/12 h-[100px] items-center bg-white  p-4 rounded-lg shadow-md mb-5">
                <div className="h-full">
                    {order.product.imageUrl ? (
                        <img onClick={handleOpenClose} src={order.product.imageUrl} alt="product" className="h-full rounded-lg" />
                    ) : (
                        <img onClick={handleOpenClose} src={templateImage} alt="product" className="h-full rounded-lg" />
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Order ID</p>
                    <p>{order.id}</p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Order Status</p>
                    <p className={
                        order.order_status.id === 1 ? "text-indigo-500 font-semibold" :
                            order.order_status.id === 2 ? "text-sky-500 font-semibold" :
                                order.order_status.id === 3 ? "text-orange-500 font-semibold" :
                                    order.order_status.id === 4 ? "text-cyan-500 font-semibold" :
                                        order.order_status.id === 5 ? "text-green-500 font-semibold" :
                                            order.order_status.id === 6 ? "text-green-800 font-semibold" :
                                                order.order_status.id === 7 ? "text-red-500 font-semibold" :
                                                    "font-semibold"
                    }>{order.order_status.name}</p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Deposit Has Paid</p>
                    <p className="truncate hover:text-clip"><CurrencyFormatter value={order.deposit_has_paid} /></p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Total Price</p>
                    <p className="truncate hover:text-clip"><CurrencyFormatter value={order.total_price} /></p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-1 flex-col items-center">
                    <button onClick={() => handleViewDetails(order.id)} className="bg-sky-500 text-white font-bold rounded-lg p-2 hover:bg-sky-900">View Details</button>
                </div>
            </div>

            <Collapse className="w-full flex justify-center items-center" in={checkOpen} timeout="auto" unmountOnExit>
                <div className="w-full flex justify-center">
                    <div className="w-10/12 p-2 grid grid-cols-4 bg-slate-200">
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">Required For Deposit:</p>
                            <CurrencyFormatter value={deposit_left} />
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">Material Prices:</p>
                            <CurrencyFormatter value={order.product_price} />
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">Production Prices:</p>
                            <CurrencyFormatter value={newProductionPrice} />
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold">Created Date:</p>
                            <p>{order.created_date}</p>
                        </div>
                    </div>
                </div>
            </Collapse >

        </div>

    );
}