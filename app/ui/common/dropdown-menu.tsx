'use client'
import { faArrowDown, faArrowUp, faChevronDown, faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React, { useState, ReactNode } from 'react';

interface DropDownMenuProps {
    title: string;
    children: ReactNode;
    icon?: FontAwesomeIconProps['icon']
}

export default function DropDownMenu({ title, children, icon }: DropDownMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="w-full max-w-xl mx-auto p-2">
            <div className="w-full flex items-center cursor-pointer gap-2" onClick={toggleExpand}>
            <div className='flex flex-row items-center justify-center gap-2 opacity-80'>
                { icon && <FontAwesomeIcon icon={icon} className='w-6 h-6'/>}
                <h2 className="text-sm">{title}</h2>
            </div>
                <button className="text-sm">
                    {isExpanded ? (<FontAwesomeIcon icon={faChevronDown} className='w-2 h-2 opacity-80'/>) : <FontAwesomeIcon icon={faChevronRight} className='w-2 h-2 opacity-80 '/>}
                </button>
            </div>
            {isExpanded && (
                <div className="w-full mt-4">
                    {children}
                </div>
            )}
        </div>
    );
}
