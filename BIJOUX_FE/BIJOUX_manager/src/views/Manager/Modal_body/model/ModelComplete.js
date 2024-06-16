import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CCard,
    CCardBody,
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
    CFormInput,
} from '@coreui/react'
import { ArrowCircleUp, CurrencyCircleDollar, ClipboardText, ListPlus, UserCirclePlus, CheckCircle } from "phosphor-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { get_account_list } from "../../../../api/main/accounts/Account_api";
import MetalCard from "./widget/MetalCard";
import DiamondCard from "./widget/DiamondCard";
import UploadSingle from "./widget/UploadSingle";
import ModelDetailCard from "./widget/ModelDetailCard";
import ShapeCard from "../../../component_items/miniCard/items";
import MainUpload from "./MainUpload";
import RelatedUpload from "./RelatedUpload";
import { get } from "jquery";
import { get_missing_image, get_model_detail, set_available_model } from "../../../../api/main/items/Model_api";

// const data = {
//     "model": {
//         "id": 1,
//         "name": "Elegant Ring",
//         "imageUrl": "http://localhost:8000/image/test/q-1.jpg",
//         "mounting_type": {
//             "id": 1,
//             "name": "Prong"
//         },
//         "mounting_style": {
//             "id": 1,
//             "name": "Solitaire"
//         },
//         "base_width": 2.0,
//         "base_height": 1.5,
//         "volume": null,
//         "production_price": 400.00,
//         "profit_rate": 0.25,
//         "isAvailable": true,
//         "deactivated": false
//     },
//     "missing_image": [
//         {
//             "metal_1": {
//                 "id": 1,
//                 "name": "Gold",
//                 "buy_price_per_gram": 50.00,
//                 "sale_price_per_gram": 60.00,
//                 "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
//                 "specific_weight": 19.32,
//                 "deactivated": false,
//                 "created": "2024-05-20T08:30:00.000Z"
//             },
//             "metal_2": {
//                 "id": 2,
//                 "name": "Platinum",
//                 "buy_price_per_gram": 70.00,
//                 "sale_price_per_gram": 80.00,
//                 "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
//                 "specific_weight": 21.45,
//                 "deactivated": false,
//                 "created": "2024-05-21"
//             },
//             "diamond_shape": {
//                 "id": 1,
//                 "name": "Round",
//                 "drawing_path": "M 6.1 1.001 c 2.95 0.083 5.287 3.735 5.233 8.148 S 8.852 17.08 5.9 16.999 S 0.614 13.265 0.668 8.85 S 3.148 0.92 6.1 1.001 Z M 9.559 14.73 H 7.542 l -1.406 2.128 c 1.32 -0.051 2.52 -0.848 3.423 -2.128 Z m -5.099 0 H 2.441 c 0.908 1.288 2.122 2.09 3.462 2.129 l -0.039 -0.002 L 4.46 14.73 Z M 6 13.78 l -1.413 0.896 l 1.414 2.139 l 1.412 -2.14 Z m 3.613 -2.292 l -1.432 0.909 l -0.59 2.19 h 2.022 Z m -7.225 0 v 3.099 h 2.02 l -0.588 -2.19 Z m 1.599 1.015 l 0.55 2.042 l 1.333 -0.847 Z m 4.026 0 L 6.13 13.698 l 1.334 0.847 Z M 0.801 9.192 c 0.032 2.037 0.58 3.887 1.454 5.258 v -3.058 Z m 10.398 0 l -1.453 2.2 v 3.058 c 0.878 -1.377 1.428 -3.24 1.454 -5.303 Z m -5.2 -4.824 L 3.926 5.664 L 3.038 8.97 l 0.896 3.334 L 6 13.617 l 2.067 -1.312 l 0.896 -3.333 l -0.887 -3.308 Z m -3.03 4.86 l -0.566 2.107 l 1.364 0.865 Z m 6.063 0.002 l -0.798 2.969 l 1.363 -0.864 Z M 2.298 6.735 L 0.813 8.963 l 1.485 2.249 l 0.601 -2.24 Z m 7.405 0 L 9.1 8.973 l 0.601 2.24 l 1.486 -2.249 Z m 0.042 -3.185 v 3.006 l 1.453 2.178 c -0.044 -2.007 -0.588 -3.83 -1.453 -5.184 Z m -7.49 0 C 1.377 4.927 0.827 6.79 0.8 8.854 l 0.002 -0.12 l 1.452 -2.178 Z m 1.504 2.217 l -1.355 0.847 l 0.564 2.1 Z m 4.482 0 l 0.79 2.947 l 0.566 -2.1 Z m -3.85 -2.355 H 2.388 V 6.46 l 1.424 -0.889 Z m 5.222 0 H 7.609 l 0.58 2.16 l 1.424 0.888 Z m -5.092 0.032 l -0.544 2.023 L 5.87 4.286 Z m 2.959 0 l -1.349 0.841 l 1.892 1.182 Z M 6 1.184 L 4.578 3.316 L 6 4.204 l 1.422 -0.888 Z m 0.137 -0.04 L 7.556 3.27 h 2.003 C 8.65 1.983 7.437 1.18 6.097 1.143 Z m -0.273 0 c -1.318 0.05 -2.52 0.848 -3.422 2.127 h 2.003 l 1.419 -2.128 Z"
//             }
//         },
//         {
//             "metal_1": {
//                 "id": 3,
//                 "name": "Silver",
//                 "buy_price_per_gram": 30.00,
//                 "sale_price_per_gram": 40.00,
//                 "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
//                 "specific_weight": 10.49,
//                 "deactivated": false,
//                 "created": "2024-05-22"
//             },
//             "metal_2": {
//                 "id": 4,
//                 "name": "Palladium",
//                 "buy_price_per_gram": 55.00,
//                 "sale_price_per_gram": 65.00,
//                 "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
//                 "specific_weight": 12.02,
//                 "deactivated": false,
//                 "created": "2024-05-23"
//             },
//             "diamond_shape": {
//                 "id": 2,
//                 "name": "Princess",
//                 "drawing_path": "M 6.1 1.001 c 2.95 0.083 5.287 3.735 5.233 8.148 S 8.852 17.08 5.9 16.999 S 0.614 13.265 0.668 8.85 S 3.148 0.92 6.1 1.001 Z M 9.559 14.73 H 7.542 l -1.406 2.128 c 1.32 -0.051 2.52 -0.848 3.423 -2.128 Z m -5.099 0 H 2.441 c 0.908 1.288 2.122 2.09 3.462 2.129 l -0.039 -0.002 L 4.46 14.73 Z M 6 13.78 l -1.413 0.896 l 1.414 2.139 l 1.412 -2.14 Z m 3.613 -2.292 l -1.432 0.909 l -0.59 2.19 h 2.022 Z m -7.225 0 v 3.099 h 2.02 l -0.588 -2.19 Z m 1.599 1.015 l 0.55 2.042 l 1.333 -0.847 Z m 4.026 0 L 6.13 13.698 l 1.334 0.847 Z M 0.801 9.192 c 0.032 2.037 0.58 3.887 1.454 5.258 v -3.058 Z m 10.398 0 l -1.453 2.2 v 3.058 c 0.878 -1.377 1.428 -3.24 1.454 -5.303 Z m -5.2 -4.824 L 3.926 5.664 L 3.038 8.97 l 0.896 3.334 L 6 13.617 l 2.067 -1.312 l 0.896 -3.333 l -0.887 -3.308 Z m -3.03 4.86 l -0.566 2.107 l 1.364 0.865 Z m 6.063 0.002 l -0.798 2.969 l 1.363 -0.864 Z M 2.298 6.735 L 0.813 8.963 l 1.485 2.249 l 0.601 -2.24 Z m 7.405 0 L 9.1 8.973 l 0.601 2.24 l 1.486 -2.249 Z m 0.042 -3.185 v 3.006 l 1.453 2.178 c -0.044 -2.007 -0.588 -3.83 -1.453 -5.184 Z m -7.49 0 C 1.377 4.927 0.827 6.79 0.8 8.854 l 0.002 -0.12 l 1.452 -2.178 Z m 1.504 2.217 l -1.355 0.847 l 0.564 2.1 Z m 4.482 0 l 0.79 2.947 l 0.566 -2.1 Z m -3.85 -2.355 H 2.388 V 6.46 l 1.424 -0.889 Z m 5.222 0 H 7.609 l 0.58 2.16 l 1.424 0.888 Z m -5.092 0.032 l -0.544 2.023 L 5.87 4.286 Z m 2.959 0 l -1.349 0.841 l 1.892 1.182 Z M 6 1.184 L 4.578 3.316 L 6 4.204 l 1.422 -0.888 Z m 0.137 -0.04 L 7.556 3.27 h 2.003 C 8.65 1.983 7.437 1.18 6.097 1.143 Z m -0.273 0 c -1.318 0.05 -2.52 0.848 -3.422 2.127 h 2.003 l 1.419 -2.128 Z"
//             }
//         },
//         // {
//         //     "metal_1": {
//         //         "id": 1,
//         //         "name": "Goldđ",
//         //         "buy_price_per_gram": 50.00,
//         //         "sale_price_per_gram": 60.00,
//         //         "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
//         //         "specific_weight": 19.32,
//         //         "deactivated": false,
//         //         "created": "2024-05-20T08:30:00.000Z"
//         //     },
//         //     "metal_2": {
//         //         "id": 2,
//         //         "name": "Platinummm",
//         //         "buy_price_per_gram": 70.00,
//         //         "sale_price_per_gram": 80.00,
//         //         "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
//         //         "specific_weight": 21.45,
//         //         "deactivated": false,
//         //         "created": "2024-05-21"
//         //     },
//         //     "diamond_shape": {
//         //         "id": 1,
//         //         "name": "Round",
//         //         "drawing_path": "M 6.1 1.001 c 2.95 0.083 5.287 3.735 5.233 8.148 S 8.852 17.08 5.9 16.999 S 0.614 13.265 0.668 8.85 S 3.148 0.92 6.1 1.001 Z M 9.559 14.73 H 7.542 l -1.406 2.128 c 1.32 -0.051 2.52 -0.848 3.423 -2.128 Z m -5.099 0 H 2.441 c 0.908 1.288 2.122 2.09 3.462 2.129 l -0.039 -0.002 L 4.46 14.73 Z M 6 13.78 l -1.413 0.896 l 1.414 2.139 l 1.412 -2.14 Z m 3.613 -2.292 l -1.432 0.909 l -0.59 2.19 h 2.022 Z m -7.225 0 v 3.099 h 2.02 l -0.588 -2.19 Z m 1.599 1.015 l 0.55 2.042 l 1.333 -0.847 Z m 4.026 0 L 6.13 13.698 l 1.334 0.847 Z M 0.801 9.192 c 0.032 2.037 0.58 3.887 1.454 5.258 v -3.058 Z m 10.398 0 l -1.453 2.2 v 3.058 c 0.878 -1.377 1.428 -3.24 1.454 -5.303 Z m -5.2 -4.824 L 3.926 5.664 L 3.038 8.97 l 0.896 3.334 L 6 13.617 l 2.067 -1.312 l 0.896 -3.333 l -0.887 -3.308 Z m -3.03 4.86 l -0.566 2.107 l 1.364 0.865 Z m 6.063 0.002 l -0.798 2.969 l 1.363 -0.864 Z M 2.298 6.735 L 0.813 8.963 l 1.485 2.249 l 0.601 -2.24 Z m 7.405 0 L 9.1 8.973 l 0.601 2.24 l 1.486 -2.249 Z m 0.042 -3.185 v 3.006 l 1.453 2.178 c -0.044 -2.007 -0.588 -3.83 -1.453 -5.184 Z m -7.49 0 C 1.377 4.927 0.827 6.79 0.8 8.854 l 0.002 -0.12 l 1.452 -2.178 Z m 1.504 2.217 l -1.355 0.847 l 0.564 2.1 Z m 4.482 0 l 0.79 2.947 l 0.566 -2.1 Z m -3.85 -2.355 H 2.388 V 6.46 l 1.424 -0.889 Z m 5.222 0 H 7.609 l 0.58 2.16 l 1.424 0.888 Z m -5.092 0.032 l -0.544 2.023 L 5.87 4.286 Z m 2.959 0 l -1.349 0.841 l 1.892 1.182 Z M 6 1.184 L 4.578 3.316 L 6 4.204 l 1.422 -0.888 Z m 0.137 -0.04 L 7.556 3.27 h 2.003 C 8.65 1.983 7.437 1.18 6.097 1.143 Z m -0.273 0 c -1.318 0.05 -2.52 0.848 -3.422 2.127 h 2.003 l 1.419 -2.128 Z"
//         //     }
//         // },
//     ]
// }
const state_creator = (table, handleMainUpload, handleRelatedUpload) => {
    const state = {
        columnDefs: [
            {
                headerName: "Metal 1",
                field: "metal_1.name",
                cellRenderer: (params) => {
                    return (
                        <div className="d-flex align-items-center">
                            <img className="rounded-3" width={'30px'} src={params.data.metal_1.imageUrl} />
                            <span className="text-dark ms-2">{params.data.metal_1.name}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Metal 2",
                field: "metal_2.name",
                cellRenderer: (params) => {
                    return (
                        <div className="d-flex align-items-center">
                            <img className="rounded-3" width={'30px'} src={params.data.metal_2 && params.data.metal_2.imageUrl} />
                            <span className="text-dark ms-2">{params.data.metal_2 ? params.data.metal_2.name : 'X'}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Shape",
                field: "diamond_shape.name",
                cellRenderer: (params) => {
                    return (
                        <span className="bg-light rounded h-auto text-dark p-2" style={{ height: '100%', fontSize: 'small' }}>
                            <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="20" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={params.data.diamond_shape.drawing_path} />
                            </svg>
                            {params.data.diamond_shape.name}</span>
                    )

                },
            },
            {
                flex: 2,
                filter: false,
                headerName: "Image Sets",
                cellClass: 'd-flex align-items-center py-1',
                cellRenderer: (params) => {
                    //console.log('params', params)
                    return (
                        <CRow className="d-flex ">
                            <CCol xs={12}>
                                <MainUpload key={`main-${params.rowIndex}`} handleMainUpload={handleMainUpload} rowIndex={params.rowIndex} />

                            </CCol>
                            <CCol xs={12}>
                                <RelatedUpload key={`main-${params.rowIndex}`} handleRelatedUpload={handleRelatedUpload} rowIndex={params.rowIndex} />

                            </CCol>

                        </CRow>
                    )
                }
            },

        ],
        rowData: table,


    }
    return state
}

const CustomForm = ({ modelInfo, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [model, setModel] = useState(null);
    const [gridApi, setGridApi] = useState(null);

    const [state, setState] = useState(null);
    //report
    const [mainImages, setMainImages] = useState([]);
    const [relatedImages, setRelatedImages] = useState([]);



    const handleMainUpload = (index, base64) => {
        setMainImages((prev) => {
            const updatedImages = prev.filter(img => img.index !== index);
            return [...updatedImages, { index: index, main_image: base64 }];
        });
    };

    const handleRelatedUpload = (index, base64) => {
        setRelatedImages((prev) => {
            const updatedImages = prev.filter(img => img.index !== index);
            return [...updatedImages, { index: index, related_image: base64 }];
        });
    };

    useEffect(() => {
        const setAttribute = async () => {
            const formData = new FormData();
            formData.append('model_id', JSON.stringify(modelInfo.id));
            const data_detail = await get_missing_image(formData);
            const model_detail = data_detail.data
            setModel(model_detail.model)

            console.log("ẢNH THIẾU", model_detail.missing_image)
            setState(state_creator(model_detail.missing_image, handleMainUpload, handleRelatedUpload))
            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleModelComplete = async () => {
        await get_account_list()
        const new_model = {


        }
        console.log('update_model', new_model)

        window.location.reload();
        // set toast
        dispatch(setToast({ color: 'success', title: 'Model id' + model.id, mess: "Add successfully !" }))
        onClose();
    }

    const defaultColDef = useMemo(() => {
        return {
            flex: 0.5,
            filter: true,
            autoHeight: true,
            wrapText: true,
            cellClass: 'd-flex align-items-center',
        };
    }, [])
    const onGridReady = (type) => (params) => {
        if (type === 'customize') {
            setGridApi(params.api);
        }
    };

    const handleSubmit = async () => {
        setUploadLoading(true); 
        const image_list = [];
        gridApi.forEachNode((node) => {

            const rowData = node.data;
            // console.log('row data', rowData)

            // const imageArray = [rowData.metal_1.imageUrl, rowData.metal_2.imageUrl]; 
            console.log('ẢNH MAINNNNNNN', mainImages)
            const main_image = mainImages.find((item) => item.index == node.rowIndex).main_image;
            const related_image = relatedImages.find((item) => item.index == node.rowIndex).related_image;

            const newRowData = {
                metal_1_id: rowData.metal_1.id,
                metal_2_id: rowData.metal_2 ? rowData.metal_2.id : null,
                diamond_shape_id: rowData.diamond_shape.id,
                main_image: main_image,
                related_image: related_image
            };

            image_list.push(newRowData);
        });

        //image_list([...rowData, ...newData]);
        console.log('OH SHIT BRO', image_list)

        const set_available = {
            model_id: modelInfo.id,
            image_list: image_list
        }

        const formData = new FormData();
        formData.append('set_available', JSON.stringify(set_available));
        const response = await set_available_model(formData, 'Model ID ' + modelInfo.id);

        if (response.success) {
            window.location.reload();
        }
        dispatch(setToast(response.mess))
        setUploadLoading(false)

    };
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    {loading ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>Fill Form</strong> <small><ClipboardText size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >

                                    <CCol md={6} style={{ height: 'fit-content' }}>

                                        <div className="d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Base Image</span>

                                            <UploadSingle defaultImage={model ? model.imageUrl : "http://localhost:8000/image/Metal/1/main.jpg"} disabled={true} />

                                        </div>
                                    </CCol>
                                    <CCol md={6} >
                                        <ModelDetailCard title={'MODEL INFORMATION'} model={model} />
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Fill All Image Set  <span className="text-danger">(*required)</span></h2>
                                </div>
                                <div className="my-4 ag-theme-quartz"  >

                                    <AgGridReact
                                        enableColResize={true}
                                        columnDefs={state.columnDefs}
                                        rowData={state.rowData}
                                        defaultColDef={defaultColDef}
                                        rowHeight={35}
                                        headerHeight={30}
                                        domLayout='autoHeight'
                                        onGridReady={onGridReady('customize')}
                                    />
                                </div>

                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={uploadLoading || mainImages.length != state.rowData.length || relatedImages.length != state.rowData.length}
                                        onClick={()=>handleSubmit()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        {uploadLoading ?
                                            <CSpinner as="span" size="sm" aria-hidden="true" />
                                            :
                                            <>
                                                Upload All Image Set <CheckCircle size={30} color="lime" weight="duotone" />

                                            </>
                                        }
                                    </Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}

const ModelComplete = ({ modelInfo, onClose }) => {

    return (
        <CustomForm modelInfo={modelInfo} onClose={onClose} />
    );

};

export default ModelComplete;

