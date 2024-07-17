import React from "react";
import { Button } from "@mui/material"

export default function TypeCard({ type, image }) {
    return (
        <div className="flex flex-col items-center border-1 border-gray-300 rounded-md">
            <div className="w-[500px] h-[400px] flex items-center justify-center">
                <img src={image} alt={type.name} className="w-[350px] h-[350px] rounded-full object-cover" />
            </div>
            <p className="font-gantariFont text-2xl font-semibold text-[#151542]">{type.name}</p>
            <p className="text-sm text-justify mb-2">Ready to make your own {type.name} for yourself ? Try now !</p>
            <Button sx={{ marginBottom: '20px', color: '#151542', borderColor: '#151542' }} variant="outlined" >Select</Button>
        </div>
    )
}