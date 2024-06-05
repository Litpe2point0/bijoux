import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';




function Picker() {
    return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer className="p-0"  components={['DateTimePicker']}>
                    <DateTimePicker  label="Basic date time picker" />
                </DemoContainer>
            </LocalizationProvider>
    );
}

const BasicDateTimePicker = () => {
    return (  
            <div>
                <Picker />
            </div>
    );

}
export default BasicDateTimePicker;
