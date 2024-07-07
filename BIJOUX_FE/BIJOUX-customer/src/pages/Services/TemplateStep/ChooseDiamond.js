import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { gold, silver, platinum, roseGold } from "../../../assets/images/index";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { diamondImg } from "../../../assets/images/index";
import choose4C from "../../../components/Services/Template/choose4C";
import { demoFinalMain } from "../../../assets/images/index";
import { CSpinner } from "@coreui/react";
import Swal from "sweetalert2";
import { get_clarity_list, get_color_list, get_cut_list, get_diamond_list, get_origin_list, get_shape_list } from "../../../api/main/items/Diamond_api";
import { get_model_detail } from "../../../api/main/items/Model_api";
import numeral from 'numeral';
import { Box, CircularProgress } from "@mui/material";


const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export default function ChooseDiamond() {
    const query = useQuery();

    const navigate = useNavigate();
    //const finalProduct = localStorage.getItem('finalProduct');
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDiamond, setLoadingDiamond] = useState(false);


    const [originList, setOriginList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [clarityList, setClarityList] = useState([]);
    const [cutList, setCutList] = useState([]);
    const [sizeList, setSizeList] = useState([]);

    const [selectedShape, setSelectedShape] = useState(null);
    const [diamond_size, setDiamond_size] = useState(null);

    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedClarity, setSelectedClarity] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedCut, setSelectedCut] = useState(null);

    const [diamondImage, setDiamondImage] = useState(null);

    const [checkOpenEdit, setCheckOpenEdit] = useState(false);

    const [searchedDiamond, setSearchedDiamond] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        const setAttribute = async () => {


            const finalProduct = JSON.parse(localStorage.getItem('finalProduct'));
            const mountingType = JSON.parse(localStorage.getItem('mountingType'));
            const mountingTypeQuery = parseInt(query.get("mountingType"));
            if (finalProduct) {
                const model_id = query.get("model_id");
                if (finalProduct)
                    if ((!finalProduct.model || !model_id) && mountingType && mountingTypeQuery && mountingTypeQuery === mountingType.id) {

                        window.location.href = '/template?step=1&mountingType=' + mountingType.id

                    } else if (finalProduct.model && model_id && (!mountingType || !mountingTypeQuery || mountingTypeQuery !== mountingType.id)) {
                        navigate(`/mounting-detail/${finalProduct.model.id}`);
                    } else if (!finalProduct.model && !model_id && !mountingType && !mountingTypeQuery && mountingTypeQuery !== mountingType.id) {
                        console.log('không có finalProduct.model và không có model_id trong query và không có mountingType trong localStorage và không có mountingTypeQuery trong query')
                        window.location.href = '/services'
                    } else if (finalProduct.model.id != model_id) {
                        console.log('model của finalProduct không bằng model_id trong query')
                        window.location.href = '/services'
                    }
                const formData = new FormData();
                formData.append('model_id', model_id);
                //goi api lay model detail
                const model_data = await get_model_detail(formData);
                const model_detail = model_data.data.model;
                setModel(model_detail)


                const shape_list = await get_shape_list();
                const color_list = await get_color_list();
                const origin_list = await get_origin_list();
                const clarity_list = await get_clarity_list();
                const cut_list = await get_cut_list();

                setOriginList(origin_list.data);
                setColorList(color_list.data);
                setClarityList(clarity_list.data);
                setCutList(cut_list.data);

                const size_list_data = model_detail.model_diamond.filter(diamond => diamond.is_editable == 1)[0].size_list
                //console.log('size_list_data', size_list_data)
                setSizeList(size_list_data);

                setSelectedShape(finalProduct.diamond_shape || model_detail.model_diamond_shape[0]);

                setDiamond_size(finalProduct.diamond_size || size_list_data[0]);
                setSelectedOrigin(finalProduct.diamond_origin || origin_list.data[0]);
                setSelectedClarity(finalProduct.diamond_clarity || clarity_list.data[0]);
                setSelectedColor(finalProduct.diamond_color || color_list.data[0]);
                setSelectedCut(finalProduct.diamond_cut || cut_list.data[0]);
                setSearchedDiamond(finalProduct.diamond_search || null);
                //setDiamondImage(finalProduct.diamond_imageUrl || diamondImg);
                if (finalProduct.diamond_search) {
                    setCheckOpenEdit(true);
                    setIsSearch(true);
                }
                console.log("Final Product", finalProduct)





                setLoading(false)
            } else {
                console.log('không có finalProduct trong local storage')
                window.location.href = '/services'
            }
        }
        setAttribute()
    }, []);

    const handleOpenEdit = () => {
        setCheckOpenEdit(true);
    };

    const handleDiamondOriginChange = (event) => {
        const originUpdate = event.target.value;
        setSelectedOrigin(JSON.parse(originUpdate));
        setIsSearch(false);
    }
    const handleDiamondCutChange = (event) => {
        const cutUpdate = event.target.value;
        setSelectedCut(JSON.parse(cutUpdate));
        setIsSearch(false);
    }
    const handleDiamondColorChange = (event) => {
        const colorUpdate = event.target.value;
        setSelectedColor(JSON.parse(colorUpdate));
        setIsSearch(false);
    }
    const handleDiamondClarityChange = (event) => {
        const clarityUpdate = event.target.value;
        setSelectedClarity(JSON.parse(clarityUpdate));
        setIsSearch(false);
    }

    const handleDiamondSizeChange = (event) => {
        const sizeUpdate = event.target.value;
        setDiamond_size(sizeUpdate);
        setIsSearch(false);
    }

    const handleShapeChange = (shape) => {
        const newShape = shape;
        setSelectedShape(newShape);
        setIsSearch(false);
    }

    const handleGenerateDiamond = async () => {
        setLoadingDiamond(true);
        const diamond_search_information = {
            size: diamond_size,
            diamond_color_id: selectedColor.id,
            diamond_origin_id: selectedOrigin.id,
            diamond_clarity_id: selectedClarity.id,
            diamond_cut_id: selectedCut.id,
        }
        const formData = new FormData();
        formData.append('diamond_search_information', JSON.stringify(diamond_search_information));
        //goi api lay diamond

        const diamond_data = await get_diamond_list(formData);
        if (diamond_data.success) {
            const newDiamond = diamond_data.data[0];

            setSearchedDiamond(newDiamond)
            setDiamondImage(newDiamond.imageUrl);
            setIsSearch(true);
        } else {
            setSearchedDiamond(null)
            setDiamondImage(null);
            setIsSearch(false);
        }

        setLoadingDiamond(false);
    }
    const showAlert = () => {
        Swal.fire({
            title: 'Unable To Proceed',
            text: "Please search for a specific diamond!",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        })
    };
    const handleSelectDiamond = () => {
        if (!isSearch) {
            return showAlert();
        }

        let finalProduct = JSON.parse(localStorage.getItem('finalProduct'));
        if (!finalProduct || !searchedDiamond) {
            console.log('không có finalProduct trong local storage hoặc có finalProduct mà không có diamond_search ở bước submit diamond')
            window.location.href = '/services'
        }
        finalProduct.diamond_shape = selectedShape;
        finalProduct.diamond_size = diamond_size;
        finalProduct.diamond_origin = selectedOrigin;
        finalProduct.diamond_clarity = selectedClarity;
        finalProduct.diamond_color = selectedColor;
        finalProduct.diamond_cut = selectedCut;
        finalProduct.diamond_search = searchedDiamond;
        localStorage.setItem('finalProduct', JSON.stringify(finalProduct));

        window.location.href = '/template?step=3&mountingType=' + model.mounting_type.id + '&model_id=' + model.id
    }

    useEffect(() => {
        if (!isSearch) {
            setSearchedDiamond(null)
        }
    }, [isSearch])

    return (
        <div className="flex flex-col items-center" >
            {/* <h1 className="md:text-3xl xs:text-xl mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Diamond Details</h1>
            <p className="text-light mt-5 mb-5 font-semibold font-loraFont text-[#151542]">Choose detailed informations for your diamond</p> */}
            <p className="text-2xl text-[#151542] font-loraFont font-medium">Choose A Diamond</p>
            <p className="text-xs md:w-1/3 xs:h-1/5 text-center text-[#151542] font-gantariFont font-medium">Search hundreds of settings to find the perfect ring. Styles range from solitaire to vintage-inspired to everything in between, now including settings designed for Men’s Engagement. Start designing your own custom  with handcrafted  settings built to last a lifetime.</p>
            {loading ?
                <Box sx={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                    <CircularProgress color="inherit" />
                </Box>
                :
                <>
                    <div className="w-full grid grid-cols-2 ">
                        <div className="flex flex-col justify-center ml-10">
                            {model.model_diamond.map((diamond, index) => (
                                <div className="w-full items-center h-14 bg-gray-200 mb-5 rounded-sm flex relative">
                                    <div className="w-2/3">
                                        <p className="text-[#151542] text-base font-semibold ml-5">Diamond {index + 1}</p>
                                        <div className="flex w-full grid-cols-3 gap-2 ml-5 text-xs">
                                            <div className="w-1/3">
                                                <p >Diamond Size: {diamond.diamond_size_max === diamond.diamond_size_min ? diamond.diamond_size_min : diamond_size} (mm)</p>
                                            </div >
                                            <div className="w-1/3">
                                                <p >Diamond Count: {diamond.count}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p>Diamond Shape: {diamond.is_editable == 1 ? selectedShape.name : diamond.diamond_shape.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {diamond.is_editable == 1 && (
                                        <div className="flex w-[63px] justify-center items-center">
                                            <button onClick={handleOpenEdit} className="text-cyan-500 font-bold absolute right-5 hover:text-cyan-900">Edit</button>
                                        </div>
                                    )}
                                </div>

                            )
                            )}
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="w-[200px]">
                                <img src={model.imageUrl} alt="diamond" className="w-full" />
                            </div>
                        </div>

                    </div>
                    <div className="h-0.5 w-10/12 bg-slate-400 mb-5"></div>
                    {checkOpenEdit && (
                        <>
                            <div className="w-11/12 grid grid-cols-2 gap-5 mb-10">
                                <div>
                                    {/* Chọn shape: */}
                                    <div className="mb-6">
                                        <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Shapes</p>
                                        <div className="grid grid-cols-4">
                                            {model.model_diamond_shape.map((shape, index) => (
                                                <div id={index} onClick={() => handleShapeChange(shape)}
                                                    className={
                                                        "w-16 h-16 flex flex-col items-center justify-center hover:border border-black focus:outline-none focus:ring focus:ring-violet-300" +
                                                        (selectedShape.id === shape.id ? " border-2 border-black rounded-lg" : "")
                                                    }
                                                >
                                                    <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 align-middle">
                                                        <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={shape.drawing_path} />
                                                    </svg>
                                                    <p className="text-[#151542] hover:font-semibold font-loraFont text-sm font-medium">{shape.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Chọn Origin */}
                                        <div>
                                            <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Origin</p>
                                            <FormControl>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={JSON.stringify(selectedOrigin)}
                                                    label="Age"
                                                    onChange={handleDiamondOriginChange}
                                                >
                                                    {originList.map((origin) => (

                                                        <MenuItem key={origin.id} value={JSON.stringify(origin)}>
                                                            {origin.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        {/* Chọn Cut */}
                                        <div >
                                            <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Cut</p>
                                            <FormControl>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={JSON.stringify(selectedCut)}
                                                    label="Age"
                                                    onChange={handleDiamondCutChange}
                                                >
                                                    {cutList.map((cut) => (

                                                        <MenuItem key={cut.id} value={JSON.stringify(cut)}>
                                                            {cut.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        {/* Chọn Color */}
                                        <div >
                                            <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Color</p>
                                            <FormControl>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={JSON.stringify(selectedColor)}
                                                    label="Age"
                                                    onChange={handleDiamondColorChange}
                                                >
                                                    {colorList.map((color) => (

                                                        <MenuItem key={color.id} value={JSON.stringify(color)}>
                                                            {color.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div >
                                            <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Clarity</p>
                                            <FormControl >
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={JSON.stringify(selectedClarity)}
                                                    label="Age"
                                                    onChange={handleDiamondClarityChange}
                                                >
                                                    {clarityList.map((clarity) => (

                                                        <MenuItem key={clarity.id} value={JSON.stringify(clarity)} >
                                                            {clarity.name}
                                                        </MenuItem>

                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div >
                                            <p className="text-[#151542 font-loraFont text-xl font-bold ">Diamond Size</p>
                                            <FormControl >
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={diamond_size}
                                                    label="Age"
                                                    onChange={handleDiamondSizeChange}
                                                >
                                                    {sizeList.map((size) => (

                                                        <MenuItem key={size} value={size} >
                                                            {size}
                                                        </MenuItem>

                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>


                                    </div>
                                    <div className="w-full flex justify-center mt-10">
                                        <button onClick={handleGenerateDiamond} className="bg-[#151542] hover:bg-cyan-900 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Generate Diamond Image</button>
                                    </div>
                                </div>
                                <div className="flex justify-center flex-col rounded-lg border-2 w-[562px] py-5">
                                    <div className="w-full mb-5 flex justify-center ">
                                        {loadingDiamond ?
                                            <Box sx={{ display: 'flex', height: '324px', width: '300px', alignItems: 'center', justifyContent: 'center', paddingY: '100px' }}>
                                                <CircularProgress color="inherit" />
                                            </Box>
                                            :
                                            <div className=" flex flex-col rounded-full items-center">
                                                <img src={searchedDiamond ? searchedDiamond.imageUrl : diamondImg} alt="diamond" className="w-[300px] h-[300px] rounded-full object-cover object-center" />
                                                <div>
                                                    <p className="font-gantariFont text-[#151542] font-semibold ">Price In Piece: <CurrencyFormatter value={searchedDiamond ? searchedDiamond.price : 0} /></p>
                                                </div>
                                            </div>

                                        }

                                    </div>
                                    <div className="w-full flex justify-around">
                                        {isSearch ?
                                            <button onClick={handleSelectDiamond} className="bg-[#151542] hover:bg-cyan-900 text-white pl-5 pr-5 pt-2 pb-2 rounded-sm">Select Diamonds</button>
                                            :
                                            <button onClick={showAlert} className="bg-white text-[#151542] border-solid border-2 border-[#151542] pl-5 pr-5 pt-2 pb-2 rounded-sm">Select Diamonds</button>
                                        }
                                    </div>

                                </div>
                            </div>
                        </>
                    )
                    }
                </>
            }

        </div >
    );
}