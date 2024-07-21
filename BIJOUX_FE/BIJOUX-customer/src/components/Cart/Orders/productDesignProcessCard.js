import React, { useEffect, useState } from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};

export default function ProductDesignProcessCard({ order, state }) {

    // const [mounting_type, setMountingType] = useState([]);
    // const [mounting_size, setMountingSize] = useState([]);
    // const [imageUrl, setImageUrl] = useState('');
    // const [productionPrice, setProductionPrice] = useState(0);
    const [mounting_type, setMountingType] = useState([]);
    const [mounting_size, setMountingSize] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productionPrice, setProductionPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const setAttribute = async () => {
            if (state === "updating") {
                setTotalPrice(order.total_price);
                setImageUrl(order.product.imageUrl);
                setMountingType(order.product.mounting_type);
                setMountingSize(order.product.mounting_size);
                setProductPrice(order.product_price)
                setProductionPrice(order.production_price + order.product_price * (order.profit_rate / 100));
            } else {
                setTotalPrice(order.design_process.total_price);
                setImageUrl(order.design_process.imageUrl);
                setMountingType(order.design_process.mounting_type);
                setMountingSize(order.design_process.mounting_size);
                setProductPrice(order.design_process.product_price)
                setProductionPrice(order.design_process.production_price + order.design_process.product_price * (order.design_process.profit_rate / 100));
            }
            setLoading(false);
        }
        //


        setAttribute();
    }, []);

    return (
        <div className='w-full grid grid-cols-1 md:grid-cols-5 border border-black rounded-md'>
            {!loading &&
                <>
                    <div className='w-full m-0 col-span-1 md:col-span-1 flex xs:justify-start items-center md:justify-center h-full'>
                        <img src={imageUrl} alt='product' className='md:w-[100px] md:h-[100px] xs:w-[245px] xs:h-[245px] object-cover rounded-t-md' />
                    </div>
                    <div className='w-full col-span-1 md:col-span-4 flex p-3 flex-col'>
                        <p className={
                            state === 'previous' ? 'text-gray-600 text-xl font-gantariFont' : 'text-green-800 text-xl font-gantariFont'
                        }><CurrencyFormatter value={totalPrice} /></p>

                        <div className='flex'>
                            <p className='font-gantariFont md:text-base xs:text-xs font-semibold text-[#151542] mr-3'>Mounting Type: </p>
                            {mounting_type ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 md:text-base xs:text-xs font-gantariFont' : 'text-green-800 md:text-base xs:text-xs font-gantariFont'
                                }>{mounting_type.name}</p>
                            ) : (
                                <p className='text-red-600 md:text-base xs:text-xs'>No Specific Type</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont md:text-base xs:text-xs font-semibold text-[#151542] mr-3'>Mounting Size: </p>
                            {mounting_size ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 md:text-base xs:text-xs font-gantariFont' : 'text-green-800 md:text-base xs:text-xs font-gantariFont'
                                }>{mounting_size} (mm)</p>
                            ) : (
                                <p className='md:text-base xs:text-xs'>Not available</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont font-semibold md:text-base xs:text-xs text-[#151542] mr-3'>Materials Price: </p>
                            {productPrice ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 md:text-base xs:text-xs font-gantariFont' : 'text-green-800 md:text-base xs:text-xs font-gantariFont'
                                }><CurrencyFormatter value={productPrice} /></p>
                            ) : (
                                <p className='md:text-base xs:text-xs'>Not available</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont md:text-base xs:text-xs font-semibold text-[#151542] mr-3'>Production Price: </p>
                            {productionPrice ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 md:text-base xs:text-xs font-gantariFont' : 'text-green-800 md:text-base xs:text-xs font-gantariFont'
                                }><CurrencyFormatter value={productionPrice} /></p>
                            ) : (
                                <p className='md:text-base xs:text-xs'>Not available</p>
                            )
                            }
                        </div>

                    </div>
                </>

            }

        </div>
    )
}