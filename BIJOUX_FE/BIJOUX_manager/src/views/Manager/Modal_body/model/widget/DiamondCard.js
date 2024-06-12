import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardImage,
    CCardTitle,
    CCardText,
    CModal,
    CModalBody,
    CModalHeader,
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CFormSelect,
    CFormTextarea,
    CModalTitle,
    CModalFooter,
} from '@coreui/react'
import './../style.css'
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
//import Button from '@mui/joy/Button';
import { PlusCircle, XCircle } from "phosphor-react";
import DiamondAdd from "../DiamondAdd";
import { get_diamond_imageUrl } from "../../../../../api/Back_End_Url";





export default function DiamondCard({ model, handleChange }) {
    const [diamondList, setDiamondList] = useState(model ? model.model_diamond :[])
    const [visible, setVisible] = useState(false)
    const handleClose = () => {
        setVisible(false);
    };
    const handleAddDiamond = (newDiamond) => {
        setDiamondList([...diamondList, newDiamond])
    }
    useEffect(() => {
        //console.log('here is diamond list', diamondList)
        handleChange(diamondList)
    }, [diamondList])
    const handleRemove = (index) => {

        const updatedDiamondList = [...diamondList];
        updatedDiamondList.splice(index, 1);

        setDiamondList(updatedDiamondList);
    }
    return (
        <CCard className="bg-light metal-card" >
            <CCardHeader   >
                <CRow>
                    <CCol md={2} className="text-dark fw-bold fs-5 d-flex align-items-center">Diamond</CCol>
                    <CCol className="d-flex align-items-center" md={10}>
                        <Button
                            onClick={() => setVisible(!visible)}
                            className="rounded-pill fw-bold"
                            variant="outlined"
                            color="warning"
                            startIcon={<PlusCircle size={25} color="peru" weight="duotone" />}
                        >
                            Add Diamond
                        </Button>
                        <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)} >
                            <CModalHeader>
                                <CModalTitle>Add New Diamond</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <DiamondAdd onClose={handleClose} handleAddDiamond={handleAddDiamond} />
                            </CModalBody>
                        </CModal>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>
                <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {diamondList.length > 0 && diamondList.map((item, index) => {
                        return (
                            <ListItem>
                                <ListItemAvatar>
                                    <span className="bg-light rounded h-auto text-dark p-2" style={{ height: '100%', fontSize: 'small' }}>
                                        <svg fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="30" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={item.diamond_shape.drawing_path} />
                                        </svg>
                                        </span>

                                </ListItemAvatar>

                                <ListItemText className="text-dark w-25" primary='Shape' secondary={item.diamond_shape.name} />
                                <ListItemText className="text-dark w-25" primary='Min Size' secondary={item.diamond_size_min} />
                                <ListItemText className="text-dark w-25" primary='Max Size' secondary={item.diamond_size_max} />
                                <ListItemText className="text-dark w-25" primary='Count' secondary={item.count} />
                                <ListItemText className="text-dark w-25" primary='Status' secondary={item.is_editable ? 'Editable' : 'Uneditable'} />

                                <IconButton onClick={() => handleRemove(index)} aria-label="delete" size="large" color="error">
                                    <XCircle size={30} color="crimson" weight="duotone" />
                                </IconButton>

                            </ListItem>
                        )
                    })}
                </List>
            </CCardBody>
        </CCard>
    )
}