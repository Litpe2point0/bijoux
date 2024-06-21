import React from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function DiamondDesignProcessCard({ diamond, status }) {
    return (
        <div className='w-full flex-col flex items-center border border-black rounded-md mt-5'>
            <div className='flex w-full'>
                <div className='w-[120px] h-[120px] m-3'>
                    <img src={diamond.diamond.imageUrl} alt='product' className='w-full h-full object-cover' />
                </div>
                <div className='flex-1 grid grid-cols-3 gap-5'>
                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Shape</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.diamond_shape.name}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Origin</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center ' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.diamond.diamond_origin.name}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Count</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.count}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Color</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.diamond.diamond_color.name}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Clarity</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.diamond.diamond_clarity.name}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center'>
                        <p className='font-gantari text-[#151542] font-semibold'>Cut</p>
                        <div className={
                            status === 1 ? 'bg-sky-300 w-[85px] rounded-md h-[35px] flex items-center justify-center' : 'bg-gray-300 w-[85px] rounded-md h-[35px] flex items-center justify-center'
                        }>
                            <p className='font-gantariFont font-semibold'>{diamond.diamond.diamond_cut.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full my-3 flex justify-center'>
                <p className={status === 1 ?
                    'text-xl font-semibold font-gantariFont text-green-500' :
                    'text-xl font-semibold font-gantariFont text-gray-500'
                }>Price: </p>
                <p className='text-xl font-semibold font-gantariFont text-[#151542] ml-2'><CurrencyFormatter value={diamond.price} /></p>
            </div>
        </div>
    )
}