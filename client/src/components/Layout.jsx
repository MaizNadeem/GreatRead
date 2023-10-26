import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <>
            <Header />
            <div className='pt-40 sm:pt-36'>
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default Layout;
