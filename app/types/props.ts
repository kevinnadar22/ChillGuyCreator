import { TextBox, VariantTransform, BackgroundType, TabType } from './index';

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
  textBoxes: TextBox[];
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
} 