import React from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};

export default function MetalDesignProcessCard({ metal, status }) {



    return (
        <div className='w-full flex justify-center items-center border border-black rounded-md mt-5'>
            <div className='w-[40px] h-full flex md:items-center justify-center xs:items-start'>
                <img src={metal.metal.imageUrl} alt='product' className='w-[30px] h-[30px] object-cover sm:mt-1 md:mt-0' />
            </div>
            <div className='flex-1 grid md:grid-cols-4 xs:grid-cols-1 m-3'>
                <div className='w-full flex md:flex-col xs:flex-row md:items-center xs:items-center xs:justify-start md:justify-center'>
                    <p className={status === 1 ? 'font-gantariFont text-xs font-semibold text-green-500 md:mr-0 xs:mr-3' : 'font-gantariFont text-xs font-semibold text-gray-500  md:mr-0 xs:mr-3 '}>Type:</p>
                    <p className={
                        /Rose-Gold/i.test(metal.metal.name) ? 'text-rose-500 font-bold text-xs  font-gantariFont' :
                            /Gold/i.test(metal.metal.name) ? 'text-yellow-600 font-bold text-xs font-gantariFont' :
                                /Silver/i.test(metal.metal.name) ? 'text-gray-500 font-bold text-xs font-gantariFont' :
                                    /Platinum/i.test(metal.metal.name) ? 'text-zinc-400 font-bold text-xs font-gantariFont' :
                                        ""
                    }
                    >{metal.metal.name}</p>
                </div>
                <div className='flex md:flex-col xs:flex-row md:items-center xs:items-center xs:justify-start md:justify-center'>
                    <p className={status === 1 ? 'font-gantariFont font-semibold text-green-500 text-xs  md:mr-0 xs:mr-3' : 'font-gantariFont font-semibold text-gray-500 text-xs  md:mr-0 xs:mr-3'}>Volume:</p>
                    <p className='font-gantariFont text-xs'>{metal.volume} mm<sup>3</sup></p>
                </div>

                <div className='flex md:flex-col xs:flex-row md:items-center xs:items-center xs:justify-start md:justify-center'>
                    <p className={status === 1 ? 'font-gantariFont font-semibold text-green-500 text-xs  md:mr-0 xs:mr-3' : 'font-gantariFont font-semibold text-gray-500 text-xs  md:mr-0 xs:mr-3'}>Weight:</p>
                    <p className='font-gantariFont text-xs'>{metal.weight} gramm</p>
                </div>
                <div className='w-full flex md:flex-col xs:flex-row md:items-center xs:items-center xs:justify-start md:justify-center'>
                    <p className={status === 1 ? 'font-gantariFont text-xs font-semibold text-green-500  md:mr-0 xs:mr-3' : 'font-gantariFont text-xs font-semibold text-gray-500  md:mr-0 xs:mr-3'}>Price:</p>
                    <p className='font-gantariFont text-xs font-semibold'><CurrencyFormatter value={metal.price} /></p>
                </div>
            </div>

        </div>
    )
}