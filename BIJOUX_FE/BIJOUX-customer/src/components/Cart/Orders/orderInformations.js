import react from 'react';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import PricedMetalCard from '../Quotes/pricedMetalCard';
import PricedDiamondCard from '../Quotes/pricedDiamondCard';
import MetalDesignProcessCard from './metalDesignProcessCard';
import DiamondDesignProcessCard from './diamondDesignProcessCard';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0');
    return <span>{formattedValue}</span>;
};




const getFormattedDate = (dateStringOrDate) => {
    let date;
    if (typeof dateStringOrDate === 'string') {
        // Chuyển đổi chuỗi thành đối tượng Date
        date = new Date(dateStringOrDate);
    } else if (dateStringOrDate instanceof Date) {
        // Sử dụng trực tiếp nếu là đối tượng Date
        date = dateStringOrDate;
    } else {
        return ''; // Xử lý trường hợp không hợp lệ
    }

    if (!(date instanceof Date) || isNaN(date)) {
        return ''; // Xử lý trường hợp ngày tháng không hợp lệ
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const getRightFormattedCreatedDate = (inputString) => {
    // Tách chuỗi theo khoảng trắng
    const parts = inputString.split(' ');

    // Lấy phần tử thứ 1 sau khi tách
    if (parts.length > 1) {
        return parts[1]; // Trả về phần tử thứ 2
    } else {
        return ''; // Trường hợp không có khoảng trắng đầu tiên
    }
};


const complete_old_version_metal = (old_list, new_list) => {

    old_list.forEach(old_item => {
        const found = new_list.find(new_item => (old_item.metal.id === new_item.metal.id) && (old_item.volume === new_item.volume));

        if (!found) {
            old_list.splice(old_list.indexOf(old_item), 1);
        }
    });
    new_list.forEach(new_item => {

        const found = old_list.find(old_item => (old_item.metal.id === new_item.metal.id) && (old_item.volume === new_item.volume));

        if (!found) {
            old_list.push(new_item);
        }
    });
    return old_list;
}

const complete_old_version_diamond = (old_list, new_list) => {
    old_list.forEach(old_item => {
        const found = new_list.find(new_item => (old_item.diamond.id === new_item.diamond.id) && (old_item.count === new_item.count));

        if (!found) {
            old_list.splice(old_list.indexOf(old_item), 1);
        }
    });
    new_list.forEach(new_item => {

        const found = old_list.find(old_item => (old_item.diamond.id === new_item.diamond.id) && (old_item.count === new_item.count));

        if (!found) {
            old_list.push(new_item);
        }
    });

    return old_list;
}

export default function OrderInformations({ order }) {
    const updateProductionPrice = (order.profit_rate / 100) * order.product_price + order.production_price;
    const formattedCreatedDate = getFormattedDate(order.created);
    const today = new Date();


    const currentMetals = order.product.product_metal.filter(metal => metal.status === 1);
    const oldMetals = order.product.product_metal.filter(metal => metal.status === 3);
    console.log('old METAL', oldMetals)
    const unchangedMetals = currentMetals.filter(current =>
        !oldMetals.some(old => old.metal.id === current.metal.id)
    );

    const currentDiamonds = order.product.product_diamond.filter(diamond => diamond.status === 1);
    const oldDiamonds = order.product.product_diamond.filter(diamond => diamond.status === 3);
    const unchangedDiamonds = currentDiamonds.filter(current =>
        !oldDiamonds.some(old => old.diamond.id === current.diamond.id)
    );

    // console.log(">>>curDiamond", currentDiamonds)
    // console.log(">>>oldDiamond", oldDiamonds)
    // console.log(">>>unchangedDiamond", unchangedDiamonds)
    console.log("diamond", order.product.product_diamond)

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center items-center mb-5">
                <p className="font-loraFont text-4xl text-[#151542] font-light">Order Informations</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-5 mb-10">
                <div className="w-full">
                    <div className="w-3/4 flex justify-center items-center">
                        <p className="font-gantariFont text-[#151542] text-xl">IMAGE OF PRODUCT</p>
                    </div>
                    <div className="w-3/4 h-0.5 bg-[#151542] mb-5"></div>
                    <div className="w-3/4">
                        <img src={order.imageUrl} alt="product" className="w-full object-cover rounded-lg" />
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
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.order_type.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Created:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.created}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex items-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Mounting Type:</p>
                            <div className="flex-1"></div>
                            <div className="w-[210px] flex items-center justify-start h-9 bg-slate-200 rounded-lg">
                                {order.product.mounting_type
                                    ? (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.product.mounting_type.name}</p>
                                    )
                                    : (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">No Specific Type</p>
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
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">{order.product.mounting_size} (mm)</p>
                                    )
                                    : (
                                        <p className="font-gantariFont text-[#151542] font-medium text-base ml-2">...</p>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4 flex flex-col mb-5">
                        <div className="flex flex-col justifi-center">
                            <p className="font-gantariFont text-[#151542] font-bold text-base mr-2">Note:</p>
                            <textarea readOnly className="w-full h-[175px] resize-none bg-slate-200 overflow-y-auto font-gantariFont p-2 border-2 border-gray-200 rounded-md">
                                {order.note}
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-3/4 flex flex-col">
                <p className="font-gantariFont text-2xl text-[#151542] font-bold">Metals:</p>

                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <p className='font-gantariFont font-semibold text-gray-500 text-xl'>Previous Price</p>
                        {oldMetals.length > 0 && (
                            oldMetals.map((metal, index) => (
                                <MetalDesignProcessCard key={index} metal={metal} status={2} />
                            ))
                        )}
                        {unchangedMetals.length > 0 && (
                            unchangedMetals.map((metal, index) => (
                                <MetalDesignProcessCard key={index} metal={metal} status={2} />
                            ))
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-gantariFont font-semibold text-green-500 text-xl'>Current Price</p>
                        {/* {currentMetals.map((metal, index) => (
                            <MetalDesignProcessCard metal={metal} status={1} />
                        ))} */}
                        {(order.order_status.id == 2 && oldMetals.length > 0) ? (
                            complete_old_version_metal(oldMetals, currentMetals).map((metal, index) => (
                                <MetalDesignProcessCard key={index} metal={metal} status={2} />
                            ))
                        )
                            :
                            currentMetals.map((metal, index) => (
                                <MetalDesignProcessCard metal={metal} status={1} />
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="w-3/4 flex flex-col my-10">
                <p className="font-gantariFont text-2xl text-[#151542] font-bold">Diamonds:</p>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <p className='font-gantariFont font-semibold text-gray-500 text-xl'>Previous Price</p>
                        {oldDiamonds.length > 0 && (
                            oldDiamonds.map((diamond, index) => (
                                <DiamondDesignProcessCard key={index} diamond={diamond} status={2} />
                            ))
                        )}
                        {unchangedDiamonds.length > 0 && (
                            unchangedDiamonds.map((diamond, index) => (
                                <DiamondDesignProcessCard key={index} diamond={diamond} status={2} />
                            ))
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-gantariFont font-semibold text-green-500 text-xl'>Current Price</p>

                        {(order.order_status.id == 2 && oldDiamonds.length > 0) ? (
                            complete_old_version_diamond(oldDiamonds, currentDiamonds).map((diamond, index) => (
                                <DiamondDesignProcessCard key={index} diamond={diamond} status={2} />
                            ))
                        )
                            :
                            currentDiamonds.map((diamond, index) => (
                                <DiamondDesignProcessCard diamond={diamond} status={1} />
                            ))
                        }
                        {/* {currentDiamonds.map((diamond, index) => (
                            <DiamondDesignProcessCard diamond={diamond} status={1} />
                        ))
                        } */}


                    </div>
                </div>
            </div>

        </div>
    );
}