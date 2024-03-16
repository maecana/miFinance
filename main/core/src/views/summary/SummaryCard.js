import React, { useState, useRef, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, CardContent } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

// project imports
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebase-config';
import MainCard from 'ui-component/cards/MainCard';
import SummaryTable from './SummaryTable';
import SummaryPopper from './SummaryPopper';

const SummaryCard = ({ title, formTitle, description }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [rows, setRows] = useState([]);

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, title));
            const data = querySnapshot.docs.map((doc) => {
                const docData = doc.data();

                const sumOfActual = docData.actual ? docData.actual.reduce((acc, curr) => acc + curr, 0) : 0;
                const difference = docData.plannedAmount - sumOfActual;
                return {
                    id: doc.id,
                    ...docData,
                    sumOfActual: sumOfActual,
                    difference: difference
                };
            });
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
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Grid container alignContent="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h3">{title}</Typography>
                            </Grid>
                            <Grid item>
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
                                <SummaryPopper entity={title} formTitle={formTitle} description={description} open={open} anchorRef={anchorRef} setOpen={setOpen} handleClose={handleClose} fetchData={fetchData} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <SummaryTable rows={rows} />
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

export default SummaryCard;
