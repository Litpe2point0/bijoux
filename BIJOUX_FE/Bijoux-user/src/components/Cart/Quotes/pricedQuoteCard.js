import React, { useState } from "react";
import numeral from 'numeral';
import { useNavigate } from "react-router-dom";
import { Collapse } from '@mui/material';
import { Envelope, Phone } from 'phosphor-react';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function PricedQuoteCard({ quote, onDeclined }) {
    const newProductionPrice = quote.total_price - quote.product_price;
    const [checkOpen, setCheckOpen] = useState(false);
    const handleOpenClose = () => {
        setCheckOpen(!checkOpen);
    }
    const templateImage = "https://i.pinimg.com/564x/03/1a/45/031a45adc4efa1deedc50732c477bceb.jpg";

    const navigate = useNavigate();
    const handleViewDetails = (id) => {
        navigate(`/cart/priced-quote-details?id=${id}`);
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-10/12 h-[100px] items-center bg-white  p-4 rounded-lg shadow-md mb-5">
                <div className="h-full">
                    {quote.product.imageUrl ? (
                        <img onClick={handleOpenClose} src={quote.product.imageUrl} alt="product" className="h-full rounded-lg" />
                    ) : (
                        <img onClick={handleOpenClose} src={templateImage} alt="product" className="h-full rounded-lg" />
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Product ID</p>
                    <p>{quote.product.id}</p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Product Price</p>
                    <p className="truncate hover:text-clip"><CurrencyFormatter value={quote.product_price} /></p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Production Price</p>
                    <p className="truncate hover:text-clip"><CurrencyFormatter value={newProductionPrice} /></p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Total Price</p>
                    <p className="truncate hover:text-clip"><CurrencyFormatter value={quote.total_price} /></p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-1 flex-col items-center">
                    <button onClick={() => handleViewDetails(quote.id)} className="bg-sky-500 text-white font-bold rounded-lg p-2 hover:bg-sky-900">View Details</button>
                </div>
            </div>
        </div>

    );
}