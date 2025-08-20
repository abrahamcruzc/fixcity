import React from 'react';
import { Container } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      {children}
    </Container>
  );
};

export default Layout;
