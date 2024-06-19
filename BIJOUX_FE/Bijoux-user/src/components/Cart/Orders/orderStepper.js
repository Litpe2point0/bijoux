import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

// Danh sách các bước trong stepper
const steps = [
    { id: 1, name: "Deposit" },
    { id: 2, name: "Designing" },
    { id: 3, name: "Manufacturing" },
    { id: 4, name: "Payment" },
    { id: 5, name: "Delivery" },
    { id: 6, name: "Received" }
];

const getOrderStepIndex = (orderStatusId) => {
    return steps.findIndex(step => step.id === orderStatusId);
};

const getOrderStepName = (orderStatusId) => {
    const step = steps.find(step => step.id === orderStatusId);
    return step ? step.name : '';
};

export default function OrderStepper({ order }) {
    const [activeStep, setActiveStep] = React.useState(getOrderStepIndex(order.order_status.id));
    console.log("id nè:", order.order_status.id);
    console.log("tới đây r")
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={step.id}>
                        <StepLabel>{step.name}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}