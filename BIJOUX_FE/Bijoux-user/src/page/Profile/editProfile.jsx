import React, { useState } from "react";
import { Box, TextField } from '@mui/material';
import './editProfile.css';
import { Copy } from "@phosphor-icons/react";
import { Autocomplete } from '@mui/material';

export default function EditProfile() {
    const [date, setDate] = useState(null);

    const southeastAsiaCountries = [
        'Brunei',
        'Cambodia',
        'East Timor',
        'Indonesia',
        'Laos',
        'Malaysia',
        'Myanmar',
        'Philippines',
        'Singapore',
        'Thailand',
        'Vietnam',
    ];

    const provincesData = {
        'Vietnam': ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong'],
        'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket'],
        // Add more countries and their provinces here...
    };

    const user = {
        name: "Hoàng Minh Lộc",
        user_id: "#cus0310314a",
        email: "lochmse182366@fpt.edu.vn",
        avatar_url: "https://i.pinimg.com/564x/20/e6/d6/20e6d604cc0a68b71014de82784726fe.jpg",
        phone: "0123456789",
        street: "123 Nguyễn Thị Minh Khai, Tân Phú, Quận 10",
        city: "TP Hồ Chí Minh",
        country: "Vietnam",
        dob: "2004-10-03"
    }

    const [country, setCountry] = useState(user.country);
    const [provinces, setProvinces] = useState(provincesData[country] || []);
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                    my={4}
                    display="flex"
                    flexDirection="column"
                    gap={4}
                    p={2}
                    sx={{ border: '2px solid grey' }}
                >
                    <Box sx={{ display: 'flex' }}>
                        <div className="user-avatar-outer">
                            <img className="user-avatar-img" src={user.avatar_url} alt={user.name} />
                            <p style={{ fontWeight: '500', color: '#1e8dbd', textDecoration: 'underline' }}>Change Avatar</p>
                        </div>
                        <Box>
                            <h1 style={{ color: '#1a7a2b' }}>{user.name}</h1>
                            <h3 style={{ color: 'gray' }}>{user.user_id} <Copy size={32} /></h3>

                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        gap={2}
                    >
                        <TextField id="outlined-basic" label="User Name" variant="outlined" defaultValue={user.name} />
                        <TextField id="outlined-basic" label="Phone Number" variant="outlined" defaultValue={user.phone} />
                        <TextField id="outlined-basic" label="Email" variant="outlined" defaultValue={user.email} />
                        <TextField
                            id="date"
                            label="Date Of Birth"
                            type="date"
                            defaultValue={user.dob}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        gap={3}
                    >
                        <p>Address Informations:</p>

                        <Autocomplete
                            id="country-select"
                            options={southeastAsiaCountries}
                            defaultValue={country}
                            onChange={(event, newValue) => {
                                setCountry(newValue);
                                setProvinces(provincesData[newValue] || []);
                            }}
                            renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                            sx={{ flex: 1 }}
                        />

                        <Autocomplete
                            id="province-select"
                            options={provinces}
                            renderInput={(params) => <TextField {...params} label="Province" variant="outlined" />}
                            sx={{ flex: 1 }}
                        />
                        <TextField sx={{ flex: 1 }} id="outlined-basic" label="Street" variant="outlined" defaultValue={user.street} />
                    </Box>
                </Box>


            </Box>
        </>
    )
}