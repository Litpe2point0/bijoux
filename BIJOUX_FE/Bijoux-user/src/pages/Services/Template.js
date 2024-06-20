import React, { useEffect } from "react";
import ProgressBar from "../../components/Services/Template/progressBar";
import { useState } from 'react';
import ChooseDiamond from "./TemplateStep/ChooseDiamond";
import ChooseMounting from "./TemplateStep/ChooseMounting";
import CompleteJewelry from "./TemplateStep/CompleteJewelry";
import { useLocation } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { CgSpinner } from "react-icons/cg";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Template() {

    const query = useQuery();
    const [loading, setLoading] = useState(false);
    const [progressState, setProgressState] = useState(null);

    const [mountingType, setMountingType] = query.get("mountingType");
    useEffect(() => {
        const mountingTypeQuery = query.get("mountingType");
        const step = query.get("step");
        if (!mountingTypeQuery) {
            window.location.href = "/services";
        }
        setMountingType(query.get("mountingType"));
        localStorage.setItem("mountingType", query.get("mountingType"));
        setProgressState(step ? parseInt(step) : 1);
        setLoading(true)
    }, [])


    return (
        <div>
            {loading ? <CgSpinner color='primary' />
                :
                <>
                    <ProgressBar progressState={progressState} />
                    {progressState === 1 && <ChooseMounting mountingType={mountingType} />}
                    {progressState === 2 && <ChooseDiamond />}
                    {progressState === 3 && <CompleteJewelry />}
                </>
            }

        </div>
    );
}