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
import { get_production_process_list, get_production_status_list } from '../../../api/main/orders/Order_api';


function filterArray(arr) {
    const lastElements = {};

    arr.forEach(element => {
        lastElements[element.production_status.id] = element;
    });
    console.log("111",lastElements)

    const maxId = arr[arr.length - 1].production_status.id;

    const result = [];
    for (let id = 1; id <= maxId; id++) {
        if (lastElements[id]) {
            result.push(lastElements[id]);
        }
    }

    return result;
}
export default function ManufactureProgress({ order }) {
    const [productionStatusList, setProductionStatusList] = useState([]);
    const [productionProcessList, setProductionProcessList] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const setAttribute = async () => {
            const production_status_list = await get_production_status_list(null, "Get production status list", true);
            setProductionStatusList(production_status_list.data);

            const formData = new FormData();
            formData.append("order_id", order.id);
            const production_process_list = await get_production_process_list(formData, "Get production process list", true);
            const filter_process = filterArray(production_process_list.data);
            setProductionProcessList(filter_process);

            setActiveStep(filter_process.length);
            
            setLoading(false); 
        }

        setAttribute()
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
            {loading ?   (
                <Typography>Loading...</Typography>
            )
            :
            (
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
                                            <button disabled={process.imageUrl == null}  onClick={() => handleOpen(process.imageUrl)} className={'font-semibold ' + (process.imageUrl ? 'text-sky-500 hover:text-sky-900' : 'text-grey-900')}>View Image</button>
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
            )
            
            }
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
