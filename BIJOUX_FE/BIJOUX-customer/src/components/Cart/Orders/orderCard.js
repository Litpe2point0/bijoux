import React, { useEffect } from "react";
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirm_delivery, create_payment_link } from "../../../api/main/orders/Order_api";
import Button from '@mui/material/Button';
import { Wallet } from "@phosphor-icons/react";
import { instantAlertMaker } from "../../../api/instance/axiosInstance";


const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

function getUrlWithoutQuery() {
    return window.location.origin + window.location.pathname;
}

export default function OrderCard({ order, onCancel, handleDataChange }) {
    const newProductionPrice = (order.profit_rate / 100) * order.product_price + order.production_price;
    const navigate = useNavigate();
    const handleViewDetails = () => {
        //Navigate đến trang order detail
        navigate(`/cart/order-detail/${order.id}`);
    };

    useEffect(() => {
        console.log("--->", order);
    }, [order]);

    const handleCreatePaymentLink = async () => {
        const order_information = {
            order_id: order.id,
            return_url: getUrlWithoutQuery() + "?payment_status=success",
            cancel_url: getUrlWithoutQuery() + "?payment_status=cancel",
        };
        const formData = new FormData();
        formData.append("order_information", JSON.stringify(order_information));
        const payment_link = await create_payment_link(formData, "Create payment link", true);
        if (payment_link.data.payment_link) {
            window.location.href = payment_link.data.payment_link;
        } else {
            instantAlertMaker('warning', 'Error', "So Sorry, You Can Not Pay It For Now, Because Of Some Unexpected Reason!");
        }
    };

    const handleConfirmReceived = async (orderID) => {
        Swal.fire({
            title: "Please make sure that you have received the order before clicked confirm",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, i have received the jewelry!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('order_id', orderID);
                const response = await confirm_delivery(formData, 'confirm delivery', true);
                if (response.success) {
                    Swal.fire({
                        title: "Success",
                        text: "Enjoy your jewelry! Thank you for choosing us!",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: response.mess,
                        icon: "error"
                    });
                }
                handleDataChange();
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-col md:flex-row w-10/12 items-start bg-white p-4 border-b border-black">
                <div className="md:border-2 md:w-[150px] md:h-[150px] my-5 sm:w-0 flex items-center justify-center overflow-hidden">
                    <img src={order.product.imageUrl} alt="product" className="w-full h-full object-cover object-center" />
                </div>

                <div className="flex flex-col h-full ml-5 w-full md:w-1/3">
                    <div className="flex">
                        <p className="font-semibold font-gantariFont text-lg md:text-2xl">Order ID: </p>
                        <p className="ml-1 font-semibold font-gantariFont text-lg md:text-2xl">#{order.id}</p>
                    </div>
                    <div className="flex mt-1">
                        <p className="font-gantariFont">Created Date: {order.created}</p>
                    </div>
                    <div className="flex-col mt-1 hidden md:flex">
                        <p className="font-gantariFont">Note:</p>
                        <textarea readOnly className="w-10/12 h-[75px] resize-none bg-slate-200 overflow-y-auto font-gantariFont p-2 border-2 border-gray-200 rounded-md">
                            {order.note}
                        </textarea>
                    </div>
                </div>

                <div className="mx-1 h-full w-0.5 bg-black hidden md:block"> </div>

                <div className="flex-1 flex flex-col h-full ml-5 mr-2 w-full">
                    {order.total_price ? (
                        <p className="font-gantariFont text-md md:text-xl font-semibold"><CurrencyFormatter value={order.total_price} /></p>
                    ) : (
                        <p className="font-gantariFont text-md md:text-xl font-semibold">Unpriced yet</p>
                    )}

                    <div className="flex">
                        <p className="font-gantariFont text-sm md:text-md mr-2">Order Status: </p>
                        <p className={
                            order.order_status.id === 1 ? "text-indigo-700 font-gantariFont font-semibold text-sm md:text-md" :
                                order.order_status.id === 2 ? "text-sky-700 font-gantariFont font-semibold text-sm md:text-md" :
                                    order.order_status.id === 3 ? "text-orange-700 font-gantariFont font-semibold text-sm md:text-md" :
                                        order.order_status.id === 4 ? "text-indigo-700 font-gantariFont font-semibold text-sm md:text-md" :
                                            order.order_status.id === 5 ? "text-cyan-700 font-gantariFont font-semibold text-sm md:text-md" :
                                                order.order_status.id === 6 ? "text-green-700 font-gantariFont font-semibold text-sm md:text-md" :
                                                    order.order_status.id === 7 ? "text-red-700 font-gantariFont font-semibold text-sm md:text-md" :
                                                        ""
                        }>{order.order_status.name}
                        </p>
                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-sm md:text-md mr-2">Materials Price: </p>
                        {order.product_price ? (
                            <p className="font-gantariFont text-sm md:text-md"><CurrencyFormatter value={order.product_price} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="flex">
                        <p className="font-gantariFont text-sm md:text-md mr-2">Production Price: </p>
                        {order.production_price ? (
                            <p className="font-gantariFont text-sm md:text-md"><CurrencyFormatter value={newProductionPrice} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="w-full h-[40px] grid grid-cols-2 gap-2 mt-2 md:mt-10">
                        <Button onClick={() => handleViewDetails(order.id)} variant="contained">
                            DETAILS
                        </Button>
                        {
                            order.order_status.id === 5 ? (
                                <Button onClick={() => handleConfirmReceived(order.id)} color="success" variant="contained">
                                    CONFIRM RECEIVED
                                </Button>
                            ) : order.order_status.id === 6 ? (
                                <Button disabled variant="contained">
                                    CONFIRM RECEIVED
                                </Button>
                            ) : order.order_status.id === 7 ? (
                                <Button disabled variant="contained">
                                    CANCEL
                                </Button>
                            ) :
                                (
                                    <Button onClick={onCancel} variant="contained" color="error">
                                        CANCEL
                                    </Button>
                                )
                        }
                    </div>
                </div>

                <div className="flex h-full w-full justify-start items-start md:w-auto sm:mt-3 sm:ml-5 md:ml-0 md:mt-0">
                    <div className="flex h-full items-start self-start w-full">
                        {order.order_status.id === 1 || order.order_status.id === 4 ? (
                            <Button
                                onClick={!(order.order_status.id === 4 && order.deposit_has_paid - order.total_price > 0) && handleCreatePaymentLink}
                                variant="outlined"
                                sx={{ color: '#33ab95', borderBlockColor: '#33ab95' }}
                                startIcon={<Wallet size={27} weight="duotone" />}
                            //disabled={order.order_status.id === 4 && order.deposit_has_paid - order.total_price > 0}
                            >
                                {order.order_status.id === 1
                                    ? 'Pay Deposit'
                                    : order.deposit_has_paid - order.total_price > 0
                                        ? 'Refunding...'
                                        : 'Pay The Rest'}
                            </Button>
                        ) : (
                            <div className="w-full md:w-[150px] sm:w-[133px]"></div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
