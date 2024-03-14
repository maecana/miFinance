import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'plannedAmount', headerName: 'Amount', width: 130 },
    { field: 'sumOfActual', headerName: 'Actual', width: 130 },
    { field: 'difference', headerName: 'Difference', width: 130 }
];

const ExpenseTable = ({ rows }) => {
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 }
                }
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
        />
    );
};

export default ExpenseTable;
