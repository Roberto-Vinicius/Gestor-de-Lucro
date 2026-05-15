/**
 * @file masks.ts
 * @description Funções utilitárias para aplicar máscaras em campos de texto.
 */

/**
 * Formata um valor numérico para o formato de moeda brasileiro (R$ 1.234,56).
 * É preenchido da direita para a esquerda (estilo caixa registradora).
 */
export function maskMoeda(valor: string): string {
  // Remove tudo que não é número
  const apenasNumeros = valor.replace(/\D/g, '');
  
  if (!apenasNumeros) return '';

  // Converte para centavos (ex: "123" -> 1.23)
  const valorDecimal = (parseInt(apenasNumeros, 10) / 100).toFixed(2);
  
  // Troca o ponto por vírgula e adiciona os pontos de milhar
  let [inteiro, decimal] = valorDecimal.split('.');
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${inteiro},${decimal}`;
}

/**
 * Converte a string de moeda (Ex: "1.234,56") de volta para número (1234.56).
 */
export function desmaskMoeda(valorFormatado: string): number {
  if (!valorFormatado) return 0;
  const limpo = valorFormatado.replace(/\./g, '').replace(',', '.');
  return parseFloat(limpo) || 0;
}

/**
 * Aplica a máscara de telefone celular: (XX) XXXXX-XXXX
 */
export function maskTelefone(valor: string): string {
  // Aceita apenas números
  let limpo = valor.replace(/\D/g, '');
  
  // Limita a 11 caracteres (DDD + 9 dígitos)
  if (limpo.length > 11) {
    limpo = limpo.slice(0, 11);
  }

  // Aplica a máscara
  if (limpo.length === 0) return '';
  if (limpo.length <= 2) return `(${limpo}`;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

/**
 * Aplica a máscara de data: DD/MM/YYYY
 */
export function maskData(valor: string): string {
  let limpo = valor.replace(/\D/g, '');
  
  if (limpo.length > 8) {
    limpo = limpo.slice(0, 8);
  }

  if (limpo.length === 0) return '';
  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 4) return `${limpo.slice(0, 2)}/${limpo.slice(2)}`;
  return `${limpo.slice(0, 2)}/${limpo.slice(2, 4)}/${limpo.slice(4)}`;
}

/**
 * Converte a string "DD/MM/YYYY" para um objeto Date.
 * Retorna null se for uma data inválida.
 */
export function parseDataBr(dataStr: string): Date | null {
  const partes = dataStr.split('/');
  if (partes.length !== 3) return null;
  
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // Mês no JS é 0-indexado
  const ano = parseInt(partes[2], 10);
  
  const data = new Date(ano, mes, dia);
  
  // Valida se a data resultante existe no calendário (ex: rejeita 32/13/2020)
  if (data.getFullYear() === ano && data.getMonth() === mes && data.getDate() === dia) {
    return data;
  }
  return null;
}
