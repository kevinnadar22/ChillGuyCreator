import { BackgroundType } from '@/app/types';
import { ColorPicker } from '../ColorPicker';
import { Trash2, Upload } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { RangeInput } from '../RangeInput';

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
}: Omit<BackgroundControlsProps, 'bgOpacity' | 'setBgOpacity'>) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGlobalDragOver, setIsGlobalDragOver] = useState(false);

  // Handle global drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsGlobalDragOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only hide if we're leaving the window
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientY >= window.innerHeight || 
          e.clientX >= window.innerWidth) {
        setIsGlobalDragOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsGlobalDragOver(false);
      setIsDragOver(false);

      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) {
        processImageFile(file);
        setBgType('image');
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [setBgType]);

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBgImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
      setBgType('image');
    }
  }, [setBgType, setBgImage]);

  const clearImage = () => {
    setBgImage(null);
  };

  return (
    <>
      {/* Global drag overlay */}
      {isGlobalDragOver && (
        <div className="fixed inset-0 bg-blue-500/10 backdrop-blur-sm z-50 pointer-events-none">
          <div className="absolute inset-0 border-2 border-blue-500 border-dashed m-8 rounded-3xl flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg">
              <Upload className="w-6 h-6 text-blue-500" />
              <p className="text-lg font-medium text-blue-800">Drop image to set as background</p>
            </div>
          </div>
        </div>
      )}

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
          <div 
            className="mt-4 relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={`
              border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200
              ${isDragOver ? 'border-blue-500 bg-blue-50 scale-102' : ''}
              ${bgImage ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}
            `}>
              {bgImage ? (
                <div className="relative">
                  <img 
                    src={bgImage} 
                    alt="Background" 
                    className="max-h-40 mx-auto rounded"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                    title="Clear image"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {isDragOver ? 'Drop image here' : 'Drag and drop an image here, or'}
                  </p>
                  <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 