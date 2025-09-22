/**
 * Date validation utilities
 */
export function formatYMD(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addYears(date: Date, years: number): Date {
  const newDate = new Date(date.getTime());
  newDate.setFullYear(newDate.getFullYear() + years);
  // Handle leap year edge case (Feb 29)
  if (newDate.getMonth() !== date.getMonth()) {
    newDate.setDate(0);
  }
  return newDate;
}

export function createDateValidators() {
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = addYears(minDate, 50);
  const minStr = formatYMD(minDate);
  const maxStr = formatYMD(maxDate);

  return {
    minDate,
    maxDate,
    minStr,
    maxStr,
    isValidDateStr(dateStr: string): boolean {
      // Check format YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
      
      const [yearStr, monthStr, dayStr] = dateStr.split('-');
      if (yearStr.length !== 4) return false;
      
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
      
      // Check if date is actually valid
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
      ) {
        return false;
      }
      
      // Check if date is within range
      if (date < minDate || date > maxDate) return false;
      
      return true;
    }
  };
}

/**
 * Quantity validation (1-10000)
 */
export function validateQuantity(value: string | number): { isValid: boolean; value: number; error?: string } {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (isNaN(num)) {
    return { isValid: false, value: 1, error: 'Cantidad debe ser un número válido.' };
  }
  
  if (num < 1) {
    return { isValid: false, value: 1, error: 'Cantidad mínima: 1.' };
  }
  
  if (num > 10000) {
    return { isValid: false, value: 10000, error: 'Cantidad máxima: 10.000.' };
  }
  
  return { isValid: true, value: num };
}

/**
 * Discount validation (0-100%)
 */
export function validateDiscount(value: string | number): { isValid: boolean; value: number; error?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, value: 0, error: 'Descuento debe ser un número válido.' };
  }
  
  if (num < 0) {
    return { isValid: false, value: 0, error: 'El descuento no puede ser menor a 0%.' };
  }
  
  if (num > 100) {
    return { isValid: false, value: 100, error: 'El descuento máximo es 100%.' };
  }
  
  return { isValid: true, value: num };
}

/**
 * SKU validation for product management
 */
export function validateSKU(sku: string, existingSkus: string[], currentSku?: string): { isValid: boolean; error?: string } {
  const trimmedSku = sku.trim().toUpperCase();
  
  if (!trimmedSku) {
    return { isValid: false, error: 'SKU es requerido.' };
  }
  
  // Check for duplicates (excluding current SKU during edit)
  if (currentSku !== trimmedSku && existingSkus.includes(trimmedSku)) {
    return { isValid: false, error: 'Ya existe un producto con ese SKU.' };
  }
  
  return { isValid: true };
}

/**
 * Product price validation
 */
export function validatePrice(value: string | number): { isValid: boolean; value: number; error?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, value: 0, error: 'Precio debe ser un número válido.' };
  }
  
  if (num < 0) {
    return { isValid: false, value: 0, error: 'El precio no puede ser negativo.' };
  }
  
  return { isValid: true, value: num };
}