import React, { useEffect, useState } from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const setAttribute = async () => {
            if (state === "updating") {
                setImageUrl(order.product.imageUrl);
                setMountingType(order.product.mounting_type);
                setMountingSize(order.product.mounting_size);
                setProductPrice(order.product_price)
                setProductionPrice(order.production_price + order.product_price*(order.profit_rate/100));
            } else {
                setImageUrl(order.design_process.imageUrl);
                setMountingType(order.design_process.mounting_type);
                setMountingSize(order.design_process.mounting_size);
                setProductPrice(order.design_process.product_price)
                setProductionPrice(order.design_process.production_price + order.design_process.product_price*(order.design_process.profit_rate/100));
            }
            setLoading(false);
        }
        //
        

        setAttribute();
    }, []);

    return (
        <div className='w-full flex items-center border border-black rounded-md'>
            {!loading &&
                <>
                    <div className='w-[120px] h-[120px] m-3'>
                        <img src={imageUrl} alt='product' className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-1 mr-3 flex flex-col'>
                        <p className={
                            state === 'previous' ? 'text-gray-600 text-xl font-gantariFont' : 'text-green-800 text-xl font-gantariFont'
                        }><CurrencyFormatter value={order.total_price} /></p>

                        <div className='flex'>
                            <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Mounting Type: </p>
                            {mounting_type ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                                }>{mounting_type.name}</p>
                            ) : (
                                <p className='text-red-600'>No Specific Type</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Mounting Size: </p>
                            {mounting_size ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                                }>{mounting_size} (mm)</p>
                            ) : (
                                <p>Not available</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Materials Price: </p>
                            {productPrice ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                                }><CurrencyFormatter value={productPrice} /></p>
                            ) : (
                                <p>Not available</p>
                            )
                            }
                        </div>

                        <div className='flex'>
                            <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Production Price: </p>
                            {productionPrice ? (
                                <p className={
                                    state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                                }><CurrencyFormatter value={productionPrice} /></p>
                            ) : (
                                <p>Not available</p>
                            )
                            }
                        </div>

                    </div>
                </>

            }

        </div>
    )
}