import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuoteProduct } from '@/types';
import { validateDiscount } from '@/utils/validation';

interface QuoteTotalsProps {
  products: QuoteProduct[];
  discount: number;
  onDiscountChange: (discount: number) => void;
}

export function QuoteTotals({ products, discount, onDiscountChange }: QuoteTotalsProps) {
  const [discountError, setDiscountError] = useState('');

  const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = Math.max(subtotal - discountAmount, 0);

  const handleDiscountChange = (value: string) => {
    const validation = validateDiscount(value);
    
    if (!validation.isValid) {
      setDiscountError(validation.error || '');
    } else {
      setDiscountError('');
    }
    
    onDiscountChange(validation.value);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-end mt-6">
      <div className="w-full max-w-sm bg-input border border-border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Subtotal:</span>
          <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <Label htmlFor="discount" className="text-sm text-muted-foreground">
              Descuento:
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className={`w-20 text-right ${discountError ? 'border-destructive' : ''}`}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <span className="font-semibold">{discount}%</span>
          </div>
          {discountError && (
            <p className="text-xs text-destructive" aria-live="polite">
              {discountError}
            </p>
          )}
        </div>
        
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-accent">TOTAL FINAL:</span>
            <span className="text-lg font-bold text-accent">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}