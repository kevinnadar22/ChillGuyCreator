import { BackgroundType, TabType } from '@/app/types';
import { Download, Copy } from 'lucide-react';
import { BackgroundControls } from '../controls/BackgroundControls';
import { TextControls } from '../controls/TextControls';
import { VariantControls } from '../controls/VariantControls';
import { ControlPanelProps } from '@/app/types/props';

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
    <div className="w-full lg:w-[320px] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-3">
          <div className="flex gap-1.5">
            {['background', 'text', 'variant'].map((tab) => (
              <button
                key={tab}
                onClick={() => props.setActiveTab(tab as TabType)}
                className={`flex-1 px-3 py-2.5 text-sm rounded-md border transition-colors ${
                  props.activeTab === tab
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
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

      <div className="sticky bottom-0 z-10 p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <button
            onClick={props.onDownload}
            className="action-button flex-1 h-12"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={props.onCopy}
            className="action-button flex-1 h-12"
          >
            <Copy size={18} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
} 