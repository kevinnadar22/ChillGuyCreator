import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/debounce';

interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  debounce?: boolean;
  defaultValue?: number;
}

export function RangeInput({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  label,
  debounce: shouldDebounce = true,
  defaultValue
}: RangeInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  // Create a debounced version of onChange
  const debouncedOnChange = useCallback(
    debounce((value: number) => {
      onChange(value);
    }, 16),
    [onChange]
  );

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    
    if (shouldDebounce) {
      debouncedOnChange(newValue);
    } else {
      onChange(newValue);
    }
  };

  const handleReset = () => {
    const resetValue = defaultValue ?? (max + min) / 2;
    setLocalValue(resetValue);
    onChange(resetValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {label === "Rotation" ? `${Math.round(localValue)}°` : Math.round(localValue)}
          </span>
          <button
            onClick={handleReset}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Reset to default"
          >
            ↺
          </button>
        </div>
      </div>
      <input
        type="range"
        value={localValue}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        min={min}
        max={max}
        step={step}
        className="w-full range-slider"
      />
    </div>
  );
} 