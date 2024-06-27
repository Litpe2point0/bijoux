import React from "react";
import { MdDone } from "react-icons/md";
export default function ThanksPage() {


    const handleNavigate = () => {
        window.location.href = "/cart/order";
    }


    return (
        <div className="flex flex-col items-center">
            <div className="p-4 bg-green-800 rounded-full">
                <MdDone size={80} color="white" />
            </div>
            <div className="flex flex-col justify-center items-center">
                <p className="font-bold text-4xl font-gantariFont text-[#151542]">All Done!</p>
            </div>
            <div className="w-1/3 text-center">
                <p className="font-gantariFont">Your jewelry selection has been recorded. Please proceed to your cart to make a deposit. The crafting of your jewelry will commence as soon as the deposit is received. Thank you for choosing Bijoux. For any inquiries, please contact our hotline at <span className="font-gantariFont text-blue-500 font-semibold">+84 077 7777.</span></p>
            </div>

            <button onClick={() => handleNavigate()} className="w-[180px] h-[40px] bg-blue-900 text-white font-semibold mt-5 hover:bg-cyan-800">
                GO TO CART
            </button>
        </div>
    );
}