// Mock data for Super Admin Dashboard
// Will be replaced with real API calls when backend is ready

export interface MockUser {
  id: string;
  email: string;
  nome: string;
  avatar?: string;
  isPremium: boolean;
  criadoEm: string;
  ultimaAtividade: string;
  totalSimulacoes: number;
}

export interface MockSimulacao {
  id: string;
  userId: string;
  userEmail: string;
  identificacao: string;
  peso: number;
  dias: number;
  decisao: 'vender' | 'segurar';
  lucro: number;
  criadoEm: string;
}

export interface MockAlerta {
  id: string;
  userId: string;
  userEmail: string;
  identificacao: string;
  dataAlerta: string;
  status: 'ativo' | 'inativo' | 'disparado';
  criadoEm: string;
}

export interface MockLog {
  id: string;
  timestamp: string;
  tipo: 'login_sucesso' | 'login_falha' | 'simulacao' | 'premium_ativado' | 'premium_cancelado' | 'erro';
  userId?: string;
  userEmail?: string;
  acao: string;
  detalhes?: string;
  ip?: string;
}

export interface MockExportacao {
  id: string;
  userId: string;
  userEmail: string;
  tipo: 'CSV' | 'PDF' | 'JSON';
  tamanho: string;
  status: 'concluido' | 'erro';
  criadoEm: string;
}

export interface MockAssinatura {
  id: string;
  userId: string;
  userEmail: string;
  plano: 'mensal' | 'anual';
  status: 'ativo' | 'cancelado';
  inicio: string;
  proximoPagamento: string;
  valor: number;
}

// Generate mock users
export function generateMockUsers(count: number = 20): MockUser[] {
  const nomes = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Lima',
    'Juliana Souza', 'Roberto Ferreira', 'Fernanda Alves', 'Lucas Pereira', 'Camila Rodrigues',
    'Marcos Gomes', 'Patricia Martins', 'Rafael Barbosa', 'Aline Ribeiro', 'Thiago Carvalho',
    'Beatriz Nascimento', 'Diego Mendes', 'Larissa Araújo', 'Bruno Cardoso', 'Amanda Teixeira'
  ];

  return nomes.slice(0, count).map((nome, i) => {
    const email = nome.toLowerCase().replace(' ', '.') + '@email.com';
    const isPremium = Math.random() > 0.6;
    const daysAgo = Math.floor(Math.random() * 90);
    const lastActive = Math.floor(Math.random() * 7);
    
    return {
      id: `user-${i + 1}`,
      email,
      nome,
      isPremium,
      criadoEm: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      ultimaAtividade: new Date(Date.now() - lastActive * 24 * 60 * 60 * 1000).toISOString(),
      totalSimulacoes: Math.floor(Math.random() * 50) + 1
    };
  });
}

// Generate mock simulations
export function generateMockSimulacoes(users: MockUser[], count: number = 100): MockSimulacao[] {
  const animais = ['Cordeiro A1', 'Ovelha B2', 'Carneiro C3', 'Borrego D4', 'Matriz E5'];
  const simulacoes: MockSimulacao[] = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const peso = Math.floor(Math.random() * 30) + 20;
    const dias = Math.floor(Math.random() * 60) + 10;
    const decisao = Math.random() > 0.5 ? 'vender' : 'segurar';
    const lucro = decisao === 'vender' ? Math.floor(Math.random() * 500) + 100 : -Math.floor(Math.random() * 200) - 50;
    const hoursAgo = Math.floor(Math.random() * 168);

    simulacoes.push({
      id: `sim-${i + 1}`,
      userId: user.id,
      userEmail: user.email,
      identificacao: animais[Math.floor(Math.random() * animais.length)] + `-${i}`,
      peso,
      dias,
      decisao,
      lucro,
      criadoEm: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
    });
  }

  return simulacoes.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

