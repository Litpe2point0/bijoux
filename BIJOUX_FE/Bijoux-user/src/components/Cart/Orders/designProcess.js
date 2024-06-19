import react, { useEffect, useState } from 'react';
import ProductDesignProcessCard from './productDesignProcessCard';
import MetalDesignProcessCard from './metalDesignProcessCard';
import DiamondDesignProcessCard from './diamondDesignProcessCard';

export default function DesignProcess({ order }) {

    const [previousDiamondList, setPreviousDiamondList] = useState([]);
    const [previousMetalList, setPreviousMetalList] = useState([]);
    const [currentlyDiamondList, setCurrentlyDiamondList] = useState([]);
    const [currentlyMetalList, setCurrentlyMetalList] = useState([]);
    useEffect(() => {
        setPreviousDiamondList(order.product.product_diamond.filter(diamond => diamond.status === 2));
        setPreviousMetalList(order.product.product_metal.filter(metal => metal.status === 2));
        setCurrentlyDiamondList(order.product.product_diamond.filter(diamond => diamond.status === 1));
        setCurrentlyMetalList(order.product.product_metal.filter(metal => metal.status === 1));
    }, [order]);

    return (
        <div className='w-full flex flex-col items-center'>
            <h1 className='font-loraFont text-2xl font-light text-[#151542]'>Design Process</h1>
            <div className='w-full grid grid-cols-2 gap-8 mt-10'>
                <div className='flex flex-col w-full items-center'>
                    <p className='text-xl font-loraFont text-gray-400 mb-5'>Previous Design</p>
                    <ProductDesignProcessCard product={order.design_process} state="previous" />
                    {previousMetalList.map((metal, index) => (
                        <MetalDesignProcessCard key={index} metal={metal} status={2} />
                    ))}
                    {previousDiamondList.map((diamond, index) => (
                        <DiamondDesignProcessCard key={index} diamond={diamond} status={2} />
                    ))}
                </div>
                <div className='flex flex-col w-full items-center'>
                    <p className='text-xl font-loraFont text-green-800 mb-5'>Currently Design</p>
                    <ProductDesignProcessCard product={order} state="currently" />
                    {currentlyMetalList.map((metal, index) => (
                        <MetalDesignProcessCard key={index} metal={metal} status={1} />
                    ))}
                    {currentlyDiamondList.map((diamond, index) => (
                        <DiamondDesignProcessCard key={index} diamond={diamond} status={1} />
                    ))}
                </div>
            </div>
        </div>
    )
}