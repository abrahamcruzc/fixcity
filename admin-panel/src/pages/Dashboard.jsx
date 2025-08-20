import React from 'react';
import { Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de FixCity
      </Typography>
      <Typography variant="body1">
        Bienvenido al panel de administración de FixCity.
      </Typography>
    </div>
  );
};

export default Dashboard;
