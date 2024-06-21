import React from "react";
import PricedQuoteCard from "../../components/Cart/Quotes/pricedQuoteCard";

export default function ViewPricedQuote() {
    const initialQuoteList = [
        {
            id: 17,
            product: {
                id: 231,
                imageUrl: "",
                mounting_type: { id: 1, name: "Ring" },
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
            product_price: 10000000,
            production_price: 500000,
            profit_rate: 0.4,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
            created_date: "15/06/2024",
            total_price: (10000000 + 500000) * 1.4,
        },
        {
            id: 142,
            product: {
                id: 232,
                imageUrl: "https://i.pinimg.com/736x/f0/56/77/f056772c2e1dc8ca43219539779a73cd.jpg",
                mounting_type: null,
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
            product_price: 10000000,
            production_price: 500000,
            profit_rate: 0.4,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
            created_date: "15/06/2024",
            total_price: (10000000 + 500000) * 1.4,
        },
        {
            id: 21,
            product: {
                id: 233,
                imageUrl: "https://i.pinimg.com/564x/12/c8/a6/12c8a62897324571559d599af41f4cea.jpg",
                mounting_type: { id: 1, name: "Ring" },
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
            product_price: 10000000,
            production_price: 500000,
            profit_rate: 0.4,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
            created_date: "15/06/2024",
            total_price: (10000000 + 500000) * 1.4,
        },
        {
            id: 22,
            product: {
                id: 234,
                imageUrl: "https://i.pinimg.com/564x/78/7f/eb/787feb377825011cfc4357e2e65ec765.jpg",
                mounting_type: { id: 3, name: "Pendant" },
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
            product_price: 10000000,
            production_price: 500000,
            profit_rate: 0.4,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
            created_date: "15/06/2024",
            total_price: (10000000 + 500000) * 1.4,
        },
        {
            id: 412,
            product: {
                id: 235,
                imageUrl: "https://i.pinimg.com/564x/54/1c/b9/541cb95f94362d6b1fa4b39890c41b8d.jpg",
                mounting_type: { id: 1, name: "Ring" },
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
            product_price: 10000000,
            production_price: 500000,
            profit_rate: 0.4,
            saleStaff_id: 1,
            designStaff_id: 1,
            productionStaff_id: 1,
            note: "Đơn hàng đã được báo giá, quý khách vui lòng kiểm tra và xác nhận",
            created_date: "15/06/2024",
            total_price: (10000000 + 500000) * 1.4,
        }
    ]

    const [quoteList, setQuoteList] = React.useState(initialQuoteList);

    const filterAndSortQuotes = (quotes) => {
        return quotes
            .filter(quote => quote.quote_status.name === 'Priced')
    };

    const handleConfirmQuote = (quoteId) => {
        // Call API to confirm quote
        // Update quote status to Confirmed
        // Update quoteList
    }

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center mb-2 mt-2">
                <h1 className="font-loraFont text-4xl font-semibold text-[#1151542] mb-2">Your Priced Quote List</h1>
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
                        {quoteList.map((quote, index) => (
                            <PricedQuoteCard quote={quote} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}