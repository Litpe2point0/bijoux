import react from 'react';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import PricedMetalCard from '../Quotes/pricedMetalCard';
import PricedDiamondCard from '../Quotes/pricedDiamondCard';
const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function OrderInformations({ order }) {
    const updateProductionPrice = order.total_price - order.product_price;
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center items-center mb-5">
                <p className="font-loraFont text-4xl text-[#151542] font-light">Order Informations</p>
            </div>
            <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="w-full">
                    <div className="w-3/4 flex justify-center items-center">
                        <p className="font-gantariFont text-[#151542] text-xl">IMAGE OF PRODUCT</p>
                    </div>
                    <div className="w-3/4 h-0.5 bg-[#151542] mb-5"></div>
                    <div className="w-3/4">
                        <img src={order.imageUrl} alt="product" className="w-full rounded-lg" />
                    </div>
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="w-3/4 flex justify-center items-center">
                        <p className="font-gantariFont text-[#151542] text-xl">INFORMATIONS OF PRODUCT</p>
                    </div>
                    <div className="w-3/4 h-0.5 bg-[#151542] mb-5"></div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Order ID:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Product ID:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.product.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Order Type:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">Customization</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Created:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.created_date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Mounting Type:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                {order.product.mounting_type.name
                                    ? (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.product.mounting_type.name}</p>
                                    )
                                    : (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">null</p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Mounting Size:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                {order.product.mounting_size
                                    ? (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.product.mounting_size}.0 (mm)</p>
                                    )
                                    : (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">null</p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex flex-col justifi-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Note:</p>
                            <div className='w-full h-[70px] border-sm bg-slate-200 overflow-y-auto'>
                                <p className="font-gantariFont text-[#151542] font-medium text-base mx-2">{order.note}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-3/4 flex flex-col">
                <p className="font-gantariFont text-2xl text-[#151542] font-bold">Metals:</p>
                {order.product.product_metal
                    .filter(metal => metal.status === 1)
                    .map((metal, index) => (
                        <PricedMetalCard key={index} metal={metal} />
                    ))}
            </div>

            <div className="w-3/4 flex flex-col mt-10">
                <p className="font-gantariFont text-2xl text-[#151542] font-bold">Diamonds:</p>
                {order.product.product_diamond
                    .filter(diamond => diamond.status === 1)
                    .map((diamond, index) => (
                        <PricedDiamondCard key={index} diamond={diamond} />
                    ))}
            </div>

        </div>
    );
}