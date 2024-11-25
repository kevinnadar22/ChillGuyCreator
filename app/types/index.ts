export type TextBox = {
  id: string;
  message: string;
  position: { x: number; y: number };
  style: {
    color: string;
    fontSize: number;
    fontFamily: string;
    rotation: number;
    scale: number;
    opacity: number;
    flipX: boolean;
    flipY: boolean;
  };
};

export type VariantTransform = {
  rotation: number;
  scale: number;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
};

export type BackgroundType = 'solid' | 'gradient' | 'image';
export type TabType = 'background' | 'text' | 'variant'; 