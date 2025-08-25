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
  // Pega a primeira recomendação (principal)
  const recomendacaoPrincipal = recomendacoes[0];
  
  let mensagem = `Olá ${dados.nome}! 👋\n\n`;
  mensagem += `Sabemos como é importante ter conforto no dia a dia e com base no seu perfil, nossa recomendação especial é a ${recomendacaoPrincipal.categoria.rotulo}!\n\n`;
  mensagem += `💡 *Por que é perfeita para você:*\n`;
  mensagem += `${recomendacaoPrincipal.motivo}\n\n`;
  mensagem += `📞 *Entre em contato agora para garantir sua oferta:*\n`;
  mensagem += `Email: comercial@cuellarmoveis.com.br\n`;
  mensagem += `Site: https://www.cuellarmoveis.com.br\n\n`;
  mensagem += `*Cuellar Móveis - Transformando seu ambiente de trabalho!* 🪑✨`;
  
  return mensagem;
};

// Função para criar mensagem específica para cada cadeira individual
export const formatarMensagemCadeiraIndividual = (dados: DadosUsuario, cadeira: Recomendacao): string => {
  let mensagem = `*Olá ${dados.nome}! 👋*\n\n`;
  mensagem += `Baseado no seu perfil, nossa recomendação especial é a *${cadeira.categoria.rotulo}*!\n\n`;
  
  mensagem += `🎁 *OFERTA ESPECIAL PARA VOCÊ:*\n`;
  mensagem += `• *10% de desconto exclusivo*\n\n`;
  
  mensagem += `💡 *Por que é perfeita para você:*\n`;
  mensagem += `${cadeira.motivo}\n\n`;
  
  mensagem += `📞 *Entre em contato agora para garantir sua oferta:*\n`;
  mensagem += `Email: comercial@cuellarmoveis.com.br\n`;
  mensagem += `Site: https://www.cuellarmoveis.com.br/cadeira\n\n`;
  
  mensagem += `*Cuellar Móveis - Transformando seu ambiente de trabalho!* 🪑✨`;
  
  return mensagem;
};

export const formatarMensagemResumida = (dados: DadosUsuario, recomendacoes: Recomendacao[]): string => {
  const principaisRecomendacoes = recomendacoes
    .filter(rec => rec.prioridade === 'alta')
    .map(rec => rec.categoria.rotulo)
    .join(', ');
  
  let mensagem = `*Nova consulta - Cuellar Móveis*\n\n`;
  mensagem += `👤 *Cliente:* ${dados.nome}\n`;
  mensagem += `📧 *Email:* ${dados.email}\n`;
  mensagem += `📏 *Medidas:* ${dados.altura}cm x ${dados.peso}kg\n`;
  mensagem += `🎯 *Perfil:* ${dados.perfilPostural}\n`;
  mensagem += `🪑 *Principais recomendações:* ${principaisRecomendacoes}\n\n`;
  mensagem += `*Aguardando contato para proposta personalizada*`;
  
  return mensagem;
};
