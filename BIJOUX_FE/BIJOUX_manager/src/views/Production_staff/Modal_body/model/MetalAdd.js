import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormCheck,
    CSpinner
} from '@coreui/react'
import { get_account_list } from "../../../../api/accounts/Account_Api";
import AvatarUpload from "../../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import { Avatar, Button, ListItemAvatar, ListItemText } from "@mui/material";
import { Coins } from "phosphor-react";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';

const metal = [
    {
        "id": 1,
        "name": "Gold",
        'imageUrl': "http://localhost:8000/image/Metal/1/main.jpg",
        "buy_price_per_gram": 60.00,
        "sale_price_per_gram": 75.00,
        "specific_weight": 19.32,
        "deactivated": false,
        "created": "2024-01-15T10:20:30.000Z"
    },
    {
        "id": 2,
        "name": "Silver",
        'imageUrl': "http://localhost:8000/image/Metal/2/main.jpg",
        "buy_price_per_gram": 0.80,
        "sale_price_per_gram": 1.20,
        "specific_weight": 10.49,
        "deactivated": false,
        "created": "2024-01-20T14:35:22.000Z"
    },
    {
        "id": 3,
        "name": "Platinum",
        'imageUrl': "http://localhost:8000/image/Metal/3/main.jpg",
        "buy_price_per_gram": 30.00,
        "sale_price_per_gram": 45.00,
        "specific_weight": 21.45,
        "deactivated": false,
        "created": "2024-01-25T08:15:55.000Z"
    },
    {
        "id": 4,
        "name": "Copper",
        'imageUrl': "http://localhost:8000/image/Metal/4/main.jpg",
        "buy_price_per_gram": 0.02,
        "sale_price_per_gram": 0.03,
        "specific_weight": 8.96,
        "deactivated": true,
        "created": "2023-12-01T12:00:00.000Z"
    }
]
const CustomForm = ({ handleAddMetal, onClose }) => {
    const dispatch = useDispatch();
    const [validated, setValidated] = useState(false)   //check form điền đầy đủ chưa
    const [isSearch, setIsSearch] = useState(false)   //check form điền đầy đủ chưa
    const [loading, setLoading] = useState(true)  //loading
    const [metalList, setMetalList] = useState(null);  //danh sách kim loại


    const [selectedMetal, setSelectedMetal] = useState(null);  // kim loại được chọn
    const [addVolume, setAddVolume] = useState(0);       //thể tích
    const [addWeight, setAddWeight] = useState(0); //trọng lượng
    const [addPrice, setAddPrice] = useState(0); //giá


    useEffect(() => {
        const setAttribute = async () => {
            await get_account_list();
            setMetalList(metal)
            setLoading(false);
        }
        setAttribute()
    }, [])


    useEffect(() => {
        console.log('select metal', selectedMetal)
        console.log('add volume', addVolume)
        console.log('add weight', addWeight)
        console.log('add price', addPrice)
    }, [selectedMetal, addVolume, addWeight, addPrice])


    const handleMetalSelect = (event) => {
        const selectedItem = JSON.parse(event.target.value);
        setSelectedMetal(selectedItem);
        setIsSearch(false)
    };
    const handleVolumeChange = (e) => {
        const value= parseInt(e.target.value)
        setAddVolume(value > 0 ? value : 0)
        setIsSearch(false)
    }
    const handleSearch = () => {

        const setWeightPrice = async () => {
            await get_account_list();


            let metal_information = {
                metal_id: selectedMetal.id,
                volume: addVolume
            }

            console.log('metal information', metal_information)
            setAddWeight(1000);
            setAddPrice(1001203);

            setIsSearch(true)
        }
        setWeightPrice()
        
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setValidated(true);

        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {





            const add_metal = {
                metal: selectedMetal,
                volume: addVolume,
                weight: addWeight,
                price: addPrice
            }
            handleAddMetal(add_metal)
            onClose();
        }

        setDisabled(false)
    }


    return (
        <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}

        >


            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom01">Full Name</CFormLabel>


                <RadioGroup className="p-0" aria-label="Your plan" name="people" defaultValue="Individual" onChange={handleMetalSelect}  >
                    {loading ?
                        <List
                            sx={{
                                minWidth: 240,
                                '--List-gap': '0.5rem',
                                '--ListItem-paddingY': '1rem',
                                '--ListItem-radius': '8px',
                                '--ListItemDecorator-size': '32px',
                            }}
                        >
                            <ListItem variant="outlined" sx={{ boxShadow: 'sm', backgroundColor: 'wheat', height: '3em' }}><CSpinner color="warning" /></ListItem>
                        </List>
                        :


                        <List
                            sx={{
                                minWidth: 240,
                                '--List-gap': '0.5rem',
                                '--ListItem-paddingY': '1rem',
                                '--ListItem-radius': '8px',
                                '--ListItemDecorator-size': '32px',
                            }}
                        >

                            {metalList && metalList.map((item, index) => (
                                <ListItem variant="outlined" key={item} sx={{ boxShadow: 'sm', backgroundColor: 'wheat', height: '3em' }}>
                                    <ListItemDecorator>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <img height={'100%'} src={item.imageUrl} alt="metal" />
                                            </Avatar>
                                        </ListItemAvatar>
                                    </ListItemDecorator>
                                    <Radio
                                        overlay
                                        value={JSON.stringify(item)}
                                        label={item.name}
                                        sx={{ flexGrow: 1, flexDirection: 'row-reverse', color: 'text.dark' }}
                                        slotProps={{
                                            action: ({ checked }) => ({
                                                sx: (theme) => ({
                                                    ...(checked && {
                                                        inset: -1,
                                                        border: '2px solid',
                                                        borderColor: theme.vars.palette.primary[500],
                                                    }),
                                                }),
                                            }),
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    }
                </RadioGroup>
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Volume</CFormLabel>
                <CFormInput type="number" id="validationCustom02" onChange={handleVolumeChange} defaultValue={addVolume} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12} className="d-flex justify-content-center">

                <Button
                    onClick={() => {
                        handleSearch();
                    }}
                    className="rounded-pill fw-bold"
                    variant="outlined"
                    color="warning"
                    startIcon={<Coins size={25} color="peru" weight="duotone" />} disabled={addVolume == 0 || !selectedMetal}>
                    Price Calculating
                </Button>
            </CCol>
            <hr />
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Weight</CFormLabel>
                <CFormInput disabled type="number" id="validationCustom02" value={addWeight} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={12}>
                <CFormLabel htmlFor="validationCustom02">Price</CFormLabel>
                <CFormInput disabled type="number" id="validationCustom02" value={addPrice} required />
                <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">
                <CButton onClick={handleSubmit} color="success" type="submit" disabled={addVolume <= 0 ||  addWeight == 0 || addPrice == 0 || !isSearch}>
                    Confirm add
                </CButton>
            </CCol>
        </CForm>
    )
}

const MetalAdd = ({ handleAddMetal, onClose }) => {
    return (
        <CustomForm handleAddMetal={handleAddMetal} onClose={onClose} />
    );
};

export default MetalAdd;
