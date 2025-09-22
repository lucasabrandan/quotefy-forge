import { QuoteData } from '@/types';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

/**
 * Generate PDF from quote data using html2canvas and jsPDF
 */
export async function generateQuotePDF(quoteData: QuoteData): Promise<void> {
  // Check if libraries are loaded
  if (!window.html2canvas || !window.jspdf) {
    throw new Error('PDF libraries not loaded');
  }

  // Create PDF template
  const pdfTemplate = createPDFTemplate(quoteData);
  document.body.appendChild(pdfTemplate);

  try {
    // Generate canvas from template
    const canvas = await window.html2canvas(pdfTemplate, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const clientName = quoteData.client.name.replace(/[^a-zA-Z0-9_-]/g, '') || 'cliente';
    const quoteNumber = quoteData.number.replace(/[^a-zA-Z0-9_-]/g, '') || 'presupuesto';
    const filename = `${quoteNumber}-${clientName}-Presupuesto.pdf`;

    // Save PDF
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(pdfTemplate);
  }
}

/**
 * Create PDF template element
 */
function createPDFTemplate(quoteData: QuoteData): HTMLElement {
  const template = document.createElement('div');
  template.style.display = 'block';
  template.style.position = 'absolute';
  template.style.left = '-9999px';
  template.style.fontFamily = 'Inter, Arial, sans-serif';
  template.style.color = '#000';
  template.style.backgroundColor = '#fff';
  template.style.padding = '18px';

  const subtotal = quoteData.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discountAmount = subtotal * (quoteData.discount / 100);
  const total = Math.max(subtotal - discountAmount, 0);

  template.innerHTML = `
    <div style="max-width: 800px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">PRESUPUESTO DE VENTA</h1>
      </div>

      <!-- Info sections -->
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1; border: 1px solid #ccc; border-radius: 8px; padding: 15px;">
          <h4 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; font-weight: bold;">Datos del Cliente</h4>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Nombre:</strong> ${quoteData.client.name}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Contacto:</strong> ${quoteData.client.contact}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Dirección:</strong> ${quoteData.client.address}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Localidad:</strong> ${quoteData.client.location}</p>
        </div>
        <div style="flex: 1; border: 1px solid #ccc; border-radius: 8px; padding: 15px;">
          <h4 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; font-weight: bold;">Datos del Presupuesto</h4>
          <p style="margin: 5px 0; font-size: 12px;"><strong>N° de Presupuesto:</strong> ${quoteData.number}</p>
          <p style="margin: 5px 0; font-size: 12px;"><strong>Fecha:</strong> ${quoteData.date}</p>
        </div>
      </div>

      <!-- Products table -->
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ccc; padding: 8px; font-size: 12px; text-align: left;">SKU</th>
              <th style="border: 1px solid #ccc; padding: 8px; font-size: 12px; text-align: left;">Producto</th>
              <th style="border: 1px solid #ccc; padding: 8px; font-size: 12px; text-align: center;">Cantidad</th>
              <th style="border: 1px solid #ccc; padding: 8px; font-size: 12px; text-align: right;">P. Unitario</th>
              <th style="border: 1px solid #ccc; padding: 8px; font-size: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quoteData.products.map(product => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px; font-size: 11px;">${product.sku}</td>
                <td style="border: 1px solid #ccc; padding: 8px; font-size: 11px;">${product.name}</td>
                <td style="border: 1px solid #ccc; padding: 8px; font-size: 11px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ccc; padding: 8px; font-size: 11px; text-align: right;">$${product.price.toLocaleString('es-AR')}</td>
                <td style="border: 1px solid #ccc; padding: 8px; font-size: 11px; text-align: right;">$${(product.price * product.quantity).toLocaleString('es-AR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 300px; border: 1px solid #ccc; border-radius: 8px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
            <span>Subtotal:</span>
            <span>$${subtotal.toLocaleString('es-AR')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
            <span>Descuento:</span>
            <span>${quoteData.discount}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px dashed #ccc; font-weight: bold; font-size: 14px;">
            <span>TOTAL FINAL:</span>
            <span>$${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #666;">
        <p>Este presupuesto posee validez de 7 días a partir de su emisión.</p>
      </div>
    </div>
  `;

  return template;
}