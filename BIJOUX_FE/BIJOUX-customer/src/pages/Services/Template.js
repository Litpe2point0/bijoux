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
const mountingTypes = [
    {
        id: 1,
        name: "Ring",
    },
    {
        id: 2,
        name: "Band",
    },
    {
        id: 3,
        name: "Pendant",
    },
];
export default function Template() {

    const query = useQuery();
    const [loading, setLoading] = useState(true);
    const [progressState, setProgressState] = useState(null);




    useEffect(() => {
        const setAttribute = async () => {

            const model_id = query.get("model_id");
            const finalProduct_storage = JSON.parse(localStorage.getItem("finalProduct"));

            if (model_id && !isNaN(parseInt(model_id)) && finalProduct_storage && finalProduct_storage.model.id != parseInt(model_id)) {
                console.log('có model_id trong query và  model_id không bằng model_id của finalProduct trong local storage')
                alert('ok')
                window.location.href = "/services";
            }

            const mountingTypeQuery = query.get("mountingType");
            if (!mountingTypeQuery || isNaN(parseInt(mountingTypeQuery))) {
                console.log('không có mounting trong query hoặc nó không phải là số')
                alert('ok')
                window.location.href = "/services";
            }
            //gọi lấy mounting_type để filterr

            const mountingType = mountingTypes.filter(item => item.id == parseInt(mountingTypeQuery))[0];
            const mountingType_storage = JSON.parse(localStorage.getItem("mountingType"));

            if (mountingType == null || (mountingType_storage && mountingType_storage.id != mountingType.id)) {
                console.log('không thể tìm thấy mountingType(' + mountingTypeQuery + ') trong data hoặc không khớp với mountingType trong local storage')
                alert('ok')
                window.location.href = "/services";
            }
            localStorage.setItem("mountingType", JSON.stringify(mountingType));

            const step = query.get("step");
            const nextStep_storage = localStorage.getItem("nextStep");
            if (step && !isNaN(parseInt(step))) {
                if ((step > 3 || step < 1) || (nextStep_storage && nextStep_storage < parseInt(step))) {
                    console.log('step(' + step + ') không hợp lệ hoặc nhỏ hơn nextStep trong local storage')
                    alert('ok')
                    window.location.href = "/services";
                }
                setProgressState(parseInt(step));
                localStorage.setItem("currentStep", parseInt(step));
                localStorage.setItem("nextStep", parseInt(step) + 1);
            } else if (step && isNaN(parseInt(step))) {
                console.log('step(' + step + ') không null nhưng không phải số')
                alert('ok')
                window.location.href = "/services";
            } else {
                setProgressState(1);
            }

            setLoading(false)
        }


        setAttribute();
    }, [])


    return (
        <div>
            {loading ? <CgSpinner color='primary' />
                :
                <>
                    <ProgressBar progressState={progressState} />
                    {progressState === 1 && <ChooseMounting />}
                    {progressState === 2 && <ChooseDiamond />}
                    {progressState === 3 && <CompleteJewelry />}
                </>
            }

        </div>
    );
}