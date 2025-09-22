import { useState, useCallback } from 'react';
import { Product } from '@/types';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { useLocalStorage } from './useLocalStorage';
import { validateSKU, validatePrice } from '@/utils/validation';

const STORAGE_KEY = 'priceList';

/**
 * Hook for managing products with CRUD operations and localStorage persistence
 */
export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>(STORAGE_KEY, DEFAULT_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get product by SKU
  const getProductBySku = useCallback((sku: string): Product | undefined => {
    return products.find(product => product.sku === sku);
  }, [products]);

  // Add new product
  const addProduct = useCallback((productData: Omit<Product, 'sku'> & { sku: string }) => {
    const sku = productData.sku.trim().toUpperCase();
    const existingSkus = products.map(p => p.sku);
    
    const skuValidation = validateSKU(sku, existingSkus);
    if (!skuValidation.isValid) {
      throw new Error(skuValidation.error);
    }

    const priceValidation = validatePrice(productData.price);
    if (!priceValidation.isValid) {
      throw new Error(priceValidation.error);
    }

    if (!productData.name.trim()) {
      throw new Error('Nombre del producto es requerido.');
    }

    const newProduct: Product = {
      sku,
      name: productData.name.trim(),
      price: priceValidation.value,
    };

    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products, setProducts]);

  // Update existing product
  const updateProduct = useCallback((originalSku: string, productData: Product) => {
    const sku = productData.sku.trim().toUpperCase();
    const existingSkus = products.map(p => p.sku);
    
    const skuValidation = validateSKU(sku, existingSkus, originalSku);
    if (!skuValidation.isValid) {
      throw new Error(skuValidation.error);
    }

    const priceValidation = validatePrice(productData.price);
    if (!priceValidation.isValid) {
      throw new Error(priceValidation.error);
    }

    if (!productData.name.trim()) {
      throw new Error('Nombre del producto es requerido.');
    }

    const updatedProduct: Product = {
      sku,
      name: productData.name.trim(),
      price: priceValidation.value,
    };

    setProducts(prev => 
      prev.map(product => 
        product.sku === originalSku ? updatedProduct : product
      )
    );

    return updatedProduct;
  }, [products, setProducts]);

  // Delete product
  const deleteProduct = useCallback((sku: string) => {
    setProducts(prev => prev.filter(product => product.sku !== sku));
  }, [setProducts]);

  // Reset to default products
  const resetToDefaults = useCallback(() => {
    setProducts([...DEFAULT_PRODUCTS]);
  }, [setProducts]);

  // Search functionality
  const searchProducts = useCallback((term: string): Product[] => {
    if (!term.trim()) return [];
    
    const searchTerm = term.toLowerCase();
    return products.filter(product =>
      product.sku.toLowerCase().includes(searchTerm) ||
      product.name.toLowerCase().includes(searchTerm)
    );
  }, [products]);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    getProductBySku,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
    searchProducts,
  };
}