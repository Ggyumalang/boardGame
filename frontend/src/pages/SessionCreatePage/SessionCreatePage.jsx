import React from 'react';
import Navbar from '../../shared/ui/Navbar';
import SessionForm from '../../features/session/SessionForm';

const SessionCreatePage = () => {
    return (
        <div className="min-h-screen bg-bg-secondary">
            <Navbar />

            <div className="container py-xl">
                <SessionForm />
            </div>
        </div>
    );
};

export default SessionCreatePage;
