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
    <div>
      <button
        onClick={addTextBox}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 mb-4"
      >
        <Plus className="w-4 h-4" />
        Add Text
      </button>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {textBoxes.map((textBox) => {
          const currentFont = Object.entries(fonts).find(
            ([_, font]) => font.style.fontFamily === textBox.style.fontFamily
          )?.[0] || 'roboto';

          return (
            <div 
              key={textBox.id}
              className={`border rounded-lg transition-all duration-200 ${
                activeTextId === textBox.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between p-3">
                <button
                  className="flex-1 flex items-center justify-between"
                  onClick={() => setActiveTextId(textBox.id === activeTextId ? null : textBox.id)}
                >
                  <span className="text-sm font-medium truncate">
                    {textBox.message || 'New Text'}
                  </span>
                  {activeTextId === textBox.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => deleteTextBox(textBox.id)}
                  className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  activeTextId === textBox.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-3 pt-0 border-t space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Text Content</label>
                    <input
                      type="text"
                      value={textBox.message}
                      onChange={(e) => updateTextBox(textBox.id, { message: e.target.value })}
                      className="w-full mt-1 input-style"
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
                      className="w-full mt-1 input-style"
                    >
                      <option value="roboto">Roboto</option>
                      <option value="playfair">Playfair Display</option>
                      <option value="marker">Permanent Marker</option>
                      <option value="comic">Comic Neue</option>
                    </select>
                  </div>

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
                      className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Flip X
                    </button>
                    <button
                      onClick={() =>
                        updateTextBox(textBox.id, {
                          style: { ...textBox.style, flipY: !textBox.style.flipY },
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Flip Y
                    </button>
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