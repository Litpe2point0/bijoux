import react, { useEffect, useState } from 'react';
import ProductDesignProcessCard from './productDesignProcessCard';
import MetalDesignProcessCard from './metalDesignProcessCard';
import DiamondDesignProcessCard from './diamondDesignProcessCard';

export default function DesignProcess({ order }) {

    const [previousDiamondList, setPreviousDiamondList] = useState([]);
    const [previousMetalList, setPreviousMetalList] = useState([]);
    const [currentlyDiamondList, setCurrentlyDiamondList] = useState([]);
    const [currentlyMetalList, setCurrentlyMetalList] = useState([]);
    const [maxMetalLength, setMaxLength] = useState(0);
    useEffect(() => {
        setPreviousDiamondList(order.product.product_diamond.filter(diamond => diamond.status === 2));
        setPreviousMetalList(order.product.product_metal.filter(metal => metal.status === 2));
        setCurrentlyDiamondList(order.product.product_diamond.filter(diamond => diamond.status === 1));
        setCurrentlyMetalList(order.product.product_metal.filter(metal => metal.status === 1));

        console.log(">>> max Length", maxMetalLength);
        console.log(">>> currentlyMetakList", currentlyMetalList.length);
        console.log(">>> previousMetalList", previousMetalList.length);
    }, [order]);
    useEffect(() => {
        setMaxLength(Math.max(currentlyMetalList.length, previousMetalList.length));
    }, [currentlyMetalList, previousMetalList]);
    return (
        <div className='w-full flex flex-col items-center'>
            <h1 className='font-loraFont text-2xl font-light text-[#151542]'>Design Process</h1>
            <div className='w-full grid grid-cols-2 gap-8 my-10'>
                <div className='flex flex-col w-full items-center'>
                    <p className='text-xl font-loraFont text-gray-400 mb-5'>Previous Design</p>
                    <ProductDesignProcessCard order={order} state="previous" />
                    <p className='mt-5 font-gantariFont font-semibold text-xl text-[#151542]'>Metal List:</p>
                    {previousMetalList.map((metal, index) => (
                        <MetalDesignProcessCard key={index} metal={metal} status={2} />
                    ))}
                    {previousMetalList.length < maxMetalLength &&
                        Array(maxMetalLength - previousMetalList.length).fill().map((_, index) => (
                            <div key={index} className='w-full md:h-[66px] sm:h-[106px] mt-5'></div>
                        ))
                    }
                    <p className='mt-5 font-gantariFont font-semibold text-xl text-[#151542]'>Diamond List:</p>
                    {previousDiamondList.map((diamond, index) => (
                        <DiamondDesignProcessCard key={index} diamond={diamond} status={2} />
                    ))}
                </div>
                <div className='flex flex-col w-full items-center'>
                    <p className='text-xl font-loraFont text-green-800 mb-5'>New Design</p>
                    <ProductDesignProcessCard order={order} state="updating" />
                    <p className='mt-5 font-gantariFont font-semibold text-xl text-[#151542]'>Metal List:</p>
                    {currentlyMetalList.map((metal, index) => (
                        <MetalDesignProcessCard key={index} metal={metal} status={1} />
                    ))}
                    {currentlyMetalList.length < maxMetalLength &&
                        Array(maxMetalLength - currentlyMetalList.length).fill().map((_, index) => (
                            <div key={index} className='w-full h-[66px] mt-5'></div>
                        ))
                    }
                    <p className='mt-5 font-gantariFont font-semibold text-xl text-[#151542]'>Diamond List:</p>
                    {currentlyDiamondList.map((diamond, index) => (
                        <DiamondDesignProcessCard key={index} diamond={diamond} status={1} />
                    ))}
                </div>
            </div>
        </div>
    )
}