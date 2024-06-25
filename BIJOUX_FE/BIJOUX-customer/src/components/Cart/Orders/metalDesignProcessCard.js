import React from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function MetalDesignProcessCard({ metal, status }) {



    return (
        <div className='w-full flex items-center border border-black rounded-md mt-5'>
            <div className='w-[120px] h-[120px] m-3'>
                <img src={metal.metal.imageUrl} alt='product' className='w-full h-full object-cover' />
            </div>

            <div className='flex flex-1 flex-col mr-3'>
                <p className={
                    /Rose-Gold/i.test(metal.metal.name) ? 'text-rose-500 font-bold text-xl  font-gantariFont' :
                        /Gold/i.test(metal.metal.name) ? 'text-yellow-600 font-bold  text-xl font-gantariFont' :
                            /Silver/i.test(metal.metal.name) ? 'text-gray-500 font-bold  text-xl font-gantariFont' :
                                /Platinum/i.test(metal.metal.name) ? 'text-zinc-400 font-bold  text-xl  font-gantariFont' :
                                    ""
                }
                >{metal.metal.name}</p>
                <div className='flex mt-3'>
                    <p className={status === 1 ? 'font-gantariFont font-semibold text-green-500 mr-3' : 'font-gantariFont font-semibold text-gray-500 mr-3'}>Volume:</p>
                    <p className='font-gantariFont'>{metal.volume} mm<sup>3</sup></p>
                </div>

                <div className='flex mt-3'>
                    <p className={status === 1 ? 'font-gantariFont font-semibold text-green-500 mr-3' : 'font-gantariFont font-semibold text-gray-500 mr-3'}>Weight:</p>
                    <p className='font-gantariFont'>{metal.weight} gramm</p>
                </div>

                <div className='flex mt-3'>
                    <p className={status === 1 ? 'font-gantariFont font-semibold text-green-500 mr-3' : 'font-gantariFont font-semibold text-gray-500 mr-3'}>Price:</p>
                    <p className='font-gantariFont'><CurrencyFormatter value={metal.price} /></p>
                </div>
            </div>
        </div>
    )
}