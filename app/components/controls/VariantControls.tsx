import { VariantTransform } from '@/app/types';
import { RangeInput } from '../RangeInput';
import { VariantButton } from '../VariantButton';

const variants = ['/variants/1.png', '/variants/2.png', '/variants/3.png'];

interface VariantControlsProps {
  selectedVariant: string;
  variantTransform: VariantTransform;
  setSelectedVariant: (variant: string) => void;
  setVariantTransform: (transform: VariantTransform) => void;
}

export function VariantControls({
  selectedVariant,
  variantTransform,
  setSelectedVariant,
  setVariantTransform,
}: VariantControlsProps) {
  return (
    <div>
      <div className="flex gap-x-3 overflow-x-auto mb-4">
        {variants.map((variant) => (
          <VariantButton
            key={variant}
            variant={variant}
            isSelected={selectedVariant === variant}
            onClick={() => setSelectedVariant(variant)}
          />
        ))}
      </div>

      <div className="space-y-4">
        <RangeInput
          label="Rotation"
          value={variantTransform.rotation}
          onChange={(rotation) =>
            setVariantTransform({ ...variantTransform, rotation })
          }
          min={-180}
          max={180}
        />

        <RangeInput
          label="Scale"
          value={variantTransform.scale}
          onChange={(scale) =>
            setVariantTransform({ ...variantTransform, scale })
          }
          min={0}
          max={2}
          step={0.1}
          defaultValue={1}
        />

        <RangeInput
          label="Opacity"
          value={variantTransform.opacity}
          onChange={(opacity) =>
            setVariantTransform({ ...variantTransform, opacity })
          }
          min={0}
          max={1}
          step={0.1}
          defaultValue={1}
        />

        <div className="flex gap-4">
          <button
            onClick={() =>
              setVariantTransform({
                ...variantTransform,
                flipX: !variantTransform.flipX,
              })
            }
            className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Flip X
          </button>
          <button
            onClick={() =>
              setVariantTransform({
                ...variantTransform,
                flipY: !variantTransform.flipY,
              })
            }
            className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Flip Y
          </button>
        </div>
      </div>
    </div>
  );
} 