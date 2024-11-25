'use client';

import { useState, useRef } from 'react';
import { Canvas } from './components/canvas/Canvas';
import { ControlPanel } from './components/layout/ControlPanel';
import { useTextBoxes } from './hooks/useTextBoxes';
import { BackgroundType, TabType } from './types';
import { Header } from './components/layout/Header';
import { useVariant } from './hooks/useVariant';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

export default function Home() {
  const [bgColor, setBgColor] = useState('#295144');
  const [bgType, setBgType] = useState<BackgroundType>('solid');
  const [secondaryBgColor, setSecondaryBgColor] = useState('#1a3830');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('background');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTextDragging, setIsTextDragging] = useState(false);
  const [textDragStart, setTextDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  const textBoxState = useTextBoxes();
  const variantState = useVariant();
  const { setVariantPosition } = variantState;

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setVariantPosition({ x: newX, y: newY });
    }
    
    if (isTextDragging && textBoxState.activeTextId) {
      const newX = e.clientX - textDragStart.x;
      const newY = e.clientY - textDragStart.y;
      textBoxState.updateTextBox(textBoxState.activeTextId, {
        position: { x: newX, y: newY }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsTextDragging(false);
  };

  const handleVariantMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - variantState.variantPosition.x,
      y: e.clientY - variantState.variantPosition.y
    });
  };

  const handleTextMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    textBoxState.setActiveTextId(id);
    setIsTextDragging(true);
    
    const textBox = textBoxState.textBoxes.find(t => t.id === id);
    if (textBox) {
      setTextDragStart({
        x: e.clientX - textBox.position.x,
        y: e.clientY - textBox.position.y
      });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('canvas-content')) {
      textBoxState.setActiveTextId(null);
    }
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      try {
        setIsDownloading(true);
        textBoxState.setActiveTextId(null);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const element = canvasRef.current.querySelector('.canvas-content') as HTMLElement;
        if (!element) return;

        const dataUrl = await toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
        });
        
        const link = document.createElement('a');
        link.download = 'chillguy-image.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image:', err);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleCopy = async () => {
    if (canvasRef.current) {
      try {
        setIsDownloading(true);
        textBoxState.setActiveTextId(null);
        
        await new Promise(resolve => setTimeout(resolve, 0));

        const element = canvasRef.current.querySelector('.canvas-content') as HTMLElement;
        if (!element) return;

        const dataUrl = await toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
        });

        try {
          await navigator.clipboard.writeText(dataUrl);
          toast.success('Image URL copied to clipboard!');
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          // If clipboard fails, trigger download instead
          const link = document.createElement('a');
          link.download = 'chillguy-image.png';
          link.href = dataUrl;
          link.click();
          toast.success('Image downloaded instead!');
        }
      } catch (err) {
        console.error('Failed to process image:', err);
        toast.error('Failed to copy image. Please try downloading instead.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <main className="overflow-y-auto">
      <Header />
      
      <div className="mt-8 2xl:mt-16 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="flex flex-col-reverse md:flex-row items-start gap-8 md:gap-0 md:items-center md:max-w-[1056px] mx-auto">
          <ControlPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bgType={bgType}
            setBgType={setBgType}
            bgColor={bgColor}
            setBgColor={setBgColor}
            secondaryBgColor={secondaryBgColor}
            setSecondaryBgColor={setSecondaryBgColor}
            bgImage={bgImage}
            setBgImage={setBgImage}
            {...textBoxState}
            {...variantState}
            onDownload={handleDownload}
            onCopy={handleCopy}
          />
          
          <Canvas
            bgType={bgType}
            bgColor={bgColor}
            bgImage={bgImage}
            secondaryBgColor={secondaryBgColor}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onVariantMouseDown={handleVariantMouseDown}
            onTextMouseDown={handleTextMouseDown}
            textBoxes={textBoxState.textBoxes}
            activeTextId={textBoxState.activeTextId}
            {...variantState}
            onCanvasClick={handleCanvasClick}
            isDownloading={isDownloading}
            ref={canvasRef}
          />
        </div>
      </div>
    </main>
  );
} 