import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function PricedQuote() {

    function createData(quoteID, jewelryID, profitRate, jewelryPrice, productionPrice) {
        const totalPrice = (jewelryPrice + productionPrice) * (1 + profitRate);
        const depositPrice = totalPrice * 0.5;
        return { quoteID, jewelryID, jewelryPrice, productionPrice, totalPrice, depositPrice };
    }

    const rows = [
        createData("#quote00123", "#jewl101", 0.2, 1000, 200),
        createData("#quote00134", "#jewl102", 0.25, 1500, 300),
        createData("#quote00165", "#jewl103", 0.15, 1200, 250),
        createData("#quote00122", "#jewl104", 0.3, 1800, 350),
        createData("#quote00321", "#jewl105", 0.2, 2000, 400),
        createData("#quote00142", "#jewl106", 0.22, 1100, 220),
        createData("#quote00176", "#jewl107", 0.18, 1300, 270),
        createData("#quote00142", "#ewl108", 0.25, 1400, 280),
        createData("#quote03251", "#jewl109", 0.2, 1600, 320),
        createData("#quote07534", "#jewl110", 0.2, 1700, 340)
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <h1>
                    Priced Quote
                </h1>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'black' }}>
                            <TableCell sx={{ color: 'white' }}>Quote ID</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Jewelry ID</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Jewelry Price&nbsp;($)</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Production Price&nbsp;($)</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Total Price&nbsp;($)</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Deposit Price&nbsp;($)</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={row.quoteID}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    backgroundColor: index % 2 === 0 ? 'white' : '#F7F6FE'
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.quoteID}
                                </TableCell>
                                <TableCell align="right">{row.jewelryID}</TableCell>
                                <TableCell sx={{ color: 'red', fontWeight: '500' }} align="right">{row.jewelryPrice}</TableCell>
                                <TableCell sx={{ color: 'red', fontWeight: '500' }} align="right">{row.productionPrice}</TableCell>
                                <TableCell sx={{ color: 'red', fontWeight: '500' }} align="right">{row.totalPrice}</TableCell>
                                <TableCell sx={{ color: 'red', fontWeight: '500' }} align="right">{row.depositPrice}</TableCell>
                                <TableCell align="right"><a href="#">Details</a></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}