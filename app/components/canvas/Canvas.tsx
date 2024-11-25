import { forwardRef, ForwardedRef } from 'react';
import { TextLayer } from './TextLayer';
import { VariantLayer } from './VariantLayer';
import { BackgroundType, TextBox, VariantTransform } from '@/app/types';

interface CanvasProps {
  bgType: BackgroundType;
  bgColor: string;
  bgImage: string | null;
  secondaryBgColor: string;
  textBoxes: TextBox[];
  activeTextId: string | null;
  variantPosition: { x: number; y: number };
  selectedVariant: string;
  variantTransform: VariantTransform;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onVariantMouseDown: (e: React.MouseEvent) => void;
  onTextMouseDown: (e: React.MouseEvent, id: string) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
}

export const Canvas = forwardRef(({
  bgType,
  bgColor,
  bgImage,
  secondaryBgColor,
  textBoxes,
  activeTextId,
  variantPosition,
  selectedVariant,
  variantTransform,
  onMouseMove,
  onMouseUp,
  onVariantMouseDown,
  onTextMouseDown,
  onCanvasClick,
  isDownloading = false,
}: CanvasProps & { isDownloading?: boolean }, ref: ForwardedRef<HTMLDivElement>) => {
  const getBackgroundStyle = () => {
    const baseStyle = {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    if (bgType === 'image' && bgImage) {
      return {
        ...baseStyle,
        backgroundImage: `url(${bgImage})`,
      };
    } else if (bgType === 'gradient') {
      return {
        ...baseStyle,
        backgroundImage: `linear-gradient(to bottom, 
          ${bgColor} 0%, 
          ${bgColor} 35%, 
          ${secondaryBgColor} 100%
        )`,
      };
    }
    return {
      ...baseStyle,
      backgroundColor: bgColor,
    };
  };

  return (
    <div className="w-full md:flex-1 md:ml-6 flex flex-col items-center">
      <div className="relative bg-transparent mx-auto h-[600px] w-[600px]">
        <div 
          ref={ref}
          className="relative bg-transparent h-full w-full"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div 
            className="canvas-content relative rounded-xl h-full w-full shadow-lg overflow-hidden"
            style={getBackgroundStyle()}
            onClick={onCanvasClick}
          >
            <VariantLayer
              selectedVariant={selectedVariant}
              position={variantPosition}
              transform={variantTransform}
              onMouseDown={onVariantMouseDown}
            />
            <TextLayer
              textBoxes={textBoxes}
              activeTextId={activeTextId}
              onTextMouseDown={onTextMouseDown}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas'; 