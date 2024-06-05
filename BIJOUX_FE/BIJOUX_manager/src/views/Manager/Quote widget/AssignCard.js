import {
    CCard,
    CCardBody,
    CCardTitle,
    CCardText,
} from '@coreui/react'
import AvatarInput from '../../component_items/Avatar/Avatar'
import React, { useEffect } from 'react'
import { get_account_list } from '../../../api/accounts/Account_Api'
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useState } from 'react';

function renderValue(item) {
    if (!item) {
        return null;
    }
    const staff = JSON.parse(item.value);

    return (
        <div color="light w-100 d-flex align-items-center justify-content-start" >
            <ListItemDecorator className='px-2'>
                <AvatarInput size={30} src={staff.imageUrl} />
            </ListItemDecorator>
            {staff.fullname}
        </div>
    );
}

const AssignCard = ({selection, staffList, handleAssign }) => {
    const [selectedStaff, setSelectedStaff] = useState(selection ? staffList.filter(staff=>staff.id == selection.id)[0]  : staffList[0] );
    console.log("selectedStaff",selectedStaff)
    const handleStaffSelect = (event, newValue) => {
        console.log("newValue",newValue)
        if (!newValue) {
            return;
        }
        const selectedItem = JSON.parse(newValue);
        console.log('selectedItem', selectedItem)
        setSelectedStaff(selectedItem);
        handleAssign(selectedItem, selectedItem.role.id)
    };
    // useEffect(() => {
        
    //     handleAssign(selectedStaff, selectedStaff.role.id)
    // }, [selectedStaff])

    return (

        <CCard className="bg-light mb-3" >

            <Select
                onChange={handleStaffSelect}
                variant="soft"
                className="px-1 py-0"
                defaultValue={JSON.stringify(selectedStaff)}
                slotProps={{
                    listbox: {
                        sx: {
                            '--ListItemDecorator-size': '44px',
                        },
                    },
                }}
                sx={{
                    '--ListItemDecorator-size': '44px',
                    width: '100%',
                    height: '1.5em',
                }}
                renderValue={renderValue}
            >
                {staffList.map((item, index) => (
                    <React.Fragment key={item.id} >
                        <Option value={JSON.stringify(item)} label={item.name}  >
                            <ListItemDecorator>
                                <AvatarInput size={30} src={item.imageUrl} />
                            </ListItemDecorator>
                            {item.fullname}
                        </Option>
                    </React.Fragment>
                ))}
            </Select>

        </CCard>
    )

}
export default AssignCard