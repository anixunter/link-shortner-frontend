import React from 'react';
import {Outlet} from 'react-router-dom'
import NavBar from '@/components/NavBar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <main className="container mx-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout;
