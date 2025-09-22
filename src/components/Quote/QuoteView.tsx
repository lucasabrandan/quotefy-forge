import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { QuoteInfoSection } from './QuoteInfoSection';
import { ClientInfoSection } from './ClientInfoSection';
import { ProductSearchSection } from './ProductSearchSection';
import { ProductsTable } from './ProductsTable';
import { QuoteTotals } from './QuoteTotals';
import { useProducts } from '@/hooks/useProducts';
import { QuoteProduct, QuoteData } from '@/types';
import { generateQuotePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { createDateValidators } from '@/utils/validation';

export function QuoteView() {
  const { products: availableProducts } = useProducts();
  const { toast } = useToast();
  
  // Quote state
  const [quoteNumber, setQuoteNumber] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [isDateValid, setIsDateValid] = useState(false);
  
  // Client state
  const [client, setClient] = useState({
    name: '',
    contact: '',
    address: '',
    location: '',
  });
  
  // Products state
  const [quoteProducts, setQuoteProducts] = useState<QuoteProduct[]>([]);
  const [discount, setDiscount] = useState(0);

  // Validation states
  const quoteInfoValid = quoteNumber.trim() !== '' && quoteDate.trim() !== '' && isDateValid;
  const clientInfoValid = Object.values(client).every(value => value.trim() !== '');
  const canAddProducts = quoteInfoValid && clientInfoValid;
  const canGeneratePDF = quoteProducts.length > 0;

  const handleClientChange = useCallback((field: string, value: string) => {
    setClient(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddProduct = useCallback((product: any) => {
    setQuoteProducts(prev => {
      const existing = prev.find(p => p.sku === product.sku);
      if (existing) {
        return prev.map(p =>
          p.sku === product.sku
            ? { ...p, quantity: p.quantity + 1, price: product.price, name: product.name }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleQuantityChange = useCallback((index: number, quantity: number) => {
    setQuoteProducts(prev =>
      prev.map((product, i) =>
        i === index ? { ...product, quantity } : product
      )
    );
  }, []);

  const handleProductRemove = useCallback((index: number) => {
    setQuoteProducts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleGeneratePDF = async () => {
    // Validate date before generating PDF
    const { isValidDateStr } = createDateValidators();
    if (!isValidDateStr(quoteDate)) {
      toast({
        title: "Error de fecha",
        description: "La fecha de cotización no es válida.",
        variant: "destructive",
      });
      return;
    }

    const quoteData: QuoteData = {
      number: quoteNumber,
      date: quoteDate,
      client,
      products: quoteProducts,
      discount,
    };

    try {
      await generateQuotePDF(quoteData);
      toast({
        title: "PDF generado",
        description: "El presupuesto se ha generado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Verifica que las librerías estén cargadas.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Quote Information */}
      <QuoteInfoSection
        number={quoteNumber}
        date={quoteDate}
        isValid={isDateValid}
        onNumberChange={setQuoteNumber}
        onDateChange={setQuoteDate}
        onValidityChange={setIsDateValid}
      />

      {/* Client Information */}
      <ClientInfoSection
        client={client}
        enabled={quoteInfoValid}
        onClientChange={handleClientChange}
      />

      {/* Product Search */}
      <ProductSearchSection
        products={availableProducts}
        enabled={canAddProducts}
        onProductAdd={handleAddProduct}
      />

      {/* Products Table */}
      {quoteProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Productos en Cotización</h3>
          <ProductsTable
            products={quoteProducts}
            onQuantityChange={handleQuantityChange}
            onProductRemove={handleProductRemove}
          />
          
          {/* Totals */}
          <QuoteTotals
            products={quoteProducts}
            discount={discount}
            onDiscountChange={setDiscount}
          />
        </div>
      )}

      {/* Generate PDF Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleGeneratePDF}
          disabled={!canGeneratePDF}
          size="lg"
          variant="gradient"
        >
          Generar PDF
        </Button>
      </div>
    </div>
  );
}