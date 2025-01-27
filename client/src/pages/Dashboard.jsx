import React from 'react';
import { Link } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';

function Dashboard() {
    const { design } = useDesign();
    const operatorId = '9DvovMak0D';

    return (
        <div
            style={{ backgroundColor: design.primaryColor, fontFamily: design.font }}
        >
            <h1>Dashboard</h1>
            <Link to={`/design-panel?operatorId=${operatorId}`}>
                Open Design Panel
            </Link>
        </div>
    );
}

export default Dashboard;