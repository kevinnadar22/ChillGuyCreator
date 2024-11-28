import { VariantTransform } from '@/app/types';
import { useEffect, useState } from 'react';

interface VariantLayerProps {
  selectedVariant: string;
  position: { x: number; y: number };
  transform: VariantTransform;
  onMouseDown: (e: React.MouseEvent) => void;
  onLoad?: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isDragging?: boolean;
}

export function VariantLayer({
  selectedVariant,
  position,
  transform,
  onMouseDown,
  onLoad,
  onTouchStart,
  isDragging = false,
}: VariantLayerProps) {
  useEffect(() => {
    const img = new Image();
    img.src = selectedVariant;
    if (onLoad) {
      img.onload = () => onLoad();
    }
  }, [selectedVariant, onLoad]);

  return (
    <img
      src={selectedVariant}
      alt="Character variant"
      className={`absolute cursor-move ${isDragging ? 'dragging' : ''}`}
      style={{
        height: '50%',
        width: 'auto',
        objectFit: 'contain',
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        touchAction: 'none',
        transform: `
          rotate(${transform.rotation}deg)
          scale(${transform.scale * (transform.flipX ? -1 : 1)}, 
                ${transform.scale * (transform.flipY ? -1 : 1)})
        `,
        opacity: transform.opacity,
      }}
      onLoad={onLoad}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      draggable={false}
    />
  );
} 