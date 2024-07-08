import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gold, silver, platinum, roseGold } from "../../../assets/images/index";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import numeral from 'numeral';
import { CSpinner } from "@coreui/react";
import Swal from "sweetalert2";
import { get_model_detail } from "../../../api/main/items/Model_api";
import { get_metal_compatibility } from "../../../api/main/items/Metal_api";
import { CircularProgress } from "@mui/material";



//Hàm format tiền
const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

//Hàm tạo ra dãy size từ min, max
function generateRange(min, max) {
    const result = [];
    for (let i = min; i <= max; i += 1.0) {
        result.push(i);
    }
    return result;
}



export default function MountingDetail() {
    // Sử dụng useParams để lấy id từ đường dẫn
    const navigate = useNavigate();
    const index = useParams();
    const [loading, setLoading] = useState(true);
    const [mounting_type, setMountingType] = useState(null);
    const [model, setModel] = useState(null);



    const [mainMetal, setMainMetal] = useState(null); //biến state lưu id của kim loại Main
    const [sideMetal, setSideMetal] = useState(0); //biến state lưu id của kim loại Side
    const [fingerSize, setFingerSize] = useState(null); //biến state lưu Finger Size

    const [checkMountingType, setCheckMountingType] = useState(true); //biến state đóng mở chức năng chọn Finger Size

    const [sideMetalListVisible, setSideMetalListVisible] = useState(false); //biến state đóng mở chức năng chọn Side Metal
    const [mainMetalArray, setMainMetalArray] = useState([]); //lấy mảng model_metal Main
    const [sideMetalArray, setSideMetalArray] = useState([]); //lấy mảng model_metal Side
    const [sizeRange, setSizeRange] = useState([]); //lấy mảng Size


    useEffect(() => {
        const finalProduct = JSON.parse(localStorage.getItem('finalProduct')); //LẤY THÔNG TIN MẪU KHUNG TỪ LOCAL STORAGE
        if (finalProduct) {
            const model_id = index.id;
            if (finalProduct.model.id != model_id) {
                console.log('model_id trong param không kớp với model_id trong finalProduct local storage')
                window.location.href = '/services';
            }


            setFingerSize(finalProduct.mounting_size); //SET FINGER SIZE

            if (finalProduct.metal_2 == null) {
                setSideMetalListVisible(false)
            } else {
                setSideMetalListVisible(true)
            }
        }
        const setAttribute = async () => {
            const mountingType_storage = JSON.stringify(localStorage.getItem('mountingType'));

            if (index && index.id && mountingType_storage) {
                setMountingType(mountingType_storage);
                const model_id = index.id;
                if (!model_id) {
                    console.log('không có model_id')
                    window.location.href = '/services';
                }

                const formData = new FormData();
                formData.append('model_id', model_id);

                //gọi model_detail
                const model_data = await get_model_detail(formData);
                if (!model_data.success) {
                    return systemUpdateAlertMaker();
                }
                const model_detail = model_data.data.model;
                setModel(model_detail);
                setCheckMountingType(model_detail.mounting_type.id === 3 ? false : true)

                const mainMetalList = model_detail.model_metal.filter(metal => metal.is_main);
                const sideMetalList = model_detail.model_metal.filter(metal => !metal.is_main);
                console.log("mainMetalList", mainMetalList);
                console.log("sideMetalList", sideMetalList);
                setMainMetalArray(mainMetalList)

                const sizeRangeGenerate = generateRange(model_detail.mounting_type.min_size, model_detail.mounting_type.max_size)
                setSizeRange(sizeRangeGenerate)
                if (!finalProduct) {
                    // *****************
                    setSideMetalArray(sideMetalList)

                    setMainMetal(sideMetalList.length > 0 ? null : mainMetalList[0].metal); //SET KIM LOẠI MAIN
                    // THÊM ĐIỀU KIỆN
                    if (sideMetalList.length <= 0) {
                        if (mainMetalList.find(metal => metal.metal.id === mainMetalList[0].metal.id) == null) {
                            return systemUpdateAlertMaker();
                        }
                    }

                    setSideMetal(null);

                    setFingerSize(sizeRangeGenerate[0]);

                } else {
                    setMainMetal(finalProduct.metal_1); //SET KIM LOẠI MAIN
                    //THÊM ĐIỀU KIỆN
                    if (mainMetalList.find(metal => metal.metal.id === finalProduct.metal_1.id) == null) {
                        return systemUpdateAlertMaker();
                    }

                    const metal_compatibility = {
                        model_id: model_detail.id,
                        metal_id: finalProduct.metal_1.id
                    }
                    console.log("metal_compatibility", metal_compatibility)
                    const formData = new FormData();
                    formData.append('metal_compatibility', JSON.stringify(metal_compatibility));
                    const compatibility_data = await get_metal_compatibility(formData);
                  
                    if (finalProduct.metal_2 && !compatibility_data.success) {
                        alert()
                        return systemUpdateAlertMaker();
                    }
                    setSideMetalArray(compatibility_data.success ? compatibility_data.data : [])
                    setSideMetal(finalProduct.metal_2); //SET KIM LOẠI SIDE
                    //THÊM ĐIỀU KIỆN
                    if ( finalProduct.metal_2 && compatibility_data.data.find(metal => metal.metal.id === finalProduct.metal_2.id) == null) {
                        return systemUpdateAlertMaker();
                    }
                }


            } else {
                window.location.href = `/template?step=1&mountingType=${mountingType_storage}`;
            }

            setLoading(false)
        }

        setAttribute();
    }, []);

    //Hàm cập nhật id của kim loại Main
    const handleMainMetalChange = (event) => {
        const newMainMetal = event.target.value;

        setMainMetal(JSON.parse(newMainMetal));
        const setCompatibility = async () => {
            if (newMainMetal !== null && sideMetalArray.length > 0) {


                const metal_compatibility = {
                    model_id: model.id,
                    metal_id: JSON.parse(newMainMetal).id
                }
                console.log("metal_compatibility", metal_compatibility)
                const formData = new FormData();
                formData.append('metal_compatibility', JSON.stringify(metal_compatibility));
                const compatibility_data = await get_metal_compatibility(formData);
                if (!compatibility_data.success) {
                    return systemUpdateAlertMaker();
                }
                // *****************
                setSideMetalListVisible(true)

                setSideMetalArray(compatibility_data.success ? compatibility_data.data : [])
                setSideMetal(compatibility_data.data[0].metal);
                //THÊM ĐIỀU KIỆN
                if (compatibility_data.data.find(metal => metal.metal.id === compatibility_data.data[0].metal.id) == null) {
                    return systemUpdateAlertMaker();
                }
            }
            setLoading(false)
        }
        setLoading(true)
        setCompatibility();
    }

    const showAlert = () => {
        Swal.fire({
            title: 'Unable To Proceed',
            text: "Please fill all metal options!",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        })
    };

    //Hàm cập nhật id của kim loại Side
    const handleSideMetalChange = (event) => {
        const newSideMetal = event.target.value;
        console.log("side", newSideMetal)
        console.log("main", mainMetal)
        setSideMetal(JSON.parse((newSideMetal)));

    }

    //Hàm cập nhật Finger Size
    const handleFingerSizeChange = (event) => {
        setFingerSize(event.target.value);
    }


    const handleSelectModel = () => {
        console.log('metal_1', mainMetal)
        console.log('metal_2', sideMetal)
        if (mainMetal == null) {
            console.log('k tim thay main')
            return showAlert();
        }
        if (mainMetalArray.find(metal => metal.metal.id === mainMetal.id) == null) {
            console.log('k tim thay main')
            return showAlert();
        }
        if (sideMetalListVisible) {
            if (sideMetalArray.find(metal => metal.metal.id === sideMetal.id) == null) {
                console.log('k tim thay side')
                return showAlert();
            }
        }
        //alert('ngu')
        let finalModel = JSON.parse(localStorage.getItem('finalProduct'))
        if (finalModel !== null) {
            finalModel.model = model;
            finalModel.mounting_size = fingerSize;
            finalModel.metal_1 = mainMetal;
            finalModel.metal_2 = sideMetal;
        } else {
            if (mainMetal == null || (sideMetalArray.length > 0 && fingerSize == null)) {
                return showAlert();
            }
            finalModel = {
                model: model,
                mounting_size: fingerSize,
                metal_1: mainMetal,
                metal_2: sideMetal
            }

        }

        localStorage.setItem('finalProduct', JSON.stringify(finalModel));
        //alert(model.mounting_type.id+ '   ' + model.id)
        window.location.href = '/template?step=2&mountingType=' + model.mounting_type.id + '&model_id=' + model.id; //CHUYỂN HƯỚNG SANG TRANG CHỌN KIM CƯƠNG
    }

    const systemUpdateAlertMaker = () => {
        Swal.fire({
            title: "Our System Has Been Updated",
            text: "Please re-customize your product to get the latest category. Sorry about the inconvenience!",
            icon: 'info',
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Got It',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/services';
            }
        })
    };


    return (
        <div className="flex flex-col items-center mb-20">
            <h1 className="md:text-3xl xs:text-xl mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Mounting Detail</h1>
            <p className="text-light mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Select the detailed specifications for your mounting model.</p>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <>
                    <div className="grid grid-cols-2 gap-5 w-full h-auto">
                        <div className="w-full flex items-center justify-center">
                            <img
                                className="w-3/4 h-auto object-cover border border-gray-900 shadow-lg"
                                alt={model.name}
                                src={model.imageUrl}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <p className="w-1/2 text-3xl font-loraFont font-medium text-[#151542]">{model.name}</p>
                            <div className="w-3/4 h-0.5 bg-slate-300 mt-5 mb-5"></div>

                            {checkMountingType && (
                                <>
                                    <p className="font-loraFont font-medium text-[#151542]">Select Finger Size</p>
                                    <FormControl className="w-1/3">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={fingerSize}
                                            label="Size"
                                            onChange={handleFingerSizeChange}
                                        >
                                            {
                                                fingerSize == null &&
                                                <MenuItem value={null}>
                                                    NO VALUE
                                                </MenuItem>
                                            }
                                            {sizeRange.map((size) => (

                                                <MenuItem value={size}>
                                                    {size}.0
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </>
                            )
                            }
                            <p className="font-loraFont mt-5 font-medium text-[#151542]">Select Main Metal</p>
                            <FormControl className="w-1/3">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={JSON.stringify(mainMetal)}
                                    label="Age"
                                    onChange={handleMainMetalChange}
                                >
                                    {
                                        mainMetal == null &&
                                        <MenuItem value={null}>
                                            Select Main Metal
                                        </MenuItem>
                                    }
                                    {mainMetalArray.map((item) => {
                                        //console.log("itemmmmmmmmmmmmmmmmmmmmmm", item.metal.name)
                                        return (

                                            <MenuItem key={item.metal.id} value={JSON.stringify(item.metal)}>
                                                <img
                                                    className="w-10 h-auto inline-block mr-1 align-middle"

                                                    src={item.metal.imageUrl}
                                                />
                                                {item.metal.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>


                            {sideMetalListVisible && (
                                <>
                                    <p className="font-loraFont mt-5 font-medium text-[#151542]" visible="false">Select Side Metal</p>
                                    <FormControl className="w-1/3">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={JSON.stringify(sideMetal)}
                                            label="Age"
                                            onChange={handleSideMetalChange}
                                        >
                                            {sideMetalArray.map((item) => {
                                                //console.log("itemmmmmmmmmmmmmmmmmmmmmm", item.metal.imageUrl)
                                                return (

                                                    <MenuItem key={item.metal.id} value={JSON.stringify(item.metal)}>
                                                        <img
                                                            className="w-10 h-auto inline-block mr-1 align-middle"

                                                            src={item.metal.imageUrl}
                                                        />
                                                        {item.metal.name}
                                                    </MenuItem>
                                                )
                                            }
                                            )}
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            <div className="w-3/4 flex justify-center mt-5">
                                <button onClick={() => handleSelectModel()} className="text-white h-12 rounded-lg pl-5 pr-5 text-medium bg-[#151542] hover:bg-cyan-900">Select This Mounting</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mt-10 mb-10">
                        <div className="w-3/4 h-0.5 bg-slate-400"></div>
                    </div>


                    <div className="w-3/4 mb-2">
                        <div >
                            <p className="text-[#151542] font-loraFont font-medium">- Available Diamond Shapes: </p>
                        </div>
                        <div className="flex grid grid-cols-6 mt-5">
                            {model.model_diamond_shape.map((shape) => (
                                <div className="flex flex-col items-center justify-center w-1/4 mb-5 hover:cursor-pointer">
                                    <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 align-middle">
                                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                                    </svg>
                                    <p className="text-[#151542] hover:font-semibold font-loraFont font-medium">{shape.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="  w-3/4 mb-5">
                        <div className="flex items-center">
                            <p className="text-[#151542] font-loraFont font-medium">- Mounting Size: {model.base_width}(mm) x {model.base_height}(mm) </p>
                            <p className="ml-2 mt-px text-gray-400 text-sm">(width x height)</p>
                        </div>

                    </div>
                </>
            }




        </div>
    );
}