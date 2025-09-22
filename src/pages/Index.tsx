import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Layout/Sidebar';
import { MainLayout } from '@/components/Layout/MainLayout';
import { QuoteView } from '@/components/Quote/QuoteView';
import { ProductsManager } from '@/components/Products/ProductsManager';
import { ViewType, QuoteProduct } from '@/types';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('quote');
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>([]);

  // Handle product updates from products manager
  const handleProductUpdate = useCallback((originalSku: string, updatedProduct: any) => {
    setQuoteProducts(prev =>
      prev.map(product =>
        product.sku === originalSku
          ? { ...product, sku: updatedProduct.sku, name: updatedProduct.name, price: updatedProduct.price }
          : product
      )
    );
  }, []);

  // Handle product deletion from products manager
  const handleProductDelete = useCallback((sku: string) => {
    setQuoteProducts(prev => prev.filter(product => product.sku !== sku));
  }, []);

  // Load external libraries for PDF generation
  useEffect(() => {
    const loadLibraries = async () => {
      // These libraries are already loaded in index.html via CDN
      // We just need to wait for them to be available
      const checkLibraries = () => {
        return window.html2canvas && window.jspdf;
      };

      if (!checkLibraries()) {
        // Wait for libraries to load
        await new Promise(resolve => {
          const interval = setInterval(() => {
            if (checkLibraries()) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);
        });
      }
    };

    loadLibraries();
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'quote':
        return (
          <MainLayout title="Nueva Cotización">
            <QuoteView />
          </MainLayout>
        );
      case 'products':
        return (
          <MainLayout title="Lista de Productos">
            <ProductsManager
              onProductUpdate={handleProductUpdate}
              onProductDelete={handleProductDelete}
            />
          </MainLayout>
        );
      case 'history':
        return (
          <MainLayout title="Historial de Cotizaciones">
            <div className="text-center py-8 text-muted-foreground">
              Funcionalidad en desarrollo
            </div>
          </MainLayout>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
