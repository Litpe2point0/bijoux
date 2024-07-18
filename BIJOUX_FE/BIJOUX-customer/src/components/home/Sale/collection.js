import React from "react";

export default function Collection() {
    const handleAbout = () => {
        window.location.href = "/about";
    }

    return (
        <div className="flex w-full items-center mt-10 flex-col">
            <p className="font-loraFont text-5xl text-[#151542]">Heart of the Sea</p>
            <p className="font-gantariFont text-lg text-[#151542] mb-5">Experience the collection inspired by the deep sea, an eternal beauty of nature.</p>
            <div className="grid grid-cols-12 gap-7 w-full px-10">
                <div className="col-span-5 grid grid-rows-2 gap-5">
                    <div className="flex w-full justify-end items-center">
                        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="h-[300px] mr-10 object-cover" />
                    </div>
                    <div className="flex w-full justify-end items-center">
                        <img src="https://images.unsplash.com/photo-1654700005435-8af6c06f3716?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="h-[300px] mr-10 object-cover" />
                    </div>
                </div>

                <div className="col-span-7">
                    <img src="https://images.unsplash.com/photo-1625844225439-aad9a72213ae?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="w-[780px] h-[620px] ml-5 object-cover" />
                </div>
            </div>

            <div className="my-10 h-0.5 w-10/12 bg-[#151542]"></div>

            <div className="grid grid-cols-12">
                <div className="col-span-4 flex flex-col items-start justify-center mx-16 p-5">
                    <p className="font-loraFont text-3xl text-[#151542]">Handcrafted In Viet Nam</p>
                    <p className="font-gantariFont text-sm text-[#151542] text-start">Our highly skilled artisans exceed industry standards with sparkling GIA-graded natural diamonds, the finest-quality materials and outstanding engagement ring design at an amazing value.</p>
                    <button onClick={() => handleAbout()} className="text-gantariFont w-[226px] h-[40px] bg-[#151542] text-white font-semibold mt-2 rounded-sm hover:bg-cyan-900">About Bijoux Jewelry</button>
                </div>
                <div className="col-span-8 p-5">
                    <img src="https://media.timeout.com/images/103706501/image.jpg" />
                </div>
            </div>
        </div>
    );
}
{/* <div className="col-span-5 grid grid-rows-2 gap-5">
<div className="flex w-full justify-center items-center">
    <img src="https://i.pinimg.com/564x/49/d8/0e/49d80ed998feda7cae4c1d65f79d5840.jpg" alt="" className="w-[300px] h-[300px] object-cover" />
</div>
<div className="fle w-full justify-center items-center">
    <img src="https://i.pinimg.com/564x/ee/1e/d2/ee1ed23859ad7965352a4e2e90c802ab.jpg" alt="" className="w-[300px] h-[300px] object-cover" />
</div>
</div>
<div className="col-span-7">
<img src="https://i.pinimg.com/564x/f2/bf/c0/f2bfc0d9f3ee60c41e855a0497004f85.jpg" alt="" className="w-full h-[620px] object-cover" />
</div> */}