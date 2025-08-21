interface AvisaApiMessage {
  phone: string;
  message: string;
  instance?: string;
}

interface AvisaApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class AvisaApiService {
  private readonly baseUrl = 'https://api.avisa.ai';
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string, data: any): Promise<AvisaApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro na requisição para AvisaAPI');
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Erro na AvisaAPI:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async sendMessage(phone: string, message: string): Promise<AvisaApiResponse> {
    const messageData: AvisaApiMessage = {
      phone: this.formatPhone(phone),
      message,
    };

    return this.makeRequest('/send-message', messageData);
  }

  async sendTemplateMessage(phone: string, templateName: string, variables: Record<string, string>): Promise<AvisaApiResponse> {
    const messageData = {
      phone: this.formatPhone(phone),
      template: templateName,
      variables,
    };

    return this.makeRequest('/send-template', messageData);
  }

  private formatPhone(phone: string): string {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não estiver presente
    if (numbers.length === 11 && numbers.startsWith('0')) {
      return `55${numbers.substring(1)}`;
    }
    
    if (numbers.length === 11) {
      return `55${numbers}`;
    }
    
    return numbers;
  }

  async checkStatus(messageId: string): Promise<AvisaApiResponse> {
    return this.makeRequest('/message-status', { messageId });
  }
}

// Instância do serviço com o token fornecido
export const avisaApi = new AvisaApiService('swHRaVHVSikH9kppUhgZwJrJXcxlLHIp4yWMciBDwQ86X3FAYRwTmCpHhNRU');

export default avisaApi;
