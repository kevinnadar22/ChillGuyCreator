import { BackgroundType } from '@/app/types';
import { ColorPicker } from '../ColorPicker';

interface BackgroundControlsProps {
  bgType: BackgroundType;
  setBgType: (type: BackgroundType) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  secondaryBgColor: string;
  setSecondaryBgColor: (color: string) => void;
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
}

export function BackgroundControls({
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  secondaryBgColor,
  setSecondaryBgColor,
  bgImage,
  setBgImage,
}: BackgroundControlsProps) {
  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Background Type</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {['solid', 'gradient', 'image'].map((type) => (
          <button
            key={type}
            onClick={() => setBgType(type as BackgroundType)}
            className={`px-3 py-2 text-sm rounded-md border ${
              bgType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {bgType === 'solid' && (
        <ColorPicker 
          label="Background Color" 
          value={bgColor} 
          onChange={setBgColor}
        />
      )}

      {bgType === 'gradient' && (
        <>
          <ColorPicker 
            label="Primary Color" 
            value={bgColor} 
            onChange={setBgColor}
          />
          <div className="mt-4">
            <ColorPicker 
              label="Secondary Color" 
              value={secondaryBgColor} 
              onChange={setSecondaryBgColor}
            />
          </div>
        </>
      )}

      {bgType === 'image' && (
        <div className="mt-4">
          <label className="text-sm text-gray-600">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBgImageChange}
            className="mt-2 w-full"
          />
        </div>
      )}
    </div>
  );
} 