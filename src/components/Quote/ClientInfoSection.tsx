import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClientInfoSectionProps {
  client: {
    name: string;
    contact: string;
    address: string;
    location: string;
  };
  enabled: boolean;
  onClientChange: (field: string, value: string) => void;
}

export function ClientInfoSection({ client, enabled, onClientChange }: ClientInfoSectionProps) {
  const isValid = Object.values(client).every(value => value.trim() !== '');

  return (
    <section 
      className={`
        border-2 border-dashed border-border rounded-xl p-4 mb-6 transition-all duration-300
        ${enabled ? 'opacity-100' : 'opacity-60 pointer-events-none'}
      `}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Datos del Cliente</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-name" className="text-muted-foreground text-sm">
            Nombre
          </Label>
          <Input
            id="client-name"
            type="text"
            value={client.name}
            onChange={(e) => onClientChange('name', e.target.value)}
            className="bg-input border-border"
            disabled={!enabled}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-contact" className="text-muted-foreground text-sm">
            Contacto
          </Label>
          <Input
            id="client-contact"
            type="text"
            value={client.contact}
            onChange={(e) => onClientChange('contact', e.target.value)}
            className="bg-input border-border"
            disabled={!enabled}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-address" className="text-muted-foreground text-sm">
            Dirección
          </Label>
          <Input
            id="client-address"
            type="text"
            value={client.address}
            onChange={(e) => onClientChange('address', e.target.value)}
            className="bg-input border-border"
            disabled={!enabled}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-location" className="text-muted-foreground text-sm">
            Localidad
          </Label>
          <Input
            id="client-location"
            type="text"
            value={client.location}
            onChange={(e) => onClientChange('location', e.target.value)}
            className="bg-input border-border"
            disabled={!enabled}
            required
          />
        </div>
      </div>
    </section>
  );
}