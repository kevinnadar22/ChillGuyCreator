import { forwardRef, ForwardedRef } from 'react';
import { TextLayer } from './TextLayer';
import { VariantLayer } from './VariantLayer';
import { BackgroundType, TextBox, VariantTransform } from '@/app/types';
import { TouchLikeEvent } from '@/app/types/props';

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
  onMouseMove: (e: TouchLikeEvent) => void;
  onMouseUp: () => void;
  onVariantMouseDown: (e: React.MouseEvent) => void;
  onTextMouseDown: (e: React.MouseEvent, id: string) => void;
  onCanvasClick: (e: React.MouseEvent) => void;
  onVariantLoad?: () => void;
  isDownloading?: boolean;
  isDragging?: boolean;
  isTextDragging?: boolean;
  deleteTextBox: (id: string) => void;
  bgOpacity: number;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTextTouchStart: (e: React.TouchEvent, id: string) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
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
  isDragging,
  isTextDragging,
  deleteTextBox,
  bgOpacity,
  onTouchMove,
  onTouchEnd,
  onTextTouchStart,
}: CanvasProps, ref) => {
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
      backgroundColor: bgColor || '#ffffff',
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      onMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {},
        touches: Array.from(e.touches)
      });
    }
  };

  const handleVariantTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    onVariantMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => {},
    } as React.MouseEvent);
  };

  const handleTextTouchStart = (e: React.TouchEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onTextTouchStart(e, id);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative bg-transparent w-full aspect-square max-w-[500px] mx-auto rounded-xl overflow-hidden shadow-lg">
        <div 
          ref={ref}
          className="relative bg-transparent h-full w-full touch-none"
          style={{ contain: 'paint' }}
          onMouseMove={(e) => onMouseMove(e)}
          onTouchMove={handleTouchMove}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
          onMouseLeave={onMouseUp}
        >
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: bgColor }}
          />
          
          {bgType === 'image' && bgImage ? (
            <>
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: bgColor }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  ...getBackgroundStyle(),
                  opacity: bgOpacity,
                }}
              />
            </>
          ) : (
            <div 
              className="absolute inset-0"
              style={getBackgroundStyle()}
            />
          )}
          
          <div 
            className="canvas-content relative h-full w-full"
            style={{
              transform: 'translateZ(0)',
              touchAction: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            onClick={onCanvasClick}
          >
            <VariantLayer
              selectedVariant={selectedVariant}
              position={variantPosition}
              transform={variantTransform}
              onMouseDown={onVariantMouseDown}
              onTouchStart={handleVariantTouchStart}
              onLoad={onVariantLoad}
              isDragging={isDragging}
            />
            <TextLayer
              textBoxes={textBoxes}
              activeTextId={activeTextId}
              onTextMouseDown={onTextMouseDown}
              onTextTouchStart={handleTextTouchStart}
              isDownloading={isDownloading}
              isDragging={isTextDragging}
              onDeleteText={deleteTextBox}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas'; 