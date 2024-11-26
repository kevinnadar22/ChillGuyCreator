import { TextBox } from '@/app/types';
import { fonts, getFontFamilyForDownload } from '@/app/utils/fonts';

interface TextLayerProps {
  textBoxes: TextBox[];
  activeTextId: string | null;
  onTextMouseDown: (e: React.MouseEvent, id: string) => void;
  onTextTouchStart: (e: React.TouchEvent, id: string) => void;
  isDownloading?: boolean;
}

export function TextLayer({
  textBoxes,
  activeTextId,
  onTextMouseDown,
  onTextTouchStart,
  isDownloading = false,
}: TextLayerProps) {
  return (
    <>
      {textBoxes.map((textBox) => {
        const fontFamily = isDownloading 
          ? getFontFamilyForDownload(textBox.style.fontFamily)
          : textBox.style.fontFamily;

        return (
          <div
            key={textBox.id}
            className={`absolute cursor-move ${
              activeTextId === textBox.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: `${textBox.position.x}px`,
              top: `${textBox.position.y}px`,
              transform: `
                rotate(${textBox.style.rotation}deg)
                scale(${textBox.style.scale * (textBox.style.flipX ? -1 : 1)}, 
                      ${textBox.style.scale * (textBox.style.flipY ? -1 : 1)})
              `,
              opacity: textBox.style.opacity,
              fontSize: `${textBox.style.fontSize}px`,
              color: textBox.style.color,
              fontFamily: fontFamily,
              userSelect: 'none',
              whiteSpace: 'nowrap',
              padding: '4px 8px',
              backgroundColor: activeTextId === textBox.id && !isDownloading ? 'rgba(0,0,0,0.1)' : 'transparent',
              minWidth: '50px',
              textAlign: 'center',
              zIndex: activeTextId === textBox.id ? 10 : 1,
              touchAction: 'none',
            }}
            onMouseDown={(e) => onTextMouseDown(e, textBox.id)}
            onTouchStart={(e) => onTextTouchStart(e, textBox.id)}
            draggable={false}
          >
            {textBox.message || 'Click to edit'}
          </div>
        );
      })}
    </>
  );
} 