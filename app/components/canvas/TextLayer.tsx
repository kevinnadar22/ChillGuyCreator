import { TextBox } from '@/app/types';
import { fonts, getFontFamilyForDownload } from '@/app/utils/fonts';
import { X } from 'lucide-react';

interface TextLayerProps {
  textBoxes: TextBox[];
  activeTextId: string | null;
  onTextMouseDown: (e: React.MouseEvent, id: string) => void;
  onTextTouchStart: (e: React.TouchEvent, id: string) => void;
  isDownloading?: boolean;
  isDragging?: boolean;
  onDeleteText: (id: string) => void;
  onTextDragEnd?: (id: string, position: { x: number; y: number }) => void;
}

export function TextLayer({
  textBoxes,
  activeTextId,
  onTextMouseDown,
  onTextTouchStart,
  isDownloading = false,
  isDragging = false,
  onDeleteText,
  onTextDragEnd,
}: TextLayerProps) {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteText(id);
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span 
        key={i} 
        className="text-content-line"
        style={{
          display: 'inline-block',
          width: 'auto',
          minWidth: 'min-content',
          maxWidth: '300px',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.2,
          margin: 0,
          padding: 0,
          textAlign: 'left',
        }}
      >
        {line || '\u00A0'}
      </span>
    ));
  };

  return (
    <>
      {textBoxes.map((textBox) => {
        const isActive = textBox.id === activeTextId && !isDragging;
        
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        };

        const bgRgb = hexToRgb(textBox.style.backgroundColor || '#000000');
        const bgRgbString = bgRgb ? `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}` : '0, 0, 0';

        const containerStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${textBox.position.x}px`,
          top: `${textBox.position.y}px`,
          transform: `
            translate(-50%, -50%)
            rotate(${textBox.style.rotation}deg)
            scale(${textBox.style.scale * (textBox.style.flipX ? -1 : 1)}, 
                  ${textBox.style.scale * (textBox.style.flipY ? -1 : 1)})
          `,
          transformOrigin: 'center center',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'move',
          zIndex: isActive ? 10 : 1,
          outline: isActive ? '1px solid #3b82f6' : 'none',
          outlineOffset: '-1px',
          opacity: textBox.style.opacity,
          display: 'block',
          minWidth: 'min-content',
          maxWidth: '300px',
          width: 'fit-content',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          textAlign: 'left',
          direction: 'ltr',
          pointerEvents: 'auto',
          willChange: 'transform',
        };

        const textStyle: React.CSSProperties = {
          color: textBox.style.color,
          fontSize: `${textBox.style.fontSize}px`,
          fontFamily: textBox.style.fontFamily,
          padding: '4px 8px',
          backgroundColor: `rgba(${bgRgbString}, ${textBox.style.backgroundOpacity ?? 0})`,
          maxWidth: '300px',
          width: 'fit-content',
          display: 'block',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word' as const,
          wordBreak: 'break-word' as const,
          borderRadius: '4px',
          lineHeight: 1.2,
          margin: 0,
          textAlign: 'left',
          position: 'relative',
        };

        return (
          <div
            key={textBox.id}
            data-text-id={textBox.id}
            style={{
              ...containerStyle,
              touchAction: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              cursor: 'move',
            }}
            className={`text-box ${isDragging ? 'dragging' : ''}`}
            onMouseDown={(e) => {
              if (!(e.target as HTMLElement).closest('[data-delete-button="true"]')) {
                onTextMouseDown(e, textBox.id);
              }
            }}
            onTouchStart={(e) => {
              if (!(e.target as HTMLElement).closest('[data-delete-button="true"]')) {
                onTextTouchStart(e, textBox.id);
              }
            }}
            draggable={false}
          >
            <div 
              className="text-content"
              style={{
                ...textStyle,
                display: 'inline-block',
                width: 'auto',
                minWidth: 'min-content' as const,
                textAlign: 'left',
              }}
            >
              {formatText(textBox.message || 'Click to edit')}
            </div>
            {isActive && !isDownloading && (
              <button
                data-delete-button="true"
                className="absolute -top-3 -right-3 p-1.5 bg-white/80 backdrop-blur-sm 
                         hover:bg-white rounded-full shadow-sm border border-gray-200
                         transform transition-all duration-150 hover:scale-105 active:scale-95
                         opacity-80 hover:opacity-100"
                onClick={(e) => handleDelete(e, textBox.id)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                title="Delete text"
              >
                <X size={10} className="text-gray-600" strokeWidth={2.5} />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
} 