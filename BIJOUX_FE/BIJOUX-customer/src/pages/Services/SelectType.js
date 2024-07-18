import React, { useEffect, useState } from "react";
import TypeCard from "../../components/Card/TypeCard";
import { get_mounting_type_list } from "../../api/main/items/Model_api";
import { Box, CircularProgress } from "@mui/material";
import { ring, band, pendant } from "../../assets/images";
export default function SelectType() {
    const [typeList, setTypeList] = useState([]);
    // useEffect(() => {
    //     setTypeList([
    //         { id: 1, name: 'Ring', min_size: '3.0', max_size: '7.0' },
    //         { id: 2, name: 'Pendant', min_size: null, max_size: null },
    //         { id: 3, name: 'Band', min_size: '3.0', max_size: '7.0' }
    //     ])
    // }, [])
    const [open, setOpen] = useState(false);
    const [modelTypes, setModelTypes] = useState("Ring");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const setAttribute = async () => {
            const mountingTypes = await get_mounting_type_list();
            //alert('ok4')
            setModelTypes(mountingTypes.data);
            console.log(mountingTypes)
            setLoading(false)
        }
        setAttribute();
    }, []);

    return (
        <div className="w-full flex flex-col items-center font-gantariFont text-[#151542]">
            <p className="my-5 text-4xl font-loraFont">Select Your Jewelry Type</p>
            <div className="h-0.5 w-3/4 bg-[#151542] mb-5"></div>
            <div className="w-full flex items-center justify-around">
                {loading ?
                    <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                        <CircularProgress color="inherit" />
                    </Box>
                    :
                    modelTypes.map((type) => (
                        <TypeCard
                            type={type}
                            image={
                                (type.id === 1 && ring) ||
                                (type.id === 2 && band) ||
                                (type.id === 3 && pendant)
                            }
                        />
                    ))
                }

            </div>
        </div>
    )
}