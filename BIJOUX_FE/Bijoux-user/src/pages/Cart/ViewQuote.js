import React, { useState } from "react";
import QuoteCard from "../../components/Cart/Quotes/quoteCard";
import Swal from 'sweetalert2';

export default function ViewQuote() {

    const initialQuoteList = [
        {
            id: 1,
            product: {
                id: 1,
                imageUrl: null,
                mounting_type: null,
                model_id: null,
                mounting_size: null
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
            quote_status: { id: 1, name: "Received" },
            product_price: null,
            profit_rate: null,
            saleStaff_id: null,
            designStaff_id: null,
            productionStaff_id: null,
            note: "Liên hệ tôi vào thứ 7 hoặc chủ nhật hàng tuần. Các ngày còn lại tôi đang bận, cảm ơn.",
            created_date: "14/06/2024",
            total_price: null
        },
        {
            id: 2,
            product: {
                id: 2,
                imageUrl: null,
                mounting_type: null,
                model_id: null,
                mounting_size: null
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
            quote_status: { id: 2, name: "Assigned" },
            product_price: null,
            production_price: null,
            profit_rate: null,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Liên hệ tôi vào thứ 7 hoặc chủ nhật hàng tuần. Các ngày còn lại tôi đang bận, cảm ơn.",
            created_date: "14/06/2024",
            total_price: null
        },
        {
            id: 3,
            product: {
                id: 3,
                imageUrl: "https://i.pinimg.com/564x/d8/25/42/d82542be9a667071a8bda04d8e3020fc.jpg",
                mounting_type: { id: 1, name: "Ring", min_size: 4, max_size: 10 },
                model_id: null,
                mounting_size: 8
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
            quote_status: { id: 4, name: "Completed" },
            product_price: 2000000,
            production_price: 500000,
            profit_rate: 0.2,
            saleStaff_id: 2,
            designStaff_id: 2,
            productionStaff_id: 2,
            note: "Liên hệ tôi vào thứ 7 hoặc chủ nhật hàng tuần. Các ngày còn lại tôi đang bận, cảm ơn.",
            created_date: "14/06/2024",
            total_price: (2000000 + 500000) * 1.2
        },
        {
            id: 4,
            product: {
                id: 4,
                imageUrl: "https://i.pinimg.com/736x/fd/aa/ed/fdaaed2628a72ee3b079ccbf1692b87a.jpg",
                mounting_type: { id: 1, name: "Ring", min_size: 4, max_size: 10 },
                model_id: null,
                mounting_size: 8
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
            quote_status: { id: 4, name: "Completed" },
            product_price: 5000000,
            production_price: 200000,
            profit_rate: 0.3,
            saleStaff_id: 3,
            designStaff_id: 3,
            productionStaff_id: 3,
            note: "Liên hệ tôi vào thứ 7 hoặc chủ nhật hàng tuần. Các ngày còn lại tôi đang bận, cảm ơn.",
            created_date: "14/06/2024",
            total_price: (5000000 + 200000) * 1.3
        },
        {
            id: 5,
            product: {
                id: 5,
                imageUrl: null,
                mounting_type: { id: 2, name: "Band", min_size: 4, max_size: 10 },
                model_id: null,
                mounting_size: 8
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
            quote_status: { id: 3, name: "Priced" },
            product_price: null,
            production_price: null,
            profit_rate: null,
            saleStaff_id: null,
            designStaff_id: null,
            productionStaff_id: null,
            note: "Đã được cập nhật giá vào 15/06/2024, đợi để chấp nhận báo giá",
            created_date: "14/06/2024",
            total_price: null
        },
        {
            id: 6,
            product: {
                id: 5,
                imageUrl: null,
                mounting_type: { id: 2, name: "Band", min_size: 4, max_size: 10 },
                model_id: null,
                mounting_size: 8
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
            quote_status: { id: 2, name: "Assigned" },
            product_price: null,
            production_price: null,
            profit_rate: null,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Quote của bạn đã được Assign, vui lòng chờ trong thời gian sớm nhất. Cảm ơn bạn.",
            created_date: "14/06/2024",
            total_price: null
        },
        {
            id: 7,
            product: {
                id: 2,
                imageUrl: null,
                mounting_type: null,
                model_id: null,
                mounting_size: null
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
            quote_status: { id: 2, name: "Assigned" },
            product_price: null,
            production_price: null,
            profit_rate: null,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Liên hệ tôi vào thứ 7 hoặc chủ nhật hàng tuần. Các ngày còn lại tôi đang bận, cảm ơn.",
            created_date: "14/06/2024",
            total_price: null
        },
        {
            id: 8,
            product: {
                id: 5,
                imageUrl: null,
                mounting_type: { id: 2, name: "Band", min_size: 4, max_size: 10 },
                model_id: null,
                mounting_size: 8
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
            quote_status: { id: 5, name: "Declined" },
            product_price: null,
            production_price: null,
            profit_rate: null,
            saleStaff_id: null,
            designStaff_id: null,
            productionStaff_id: null,
            note: "Bạn đã hủy vào ngày 15/06/2024. Cảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi.",
            created_date: "14/06/2024",
            total_price: null
        }
    ]
    const sortOrder = ["Received", "Assigned", "Completed", "Declined"];

    const filterAndSortQuotes = (quotes) => {
        return quotes
            .filter(quote => quote.quote_status.name !== 'Priced')
            .sort((a, b) => sortOrder.indexOf(a.quote_status.name) - sortOrder.indexOf(b.quote_status.name));
    };

    const [quoteList, setQuoteList] = useState(filterAndSortQuotes(initialQuoteList));

    // const handleDecline = (quoteId) => {
    //     const updatedQuoteList = quoteList.map(quote =>
    //         quote.id === quoteId ? { ...quote, quote_status: { ...quote.quote_status, id: 5, name: 'Declined' } } : quote
    //     );

    //     // Cập nhật lại trạng thái của quoteList
    //     setQuoteList(filterAndSortQuotes(updatedQuoteList));
    // };

    const handleDecline = (quoteId) => {
        Swal.fire({
            title: "Are you sure you want to decline this quote?",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, decline it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Xử lý khi người dùng xác nhận
                const updatedQuoteList = quoteList.map(quote =>
                    quote.id === quoteId ? { ...quote, quote_status: { ...quote.quote_status, id: 5, name: 'Declined' } } : quote
                );

                // Cập nhật lại trạng thái của quoteList
                setQuoteList(filterAndSortQuotes(updatedQuoteList));

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "Declined!",
                    text: "The quote has been declined.",
                    icon: "success"
                });
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center mb-2 mt-2">
                <h1 className="font-loraFont text-4xl font-semibold text-[#1151542] mb-2">Your Quote List</h1>
                <div className="w-10/12 h-0.5 bg-[#151542]"></div>
            </div>
            <div className="w-10/12 flex items-center justify-end mb-5">
                <div className="w-64 h-9 flex items-center bg-zinc-200 rounded-lg">
                    <p className="ml-5">Search By ID</p>
                </div>
            </div>
            <div className="w-full">
                <div className="max-h-[675px] overflow-auto">
                    <div className="w-full flex flex-col items-center justify-center">
                        {quoteList.map((quote) => (
                            <QuoteCard key={quote.id} quote={quote} onDeclined={() => handleDecline(quote.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}