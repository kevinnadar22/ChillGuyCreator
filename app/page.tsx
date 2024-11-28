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
import { TextBox } from '@/app/types';
import { getFontFamilyForDownload } from '@/app/utils/fonts';

interface TouchLikeEvent {
  clientX: number;
  clientY: number;
  touches?: { clientX: number; clientY: number }[];
}

const CANVAS_SIZE = 500; // Base canvas size
const VARIANT_SIZE = 250; // Approximate size of variant (50% of canvas)
const TEXT_SIZE = 24; // Default text size

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
  const [bgOpacity, setBgOpacity] = useState(1);

  const textBoxState = useTextBoxes();
  const variantState = useVariant();
  const { setVariantPosition } = variantState;

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: TouchLikeEvent) => {
    if (isDragging) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      // Calculate new position
      let newX = clientX - dragStart.x;
      let newY = clientY - dragStart.y;
      
      // Bound checking for variant
      newX = Math.max(-VARIANT_SIZE/2, Math.min(CANVAS_SIZE - VARIANT_SIZE/2, newX));
      newY = Math.max(-VARIANT_SIZE/2, Math.min(CANVAS_SIZE - VARIANT_SIZE/2, newY));
      
      setVariantPosition({ x: newX, y: newY });
    }
    
    if (isTextDragging && textBoxState.activeTextId) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const canvasElement = canvasRef.current?.querySelector('.canvas-content');
      if (!canvasElement) return;
      
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Calculate new position relative to canvas
      const newX = clientX - canvasRect.left;
      const newY = clientY - canvasRect.top;

      // Update text position, ensuring it stays within canvas bounds
      const boundedX = Math.max(0, Math.min(canvasRect.width, newX));
      const boundedY = Math.max(0, Math.min(canvasRect.height, newY));
      
      textBoxState.updateTextBox(textBoxState.activeTextId, {
        position: { x: boundedX, y: boundedY }
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

  const handleTextTouchStart = (e: React.TouchEvent, id: string) => {
    e.preventDefault(); // Prevent default touch behavior
    textBoxState.setActiveTextId(id);
    setIsTextDragging(true);
    
    const touch = e.touches[0];
    const canvasElement = canvasRef.current?.querySelector('.canvas-content');
    if (!canvasElement) return;
    
    const canvasRect = canvasElement.getBoundingClientRect();
    const textBox = textBoxState.textBoxes.find(t => t.id === id);
    if (!textBox) return;

    // Calculate the offset from the touch position to the text element's center
    setTextDragStart({
      x: touch.clientX - canvasRect.left - textBox.position.x,
      y: touch.clientY - canvasRect.top - textBox.position.y
    });
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
        
        // Wait for UI updates to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = canvasRef.current.querySelector('.canvas-content') as HTMLElement;
        if (!element) {
          throw new Error('Canvas element not found');
        }

        // Create a canvas with fixed dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Set fixed output size
        const outputSize = 1200;
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Draw background
        await drawBackground(ctx, canvas, bgType, bgColor, secondaryBgColor, bgImage, bgOpacity);

        // Draw variant
        await drawVariant(ctx, canvas, variantState);

        // Draw text layers
        drawTextLayers(ctx, canvas, textBoxState.textBoxes);

        // Convert to blob and download
        await downloadCanvas(canvas);

      } catch (err) {
        console.error('Failed to process image:', err);
        toast.error('Failed to download image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Helper functions to break down the complex logic
  const drawBackground = async (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    bgType: BackgroundType,
    bgColor: string,
    secondaryBgColor: string,
    bgImage: string | null,
    bgOpacity: number
  ) => {
    // First draw the base background
    if (bgType === 'solid') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 
    else if (bgType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, bgColor);
      gradient.addColorStop(0.35, bgColor);
      gradient.addColorStop(1, secondaryBgColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else if (bgType === 'image' && bgImage) {
      // First draw solid background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Then draw image with opacity
      const img = await loadImage(bgImage);
      
      // Calculate dimensions to maintain aspect ratio
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvas.width / canvas.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspectRatio > canvasAspectRatio) {
        drawHeight = canvas.width / imgAspectRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgAspectRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      // Save the current context state
      ctx.save();
      
      // Set global alpha for the image
      ctx.globalAlpha = bgOpacity;
      
      // Draw image with opacity
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Restore the context state
      ctx.restore();
    }
  };

  const drawVariant = async (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    variantState: ReturnType<typeof useVariant>
  ) => {
    const variantImg = await loadImage(variantState.selectedVariant);
    
    // Calculate dimensions
    const variantHeight = canvas.height * 0.5;
    const variantAspectRatio = variantImg.width / variantImg.height;
    const variantWidth = variantHeight * variantAspectRatio;

    // Calculate position relative to canvas size
    const scaleFactor = canvas.width / 500; // 500 is the base canvas size in the UI
    const scaledX = variantState.variantPosition.x * scaleFactor;
    const scaledY = variantState.variantPosition.y * scaleFactor;

    // Apply transformations
    const { rotation, scale, flipX, flipY, opacity } = variantState.variantTransform;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(scaledX + (variantWidth * scale) / 2, scaledY + (variantHeight * scale) / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * (flipX ? -1 : 1), scale * (flipY ? -1 : 1));
    
    ctx.drawImage(
      variantImg,
      -variantWidth / 2,
      -variantHeight / 2,
      variantWidth,
      variantHeight
    );
    
    ctx.restore();
  };

  const drawTextLayers = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    textBoxes: TextBox[]
  ) => {
    const scaleFactor = canvas.width / CANVAS_SIZE;

    textBoxes.forEach((textBox) => {
      ctx.save();
      
      // Calculate the center point for transformations
      const centerX = textBox.position.x * scaleFactor;
      const centerY = textBox.position.y * scaleFactor;
      
      // Move to the text position
      ctx.translate(centerX, centerY);
      
      // Apply transformations around the center point
      ctx.rotate((textBox.style.rotation * Math.PI) / 180);
      ctx.scale(
        textBox.style.scale * (textBox.style.flipX ? -1 : 1),
        textBox.style.scale * (textBox.style.flipY ? -1 : 1)
      );
      
      // Set the font first so we can measure the text
      const scaledFontSize = textBox.style.fontSize * scaleFactor;
      ctx.font = `${scaledFontSize}px ${getFontFamilyForDownload(textBox.style.fontFamily)}`;
      
      // Maximum width for text wrapping (300px scaled)
      const maxWidth = 300 * scaleFactor;

      // Split text into paragraphs and wrap text
      const paragraphs = textBox.message.split('\n').map(line => line || ' ');
      const wrappedLines: string[] = [];
      paragraphs.forEach(paragraph => {
        const words = paragraph.split(' ');
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + ' ' + word).width;
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            wrappedLines.push(currentLine);
            currentLine = word;
          }
        }
        wrappedLines.push(currentLine);
      });
      
      // Calculate dimensions for background
      const lineHeight = scaledFontSize * 1.2;
      const totalHeight = lineHeight * wrappedLines.length;
      
      // Calculate maximum line width
      let maxLineWidth = 0;
      wrappedLines.forEach(line => {
        const width = ctx.measureText(line).width;
        maxLineWidth = Math.max(maxLineWidth, width);
      });

      // Draw background with proper centering
      const scaledPadding = 16 * scaleFactor;
      const bgWidth = maxLineWidth + (scaledPadding * 2);
      const bgHeight = totalHeight + (scaledPadding * 2);
      
      const bgX = -bgWidth / 2;
      const bgY = -bgHeight / 2;

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const bgRgb = hexToRgb(textBox.style.backgroundColor || '#000000');
      if (bgRgb) {
        ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${textBox.style.backgroundOpacity || 0})`;
        ctx.roundRect(
          bgX,
          bgY,
          bgWidth,
          bgHeight,
          8 * scaleFactor // border radius
        );
        ctx.fill();
      }

      // Set text properties
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = scaledFontSize * 0.05;
      ctx.strokeStyle = '#000000';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = textBox.style.opacity;
      
      // Draw text with proper centering
      wrappedLines.forEach((line, index) => {
        const y = (index - (wrappedLines.length - 1) / 2) * lineHeight;
        ctx.fillStyle = textBox.style.color;
        ctx.fillText(line, 0, y);
      });
      
      ctx.restore();
    });
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const downloadCanvas = async (canvas: HTMLCanvasElement) => {
    try {
      // Check if running in a WebView/third-party browser
      const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Version)/i.test(navigator.userAgent) 
        || /.*Android.*Version\/[0-9].[0-9]/.test(navigator.userAgent)
        || /wv|WebView/i.test(navigator.userAgent)
        || window !== window.parent;

      if (isWebView) {
        // Use direct data URL for WebViews and in-app browsers
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'chillguy-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Use Blob approach for regular browsers
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/png',
            1.0
          );
        });

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = 'chillguy-image.png';
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);
        }, 100);
      }

      toast.success('Image downloaded successfully!');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download image. Please try again.');
      
      // Final fallback: open in new tab
      try {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        window.open(dataUrl, '_blank');
      } catch (fallbackErr) {
        console.error('Fallback download failed:', fallbackErr);
      }
    }
  };

  const handleReset = () => {
    // Reset all states to their default values
    setBgColor('#295144');
    setBgType('solid');
    setSecondaryBgColor('#1a3830');
    setBgImage(null);
    setActiveTab('background');
    
    // Reset variant states
    variantState.setSelectedVariant('/variants/1.png'); // Reset to first variant
    setVariantPosition({ x: 140, y: 120 }); // Reset to initial position
    variantState.setVariantTransform({
      rotation: 0,
      scale: 1,
      flipX: false,
      flipY: false,
      opacity: 1
    });
    
    // Reset text states
    textBoxState.setTextBoxes([]);
    textBoxState.setActiveTextId(null);
  };

  useEffect(() => {
    setIsVariantLoaded(false);
  }, [variantState.selectedVariant]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't handle clicks if dragging is in progress
      if (isDragging || isTextDragging) {
        return;
      }

      // Get the canvas element
      const canvasElement = canvasRef.current;
      
      // Get the active text element if any
      const activeTextElement = document.querySelector(`[data-text-id="${textBoxState.activeTextId}"]`);
      
      // Check if the click is on a text control or delete button
      const isTextControl = (e.target as HTMLElement).closest('.text-controls');
      const isDeleteButton = (e.target as HTMLElement).closest('[data-delete-button]');
      
      // Don't unfocus if clicking on text controls or delete button
      if (isTextControl || isDeleteButton) {
        return;
      }
      
      // Check if click is outside both canvas and active text
      const isOutsideCanvas = canvasElement && !canvasElement.contains(e.target as Node);
      const isOutsideText = activeTextElement && !activeTextElement.contains(e.target as Node);
      
      if (isOutsideCanvas || isOutsideText) {
        textBoxState.setActiveTextId(null);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [textBoxState.activeTextId, isDragging, isTextDragging]);

  // Add touch event handlers
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    handleMouseMove(e);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsTextDragging(false);
  };

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
            onTextTouchStart={handleTextTouchStart}
            textBoxes={textBoxState.textBoxes}
            activeTextId={textBoxState.activeTextId}
            {...variantState}
            onCanvasClick={handleCanvasClick}
            isDownloading={isDownloading}
            ref={canvasRef}
            onVariantLoad={() => setIsVariantLoaded(true)}
            deleteTextBox={textBoxState.deleteTextBox}
            bgOpacity={bgOpacity}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
            onReset={handleReset}
            bgOpacity={bgOpacity}
            setBgOpacity={setBgOpacity}
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
              onTextTouchStart={handleTextTouchStart}
              textBoxes={textBoxState.textBoxes}
              activeTextId={textBoxState.activeTextId}
              {...variantState}
              onCanvasClick={handleCanvasClick}
              isDownloading={isDownloading}
              ref={canvasRef}
              onVariantLoad={() => setIsVariantLoaded(true)}
              deleteTextBox={textBoxState.deleteTextBox}
              bgOpacity={bgOpacity}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 