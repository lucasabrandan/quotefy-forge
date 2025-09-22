import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  existingSkus: string[];
  onSave: (product: Omit<Product, 'sku'> & { sku: string }) => void;
  onClose: () => void;
}

export function ProductModal({ isOpen, product, existingSkus, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: 0,
  });
  const [errors, setErrors] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        price: product.price,
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        price: 0,
      });
    }
    setErrors('');
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sku = formData.sku.trim().toUpperCase();
    const name = formData.name.trim();
    const price = Number(formData.price);

    // Validation
    if (!sku || !name || isNaN(price) || price < 0) {
      setErrors('Completá SKU, Nombre y un Precio válido.');
      return;
    }

    // Check for duplicate SKU (excluding current SKU during edit)
    if (!product && existingSkus.includes(sku)) {
      setErrors('Ya existe un producto con ese SKU.');
      return;
    }

    if (product && sku !== product.sku && existingSkus.includes(sku)) {
      setErrors('Ya existe un producto con ese nuevo SKU.');
      return;
    }

    onSave({ sku, name, price });
  };

  const handleDelete = () => {
    if (product && confirm(`¿Eliminar producto ${product.sku}?`)) {
      // This will be handled by the parent component
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar producto' : 'Nuevo producto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="bg-input border-border"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-input border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Precio (ARS)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="bg-input border-border"
            />
          </div>
          
          {errors && (
            <p className="text-sm text-destructive">{errors}</p>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {product && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}