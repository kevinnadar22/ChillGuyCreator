import { TextBox, VariantTransform, BackgroundType, TabType } from './index';
import { Dispatch, SetStateAction } from 'react';

export interface ControlPanelProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  bgType: BackgroundType;
  setBgType: (type: BackgroundType) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  secondaryBgColor: string;
  setSecondaryBgColor: (color: string) => void;
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
  bgOpacity: number;
  setBgOpacity: (opacity: number) => void;
  textBoxes: TextBox[];
  setTextBoxes: Dispatch<SetStateAction<TextBox[]>>;
  activeTextId: string | null;
  selectedFont: string;
  setActiveTextId: (id: string | null) => void;
  setSelectedFont: (font: string) => void;
  addTextBox: () => void;
  deleteTextBox: (id: string) => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
  selectedVariant: string;
  variantPosition: { x: number; y: number };
  variantTransform: VariantTransform;
  setSelectedVariant: (variant: string) => void;
  setVariantTransform: (transform: VariantTransform) => void;
  onDownload: () => void;
  onReset: () => void;
}

export interface TouchLikeEvent {
  clientX: number;
  clientY: number;
  preventDefault: () => void;
  touches?: { clientX: number; clientY: number }[];
}

export interface CanvasProps {
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