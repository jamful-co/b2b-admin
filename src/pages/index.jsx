import Layout from "./Layout.jsx";

import Welcome from "./Welcome";

import Dashboard from "./Dashboard";

import Groups from "./Groups";

import Employees from "./Employees";

import Settlements from "./Settlements";

import SettlementDetails from "./SettlementDetails";

import Home from "./Home";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Welcome: Welcome,
    
    Dashboard: Dashboard,
    
    Groups: Groups,
    
    Employees: Employees,
    
    Settlements: Settlements,
    
    SettlementDetails: SettlementDetails,
    
    Home: Home,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Welcome />} />
                
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Groups" element={<Groups />} />
                
                <Route path="/Employees" element={<Employees />} />
                
                <Route path="/Settlements" element={<Settlements />} />
                
                <Route path="/SettlementDetails" element={<SettlementDetails />} />
                
                <Route path="/Home" element={<Home />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}