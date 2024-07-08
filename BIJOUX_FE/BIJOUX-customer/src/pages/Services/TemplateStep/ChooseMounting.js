import React, { useState, useEffect } from "react";
import FilterToggleButton from "../../../components/Services/Template/filterToggleButton";
import ModelCard from "../../../components/Services/Template/modelCard";
import { styleHalo, styleAccented, styleSolitaire, styleThreeStone, gold, silver, roseGold, platinum } from "../../../assets/images/index";
import { useLocation } from "react-router-dom";
import { CSpinner } from "@coreui/react";
import { get_model_list, get_mounting_style_list, get_mounting_type_list } from "../../../api/main/items/Model_api";
import { get_shape_list } from "../../../api/main/items/Diamond_api";
import { get_metal_list } from "../../../api/main/items/Metal_api";
import { Box, CircularProgress } from "@mui/material";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function toLowerCase_String(str) {
    const new_str = '' + str;
    return new_str.toLowerCase();

}

export default function ChooseMounting() {
    const query = useQuery();
    const [filterModels, setFilterModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingModel, setLoadingModel] = useState(false);

    const [mounting_style_options, setMountingStyleOptions] = useState([]);
    const [shape_list_options, setShapeListOptions] = useState([]);
    const [metal_list_options, setMetalListOptions] = useState([]);

    const [mounting_type, setMountingType] = useState(null);
    const [mounting_style, setMountingStyle] = useState([]);
    const [diamond_shape, setDiamondShape] = useState([]);
    const [metal, setMetal] = useState([]);

    const setFilter = async () => {
        const model_search_information = {
            mounting_type_id: mounting_type.id,
            mounting_style: mounting_style,
            diamond_shape: diamond_shape,
            metal: metal
        }
        console.log('model_search_information: ', model_search_information)
        const formData = new FormData();
        formData.append("model_search_information", JSON.stringify(model_search_information));
        //gọi để search
        const filter_model = await get_model_list(formData);
        setFilterModels(filter_model.data.model_available);

        setLoadingModel(false)
    }
    useEffect(() => {
        setLoadingModel(true)
        if (mounting_type) {
            setFilter()
        }

    }, [mounting_type, setMountingType, mounting_style, diamond_shape, metal]);


    const updateMountingStyle = (id) => {
        //console.log("SEARCH MOUNTING STYLE ID: ",id)
        setMountingStyle((prev) => {
            if (prev.includes(id)) {
                return prev.filter((styleId) => styleId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const updateDiamondShape = (id) => {
        //console.log("SEARCH SHAPE ID: ",id)
        setDiamondShape((prev) => {
            if (prev.includes(id)) {
                return prev.filter((styleId) => styleId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const updateMetal = (id) => {
        //console.log("SEARCH METAL ID: ",id)
        setMetal((prev) => {
            if (prev.includes(id)) {
                return prev.filter((styleId) => styleId !== id);
            } else {
                return [...prev, id];
            }
        });
    };




    useEffect(() => {
        const setAttribute = async () => {
            const mountingType = query.get("mountingType");

            if (mountingType) {
                const mounting_type_list = await get_mounting_type_list();
                setMountingType(mounting_type_list.data.filter(item => item.id == parseInt(mountingType))[0]);

            } else {
                console.log('không có mountingType trong query')
                window.location.href = "/services";
            }
            const mounting_style_list = await get_mounting_style_list();
            const diamond_shape_list = await get_shape_list();
            const metal_list = await get_metal_list();
            setMountingStyleOptions(mounting_style_list.data);
            setShapeListOptions(diamond_shape_list.data);
            setMetalListOptions(metal_list.data);
            setLoading(false)
        }

        setAttribute()
    }, [])

    // useEffect(() => {
    //     setModelSearchInformation(prevState => ({
    //         ...prevState,
    //         mounting_type_id: mounting_type,
    //         mounting_style: mounting_style,
    //         diamond_shape: diamond_shape,
    //         metal: metal
    //     }));


    //     const formData = new FormData();
    //     formData.append("model_search_information", modelSearchInformation); // gọi
    //     setFilterModels(filterModels_data);
    // }, [mounting_type, mounting_style, diamond_shape, metal]);



    return (

        <div className="flex flex-col items-center m-20">


            {loading ?
                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                    <CircularProgress color="inherit"/>
                </Box>
                :
                <>
                    <p className="text-3xl text-[#151542] font-loraFont font-medium">{mounting_type.name} Model Settings Selection</p>
                    <p className="text-sm md:w-1/3 xs:h-1/5 text-center text-[#151542] font-gantariFont font-medium">Search hundreds of {toLowerCase_String(mounting_type.name)} settings to find the perfect ring. Styles range from solitaire to vintage-inspired to everything in between, now including settings designed for Men’s Engagement. Start designing your own custom {toLowerCase_String(mounting_type.name)} with handcrafted {toLowerCase_String(mounting_type.name)} settings built to last a lifetime.</p>
                    <div className="w-full flex md:items-start xs:items-center m-5">
                        <FilterToggleButton
                            list={mounting_style}
                            filterName="Style"
                            options={mounting_style_options}
                            updateList={updateMountingStyle}
                        />
                        <FilterToggleButton
                            list={diamond_shape}
                            filterName="Shape"
                            options={shape_list_options}
                            updateList={updateDiamondShape}
                        />
                        <FilterToggleButton
                            list={metal}
                            filterName="Metal"
                            options={metal_list_options}
                            updateList={updateMetal}
                        />
                    </div>

                    <div className="h-px bg-slate-600 w-full">
                    </div>


                    {loadingModel ?
                        <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                            <CircularProgress color="inherit" />
                        </Box>
                        :
                        <div className="w-full grid md:grid-cols-4 xs:grid-cols-2 gap-32 mt-5">
                            {filterModels.map((model, index) => (
                                <ModelCard
                                    model={model}
                                />
                            ))}
                        </div>

                    }


                </>

            }

        </div>
    );
}