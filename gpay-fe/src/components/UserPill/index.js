import React from 'react'

const UserPill = ({ name, active }) => {
    return (
        <div style={{
            backgroundColor: "#f3f3f311",
            border: "1px solid #ccc",
            borderRadius: 24,
            padding: 8,
            margin: 8,
            backgroundColor: `${active && "#03a9f4"}`,
            color: `${active && "#000"}`
        }}>
            {name}
        </div>
    )
}

export default UserPill
