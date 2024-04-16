import React, { useState, useEffect } from 'react';

const Reports = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const downloadCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["UserID", "Username", "Points"].join(",") + "\n" // Column headers
            + users.map(user => [user.UserId, user.UserName, user.Points].join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "driver_points_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="reports">
            <header className="report-header">
                <h1>Reports</h1>
            </header>
            <section className="user-list">
                <button onClick={downloadCsv}>Download Driver Points Report</button>
            </section>
            <footer className="report-footer">
                <p>Contact us at support@truckapp.com</p>
            </footer>
        </div>
    );
};

export default Reports;
