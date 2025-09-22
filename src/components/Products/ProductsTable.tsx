import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (sku: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron productos
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
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Precio</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground w-40">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.sku} className="border-b border-border">
              <td className="px-4 py-3 text-sm font-medium">{product.sku}</td>
              <td className="px-4 py-3 text-sm">{product.name}</td>
              <td className="px-4 py-3 text-sm">${product.price.toLocaleString('es-AR')}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                    className="border-border"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(product.sku)}
                  >
                    Borrar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.sku} className="bg-input border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <div className="font-medium">{product.sku}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Precio:</span>
                <div className="font-medium">${product.price.toLocaleString('es-AR')}</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Nombre:</span>
                <div className="font-medium">{product.name}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product)}
                className="flex-1 border-border"
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(product.sku)}
                className="flex-1"
              >
                Borrar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}