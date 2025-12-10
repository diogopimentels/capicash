export class CreateBillingDto {
  frequency: 'ONE_TIME';
  methods: ['PIX'];
  products: Array<{
    externalId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number; // Em centavos
  }>;
  returnUrl: string;
  completionUrl: string;
  customerId?: string; // Opcional, caso tenhamos os dados do comprador
  customer?: {
    email: string;
    name?: string;
    taxId?: string;
    cellphone?: string;
  };
}

export interface AbacateBillingResponse {
  data: {
    id: string;
    url: string; // Link do checkout hosted (se houver)
    amount: number;
    status: string;
    pix?: {
      code: string; // Copia e cola
      qrCode: string; // Base64 ou URL da imagem
    };
  };
}