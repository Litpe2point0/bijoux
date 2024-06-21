import React, { useState, useRef, useEffect } from 'react';
import './FilterToggleButton.css';

export default function FilterToggleButton({ list, filterName, options, updateList }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleOptionChange = (id) => {
        if (list.includes(id)) {
            updateList(id);  // Bỏ optionId ra khỏi mounting_style
        } else {
            updateList(id);  // Thêm optionId vào mounting_style
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block ml-5" ref={buttonRef}>
            <button
                onClick={handleToggle}
                className="bg-white border border-black px-4 py-2 rounded-full flex items-center justify-between w-full"
            >
                <span>{filterName} {list.length > 0 && `(${list.length})`}</span>
                <div className="ml-2 bg-white">
                    <input type="checkbox" id={`checkbox-${filterName}`} checked={isOpen} onChange={handleToggle} className="hidden" />
                    <label htmlFor={`checkbox-${filterName}`} className="toggle relative w-10 h-10 cursor-pointer flex items-center justify-center">
                        <div className="bars" id="bar1"></div>
                        <div className="bars" id="bar2"></div>
                        <div className="bars" id="bar3"></div>
                    </label>
                </div>
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-black rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                    {options.map((option, index) => (
                        // <label key={index} className="block px-4 py-2 cursor-pointer">
                        //     <input
                        //         type="checkbox"
                        //         checked={list.includes(index + 1)}
                        //         onChange={() => handleOptionChange(index + 1)}
                        //         className="mr-2"
                        //     />
                        //     {option.imageUrl ?
                        //         <img src={option.imageUrl} alt={option.name} className="w-10 h-auto inline-block mr-1 align-middle" />
                        //         :
                        //         <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg" className="inline_block mr-1 align-middle">
                        //             <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={option.drawingPath} />
                        //         </svg>
                        //     }

                        //     <span className="align-middle">{option.name}</span>

                        // </label>
                        <label key={index} className="block px-4 py-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={list.includes(index + 1)}
                                onChange={() => handleOptionChange(index + 1)}
                                className="mr-2 align-middle"
                            />
                            {option.imageUrl ? (
                                <img src={option.imageUrl} alt={option.name} className="w-10 h-auto inline-block mr-1 align-middle" />
                            ) : (
                                <svg fill='none' viewBox="0 0 18 18" height="20" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 align-middle">
                                    <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={option.drawingPath} />
                                </svg>
                            )}

                            <span className="align-middle">{option.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
