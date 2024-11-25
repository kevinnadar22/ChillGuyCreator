import { BackgroundType, TabType } from '@/app/types';
import { Download, Copy } from 'lucide-react';
import { BackgroundControls } from '../controls/BackgroundControls';
import { TextControls } from '../controls/TextControls';
import { VariantControls } from '../controls/VariantControls';

interface ControlPanelProps {
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
  // From textBoxState
  textBoxes: any[];
  activeTextId: string | null;
  selectedFont: string;
  setActiveTextId: (id: string | null) => void;
  setSelectedFont: (font: string) => void;
  addTextBox: () => void;
  deleteTextBox: (id: string) => void;
  updateTextBox: (id: string, updates: any) => void;
  // From variantState
  selectedVariant: string;
  variantPosition: { x: number; y: number };
  variantTransform: any;
  setSelectedVariant: (variant: string) => void;
  setVariantTransform: (transform: any) => void;
  // Action handlers
  onDownload: () => void;
  onCopy: () => void;
}

export function ControlPanel(props: ControlPanelProps) {
  const handleDownload = async () => {
    if (props.onDownload) {
      await props.onDownload();
    }
  };

  const handleCopy = async () => {
    if (props.onCopy) {
      await props.onCopy();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full md:w-80 md:min-w-[320px] h-fit rounded-lg py-6 bg-white border">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => props.setActiveTab('background')}
            className={`flex-1 py-2 text-sm font-medium ${
              props.activeTab === 'background' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            Background
          </button>
          <button
            onClick={() => props.setActiveTab('text')}
            className={`flex-1 py-2 text-sm font-medium ${
              props.activeTab === 'text' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => props.setActiveTab('variant')}
            className={`flex-1 py-2 text-sm font-medium ${
              props.activeTab === 'variant' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
            }`}
          >
            Variant
          </button>
        </div>

        <div className="px-6">
          {props.activeTab === 'background' && (
            <BackgroundControls {...props} />
          )}

          {props.activeTab === 'text' && (
            <TextControls {...props} />
          )}

          {props.activeTab === 'variant' && (
            <VariantControls {...props} />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full md:w-80 md:min-w-[320px] flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-white border rounded-lg hover:bg-gray-50"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  );
} 