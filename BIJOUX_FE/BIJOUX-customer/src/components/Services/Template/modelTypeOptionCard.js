import React from "react";

export default function ModelTypeOptionCard({ modelType, modelTypeImage }) {
    return (
        <div className="w-auto flex flex-col items-center h-auto overflow-hidden shadow-lg hover:bg-slate-100">
            <img
                src={modelTypeImage}
                alt="Ảnh"
                className="w-[172px] h-[172px]"
            />
            <h1 className="text-xl font-semibold mt-4 mb-2">{modelType.name}</h1>

            <a href={'/template?step=1&mountingType=' + modelType.id}
                class="
                mb-2
                        text-white 
                        bg-[#151542] 
                        hover:bg-cyan-900 
                        focus:ring-4 
                        focus:ring-blue-300 
                        font-medium 
                        rounded-sm 
                        text-sm px-5 py-2.5 
                        dark:bg-blue-600 
                        dark:hover:bg-blue-700 
                        focus:outline-none 
                        dark:focus:ring-blue-800"

            >
                Choose
            </a>

        </div>
    );
}