import { TextBox } from '@/app/types';
import { fonts } from '@/app/utils/fonts';
import { RangeInput } from '../RangeInput';
import { ColorPicker } from '../ColorPicker';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TextControlsProps {
  textBoxes: TextBox[];
  activeTextId: string | null;
  selectedFont: string;
  setActiveTextId: (id: string | null) => void;
  setSelectedFont: (font: string) => void;
  addTextBox: () => void;
  deleteTextBox: (id: string) => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
}

export function TextControls({
  textBoxes,
  activeTextId,
  selectedFont,
  setActiveTextId,
  setSelectedFont,
  addTextBox,
  deleteTextBox,
  updateTextBox,
}: TextControlsProps) {
  return (
    <div className="text-controls">
      <button
        onClick={addTextBox}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
                 text-white bg-blue-500 rounded-md hover:bg-blue-600 mb-4
                 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Add Text
      </button>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {textBoxes.map((textBox) => {
          const currentFont = Object.entries(fonts).find(
            ([_, font]) => font.style.fontFamily === textBox.style.fontFamily
          )?.[0] || 'roboto';

          const textPreview = textBox.message
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || 'New Text';

          return (
            <div 
              key={textBox.id}
              className={`border rounded-lg transition-all duration-300 ease-in-out
                         hover:shadow-sm ${
                activeTextId === textBox.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between p-3">
                <button
                  className="flex-1 flex items-center justify-between min-w-0 
                           transition-colors duration-200 rounded-md hover:bg-blue-100/50 p-1"
                  onClick={() => setActiveTextId(textBox.id === activeTextId ? null : textBox.id)}
                >
                  <span className="text-sm font-medium truncate min-w-0 max-w-[180px]">
                    {textPreview}
                  </span>
                  {activeTextId === textBox.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2 
                                        transition-transform duration-300 ease-in-out" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2 
                                          transition-transform duration-300 ease-in-out" />
                  )}
                </button>
                <button
                  onClick={() => deleteTextBox(textBox.id)}
                  className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded-md 
                           transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeTextId === textBox.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-3 pt-0 border-t transform transition-all duration-300">
                  <div className="space-y-4 mb-6 animate-fadeIn">
                    <h3 className="font-medium text-sm text-gray-700">Content</h3>
                    <div>
                      <label className="text-sm text-gray-600">Text Content</label>
                      <textarea
                        value={textBox.message}
                        onChange={(e) => updateTextBox(textBox.id, { message: e.target.value })}
                        className="w-full mt-1 input-style min-h-[80px] resize-y
                                 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your text here..."
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Font Family</label>
                      <select
                        value={currentFont}
                        onChange={(e) => {
                          const font = e.target.value;
                          setSelectedFont(font);
                          updateTextBox(textBox.id, {
                            style: {
                              ...textBox.style,
                              fontFamily: fonts[font as keyof typeof fonts].style.fontFamily,
                            },
                          });
                        }}
                        className="w-full mt-1 input-style transition-all duration-200 
                                 focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
                      >
                        <option value="roboto">Roboto</option>
                        <option value="playfair">Playfair Display</option>
                        <option value="marker">Permanent Marker</option>
                        <option value="comic">Comic Neue</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 animate-fadeIn animation-delay-100">
                    <h3 className="font-medium text-sm text-gray-700">Style</h3>
                    <ColorPicker
                      label="Text Color"
                      value={textBox.style.color}
                      onChange={(color) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, color },
                        })
                      }
                    />

                    <RangeInput
                      label="Font Size"
                      value={textBox.style.fontSize}
                      onChange={(fontSize) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, fontSize },
                        })
                      }
                      min={12}
                      max={72}
                      defaultValue={24}
                    />

                    <ColorPicker
                      label="Background Color"
                      value={textBox.style.backgroundColor || '#000000'}
                      onChange={(color) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, backgroundColor: color },
                        })
                      }
                    />

                    <RangeInput
                      label="Background Opacity"
                      value={textBox.style.backgroundOpacity ?? 1}
                      onChange={(opacity) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, backgroundOpacity: opacity === 0 ? 0 : opacity || 1 }
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-4 mb-6 animate-fadeIn animation-delay-200">
                    <h3 className="font-medium text-sm text-gray-700">Transform</h3>
                    <RangeInput
                      label="Rotation"
                      value={textBox.style.rotation}
                      onChange={(rotation) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, rotation },
                        })
                      }
                      min={-180}
                      max={180}
                    />

                    <RangeInput
                      label="Scale"
                      value={textBox.style.scale}
                      onChange={(scale) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, scale },
                        })
                      }
                      min={0.5}
                      max={2}
                      step={0.1}
                    />

                    <RangeInput
                      label="Opacity"
                      value={textBox.style.opacity}
                      onChange={(opacity) =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, opacity },
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateTextBox(textBox.id, {
                            style: { ...textBox.style, flipX: !textBox.style.flipX },
                          })
                        }
                        className="flex-1 px-3 py-2 text-sm border rounded-md 
                                 transition-all duration-200 hover:bg-gray-50 
                                 hover:border-gray-300 active:scale-95"
                      >
                        Flip X
                      </button>
                      <button
                        onClick={() =>
                          updateTextBox(textBox.id, {
                            style: { ...textBox.style, flipY: !textBox.style.flipY },
                          })
                        }
                        className="flex-1 px-3 py-2 text-sm border rounded-md 
                                 transition-all duration-200 hover:bg-gray-50 
                                 hover:border-gray-300 active:scale-95"
                      >
                        Flip Y
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 