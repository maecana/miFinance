// import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import ExpensesCard from './ExpensesCard';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Summary = () => {
  // const [isLoading, setLoading] = useState(true);
  // useEffect(() => {
  //     setLoading(false);
  // }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}></Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}></Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}></Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <ExpensesCard />
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Summary;
