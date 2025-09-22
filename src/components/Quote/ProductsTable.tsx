import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuoteProduct } from '@/types';
import { validateQuantity } from '@/utils/validation';

interface ProductsTableProps {
  products: QuoteProduct[];
  onQuantityChange: (index: number, quantity: number) => void;
  onProductRemove: (index: number) => void;
}

export function ProductsTable({ products, onQuantityChange, onProductRemove }: ProductsTableProps) {
  const [quantityErrors, setQuantityErrors] = useState<{ [key: number]: string }>({});

  const handleQuantityChange = (index: number, value: string) => {
    const validation = validateQuantity(value);
    
    if (!validation.isValid) {
      setQuantityErrors(prev => ({ ...prev, [index]: validation.error || '' }));
    } else {
      setQuantityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
    
    onQuantityChange(index, validation.value);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay productos agregados a la cotización
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full border-collapse bg-input rounded-xl overflow-hidden hidden md:table">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">SKU</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Nombre del Producto</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Cantidad</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">P. Unidad</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">P. Total</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={`${product.sku}-${index}`} className="border-b border-border">
              <td className="px-4 py-3 text-sm">{product.sku}</td>
              <td className="px-4 py-3 text-sm">{product.name}</td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className={`w-32 ${quantityErrors[index] ? 'border-destructive' : ''}`}
                  />
                  {quantityErrors[index] && (
                    <p className="text-xs text-destructive" aria-live="polite">
                      {quantityErrors[index]}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">${product.price.toLocaleString('es-AR')}</td>
              <td className="px-4 py-3 text-sm">${(product.price * product.quantity).toLocaleString('es-AR')}</td>
              <td className="px-4 py-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onProductRemove(index)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product, index) => (
          <div key={`${product.sku}-${index}`} className="bg-input border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <div className="font-medium">{product.sku}</div>
              </div>
              <div>
                <span className="text-muted-foreground">P. Unidad:</span>
                <div className="font-medium">${product.price.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Nombre:</span>
                <div className="font-medium">{product.name}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Cantidad:</span>
                <div className="space-y-1">
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className={`w-full ${quantityErrors[index] ? 'border-destructive' : ''}`}
                  />
                  {quantityErrors[index] && (
                    <p className="text-xs text-destructive" aria-live="polite">
                      {quantityErrors[index]}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">P. Total:</span>
                <div className="font-medium">${(product.price * product.quantity).toLocaleString('es-AR')}</div>
              </div>
              <div className="col-span-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onProductRemove(index)}
                  className="w-full"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}