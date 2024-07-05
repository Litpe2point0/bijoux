import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropleft } from "react-icons/io";
import OrderStepper from "../../components/Cart/Orders/orderStepper";
import { gold, silver } from "../../assets/images";
import OrderInformations from "../../components/Cart/Orders/orderInformations";
import ManufactureProgress from "../../components/Cart/Orders/manufactureProgress";
import DesignProcess from "../../components/Cart/Orders/designProcess";
import { get_order_detail, get_order_detail_customer } from "../../api/main/orders/Order_api";
import { instantAlertMaker, paymentAlertMaker } from "../../api/instance/axiosInstance";
import { Box, CircularProgress } from "@mui/material";
import numeral from "numeral";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}
const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + " VND";
    return <span>{formattedValue}</span>;
};


export default function OrderDetails() {
    const navigate = useNavigate();
    const query = useQuery();

    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkContent, setCheckContent] = useState("order-informations");
    const [checkPayment, setCheckPayment] = useState(false);
    const [updateProductionPrice, setUpdateProductionPrice] = useState(0);
    const [refundPrice, setRefundPrice] = useState(0);

    useEffect(() => {
        if (query.get("payment_status") == "success") {
            paymentAlertMaker(navigate, 'success', 'Payment success', 'Your payment has been successfully processed. Thank you for your purchase!')
        } else if (query.get("payment_status") == "cancel") {
            paymentAlertMaker(navigate, 'error', 'Payment failed', 'Your payment has failed. Please try again!')
        }
    }, [query])

    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append("order_id", id);
            const order_detail_data = await get_order_detail_customer(formData, 'Get order detail', true);
            const order_detail = order_detail_data.data.order_detail;
            setOrderDetail(order_detail);
            console.log('DETAIL', order_detail);
            if (order_detail.order_status.id == 4 || order_detail.order_status.id == 1) {
                setCheckPayment(true);
            }
            setLoading(false);

        }
        setAttribute()
    }, []);

    useEffect(() => {
        if (orderDetail) {
            const updateProductionPriceTemp = orderDetail.production_price + orderDetail.product_price * (orderDetail.profit_rate / 100);
            const refundPriceTemp = orderDetail.deposit_has_paid - orderDetail.total_price;
            setUpdateProductionPrice(updateProductionPriceTemp);
            setRefundPrice(refundPriceTemp);
        }
    }, [orderDetail]);

    const handleBack = () => {
        navigate("/cart/order"); // Navigate back to the previous page
    };

    const handleChangeContent = (content) => {
        setCheckContent(content);
    }


    return (
        <div className="flex flex-col items-center">
            <div className="flex w-full">
                <div className="md:w-1/5 flex items-center underline">
                    <IoMdArrowDropleft size={20} />
                    <button onClick={handleBack}>Back to Order list</button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <h1 className="font-loraFont text-4xl font-light">Order Details</h1>
                </div>
                <div className="w-1/5">

                </div>
            </div>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', padding: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <>


                    <div className="w-10/12 my-7">
                        {!loading && <OrderStepper order={orderDetail} />}
                    </div>
                    {!loading &&
                        <div className="w-10/12 grid grid-cols-3">
                            <div className="w-full flex items-center justify-center">
                                <button onClick={() => handleChangeContent("order-informations")} className="md:w-[190px] md:h-[40px] sm:w-[165px] sm:h-[40px] sm:text-sm md:text-base bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Order Informations</button>
                            </div>
                            {orderDetail.order_type.id == 2 &&
                                <div className="w-full flex items-center justify-center">
                                    <button onClick={() => handleChangeContent("design-process")} className="md:w-[190px] md:h-[40px] sm:w-[165px] sm:h-[40px] sm:text-sm md:text-base bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Design Process</button>
                                </div>
                            }
                            <div className="w-full flex items-center justify-center">
                                <button onClick={() => handleChangeContent("manufacture-progress")} className="md:w-[190px] md:h-[40px] sm:w-[165px] sm:h-[40px] sm:text-sm md:text-base bg-[#151542] text-white font-semibold hover:bg-[#2323D5] hover:text-yellow-400">Manufacture Progress</button>
                            </div>
                        </div>
                    }
                    <div className="w-10/12 h-0.5 my-5 bg-gray-500"></div>

                    <div className="w-10/12">
                        {!loading && checkContent === "order-informations" && (
                            <OrderInformations order={orderDetail} />
                        )}
                        {!loading && checkContent === "design-process" && (
                            //orderDetail.order_status.id !== 1 && 
                            orderDetail.design_process !== null && orderDetail.design_process.design_process_status.id == 3 ? (
                                <DesignProcess order={orderDetail} />
                            ) : (
                                <div className="flex justify-center">
                                    <p className="font-loraFont font-light text-xl text-[#151542]">Your order hasn't reach Design Step. Please wait in the future</p>
                                </div>
                            )
                        )}
                        {!loading && checkContent === "manufacture-progress" && (
                            orderDetail.order_status.id !== 1 && orderDetail.order_status.id !== 2 ? (
                                <ManufactureProgress order={orderDetail} />
                            ) : (
                                <div className="flex justify-center">
                                    <p className="font-loraFont font-light text-xl text-[#151542]">Your order hasn't reach Manufacture Step. Please wait in the future</p>
                                </div>
                            )
                        )}
                    </div>
                </>
            }
            <div className="w-3/4 h-0.5 bg-slate-500 my-4"></div>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', padding: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <div className="w-1/2 flex flex-col">
                    <div className="flex w-full">
                        <p className="font-titleFont text-xl font-bold">Deposit Has Paid:</p>
                        <div className="flex-1"></div>
                        <p><CurrencyFormatter value={orderDetail.deposit_has_paid} /></p>
                    </div>
                    <div className="flex w-full">
                        <p className="font-titleFont text-xl font-bold">Product Price:</p>
                        <div className="flex-1"></div>
                        <p><CurrencyFormatter value={orderDetail.product_price} /></p>
                    </div>
                    <div className="flex w-full">
                        <p className="font-titleFont text-xl font-bold">Production Price:</p>
                        <div className="flex-1"></div>
                        <p><CurrencyFormatter value={updateProductionPrice} /></p>
                    </div>
                    <div className="flex w-full">
                        <p className="font-titleFont text-xl font-bold">Change:</p>
                        <div className="flex-1"></div>
                        <p><CurrencyFormatter value={refundPrice < 0 ? 0 : refundPrice} /></p>
                    </div>
                    <div className="flex w-full">
                        <p className="font-titleFont text-2xl text-red-500 font-bold">Total:</p>
                        <div className="flex-1"></div>
                        <p><CurrencyFormatter value={orderDetail.total_price} /></p>
                    </div>

                </div>}
        </div>
    );
}