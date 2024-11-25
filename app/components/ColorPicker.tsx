interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const newValue = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue)) {
              onChange(newValue);
            }
          }}
          className="flex-1 input-style font-mono uppercase"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
} 