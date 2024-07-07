import React from "react";

export default function HeadServices({ scrollToCustomization, scrollToTemplate }) {
    return (
        <>
            <div className="w-full lg:h-96 md:h-full xs:h-96 bg-cover bg-center bg-headServices flex flex-col">
                <div className="flex flex-col m-10 md:items-start xs:items-center">
                    <h1 className="md:text-5xl xs:text-4xl mt-5 font-loraFont font-light text-[#151542] mb-10">Checkout Our Services</h1>
                    <h2 className="md:w-96 text-lg font-medium text-start font-gantariFont text-[#151542]">
                        We offer a seamless jewelry creation service.
                        You can choose jewelry components using our Templates, or provide us with your own ideas through Customization.
                    </h2>
                    <div className="flex justify-around w-96 items-center mt-5">
                        <button onClick={scrollToTemplate} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Template</button>
                        <button onClick={scrollToCustomization} className="bg-[#151542] hover:bg-cyan-900 w-36 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Customization</button>
                    </div>
                </div>
            </div>
        </>
    );
}
