import React from "react";
import { Button } from "@mui/material"

export default function TypeCard({ type, image }) {

    const handleNavigate = (id) => {
        localStorage.removeItem("mountingType");
        localStorage.removeItem("finalProduct");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("nextStep");
        window.location.href = `/template?step=1&mountingType=${id}`;
    }
    return (
        <div className="flex flex-col items-center border-1 border-gray-300 rounded-md">
            <div className="w-full flex items-center justify-center">
                <img src={image} alt={type.name} className="w-[350px] h-[350px] rounded-full object-cover" />
            </div>
            <p className="font-gantariFont text-2xl font-semibold text-[#151542]">{type.name}</p>
            <p className="text-sm text-justify mb-2">Ready to make your own {type.name} for yourself ? Try now !</p>
            <Button sx={{ marginBottom: '20px', color: '#151542', borderColor: '#151542' }} variant="outlined" onClick={() => handleNavigate(type.id)} >Custom Now</Button>
        </div>
    )
}