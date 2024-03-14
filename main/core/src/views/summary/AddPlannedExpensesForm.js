import React from 'react';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Box, FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'firebase-config';
import useScriptRef from 'hooks/useScriptRef';

const AddPlannedExpensesForm = ({ setOpen, fetchData }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values, { setErrors, setStatus }) => {
        try {
            if (scriptedRef.current) {
                setSubmitting(true);
                const docRef = await addDoc(collection(db, 'Expenses'), {
                    category: values.category,
                    plannedAmount: values.amount,
                    actualAmount: []
                });
                console.log('Document written with ID: ', docRef.id);
                setStatus({ success: true });
                setSubmitting(false);
                setOpen(false);
                fetchData();
            }
        } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
        }
    };

    return (
        <Formik
            initialValues={{
                category: '',
                amount: 0
            }}
            validationSchema={Yup.object().shape({
                category: Yup.string().max(50).required('Category is required'),
                amount: Yup.number()
                    .typeError('Invalid input, please enter a number')
                    .positive('Number must be greater than zero')
                    .required('Category is required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <FormControl error={Boolean(touched.category && errors.category)} fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="expenses-category">Category</InputLabel>
                        <OutlinedInput
                            id="expenses-category"
                            type="text"
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
                            type="text"
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
                        <Button disableElevation disabled={submitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                            Add
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AddPlannedExpensesForm;
