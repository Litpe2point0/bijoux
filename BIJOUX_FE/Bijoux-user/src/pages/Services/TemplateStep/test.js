import React from 'react';

const options = [
    { id: 1, label: 'Solitaire' },
    { id: 2, label: 'Accented' },
    { id: 3, label: 'Halo-style' },
    { id: 4, label: 'Three-Stone' },
    { id: 5, label: 'Five Stone' },
    { id: 6, label: 'Seven-Stone' },
    { id: 7, label: 'Cluster' },
    { id: 8, label: 'Two-Stone' },
];

const ChildComponent = ({ mountingStyle, updateMountingStyle }) => {
    const handleCheckboxChange = (id) => {
        updateMountingStyle(id);
        console.log(mountingStyle);
    };

    return (
        <div>
            {options.map((option) => (
                <div key={option.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={mountingStyle.includes(option.id)}
                            onChange={() => handleCheckboxChange(option.id)}
                        />
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default ChildComponent;