import React from "react";
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm } from "react-cool-form";
import { CButton } from '@coreui/react';
import './quotePopUp.css';

const style = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function QuotePopup({ open, handleClose }) {
    const { form } = useForm({
        defaultValues: { product: "", occasion: "", metal: "", idea: "" },
        onSubmit: (values) => alert(JSON.stringify(values, undefined, 2))
    });

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Submit Your Quote Informations
                </Typography>
                <form ref={form}>
                    <FormControl fullWidth>
                        <InputLabel id="product-label">What you want to make ?</InputLabel>
                        <Select labelId="product-label" id="product" name="product">
                            <MenuItem value="Ring">Ring</MenuItem>
                            <MenuItem value="Pendant">Pendant</MenuItem>
                            <MenuItem value="Band">Band</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="occasion-label">Jewlery for what occasions ?</InputLabel>
                        <Select labelId="occasion-label" id="occasion" name="occasion">
                            <MenuItem value="Wedding">Wedding</MenuItem>
                            <MenuItem value="Engagement">Engagement</MenuItem>
                            <MenuItem value="Birthday">Birthday</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            {/* ...other options... */}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="metal-label">Main metal ?</InputLabel>
                        <Select labelId="metal-label" id="metal" name="metal">
                            <MenuItem value="Gold">Gold</MenuItem>
                            <MenuItem value="Rose-Gold">Rose-Gold</MenuItem>
                            <MenuItem value="Silver">Silver</MenuItem>
                            <MenuItem value="Platinum">Platinum</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Let us hear more about your idea" id="idea" name="idea" multiline rows={4} required fullWidth />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CButton color="dark" type="submit" >Submit Quote</CButton>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}

export default QuotePopup;