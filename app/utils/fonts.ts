import { Roboto, Playfair_Display, Permanent_Marker, Comic_Neue } from 'next/font/google';

export const robotoFont = Roboto({ weight: '400', subsets: ['latin'] });
export const playfairFont = Playfair_Display({ subsets: ['latin'] });
export const markerFont = Permanent_Marker({ weight: '400', subsets: ['latin'] });
export const comicFont = Comic_Neue({ weight: '400', subsets: ['latin'] });

export const fonts = {
  roboto: robotoFont,
  playfair: playfairFont,
  marker: markerFont,
  comic: comicFont,
} as const;

// Map Next.js font families to system fonts for download
const fontFamilyMap: Record<string, string> = {
  [robotoFont.style.fontFamily]: 'Roboto, Arial, sans-serif',
  [playfairFont.style.fontFamily]: 'Playfair Display, Georgia, serif',
  [markerFont.style.fontFamily]: 'Permanent Marker, Impact, sans-serif',
  [comicFont.style.fontFamily]: 'Comic Neue, Comic Sans MS, cursive',
};

export const getFontFamilyForDownload = (fontFamily: string) => {
  return fontFamilyMap[fontFamily] || fontFamily;
}; 