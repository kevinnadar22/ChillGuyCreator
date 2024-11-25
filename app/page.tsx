'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [isVariantLoaded, setIsVariantLoaded] = useState(true);

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
        
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = canvasRef.current.querySelector('.canvas-content') as HTMLElement;
        if (!element) return;

        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Set canvas size
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Draw background
        if (bgType === 'solid') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, width, height);
        } else if (bgType === 'gradient') {
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(0.35, bgColor);
          gradient.addColorStop(1, secondaryBgColor);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        } else if (bgType === 'image' && bgImage) {
          const bgImg = new Image();
          bgImg.crossOrigin = 'anonymous';
          bgImg.src = bgImage;
          await new Promise((resolve, reject) => {
            bgImg.onload = resolve;
            bgImg.onerror = reject;
          });
          ctx.drawImage(bgImg, 0, 0, width, height);
        }

        // Draw variant
        const variantImg = new Image();
        variantImg.crossOrigin = 'anonymous';
        variantImg.src = variantState.selectedVariant;
        await new Promise((resolve, reject) => {
          variantImg.onload = resolve;
          variantImg.onerror = reject;
        });

        // Calculate variant position and dimensions
        const variantHeight = height * 0.5;
        const variantWidth = (variantImg.width / variantImg.height) * variantHeight;
        const { x, y } = variantState.variantPosition;
        const { rotation, scale, flipX, flipY, opacity } = variantState.variantTransform;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x + variantWidth / 2, y + variantHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
        ctx.translate(-variantWidth / 2, -variantHeight / 2);
        ctx.drawImage(variantImg, 0, 0, variantWidth, variantHeight);
        ctx.restore();

        // Draw text layers
        textBoxState.textBoxes.forEach((textBox) => {
          ctx.save();
          const { x, y } = textBox.position;
          const { fontSize, fontFamily, color, rotation, scale, flipX, flipY, opacity } = textBox.style;
          
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
          
          ctx.font = `${fontSize}px ${fontFamily}`;
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.textBaseline = 'top';
          ctx.fillText(textBox.message, 0, 0);
          
          ctx.restore();
        });

        // Get the data URL
        const dataUrl = canvas.toDataURL('image/png');

        // For iOS Safari
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          // Create a temporary link that opens in a new window
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#f5f5f5;">
                  <img src="${dataUrl}" />
                  <p style="position:fixed;bottom:20px;text-align:center;width:100%;font-family:system-ui;">
                    Press and hold the image to save
                  </p>
                </body>
              </html>
            `);
            toast.success('Long press the image to save!');
          } else {
            // If popup is blocked, try direct download
            window.location.href = dataUrl;
          }
        } else {
          // For other browsers
          const link = document.createElement('a');
          link.download = 'chillguy-image.png';
          link.href = dataUrl;
          link.click();
          toast.success('Image downloaded successfully!');
        }
      } catch (err) {
        console.error('Failed to download image:', err);
        toast.error('Failed to download image. Please try again.');
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
        
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = canvasRef.current.querySelector('.canvas-content') as HTMLElement;
        if (!element) return;

        const dataUrl = await toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true,
          canvasWidth: 1200,
          canvasHeight: 1200,
          style: {
            transform: 'none',
            transformOrigin: 'center',
          },
        });

        try {
          const blob = await fetch(dataUrl).then(res => res.blob());
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('Image copied to clipboard!');
        } catch (clipboardError) {
          // Fallback to download if clipboard fails
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

  useEffect(() => {
    setIsVariantLoaded(false);
  }, [variantState.selectedVariant]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-4 flex flex-col gap-6">
        <div className="lg:hidden w-full">
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
            onVariantLoad={() => setIsVariantLoaded(true)}
          />
        </div>

        <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-6">
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
          
          <div className="hidden lg:block lg:flex-1">
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
              onVariantLoad={() => setIsVariantLoaded(true)}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 