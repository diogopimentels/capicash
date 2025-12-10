import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { CreateBillingDto, AbacateBillingResponse } from './dto/create-billing.dto';

@Injectable()
export class AbacateService {
  private readonly http: AxiosInstance;
  private readonly logger = new Logger(AbacateService.name);

  constructor() {
    console.log('DEBUG URL:', process.env.ABACATE_API_URL);
    console.log('DEBUG KEY:', process.env.ABACATE_API_KEY ? 'Carregada' : 'Faltando');
    // ----------------------------------

    if (!process.env.ABACATE_API_URL || !process.env.ABACATE_API_KEY) {
      this.logger.error('Faltam variáveis de ambiente do Abacate Pay.');
    }
    // Validação básica de ambiente ao iniciar
    if (!process.env.ABACATE_API_URL || !process.env.ABACATE_API_KEY) {
      this.logger.error('Faltam variáveis de ambiente do Abacate Pay (ABACATE_API_URL ou ABACATE_API_KEY).');
    }

    this.http = axios.create({
      baseURL: process.env.ABACATE_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.ABACATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createBilling(data: CreateBillingDto): Promise<AbacateBillingResponse['data']> {
    try {
      const response = await this.http.post<AbacateBillingResponse>('/billing/create', data);
      
      this.logger.log(`Cobrança criada no Abacate Pay: ${response.data.data.id}`);
      
      return response.data.data;
    } catch (error) {
      this.logger.error(
        'Erro ao criar cobrança no Abacate Pay', 
        error.response?.data || error.message
      );
      
      // Lança erro para ser capturado pelo Global Filter ou Controller
      throw new InternalServerErrorException(
        'Falha ao comunicar com gateway de pagamento.'
      );
    }
  }
}