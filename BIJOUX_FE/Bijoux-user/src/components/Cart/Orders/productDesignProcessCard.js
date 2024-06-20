import React, { useEffect, useState } from 'react';
import numeral from 'numeral';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function ProductDesignProcessCard({ product, state }) {

    const [mounting_type, setMountingType] = useState([]);
    const [mounting_size, setMountingSize] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [production_price, setProductionPrice] = useState(0);

    useEffect(() => {
        setProductionPrice(product.total_price - product.product_price);
        if (state === "currently") {
            setImageUrl(product.product.imageUrl);
            setMountingType(product.product.mounting_type);
            setMountingSize(product.product.mounting_size);
        } else {
            setImageUrl(product.imageUrl);
            setMountingType(product.mounting_type);
            setMountingSize(product.mounting_size);
        }
    }, []);

    return (
        <div className='w-full flex items-center border border-black rounded-md'>
            <div className='w-[120px] h-[120px] m-3'>
                <img src={imageUrl} alt='product' className='w-full h-full object-cover' />
            </div>
            <div className='flex-1 mr-3 flex flex-col'>
                <p className={
                    state === 'previous' ? 'text-gray-600 text-xl font-gantariFont' : 'text-green-800 text-xl font-gantariFont'
                }><CurrencyFormatter value={product.total_price} /></p>

                <div className='flex'>
                    <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Mounting Type: </p>
                    {mounting_type ? (
                        <p className={
                            state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                        }>{mounting_type.name}</p>
                    ) : (
                        <p>Not available</p>
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
                    {product.product_price ? (
                        <p className={
                            state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                        }><CurrencyFormatter value={product.product_price} /></p>
                    ) : (
                        <p>Not available</p>
                    )
                    }
                </div>

                <div className='flex'>
                    <p className='font-gantariFont font-semibold text-[#151542] mr-3'>Production Price: </p>
                    {product.product_price ? (
                        <p className={
                            state === 'previous' ? 'text-gray-600 font-gantariFont' : 'text-green-800 font-gantariFont'
                        }><CurrencyFormatter value={production_price} /></p>
                    ) : (
                        <p>Not available</p>
                    )
                    }
                </div>

            </div>
        </div>
    )
}