import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRing, faGem, faImage, fa4 } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

export default function ProgressBar({ progressState }) {
    const defaultColor = '#151542';
    const activeColor = '#db9e23';

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="md:grid md:grid-cols-3 xs:grid-cols-1 md:h-20 xs:h-auto w-3/4 m-10 bg-white md:rounded-full xs:rounded-sm border border-black">
                <div className="flex items-center w-full relative">
                    <div className="ml-5 flex items-center hover:cursor-pointer">
                        <h1
                            className="font-loraFont xs:text-2xl md:text-4xl"
                            style={{ color: progressState === 1 ? activeColor : defaultColor }}
                        >
                            1
                        </h1>
                        <p
                            className="font-gantariFont xs:text-md text-lg font-semibold ml-5"
                            style={{ color: progressState === 1 ? activeColor : defaultColor }}
                        >
                            Choose A Model Settings
                        </p>
                    </div>
                    <div className="absolute right-5" style={{ color: progressState === 1 ? activeColor : defaultColor }}>
                        <FontAwesomeIcon icon={faRing} size="2x" />
                    </div>
                </div>
                <div className="flex items-center md:border-l md:border-r border-black w-full relative">
                    <div className="ml-5 flex items-center hover:cursor-pointer">
                        <h1
                            className="font-loraFont xs:text-2xl md:text-4xl"
                            style={{ color: progressState === 2 ? activeColor : defaultColor }}
                        >
                            2
                        </h1>
                        <p
                            className="font-gantariFont xs:text-md text-lg font-semibold ml-5"
                            style={{ color: progressState === 2 ? activeColor : defaultColor }}
                        >
                            Choose a Diamonds
                        </p>
                    </div>
                    <div className="absolute right-5" style={{ color: progressState === 2 ? activeColor : defaultColor }}>
                        <FontAwesomeIcon icon={faGem} size="2x" />
                    </div>
                </div>
                <div className="flex items-center w-full relative">
                    <div className="ml-5 flex items-center hover:cursor-pointer">
                        <h1
                            className="font-loraFont xs:text-2xl md:text-4xl"
                            style={{ color: progressState === 3 ? activeColor : defaultColor }}
                        >
                            3
                        </h1>
                        <p
                            className="font-gantariFont xs:text-md text-lg font-semibold ml-5"
                            style={{ color: progressState === 3 ? activeColor : defaultColor }}
                        >
                            View Complete Jewelry
                        </p>
                    </div>
                    <div className="absolute right-5" style={{ color: progressState === 3 ? activeColor : defaultColor }}>
                        <FontAwesomeIcon icon={faImage} size="2x" />
                    </div>
                </div>
            </div>
        </div>
    );
}