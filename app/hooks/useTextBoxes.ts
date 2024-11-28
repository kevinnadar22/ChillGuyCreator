import { useState } from 'react';
import { TextBox } from '../types';
import { fonts } from '../utils/fonts';

const CANVAS_SIZE = 500;
const PADDING = 60;
const TOP_THIRD = CANVAS_SIZE / 3;

export function useTextBoxes() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('roboto');

  const addTextBox = () => {
    const calculateNewPosition = () => {
      const minX = PADDING;
      const maxX = CANVAS_SIZE - PADDING;
      const minY = PADDING;
      const maxY = TOP_THIRD - PADDING;
      
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      
      return { x, y };
    };

    const position = calculateNewPosition();
    const newText: TextBox = {
      id: Date.now().toString(),
      message: 'New Text',
      position,
      style: {
        color: '#FFFFFF',
        fontSize: 24,
        fontFamily: fonts[selectedFont as keyof typeof fonts].style.fontFamily,
        rotation: 0,
        scale: 1,
        opacity: 1,
        flipX: false,
        flipY: false,
        backgroundColor: '#000000',
        backgroundOpacity: 0,
      },
    };
    setTextBoxes([...textBoxes, newText]);
    setActiveTextId(newText.id);
  };

  const deleteTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter((t) => t.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
    }
  };

  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    setTextBoxes(
      textBoxes.map((textBox) =>
        textBox.id === id
          ? {
              ...textBox,
              ...updates,
              style: updates.style
                ? { ...textBox.style, ...updates.style }
                : textBox.style,
            }
          : textBox
      )
    );
  };

  return {
    textBoxes,
    setTextBoxes,
    activeTextId,
    selectedFont,
    setActiveTextId,
    setSelectedFont,
    addTextBox,
    deleteTextBox,
    updateTextBox,
  };
} 