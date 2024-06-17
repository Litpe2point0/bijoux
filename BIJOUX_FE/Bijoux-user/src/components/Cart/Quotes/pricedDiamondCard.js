import React from "react";
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function PricedDiamondCard({ diamond }) {
    return (
        <div className="h-[167px] grid grid-cols-3 shadow-lg rounded-xl mb-5 border">
            <div className="h-[167px] flex flex-col items-center justify-center">
                <img src={diamond.diamond.imageUrl} alt="metal" className="h-[136px] rounded-lg" />
            </div>

            <div className="grid grid-cols-3">
                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Shape</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        <p className="font-semibold"> {diamond.diamond_shape.name}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Origin</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        {diamond.diamond.diamond_origin.id === 1 ?
                            <p className="font-semibold">Natural</p> :
                            <p className="font-semibold">Lab</p>
                        }
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Count</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        <p className="font-semibold"> {diamond.count}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Color</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        <p className="font-semibold">{diamond.diamond.diamond_color.name}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Clarity</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        <p className="font-semibold"> {diamond.diamond.diamond_clarity.name}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-[#151542]">Size</p>
                    <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                        <p className="font-semibold">{diamond.diamond.size}.0 (mm)</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-lg text-red-400">Price</p>
                <div className="w-3/4 flex justify-center items-center rounded-md bg-sky-200">
                    <p className="font-semibold"> <CurrencyFormatter value={diamond.price} /></p>
                </div>
            </div>
        </div>
    )
}