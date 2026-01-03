import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberControlProps {
    value: number | undefined;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    label?: string; // Floating label or internal indicator
    className?: string;
    disabled?: boolean;
    endElement?: React.ReactNode;
}

export const NumberControl = ({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    placeholder,
    label,
    className = "",
    disabled = false,
    endElement
}: NumberControlProps) => {

    // Handle manual input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (isNaN(val)) {
            // Allow empty temporarily or handle as 0 depending on UX logic
            // Here we might want to allow clearing effectively
            onChange(0); // Converting empty/NaN to 0 for simplicity in this specific app context
        } else {
            onChange(val);
        }
    };

    const increment = () => {
        const current = value || 0;
        const next = parseFloat((current + step).toFixed(2)); // Avoid float precision issues
        if (max !== undefined && next > max) return;
        onChange(next);
    };

    const decrement = () => {
        const current = value || 0;
        const next = parseFloat((current - step).toFixed(2));
        if (next < min) return;
        onChange(next);
    };

    return (
        <div className={`relative flex items-center group/input ${className}`}>
            <input
                type="number"
                value={value || ''}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full bg-black/40 border border-white/10 rounded-lg pl-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-violet-500/50 appearance-none m-0 transition-colors hover:border-white/20 ${endElement ? 'pr-14' : 'pr-8'}`}
            />

            {/* Custom Label/Indicator if provided (e.g. "W", "H") */}
            {label && (
                <span className="absolute right-7 top-1.5 text-[10px] text-gray-600 pointer-events-none font-medium">
                    {label}
                </span>
            )}

            {/* End Element (e.g. Unit Toggle) */}
            {endElement && (
                <div className="absolute right-6 top-1 bottom-1 flex items-center">
                    {endElement}
                </div>
            )}

            {/* Spinners - Visible on Hover or Focus of group */}
            <div className="absolute right-1 top-[1px] bottom-[1px] flex flex-col justify-center w-5 border-l border-white/5 my-1 pl-1">
                <button
                    type="button"
                    onClick={increment}
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-white/5 rounded-tr rounded-tl transition-colors disabled:opacity-50"
                    tabIndex={-1}
                >
                    <ChevronUp className="w-2.5 h-2.5" />
                </button>
                <button
                    type="button"
                    onClick={decrement}
                    disabled={disabled}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-white/5 rounded-br rounded-bl transition-colors disabled:opacity-50"
                    tabIndex={-1}
                >
                    <ChevronDown className="w-2.5 h-2.5" />
                </button>
            </div>
        </div>
    );
};
