import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CSpinner,
    CPopover
} from '@coreui/react'
import { AdapterDateFnsBase } from "@mui/x-date-pickers/AdapterDateFnsBase";
import { get_stoneShape_list } from "../../../../api/StoneApi";
import axios from 'axios';

import StoneShapeGroup from "./MiniCardGroup";
import ModalButton from "../../../component_items/Modal/ModalButton";
import AddForm from "../stone-form/AddForm";
//import AddForm from "../stone-form/AddFormInside";


export const StoneShapeContext = createContext();


const StoneShapeTable = () => {
    let [list, setList] = useState([]);
    let [stoneShapeLoading, setStoneShapeLoading] = useState(true);
    let [modelsLoading, setModelsLoading] = useState(true);

   

    const handleTableChange = () => {
        setStoneShapeLoading(true);
        //setTable(new_table)
        const get_list = async () => {
            const stoneShapeList = await get_stoneShape_list();
            setList(stoneShapeList);
            setStoneShapeLoading(false);
        }
        get_list();

    }


    useEffect(() => {
        handleTableChange()
    }, [])


    return (
        <StoneShapeContext.Provider value={{ onDataChange: handleTableChange}}>
            <CCard className="mb-4 w-100">
                <CCardHeader className="d-flex justify-content-between">
                    <span>Stone Shape</span>
                    <div className="w-25">
                    
                        <ModalButton title={"Add New Shape"} content={"Add New Shape"} color="primary" ><AddForm  /></ModalButton>

                    </div>
                </CCardHeader>
                <CCardBody>
                    {stoneShapeLoading ? <CSpinner color="danger" /> : <StoneShapeGroup items={list} />}
                </CCardBody>

                <CPopover
                    title="Popover title"
                    content={<AddForm onDataChange={handleTableChange} />}
                    placement="right"
                >
                    <CButton color="danger" size="lg">
                        Click to toggle popover
                    </CButton>
                </CPopover>
            </CCard>




        </StoneShapeContext.Provider>
    );

}
export default StoneShapeTable;
