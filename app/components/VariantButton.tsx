import Image from 'next/image';

interface VariantButtonProps {
  variant: string;
  isSelected: boolean;
  onClick: () => void;
}

export function VariantButton({ variant, isSelected, onClick }: VariantButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <Image 
        src={variant} 
        alt="Character variant" 
        width={64}
        height={64}
        className="w-full h-full object-cover"
      />
    </button>
  );
} 