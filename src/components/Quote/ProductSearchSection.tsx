import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductSearchSectionProps {
  products: Product[];
  enabled: boolean;
  onProductAdd: (product: Product) => void;
}

export function ProductSearchSection({ products, enabled, onProductAdd }: ProductSearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedProduct(null);
      return;
    }

    const filtered = products.filter(product =>
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchTerm, products]);

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(`${product.sku} - ${product.name}`);
    setSelectedProduct(product);
    setShowSuggestions(false);
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      onProductAdd(selectedProduct);
      setSearchTerm('');
      setSelectedProduct(null);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedProduct) {
        handleAddProduct();
      }
    }
  };

  return (
    <section 
      className={`
        border-2 border-dashed border-border rounded-xl p-4 mb-6 transition-all duration-300
        ${enabled ? 'opacity-100' : 'opacity-60 pointer-events-none'}
      `}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Agregar Productos</h3>
      
      <div className="relative mb-4">
        <Input
          ref={searchRef}
          type="text"
          placeholder="Buscar productos por SKU o nombre…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-input border-border"
          disabled={!enabled}
        />
        
        {showSuggestions && (
          <ul className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.map((product) => (
              <li
                key={product.sku}
                className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleSuggestionClick(product)}
              >
                {product.sku} - {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <Button
        onClick={handleAddProduct}
        disabled={!selectedProduct || !enabled}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Agregar
      </Button>
    </section>
  );
}