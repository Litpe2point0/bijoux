import React from 'react';
import numeral from 'numeral';
import Avatar from '@mui/material/Avatar';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};

export default function DiamondDesignProcessCard({ diamond, status }) {
    // if (!diamond || !diamond.diamond_shape || !diamond.diamond_size || !diamond.diamond.diamond_color || !diamond.diamond.diamond_clarity || !diamond.diamond.diamond_cut || !diamond.diamond.diamond_origin) {
    //     console.log(">>>diamondfwefwfwef", diamond)
    //     return null; // Hoặc hiển thị một phần tử khác như 'N/A' nếu không có dữ liệu
    // }
    return (
        <div className='w-full flex-col flex items-center border border-black rounded-md mt-5'>
            <div className='flex w-full items-center'>
                <div className='w-[30px] flex flex-col items-center m-3'>
                    {/* <img src={d} alt='product' className='w-full h-full object-cover' /> */}
                    <svg fill='none' viewBox="0 0 18 18" height="30" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={diamond.diamond_shape.drawing_path} />
                    </svg>
                    <p className='font-gantariFont text-xs'>{diamond.diamond_shape.name}</p>
                </div>
                <div className='flex flex-1 flex-col m-2'>
                    <div className='ml-3 md:flex xs:hidden md:text-base xs:text-xs items-center font-gantariFont text-[#151542] font-semibold'>
                        <p>{diamond.diamond.size} (mm) Diamond • </p>
                        <p className='ml-1'>({diamond.diamond.diamond_color.name} - {diamond.diamond.diamond_clarity.name}) • {diamond.diamond.diamond_cut.name} Cut • {diamond.diamond.diamond_origin.name}</p>
                    </div>
                    <div className='ml-3 w-full grid md:grid-cols-2 xs:grid-cols-1'>
                        <div className='w-full flex items-center'>
                            <p className='font-semibold text-xs text-[#151542] mr-2'>Count: </p>
                            <p className='text-xs text-[#151542]'>{diamond.count} pieces</p>
                        </div>
                        <div className='w-full flex items-center'>
                            <p className='font-semibold text-xs text-[#151542] mr-2'>Price: </p>
                            <p className='text-xs font-semibold text-[#151542]'><CurrencyFormatter value={diamond.price} /></p>
                        </div>
                    </div>
                </div>

            </div>
            <div className='w-full ml-3 md:hidden xs:flex flex-col text-xs items-start font-gantariFont text-[#151542] font-semibold'>
                <p>• ({diamond.diamond.size} (mm) Diamond</p>
                <p>• ({diamond.diamond.diamond_color.name} - {diamond.diamond.diamond_clarity.name})</p>
                <p>• {diamond.diamond.diamond_cut.name} Cut</p>
                <p>• {diamond.diamond.diamond_origin.name}</p>
            </div>
        </div>
    )
}