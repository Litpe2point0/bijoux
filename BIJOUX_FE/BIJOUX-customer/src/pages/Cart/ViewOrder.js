import React, { useEffect, useState } from "react";
import OrderCard from "../../components/Cart/Orders/orderCard";
import Swal from 'sweetalert2';
import { cancel_order, get_order_list_customer } from "../../api/main/orders/Order_api";
import { instantAlertMaker } from "../../api/instance/axiosInstance";

// This is a mock data for order list
const orderList_data = [
    {
        id: 1,
        product: {
            id: 213,
            imageUrl: "https://i.pinimg.com/564x/a5/00/6e/a5006ea7360527e1f4f94b3f75bed2d3.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: null,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 1, name: "Deposit" },
        order_type: { id: 1, name: "Customization" },
        deposit_has_paid: null,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 1",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    },
    {
        id: 2,
        product: {
            id: 214,
            imageUrl: "https://i.pinimg.com/564x/54/1c/b9/541cb95f94362d6b1fa4b39890c41b8d.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: null,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 2, name: "Design" },
        order_type: { id: 1, name: "Customization" },
        deposit_has_paid: 17875000,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 2",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    },
    {
        id: 3,
        product: {
            id: 245,
            imageUrl: "https://i.pinimg.com/564x/3a/07/a4/3a07a4a326f37e14cfe5ade88e2c6bd0.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: null,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 3, name: "Manufacturing" },
        order_type: { id: 1, name: "Customization" },
        deposit_has_paid: 17875000,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 2",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    },
    {
        id: 4,
        product: {
            id: 245,
            imageUrl: "https://i.pinimg.com/564x/29/08/82/29088228b5e906ae54b6489206ac1af2.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: 7574,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 4, name: "Payment" },
        order_type: { id: 2, name: "Template" },
        deposit_has_paid: 17875000,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 2",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    },
    {
        id: 5,
        product: {
            id: 644,
            imageUrl: "https://i.pinimg.com/564x/29/c9/44/29c944104582f71b5dc33b503f28c077.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: 7565,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 5, name: "Delivery" },
        order_type: { id: 2, name: "Template" },
        deposit_has_paid: 178750000,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 2",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    },
    {
        id: 6,
        product: {
            id: 2321,
            imageUrl: "https://i.pinimg.com/564x/ef/bc/10/efbc10e7961e7e79189bbce8b582179b.jpg",
            mounting_type: { id: 1, name: "Ring" },
            model_id: 7574,
            mouting_size: 8
        },
        account: {
            id: 1,
            username: "lockthepoet000",
            image_Url: "xxxx",
            dob: "10/03/2004",
            email: "lochmse182366@fpt.edu.vn",
            fullname: "Hoàng Minh Lộc",
            role: { id: 4, name: "Customer" },
            phone: "0987654321",
            address: "Hà Nội",
            deactivated: false,
            deactivated_date: null,
        },
        order_status: { id: 6, name: "Received" },
        order_type: { id: 2, name: "Template" },
        deposit_has_paid: 17875000,
        product_price: 20000000,
        profit_rate: 0.3,
        production_price: 7500000,
        total_price: (20000000 + 7500000) * 1.3,
        note: "Note 2",
        saleStaff_id: 1,
        designStaff_id: 1,
        productionStaff_id: 1,
        created_date: "15/06/2024"
    }
]

export default function ViewOrder() {

    const [orderList, setOrderList] = useState([]);
    const [customizationOrderList, setCustomizationOrderList] = useState([]);
    const [templateOrderList, setTemplateOrderList] = useState([]);

    const handleDataChange = async () => {
        const order_list = await get_order_list_customer(null, 'get order list', true);
        setOrderList(order_list.data);
        setCustomizationOrderList(order_list.data.customize_order_list)
        setTemplateOrderList(order_list.data.template_order_list)
    }
    useEffect(() => {
        // call api to get order list
        handleDataChange();
    }, []);

    // useEffect(() => {
    //     if (orderList) {
    //         setCustomizationOrderList(orderList.filter(order => order.order_type.name === "Customization"));
    //         setTemplateOrderList(orderList.filter(order => order.order_type.name === "Template"));
    //     }
    // }, [orderList]);

    const [type, setType] = useState("Customization");

    const handleCancelOrder = async (orderId) => {
        // call api to cancel order
        Swal.fire({
            title: "Are you sure you want to cancel this order?",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Xử lý khi người dùng xác nhận
                const cancel = {
                    order_id: orderId,
                    note: null
                }
                const formData = new FormData();
                formData.append("cancel", JSON.stringify(cancel));
                const response = await cancel_order(formData, 'cancel order', true);
                //setOrderList(orderList.filter(order => order.id !== id)); //này là test thôi nha
                if (!response.success) {
                    instantAlertMaker("error", "Error", "The order has not been canceled. Please try again !");
                    return;
                }
                Swal.fire({
                    title: "Success",
                    text: "The order has been cancel successfully!",
                    icon: "success"
                });
                handleDataChange();
            }
        });
    }


    return (
        <div className="w-full flex flex-col items-center text-[#151542]">
            <h1 className="font-loraFont text-4xl font-semibold">Your Order List</h1>
            <div className="w-11/12 grid grid-cols-2">
                <div className="flex flex-col w-full items-center justify-center">
                    <button onClick={() => setType('Customization')}
                        className={`${type === 'Customization' ? 'text-indigo-500 font-semibold' : 'font-semibold'
                            }`}>
                        Customization
                    </button>
                    <div className={`h-1 w-full bg-gray-400 ${type === 'Customization' ? 'bg-indigo-500' : 'bg-gray-400'
                        }`}>
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                    <button onClick={() => setType('Template')}
                        className={`${type === 'Template' ? 'text-indigo-500 font-semibold' : 'font-semibold'
                            }`}>
                        Template
                    </button>
                    <div className={`h-1 w-full bg-gray-400 ${type === 'Template' ? 'bg-indigo-500' : 'bg-gray-400'
                        }`}>
                    </div>
                </div>
            </div>

            {type === 'Customization' && (
                <div className="w-full flex flex-col items-center mt-5">
                    {customizationOrderList.map(order => (
                        <OrderCard order={order} onCancel={() => handleCancelOrder(order.id)} />
                    ))}
                </div>
            )}
            {type === 'Template' && (
                <div className="w-full flex flex-col items-center mt-5">
                    {templateOrderList.map(order => (
                        <OrderCard order={order} onCancel={() => handleCancelOrder(order.id)} />
                    ))}
                </div>
            )}

        </div >
    );
}