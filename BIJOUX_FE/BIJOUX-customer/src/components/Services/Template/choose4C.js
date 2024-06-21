import React from "react";
import { Button, ButtonGroup } from "@mui/material";

export default function choose4C({ optionList, handleChange, stateOption }) {
    return (
        <>
            <ButtonGroup variant="outlined">
                {optionList.map((option) => (
                    <Button className="bg-white font-bold text-cyan-900 focus:bg-cyan-900 focus:text-white">{option.name}</Button>
                ))}
            </ButtonGroup>
        </>
    )
}