import React from "react";
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function PricedMetalCard({ metal }) {
    return (
        <div className="h-[100px] grid grid-cols-4 shadow-lg rounded-xl mb-5 border">
            <div className="flex flex-col items-center">
                <img src={metal.metal.imageUrl} alt="metal" className="h-[75px] rounded-lg" />
                <p
                    className={
                        metal.metal.name === 'Gold' ? 'text-yellow-600 font-bold' :
                            metal.metal.name === 'Silver' ? 'text-gray-500 font-bold' :
                                metal.metal.name === 'Platinum' ? 'text-zinc-400 font-bold' :
                                    metal.metal.name === 'Palladium' ? 'text-rose-500 font-bold' :
                                        ""
                    }
                >
                    {metal.metal.name}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-lg text-yellow-600">Volume:</p>
                <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                    <p className="font-semibold">{metal.volume} mm<sup>3</sup></p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-lg text-green-800">Weight:</p>
                <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                    <p className="font-semibold">{metal.weight} gramm</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-lg text-red-400">Price:</p>
                <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                    <p className="font-semibold"> <CurrencyFormatter value={metal.price} /></p>
                </div>
            </div>
        </div>
    )
}