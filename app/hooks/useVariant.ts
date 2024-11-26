import { useState } from 'react';
import { VariantTransform } from '../types';

const variants = ['/variants/1.png', '/variants/2.png', '/variants/3.png'];

export function useVariant() {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [variantPosition, setVariantPosition] = useState({ x: 140, y: 120 });
  const [variantTransform, setVariantTransform] = useState<VariantTransform>({
    rotation: 0,
    scale: 1,
    opacity: 1,
    flipX: false,
    flipY: false,
  });

  return {
    selectedVariant,
    variantPosition,
    variantTransform,
    setSelectedVariant,
    setVariantPosition,
    setVariantTransform,
  };
} 