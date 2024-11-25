import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../utils/debounce';

interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  defaultValue?: number;
}

export function RangeInput({
  value,
  onChange,
  min,
  max,
  step = 0.1,
  label,
  defaultValue,
}: RangeInputProps) {
  const handleReset = () => {
    const resetValue = defaultValue ?? {
      'Rotation': 0,
      'Scale': 1,
      'Opacity': 1,
      'Font Size': 24,
    }[label] ?? (max + min) / 2;
    
    onChange(resetValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-600">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {value.toFixed(step >= 1 ? 0 : 1)}
            {label === "Rotation" ? "°" : ""}
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full range-slider"
      />
    </div>
  );
} 