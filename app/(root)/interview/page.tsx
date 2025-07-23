import React from 'react';
import Agent from "@components/Agent"

const Page = () => {
    return (
        <>
            <h3>Interview Generator</h3>

            <Agent userName="You" userId="user1" type="generate" />
        </>
    );
};

export default Page;