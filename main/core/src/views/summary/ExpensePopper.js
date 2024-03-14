import React from 'react';

// material-ui
import { Typography, Popper, Paper, ClickAwayListener, Stack, Divider, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import AddPlannedExpensesForm from './AddPlannedExpensesForm';

const ExpensePopper = ({ open, anchorRef, handleClose, fetchData, setOpen }) => {
    const theme = useTheme();
    return (
        <Popper
            style={{ position: 'relative', zIndex: 2 }}
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
                                    <Stack sx={{ p: 2 }}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="h4">Add Planned Expenses</Typography>
                                        </Stack>
                                        <Typography variant="subtitle2">This is your expected expenses this month.</Typography>
                                    </Stack>
                                    <Divider sx={{ pt: 2 }} />
                                    <AddPlannedExpensesForm setOpen={setOpen} fetchData={fetchData} />
                                </Box>
                            </MainCard>
                        </ClickAwayListener>
                    </Paper>
                </Transitions>
            )}
        </Popper>
    );
};

export default ExpensePopper;
