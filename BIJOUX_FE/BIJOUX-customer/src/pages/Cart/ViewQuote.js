import React, { useEffect, useState } from "react";
import QuoteCard from "../../components/Cart/Quotes/quoteCard";
import Swal from 'sweetalert2';
import { getUserFromPersist, instantAlertMaker } from "../../api/instance/axiosInstance";
import { cancel_quote, get_quote_list_customer } from "../../api/main/orders/Quote_api";
import { get_staff_list } from "../../api/main/accounts/Account_api";


export default function ViewQuote() {


    // const sortOrder = ["Received", "Assigned", "Priced", "Completed", "Declined"];

    // const sortQuotes = (quotes) => {
    //     return quotes
    //         .sort((a, b) => sortOrder.indexOf(a.quote_status.name) - sortOrder.indexOf(b.quote_status.name));
    // };

    const [quoteList, setQuoteList] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const handleDataChange = async () => {
        const response = await get_quote_list_customer(null, "Get quote list", true);

        if (response.success) {
            setQuoteList(response.data);
        } else {
            instantAlertMaker("error", "Error", response.mess);
        }
        const staff_list = await get_staff_list(null, "Get staff list", true);
        setStaffList(staff_list.data);
    }

    useEffect(() => {
        //setQuoteList(sortQuotes(initialQuoteList_data));
        handleDataChange();
    }, []);

    const handleCancel = async (quoteId) => {
        Swal.fire({
            title: "Are you sure you want to cancel this quote?",
            text: "You won't be able to revert this! If you have any problem, please contact us at: +84 099 009",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {


                // const updatedQuoteList = quoteList.map(quote =>
                //     quote.id === quoteId ? { ...quote, quote_status: { ...quote.quote_status, id: 5, name: 'Declined' } } : quote
                // );

                // // Cập nhật lại trạng thái của quoteList
                // setQuoteList(sortQuotes(updatedQuoteList));

                const cancel = {
                    quote_id: quoteId,
                    note: null
                }
                const formData = new FormData();
                formData.append("cancel", JSON.stringify(cancel));
                const response = await cancel_quote(formData, "Cancel quote", true);
                if (!response.success) {
                    instantAlertMaker("error", "Error", "The quote has not been canceled. Please try again !");
                    return;
                }
                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "Success",
                    text: "The quote has been canceled.",
                    icon: "success"
                });
                handleDataChange();
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
                <div>
                    <div className="w-full flex flex-col items-center justify-center">
                        {quoteList.map((quote) => (
                            <QuoteCard key={quote.id} quote={quote} staffList={staffList} onCancel={() => handleCancel(quote.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}