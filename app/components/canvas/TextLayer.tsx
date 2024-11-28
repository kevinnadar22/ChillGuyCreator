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
}

export function TextLayer({
  textBoxes,
  activeTextId,
  onTextMouseDown,
  onTextTouchStart,
  isDownloading = false,
  isDragging = false,
  onDeleteText,
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
      <div 
        key={i} 
        className="text-content-line"
        style={{
          width: '100%',
          maxWidth: '300px',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.2,
          margin: 0,
          padding: 0
        }}
      >
        {line || '\u00A0'}
      </div>
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 'min-content',
          lineHeight: 1,
          borderRadius: isActive ? '6px' : '0',
        };

        const textStyle = {
          color: textBox.style.color,
          fontSize: `${textBox.style.fontSize}px`,
          fontFamily: textBox.style.fontFamily,
          padding: '4px 8px',
          backgroundColor: `rgba(${bgRgbString}, ${textBox.style.backgroundOpacity ?? 0})`,
          maxWidth: '300px',
          overflowWrap: 'break-word' as const,
          whiteSpace: 'pre-wrap' as const,
          wordBreak: 'break-word' as const,
          borderRadius: '4px',
          lineHeight: 1.2,
          margin: 0,
        };

        return (
          <div
            key={textBox.id}
            data-text-id={textBox.id}
            style={containerStyle}
            className={`text-box cursor-move ${isDragging ? 'dragging' : ''}`}
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
            onClick={handleTextClick}
            draggable={false}
          >
            <div 
              className="text-content"
              style={textStyle}
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