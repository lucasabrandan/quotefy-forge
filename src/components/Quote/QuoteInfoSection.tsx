import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDateValidators, formatYMD } from '@/utils/validation';

interface QuoteInfoSectionProps {
  number: string;
  date: string;
  isValid: boolean;
  onNumberChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onValidityChange: (isValid: boolean) => void;
}

export function QuoteInfoSection({
  number,
  date,
  isValid,
  onNumberChange,
  onDateChange,
  onValidityChange,
}: QuoteInfoSectionProps) {
  const [dateError, setDateError] = useState('');
  const { minStr, maxStr, isValidDateStr } = createDateValidators();

  // Set default date to today on mount
  useEffect(() => {
    if (!date) {
      const today = new Date();
      onDateChange(formatYMD(today));
    }
  }, [date, onDateChange]);

  const validateDate = (value: string) => {
    if (!isValidDateStr(value)) {
      const error = `Fecha inválida. Permitido: ${minStr} a ${maxStr}.`;
      setDateError(error);
      onValidityChange(false);
    } else {
      setDateError('');
      onValidityChange(true);
    }
  };

  const handleDateChange = (value: string) => {
    onDateChange(value);
    validateDate(value);
  };

  // Check overall validity
  const sectionIsValid = number.trim() !== '' && date.trim() !== '' && isValid;

  return (
    <section 
      className={`
        border-2 border-dashed border-border rounded-xl p-4 mb-6 transition-all duration-300
        ${sectionIsValid ? 'opacity-100' : 'opacity-60'}
      `}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Datos de la Cotización</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quote-number" className="text-muted-foreground text-sm">
            N° de Presupuesto
          </Label>
          <Input
            id="quote-number"
            type="text"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            className="bg-input border-border"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quote-date" className="text-muted-foreground text-sm">
            Fecha
          </Label>
          <Input
            id="quote-date"
            type="date"
            value={date}
            min={minStr}
            max={maxStr}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`bg-input border-border ${dateError ? 'border-destructive' : ''}`}
            required
          />
          {dateError && (
            <p className="text-sm text-destructive mt-1" aria-live="polite">
              {dateError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}