// Generate mock alerts
export function generateMockAlertas(users: MockUser[], count: number = 15): MockAlerta[] {
  const alertas: MockAlerta[] = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const status: MockAlerta['status'] = ['ativo', 'inativo', 'disparado'][Math.floor(Math.random() * 3)] as MockAlerta['status'];
    const daysAhead = Math.floor(Math.random() * 30);
    const daysAgo = Math.floor(Math.random() * 14);

    alertas.push({
      id: `alerta-${i + 1}`,
      userId: user.id,
      userEmail: user.email,
      identificacao: `Animal-${i + 1}`,
      dataAlerta: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
      criadoEm: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return alertas;
}

// Generate mock logs
export function generateMockLogs(users: MockUser[], count: number = 50): MockLog[] {
  const tipos: MockLog['tipo'][] = ['login_sucesso', 'login_falha', 'simulacao', 'premium_ativado', 'premium_cancelado', 'erro'];
  const acoes: Record<MockLog['tipo'], string> = {
    login_sucesso: 'Login realizado com sucesso',
    login_falha: 'Tentativa de login falhou',
    simulacao: 'Simulação criada',
    premium_ativado: 'Plano Premium ativado',
    premium_cancelado: 'Plano Premium cancelado',
    erro: 'Erro no sistema'
  };

  const logs: MockLog[] = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const minutesAgo = Math.floor(Math.random() * 10080);

    logs.push({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      tipo,
      userId: user.id,
      userEmail: user.email,
      acao: acoes[tipo],
      detalhes: tipo === 'erro' ? 'Falha ao processar requisição' : undefined,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Generate mock exports
export function generateMockExportacoes(users: MockUser[], count: number = 30): MockExportacao[] {
  const tipos: MockExportacao['tipo'][] = ['CSV', 'PDF', 'JSON'];
  const exportacoes: MockExportacao[] = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const hoursAgo = Math.floor(Math.random() * 168);
    const tamanho = `${Math.floor(Math.random() * 500) + 10} KB`;

    exportacoes.push({
      id: `export-${i + 1}`,
      userId: user.id,
      userEmail: user.email,
      tipo,
      tamanho,
      status: Math.random() > 0.1 ? 'concluido' : 'erro',
      criadoEm: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
    });
  }

  return exportacoes.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

// Generate mock subscriptions
export function generateMockAssinaturas(users: MockUser[]): MockAssinatura[] {
  const premiumUsers = users.filter(u => u.isPremium);
  
  return premiumUsers.map((user, i) => {
    const plano: MockAssinatura['plano'] = Math.random() > 0.3 ? 'mensal' : 'anual';
    const valor = plano === 'mensal' ? 19.90 : 197.00;
    const daysAgo = Math.floor(Math.random() * 60);
    const inicio = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const proximoPagamento = new Date(inicio);
    proximoPagamento.setMonth(proximoPagamento.getMonth() + (plano === 'mensal' ? 1 : 12));

    return {
      id: `assinatura-${i + 1}`,
      userId: user.id,
      userEmail: user.email,
      plano,
      status: 'ativo',
      inicio: inicio.toISOString(),
      proximoPagamento: proximoPagamento.toISOString(),
      valor
    };
  });
}

// Calculate dashboard stats
export function calcularEstatisticas(
  users: MockUser[],
  simulacoes: MockSimulacao[],
  assinaturas: MockAssinatura[]
) {
  const hoje = new Date().toISOString().split('T')[0];
  const simulacoesHoje = simulacoes.filter(s => s.criadoEm.startsWith(hoje)).length;
  const premiumUsers = users.filter(u => u.isPremium).length;
  const mrr = assinaturas.filter(a => a.status === 'ativo' && a.plano === 'mensal').length * 19.90;
  const arr = mrr * 12;

  // Simulações por dia (últimos 7 dias)
  const simulacoesPorDia: { dia: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const diaStr = data.toISOString().split('T')[0];
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    simulacoesPorDia.push({
      dia: diasSemana[data.getDay()],
      total: simulacoes.filter(s => s.criadoEm.startsWith(diaStr)).length
    });
  }

  return {
    totalUsuarios: users.length,
    usuariosPremium: premiumUsers,
    percentualPremium: ((premiumUsers / users.length) * 100).toFixed(1),
    simulacoesHoje,
    totalSimulacoes: simulacoes.length,
    mrr,
    arr,
    simulacoesPorDia
  };
}

// Initialize all mock data
export function initMockData() {
  const users = generateMockUsers(20);
  const simulacoes = generateMockSimulacoes(users, 100);
  const alertas = generateMockAlertas(users, 15);
  const logs = generateMockLogs(users, 50);
  const exportacoes = generateMockExportacoes(users, 30);
  const assinaturas = generateMockAssinaturas(users);
  const estatisticas = calcularEstatisticas(users, simulacoes, assinaturas);

  return {
    users,
    simulacoes,
    alertas,
    logs,
    exportacoes,
    assinaturas,
    estatisticas
  };
}
