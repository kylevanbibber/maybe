import React, { useState } from 'react';

const AddAgent = () => {
    const [agentName, setAgentName] = useState('');
    const [contractLevel, setContractLevel] = useState('');
    const [upline, setUpline] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/agents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agentName, contractLevel, upline }),
        });
        if (response.ok) {
            console.log('Agent added successfully!');
            setAgentName('');
            setContractLevel('');
            setUpline('');
        } else {
            console.error('Failed to add agent');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Agent Name:
                <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
            </label>
            <label>
                Contract Level:
                <input type="text" value={contractLevel} onChange={(e) => setContractLevel(e.target.value)} />
            </label>
            <label>
                Upline:
                <input type="text" value={upline} onChange={(e) => setUpline(e.target.value)} />
            </label>
            <button type="submit">Add Agent</button>
        </form>
    );
};

export default AddAgent;
