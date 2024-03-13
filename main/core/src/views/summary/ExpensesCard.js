import { useState, useRef, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
// import { Grid, CardContent, Typography } from '@mui/material';
import {
    Box,
    // Card,
    CardContent,
    // Chip,
    ClickAwayListener,
    Divider,
    Grid,
    // InputAdornment,
    // List,
    // ListItemButton,
    // ListItemIcon,
    // ListItemText,
    OutlinedInput,
    InputLabel,
    FormControl,
    FormHelperText,
    Paper,
    Popper,
    Stack,
    // Switch,
    Typography,
    Button,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from 'firebase-config';
import useScriptRef from 'hooks/useScriptRef';


// assets
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
// import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';

const columns = [
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 130 },
    { field: 'actual', headerName: 'Actual', width: 130 }
];

const ExpensesCard = () => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const [open, setOpen] = useState(false);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

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


    // firebase fetch

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

        // Clean up function
        return () => {
            // Cleanup if necessary
        };
    }, []); // Empty dependency array to run only once on mount

    return (
        <MainCard content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignContent="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h3">Expenses</Typography>
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
                                <Popper style={{ position: 'relative', zIndex: 2 }}
                                    placement="bottom-end"
                                    open={open}
                                    anchorEl={anchorRef.current}
                                    role={undefined}
                                    transition
                                    disablePortal
                                    popperOptions={{
                                        modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, 14]
                                                }
                                            }
                                        ]
                                    }}
                                >
                                    {({ TransitionProps }) => (
                                        <Transitions in={open} {...TransitionProps}>
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                                        <Box sx={{ p: 2 }}>
                                                            <Stack>
                                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                                    <Typography variant="h4">Add Planned Expenses</Typography>
                                                                </Stack>
                                                                <Typography variant="subtitle2">This is your expected expenses this month.</Typography>
                                                            </Stack>
                                                            <Divider sx={{ pt: 2 }} />
                                                            <Formik
                                                                initialValues={{
                                                                    category: '',
                                                                    amount: 0,
                                                                    submit: null
                                                                }}
                                                                validationSchema={Yup.object().shape({
                                                                    category: Yup.string().max(50).required('Category is required'),
                                                                    amount: Yup.number().typeError('Invalid input, please enter a number')
                                                                        .positive('Number must be greater than zero').required('Category is required')
                                                                })}
                                                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                                    try {
                                                                        if (scriptedRef.current) {
                                                                            const docRef = await addDoc(collection(db, 'Expenses'), {
                                                                                Planned: {
                                                                                    category: values.category,
                                                                                    amount: values.amount,
                                                                                }
                                                                            });
                                                                            console.log('Document written with ID: ', docRef.id);
                                                                            setStatus({ success: true });
                                                                            setSubmitting(false);

                                                                            fetchData();
                                                                            setOpen(false);
                                                                        }
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        if (scriptedRef.current) {
                                                                            setStatus({ success: false });
                                                                            setErrors({ submit: err.message });
                                                                            setSubmitting(false);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {({ errors, handleBlur, handleChange, handleSubmit, touched, isSubmitting, values }) => (
                                                                    <form noValidate onSubmit={handleSubmit}>
                                                                        <FormControl error={Boolean(touched.category && errors.category)} fullWidth sx={{ ...theme.typography.customInput }}>
                                                                            <InputLabel htmlFor="expenses-category">Category</InputLabel>
                                                                            <OutlinedInput
                                                                                id="expenses-category"
                                                                                type='text'
                                                                                value={values.category}
                                                                                name="category"
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                label="Category"
                                                                                inputProps={{}}
                                                                            />
                                                                            {touched.category && errors.category && (
                                                                                <FormHelperText error id="standard-weight-helper-text-category">
                                                                                    {errors.category}
                                                                                </FormHelperText>
                                                                            )}
                                                                        </FormControl>
                                                                        <FormControl error={Boolean(touched.amount && errors.amount)} fullWidth sx={{ ...theme.typography.customInput }}>
                                                                            <InputLabel htmlFor="expenses-amount">Amount</InputLabel>
                                                                            <OutlinedInput
                                                                                id="expenses-amount"
                                                                                type='text'
                                                                                value={values.amount}
                                                                                name="amount"
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                label="Amount"
                                                                                inputProps={{}}
                                                                            />
                                                                            {touched.amount && errors.amount && (
                                                                                <FormHelperText error id="standard-weight-helper-text-amount">
                                                                                    {errors.amount}
                                                                                </FormHelperText>
                                                                            )}
                                                                        </FormControl>
                                                                        <Box sx={{ mt: 2 }}>
                                                                            <AnimateButton>
                                                                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                                                                    Add
                                                                                </Button>
                                                                            </AnimateButton>
                                                                        </Box>
                                                                    </form>
                                                                )}
                                                            </Formik>
                                                        </Box>
                                                    </MainCard>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Transitions>
                                    )}
                                </Popper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard >
    );
}

export default ExpensesCard;