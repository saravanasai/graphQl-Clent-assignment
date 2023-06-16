import * as React from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import { Container } from '@mui/material';


const AppLayout = ({ children }) => {
    return (
        <>
            <NavBar />
            <Container component="main" >
                {children}
            </Container>

            {/* <Footer /> */}
        </>
    )
}

export default AppLayout