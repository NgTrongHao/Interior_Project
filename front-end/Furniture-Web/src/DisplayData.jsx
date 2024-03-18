import React, { useState, useEffect } from 'react';
import fetchData from './http.js';

function DisplayData() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            const data = await fetchData('PENDING');
            if (data) {
                setRequests(data);
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {requests.map(request => (
                        <li key={request.id}>{request.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DisplayData