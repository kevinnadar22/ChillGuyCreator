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
  onVariantLoad?: () => void;
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
  onVariantLoad,
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
    <div className="w-full flex flex-col items-center">
      <div className="relative bg-transparent w-full aspect-square max-w-[500px] mx-auto rounded-xl overflow-hidden shadow-lg">
        <div 
          ref={ref}
          className="relative bg-transparent h-full w-full touch-none"
          style={{ contain: 'paint' }}
          onMouseMove={onMouseMove}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (touch) {
              onMouseMove({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {},
              } as React.MouseEvent);
            }
          }}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div 
            className="canvas-content relative h-full w-full"
            style={{
              ...getBackgroundStyle(),
              transform: 'translateZ(0)',
            }}
            onClick={onCanvasClick}
          >
            <VariantLayer
              selectedVariant={selectedVariant}
              position={variantPosition}
              transform={variantTransform}
              onMouseDown={onVariantMouseDown}
              onLoad={onVariantLoad}
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