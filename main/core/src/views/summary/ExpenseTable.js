import React, { useState, useRef, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Box } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

// project imports
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebase-config';
import MainCard from 'ui-component/cards/MainCard';
import ExpenseTable from './ExpenseTable';
import ExpensePopper from './ExpensePopper';

const ExpensesCard = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [rows, setRows] = useState([]);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Expenses'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                ...doc.data().Planned
            }));
            console.log('Data:', data);
            setRows(data);
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <MainCard content={false}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h3">Expenses</Typography>
                        <AddCircleOutlineOutlinedIcon
                            fontSize="medium"
                            sx={{
                                color: theme.palette.primary[200],
                                cursor: 'pointer'
                            }}
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <ExpensePopper open={open} anchorRef={anchorRef} handleClose={handleClose} fetchData={fetchData} />
                </Grid>
                <Grid item xs={12}>
                    <ExpenseTable rows={rows} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ExpensesCard;
