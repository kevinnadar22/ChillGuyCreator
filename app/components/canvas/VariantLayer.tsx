import { VariantTransform } from '@/app/types';
import { useEffect } from 'react';

interface VariantLayerProps {
  selectedVariant: string;
  position: { x: number; y: number };
  transform: VariantTransform;
  onMouseDown: (e: React.MouseEvent) => void;
  onLoad?: () => void;
}

export function VariantLayer({
  selectedVariant,
  position,
  transform,
  onMouseDown,
  onLoad,
}: VariantLayerProps) {
  useEffect(() => {
    // Preload the image when variant changes
    const img = new Image();
    img.src = selectedVariant;
    img.onload = onLoad;
  }, [selectedVariant, onLoad]);

  return (
    <img
      src={selectedVariant}
      alt="Character variant"
      className="absolute cursor-move"
      style={{
        height: '50%',
        width: 'auto',
        objectFit: 'contain',
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        transform: `
          rotate(${transform.rotation}deg)
          scale(${transform.scale * (transform.flipX ? -1 : 1)}, 
                ${transform.scale * (transform.flipY ? -1 : 1)})
        `,
        opacity: transform.opacity,
      }}
      onLoad={onLoad}
      onMouseDown={onMouseDown}
      draggable={false}
    />
  );
} 