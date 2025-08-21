interface Recomendacao {
  categoria: {
    rotulo: string;
    descricao: string;
    recursos: string[];
  };
  prioridade: 'alta' | 'media' | 'baixa';
  motivo: string;
}

interface DadosUsuario {
  nome: string;
  email: string;
  telefone: string;
  altura: string;
  peso: string;
  perfilPostural: string;
}

export const formatarMensagemWhatsApp = (dados: DadosUsuario, recomendacoes: Recomendacao[]): string => {
  const getPrioridadeEmoji = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return '🔥';
      case 'media': return '⭐';
      case 'baixa': return '💡';
      default: return '📋';
    }
  };

  const getPerfilEmoji = (perfil: string) => {
    switch (perfil) {
      case 'equilibrado': return '⚖️';
      case 'lordose-acentuada': return '🔽';
      case 'cifose-acentuada': return '🔼';
      case 'assimetria-leve': return '↔️';
      default: return '📊';
    }
  };

  let mensagem = `*Olá ${dados.nome}! 👋*\n\n`;
  mensagem += `Agradecemos por usar nosso *Consultor de Cadeiras Cuellar*!\n\n`;
  
  mensagem += `📋 *Seus dados:*\n`;
  mensagem += `• Nome: ${dados.nome}\n`;
  mensagem += `• Altura: ${dados.altura}cm\n`;
  mensagem += `• Peso: ${dados.peso}kg\n`;
  mensagem += `• Perfil Postural: ${getPerfilEmoji(dados.perfilPostural)} ${dados.perfilPostural.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
  
  mensagem += `🎯 *Cadeiras Recomendadas:*\n\n`;
  
  recomendacoes.forEach((rec, index) => {
    mensagem += `${getPrioridadeEmoji(rec.prioridade)} *${rec.categoria.rotulo}*\n`;
    mensagem += `📝 ${rec.categoria.descricao}\n`;
    mensagem += `💡 *Por que recomendamos:* ${rec.motivo}\n`;
    mensagem += `✨ *Principais recursos:*\n`;
    
    rec.categoria.recursos.slice(0, 3).forEach(recurso => {
      mensagem += `   • ${recurso}\n`;
    });
    
    if (index < recomendacoes.length - 1) {
      mensagem += `\n`;
    }
  });
  
  mensagem += `\n🎁 *Próximos passos:*\n`;
  mensagem += `• Nossa equipe especializada irá preparar uma proposta personalizada\n`;
  mensagem += `• Preços especiais exclusivos para você\n`;
  mensagem += `• Entrega e instalação inclusas\n`;
  mensagem += `• Garantia estendida\n\n`;
  
  mensagem += `📞 *Contato:*\n`;
  mensagem += `• WhatsApp: (11) 99999-9999\n`;
  mensagem += `• Email: contato@cuellar.com.br\n`;
  mensagem += `• Horário: Seg-Sex, 8h às 18h\n\n`;
  
  mensagem += `*Cuellar Móveis - Ergonomia que transforma seu trabalho!* 🪑✨`;
  
  return mensagem;
};

export const formatarMensagemResumida = (dados: DadosUsuario, recomendacoes: Recomendacao[]): string => {
  const principaisRecomendacoes = recomendacoes
    .filter(rec => rec.prioridade === 'alta')
    .map(rec => rec.categoria.rotulo)
    .join(', ');
  
  let mensagem = `*Nova consulta - Cuellar Móveis*\n\n`;
  mensagem += `👤 *Cliente:* ${dados.nome}\n`;
  mensagem += `📱 *Telefone:* ${dados.telefone}\n`;
  mensagem += `📧 *Email:* ${dados.email}\n`;
  mensagem += `📏 *Medidas:* ${dados.altura}cm x ${dados.peso}kg\n`;
  mensagem += `🎯 *Perfil:* ${dados.perfilPostural}\n`;
  mensagem += `🪑 *Principais recomendações:* ${principaisRecomendacoes}\n\n`;
  mensagem += `*Aguardando contato para proposta personalizada*`;
  
  return mensagem;
};
