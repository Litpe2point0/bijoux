import React, { useEffect } from "react";
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};


export default function OrderCard({ order, onCancel }) {
    const newProductionPrice = order.total_price - order.product_price;
    const navigate = useNavigate();
    const handleViewDetails = () => {
        //Navigate đến trang order detail
        navigate(`/cart/order-detail/${order.id}`);

    }
    useEffect(() => {
        console.log("--->",order);
    }, [order]);
    //const templateImage = "https://i.pinimg.com/564x/d0/65/b0/d065b0f511204401fe8af162372091a6.jpg";


    const saleStaffInformations = {
        id: 1,
        name: "Ngô Thị Hồng Hào",
        imageUrl: "https://i.pinimg.com/564x/f1/35/c4/f135c40157fb7cae9e960d169ab9ac1c.jpg",
        phone: "0987654321",
        email: "thuydungngo@gmail.com"
    }

    const designStaffInformations = {
        id: 1,
        name: "Võ Thị Kim Chỉ",
        imageUrl: "https://i.pinimg.com/564x/f1/74/83/f17483058438a9fbe95aa80a7e273414.jpg",
        phone: "0987654321",
        email: "themankimchi@gmail.com"
    }

    const productionStaffInformations = {
        id: 1,
        name: "Hoàng Việt Vị",
        imageUrl: "https://i.pinimg.com/564x/b4/3a/89/b43a892e3f68c50a5b7ce996aa41a1af.jpg",
        phone: "0987654321",
        email: "dabongtoanvietvi@gmail.com"
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-10/12 h-[200px] items-center bg-white  p-4 border-b border-black">
                <div className="h-full">
                    {/* {order.product.imageUrl ? (
                        <img src={order.product.imageUrl} alt="product" className="h-full" />
                    ) : (
                        <img src={templateImage} alt="product" className="h-full" />
                    )} */}
                    <img src={order.product.imageUrl} alt="product" className="h-full" />

                </div>

                <div className="flex flex-col h-full ml-5 w-[630px]">
                    <div className="flex">
                        <p className="font-semibold font-gantariFont text-2xl">Order ID: </p>
                        <p className="ml-1 font-semibold font-gantariFont text-2xl">#{order.id}</p>
                    </div>
                    <div className="flex mt-1">
                        <p className="font-gantariFont">Created Date: {order.created_date}</p>
                    </div>
                    <div className="flex flex-col mt-1">
                        <p className="font-gantariFont">Note:</p>
                        {/* <div className="w-10/12 h-[75px] bg-slate-200 overflow-y-auto">
                            <p className="font-gantariFont ml-2 mt-2 mr-2 mb-1">{order.note}</p>
                        </div> */}
                        <textarea className="w-10/12 h-[75px] bg-slate-200 overflow-y-auto font-gantariFont">
                            {order.note}
                        </textarea>
                    </div>
                </div>

                <div className="mx-1 h-full w-0.5 bg-black"> </div>

                <div className="flex-1 flex flex-col h-full ml-5">
                    {order.total_price ? (
                        <p className="font-gantariFont text-xl font-semibold"><CurrencyFormatter value={order.total_price} /></p>
                    ) : (
                        <p className="font-gantariFont text-xl font-semibold">Unpriced yet</p>
                    )}

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Order Status: </p>
                        <p className={
                            order.order_status.id === 1 ? "text-indigo-700 font-gantariFont font-semibold" :
                                order.order_status.id === 2 ? "text-sky-700 font-gantariFont font-semibold" :
                                    order.order_status.id === 3 ? "text-orange-700 font-gantariFont font-semibold" :
                                        order.order_status.id === 4 ? "text-indigo-700 font-gantariFont font-semibold" :
                                            order.order_status.id === 5 ? "text-cyan-700 font-gantariFont font-semibold" :
                                                order.order_status.id === 6 ? "text-green-700 font-gantariFont font-semibold" :
                                                    order.order_status.id === 7 ? "text-red-700 font-gantariFont font-semibold" :
                                                    ""
                        }>{order.order_status.name}
                        </p>

                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Materials Price: </p>
                        {order.product_price ? (
                            <p className="font-gantariFont"><CurrencyFormatter value={order.product_price} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-md mr-2">Production Price: </p>
                        {order.production_price ? (
                            <p className="font-gantariFont"><CurrencyFormatter value={newProductionPrice} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="w-full h-[65px] flex items-center justify-around">
                        <button onClick={() => handleViewDetails(order.id)} className="w-[130px] h-[35px] bg-[#0024A4] text-white hover:bg-[#071E6F]">DETAILS</button>
                        {order.order_status.id === 5 || order.order_status.id === 6 ? (
                            <button className="w-[130px] h-[35px] bg-slate-500 text-white ">CANCEL</button>
                        ) : (
                            <button onClick={onCancel} className="w-[130px] h-[35px] bg-[#CD0B2A] text-white hover:bg-[#8B1023]">CANCEL</button>
                        )}

                    </div>
                </div>

            </div>
        </div>

    );
}