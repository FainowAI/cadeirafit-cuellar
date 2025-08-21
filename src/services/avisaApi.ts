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
  private readonly baseUrl = 'https://api.avisa.ai/v1';
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
    console.log('🔧 AvisaAPI inicializada com token:', token.substring(0, 10) + '...');
  }

  private async makeRequest(endpoint: string, data: any): Promise<AvisaApiResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📡 Fazendo requisição para:', url);
    console.log('📤 Dados enviados:', data);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(data),
      });

      console.log('📥 Status da resposta:', response.status);
      console.log('📥 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📥 Resposta da API:', result);

      if (!response.ok) {
        throw new Error(result.message || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('❌ Erro na AvisaAPI:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async sendMessage(phone: string, message: string): Promise<AvisaApiResponse> {
    console.log('📱 Enviando mensagem para:', phone);
    console.log('💬 Mensagem:', message.substring(0, 100) + '...');
    
    const messageData: AvisaApiMessage = {
      phone: this.formatPhone(phone),
      message,
    };

    return this.makeRequest('/messages/send', messageData);
  }

  async sendTemplateMessage(phone: string, templateName: string, variables: Record<string, string>): Promise<AvisaApiResponse> {
    const messageData = {
      phone: this.formatPhone(phone),
      template: templateName,
      variables,
    };

    return this.makeRequest('/messages/template', messageData);
  }

  private formatPhone(phone: string): string {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    console.log('📞 Telefone original:', phone, '-> Formatado:', numbers);
    
    // Adiciona código do país se não estiver presente
    if (numbers.length === 11 && numbers.startsWith('0')) {
      const formatted = `55${numbers.substring(1)}`;
      console.log('📞 Telefone final:', formatted);
      return formatted;
    }
    
    if (numbers.length === 11) {
      const formatted = `55${numbers}`;
      console.log('📞 Telefone final:', formatted);
      return formatted;
    }
    
    console.log('📞 Telefone final:', numbers);
    return numbers;
  }

  async checkStatus(messageId: string): Promise<AvisaApiResponse> {
    return this.makeRequest('/messages/status', { messageId });
  }

  // Método para testar a conexão
  async testConnection(): Promise<AvisaApiResponse> {
    console.log('🧪 Testando conexão com AvisaAPI...');
    return this.makeRequest('/health', {});
  }
}

// Instância do serviço com o token fornecido
export const avisaApi = new AvisaApiService('swHRaVHVSikH9kppUhgZwJrJXcxlLHIp4yWMciBDwQ86X3FAYRwTmCpHhNRU');

export default avisaApi;
