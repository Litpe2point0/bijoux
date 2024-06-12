import React from "react";
import ProgressBar from "../../components/Services/Template/progressBar";
import { useState } from 'react';
import ChooseDiamond from "./TemplateStep/ChooseDiamond";
import ChooseMounting from "./TemplateStep/ChooseMounting";
import CompleteJewelry from "./TemplateStep/CompleteJewelry";
import { useLocation } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Template() {

    const query = useQuery();
    const mountingType = query.get("mountingType");

    const [progressState, setProgressState] = useState(query.get("step") ? parseInt(query.get("step")) : 1);

    return (
        <div>
            <ProgressBar progressState={progressState} />
            {progressState === 1 && <ChooseMounting mountingType={mountingType} />}
            {progressState === 2 && <ChooseDiamond />}
            {progressState === 3 && <CompleteJewelry />}
        </div>
    );
}