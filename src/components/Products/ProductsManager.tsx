import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { ProductModal } from './ProductModal';
import { ProductsTable } from './ProductsTable';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProductsManagerProps {
  onProductUpdate?: (originalSku: string, updatedProduct: Product) => void;
  onProductDelete?: (sku: string) => void;
}

export function ProductsManager({ onProductUpdate, onProductDelete }: ProductsManagerProps) {
  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  } = useProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (sku: string) => {
    if (confirm(`¿Eliminar producto ${sku}?`)) {
      deleteProduct(sku);
      onProductDelete?.(sku);
      toast({
        title: "Producto eliminado",
        description: `El producto ${sku} ha sido eliminado.`,
      });
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'sku'> & { sku: string }) => {
    try {
      if (editingProduct) {
        const updatedProduct = updateProduct(editingProduct.sku, {
          sku: productData.sku,
          name: productData.name,
          price: productData.price,
        });
        onProductUpdate?.(editingProduct.sku, updatedProduct);
        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado correctamente.",
        });
      } else {
        addProduct(productData);
        toast({
          title: "Producto agregado",
          description: "El producto ha sido agregado correctamente.",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      });
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Esto restaurará la lista por defecto y perderás cambios.')) {
      resetToDefaults();
      toast({
        title: "Lista restaurada",
        description: "La lista de productos ha sido restaurada a los valores por defecto.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Buscar por SKU o nombre…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-input border-border"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleAddProduct}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Nuevo producto
          </Button>
          <Button
            variant="outline"
            onClick={handleResetDefaults}
            className="border-border"
          >
            Restaurar lista por defecto
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        existingSkus={products.map(p => p.sku)}
        onSave={handleSaveProduct}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}