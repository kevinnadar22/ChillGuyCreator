import { useState } from 'react';
import { TextBox } from '../types';
import { fonts } from '../utils/fonts';

export function useTextBoxes() {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('roboto');

  const addTextBox = () => {
    const calculateNewPosition = () => {
      const baseX = 50;
      const baseY = 50;
      const offsetX = 20;
      const offsetY = 40;
      
      if (textBoxes.length === 0) return { x: baseX, y: baseY };
      
      const row = Math.floor(textBoxes.length / 3);
      const col = textBoxes.length % 3;
      
      return {
        x: baseX + (col * offsetX),
        y: baseY + (row * offsetY)
      };
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
        backgroundOpacity: 1,
      },
    };
    setTextBoxes([...textBoxes, newText]);
    setActiveTextId(newText.id);
  };

  const deleteTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter(text => text.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
    }
  };

  const updateTextBox = (id: string, updates: Partial<TextBox>) => {
    setTextBoxes(textBoxes.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
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