import React, { useState, KeyboardEvent } from 'react';

interface KeywordInputProps {
    value: string | undefined | null;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function KeywordInput({ value, onChange, placeholder }: KeywordInputProps) {
    const [inputValue, setInputValue] = useState('');

    // Safely parse the comma-separated string into an array of trimmed strings
    const keywords = value ? value.split(',').map(k => k.trim()).filter(k => k) : [];

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Treat 'Enter' or comma as a trigger to lock in a new capsule
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault(); // crucial to prevent the whole <form> from submitting

            const val = inputValue.trim();
            // Only push if valid and not a duplicate
            if (val && !keywords.includes(val)) {
                onChange([...keywords, val].join(', '));
            }
            setInputValue(''); // Clear the localized typing box
        }
        // Optional: allow backspace to delete the last keyword if the input is empty
        else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
            e.preventDefault();
            const poppedKeywords = [...keywords];
            poppedKeywords.pop();
            onChange(poppedKeywords.join(', '));
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        onChange(keywords.filter(k => k !== keywordToRemove).join(', '));
    };

    return (
        <div className="w-full border border-slate-600 p-2 rounded focus-within:ring-2 focus-within:ring-cyan-500 bg-slate-700 min-h-[42px] flex flex-wrap gap-2 items-center">
            {keywords.map((keyword, i) => (
                <span key={`${keyword}-${i}`} className="bg-cyan-900 text-cyan-100 px-2.5 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-sm border border-cyan-700">
                    {keyword}
                    <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-cyan-400 hover:text-cyan-100 hover:bg-cyan-800 rounded-full w-4 h-4 flex items-center justify-center font-bold focus:outline-none transition-colors"
                        title="Remove keyword"
                    >
                        &times;
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={keywords.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-slate-100 placeholder-slate-400"
            />
        </div>
    );
}
