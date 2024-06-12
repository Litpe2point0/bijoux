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
import './../style/style.css'
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
//import Button from '@mui/joy/Button';
import { PlusCircle, XCircle } from "phosphor-react";
import MetalAdd from "../Modal_body/MetalAdd";
import DiamondAdd from "../Modal_body/DiamondAdd";
import { get_diamond_imageUrl } from "../../../../../api/Back_End_Url";





export default function DiamondCard({ product, handleChange }) {
    const [diamondList, setDiamondList] = useState(product.product_diamond)
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
                                    <Avatar>
                                        <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />

                                    </Avatar>

                                </ListItemAvatar>
                                <ListItemText className="text-dark w-25" primary='Shape' secondary={item.diamond_shape.name} />
                                <ListItemText className="text-dark w-25" primary='Size' secondary={item.diamond.size} />
                                <ListItemText className="text-dark w-25" primary='Origin' secondary={item.diamond.diamond_origin.name} />
                                <ListItemText className="text-dark w-25" primary='Color' secondary={item.diamond.diamond_color.name} />
                                <ListItemText className="text-dark w-25" primary='Clarity' secondary={item.diamond.diamond_clarity.name} />
                                <ListItemText className="text-dark w-25" primary='Count' secondary={item.count} />
                                <ListItemText className="text-dark w-25" primary='Total Price' secondary={item.price + ' vnd'} />
                               
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