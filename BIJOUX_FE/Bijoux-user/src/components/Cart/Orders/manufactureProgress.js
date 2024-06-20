import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { SignalCellularNullRounded } from '@mui/icons-material';

const production_status_list_data = [
    { id: 1, name: "Unrealized" },
    { id: 2, name: "Casting" },
    { id: 3, name: "Assembly" },
    { id: 4, name: "Stone Setting" },
    { id: 5, name: "Polishing" },
    { id: 6, name: "Finished" }
];

const production_process_list_data = [
    {
        id: 1,
        order_id: 1,
        production_status: { id: 1, name: "Unrealized" },
        imageUrl: "https://i.pinimg.com/736x/10/03/8d/10038dbbb2445ac9501bbd4c04453a16.jpg",
        created: "15/06/2024"
    },
    {
        id: 2,
        order_id: 1,
        production_status: { id: 2, name: "Casting" },
        imageUrl: "https://i.pinimg.com/564x/15/2a/c1/152ac12c19021c44ca840e99a994e8dc.jpg",
        created: "16/06/2024"
    },
    {
        id: 3,
        order_id: 1,
        production_status: { id: 3, name: "Assembly" },
        imageUrl: "https://i.pinimg.com/564x/d7/b2/a4/d7b2a42f3ca22882803a9c49e22656ac.jpg",
        created: "17/06/2024"
    },
    {
        id: 4,
        order_id: 1,
        production_status: { id: 4, name: "Stone Setting" },
        imageUrl: "https://i.pinimg.com/564x/9e/8b/ca/9e8bca0abf61b1c12fb8d9bbbe5cc711.jpg",
        created: "18/06/2024"
    },
];

export default function ManufactureProgress({ order }) {
    const [productionStatusList, setProductionStatusList] = useState([]);
    const [productionProcessList, setProductionProcessList] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoad] = useState(false);

    useEffect(() => {
        setProductionStatusList(production_status_list_data);
        setProductionProcessList(production_process_list_data);

        const completedSteps = production_process_list_data.length;
        setActiveStep(completedSteps);
        setLoad(true); // Set load to true after data is set
    }, []);

    const handleOpen = (url) => {
        setImageUrl(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className='w-full flex flex-col items-start'>
            {loading ? (
                <Box sx={{ maxWidth: 400 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {productionStatusList.map((status, index) => {
                            const process = productionProcessList.find(pp => pp.production_status.id === status.id);
                            console.log(process);
                            return (
                                <Step key={status.id}>
                                    <StepLabel>{status.name}</StepLabel>

                                    {process ? (
                                        <div>
                                            <p>Complete on: {process.created}</p>
                                            <button onClick={() => handleOpen(process.imageUrl)} className='font-semibold text-sky-500 hover:text-sky-900'>View Image</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>Not yet ...</p>
                                        </div>
                                    )}

                                </Step>
                            );
                        })}
                    </Stepper>
                </Box>
            ) : (
                <Typography>Loading...</Typography>
            )}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className='w-[450px] h-[450px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <img src={imageUrl} alt="Step Image" className='w-full h-full object-cover' />
                </div>
            </Modal>
        </div>
    );
}
