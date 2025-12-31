import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-ponto-cordeiro.png";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ponto do Cordeiro" className="h-10 w-10" />
            <span className="font-bold text-lg">Ponto do Cordeiro</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          TERMOS E CONDIÇÕES DE USO - PONTO DO CORDEIRO
        </h1>
        
        <p className="text-muted-foreground mb-8">
          <strong>Última atualização:</strong> 31 de dezembro de 2024
        </p>

        {/* Seção 1 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            1. INFORMAÇÕES GERAIS
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Bem-vindo ao <strong>Ponto do Cordeiro</strong>!
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Estes Termos e Condições de Uso ("Termos") regem o acesso e uso do aplicativo Ponto do Cordeiro, operado por:
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <p className="text-base text-foreground"><strong>RS Marketer Ltda</strong></p>
            <p className="text-base text-muted-foreground">CNPJ: 45.674.846/0001-45</p>
            <p className="text-base text-muted-foreground">Nome Fantasia: Ponto do Cordeiro</p>
            <p className="text-base text-muted-foreground">Endereço: Rua Diogo Soler Soler, 261 - Chácara Três Marias - Sorocaba/SP</p>
            <p className="text-base text-muted-foreground">
              Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a>
            </p>
            <p className="text-base text-muted-foreground">
              WhatsApp: <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a>
            </p>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Ao utilizar o Ponto do Cordeiro, você concorda integralmente com estes Termos e com nossa Política de Privacidade.
          </p>
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 my-4">
            <p className="text-base text-red-800 dark:text-red-200 font-semibold">
              SE VOCÊ NÃO CONCORDA COM ESTES TERMOS, NÃO UTILIZE O SERVIÇO.
            </p>
          </div>
        </section>

        {/* Seção 2 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            2. DEFINIÇÕES
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Para fins destes Termos:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li><strong>"Aplicativo"</strong> ou <strong>"Plataforma"</strong>: Sistema Ponto do Cordeiro (web e mobile)</li>
            <li><strong>"Usuário"</strong> ou <strong>"Você"</strong>: Pessoa física ou jurídica que utiliza o serviço</li>
            <li><strong>"Nós"</strong> ou <strong>"Empresa"</strong>: RS Marketer Ltda</li>
            <li><strong>"Versão Gratuita"</strong>: Funcionalidades básicas sem custo</li>
            <li><strong>"Versão Premium"</strong>: Funcionalidades avançadas mediante assinatura</li>
            <li><strong>"Simulação"</strong>: Cálculo de decisão de venda de cordeiros</li>
            <li><strong>"Conteúdo"</strong>: Dados, textos, gráficos gerados pelo usuário</li>
            <li><strong>"Serviço"</strong>: Todas as funcionalidades oferecidas</li>
          </ul>
        </section>

        {/* Seção 3 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            3. ACEITE DOS TERMOS
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.1. Concordância</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Ao criar uma conta, você declara:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Ter lido e compreendido estes Termos</li>
            <li>Ter capacidade legal para contratar</li>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Usar o serviço de forma lícita</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.2. Idade Mínima</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Você deve ter <strong>18 anos ou mais</strong> para usar o Ponto do Cordeiro.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Menores de 18 anos só podem usar mediante autorização expressa de pais ou responsáveis legais.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.3. Alterações</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Reservamos o direito de modificar estes Termos a qualquer momento.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Quando houver alterações:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Notificaremos por email ou in-app</li>
            <li>Publicaremos versão atualizada</li>
            <li>Uso continuado representa aceitação</li>
          </ul>
        </section>

        {/* Seção 4 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            4. DESCRIÇÃO DO SERVIÇO
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">4.1. O que é o Ponto do Cordeiro</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Sistema inteligente que auxilia produtores rurais a decidirem o melhor momento de venda de cordeiros, baseado em cálculos de:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Peso do animal</li>
            <li>Dias em cativeiro</li>
            <li>Custo diário de alimentação</li>
            <li>Preço de venda por kg</li>
            <li>Projeção de ganho futuro (Premium)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">4.2. Versão Gratuita</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Funcionalidades incluídas:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Simulação básica ilimitada</li>
            <li>Cálculo de lucro instantâneo</li>
            <li>Decisão "vender" ou "segurar"</li>
            <li>Compartilhamento via WhatsApp</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">4.3. Versão Premium</h3>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <p className="text-base text-green-800 dark:text-green-200 font-semibold mb-2">Funcionalidades adicionais:</p>
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>Projeção de ganho de peso futuro</li>
              <li>Comparação: vender hoje vs segurar</li>
              <li>Histórico completo de simulações</li>
              <li>Identificação de animais</li>
              <li>Alertas e lembretes automáticos</li>
              <li>Gráficos de evolução</li>
              <li>Exportação de relatórios (PDF, CSV, Excel)</li>
              <li>Integração com Google Sheets</li>
              <li>Compartilhamento avançado (Telegram, Email, etc)</li>
              <li>Suporte prioritário (até 2 horas)</li>
            </ul>
          </div>
        </section>

        {/* Seção 5 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            5. CADASTRO E CONTA
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">5.1. Criação de Conta</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Para acessar a Versão Premium, você deve:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Fornecer dados verdadeiros e completos</li>
            <li>Criar credenciais seguras</li>
            <li>Manter informações atualizadas</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Métodos de cadastro:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Google (OAuth)</li>
            <li>Facebook (OAuth)</li>
            <li>Email e senha</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">5.2. Responsabilidade da Conta</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você é responsável por:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Manter confidencialidade da senha</li>
            <li>Todas as atividades em sua conta</li>
            <li>Notificar imediatamente sobre acesso não autorizado</li>
          </ul>
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 my-4">
            <p className="text-base text-red-800 dark:text-red-200 font-semibold">
              Não compartilhe sua conta. Contas são pessoais e intransferíveis.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">5.3. Suspensão e Cancelamento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos suspender ou cancelar sua conta se:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Violar estes Termos</li>
            <li>Usar o serviço para fins ilícitos</li>
            <li>Fornecer informações falsas</li>
            <li>Não pagar assinatura Premium</li>
            <li>Prejudicar outros usuários ou o sistema</li>
          </ul>
        </section>

        {/* Seção 6 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            6. ASSINATURA PREMIUM
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.1. Planos Disponíveis</h3>
          
          <h4 className="text-lg font-medium mt-4 mb-2 text-foreground">Plano Mensal</h4>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Cobrança: Mensal recorrente</li>
            <li>Cancelamento: A qualquer momento sem multa</li>
          </ul>

          <h4 className="text-lg font-medium mt-4 mb-2 text-foreground">Plano Anual</h4>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Cobrança: Anual</li>
            <li>Economia significativa em relação ao plano mensal</li>
            <li>Cancelamento: A qualquer momento sem multa</li>
          </ul>

          <h4 className="text-lg font-medium mt-4 mb-2 text-foreground">Programa Fundadores (Vagas Limitadas)</h4>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>Bônus: Meses extras grátis</li>
              <li>Grupo VIP exclusivo no WhatsApp</li>
              <li>Planilha complementar de gestão</li>
              <li>Condições especiais de lançamento</li>
            </ul>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Valores atualizados:</strong> Consulte nossa página de preços em{" "}
            <Link to="/premium-info" className="text-emerald-600 underline">pontodocordeiro.com.br/premium-info</Link>
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mt-2">
            Os preços podem ser atualizados periodicamente. Assinantes ativos mantêm o preço contratado até a próxima renovação (com aviso prévio de 30 dias em caso de alteração).
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.2. Teste Grátis</h3>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <p className="text-base text-green-800 dark:text-green-200 font-semibold mb-2">7 dias grátis para novos assinantes:</p>
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>Acesso completo aos recursos Premium</li>
              <li>Sem compromisso</li>
              <li>Cancele antes de 7 dias: sem cobrança</li>
              <li>Após 7 dias: cobrança automática</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.3. Pagamento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Processamento:</strong> Ticto (processadora de pagamentos)</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Métodos aceitos:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Cartão de crédito</li>
            <li>PIX</li>
            <li>Boleto bancário (conforme disponibilidade)</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Importante:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Não armazenamos dados de cartão</li>
            <li>Pagamentos processados de forma segura</li>
            <li>Recibo enviado por email</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.4. Renovação Automática</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Assinaturas renovam automaticamente até cancelamento.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Você será cobrado:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Plano Mensal: A cada 30 dias</li>
            <li>Plano Anual: A cada 12 meses</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Notificações:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>7 dias antes da renovação</li>
            <li>Confirmação após cobrança</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.5. Reembolso e Garantia</h3>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <p className="text-base text-green-800 dark:text-green-200 font-semibold mb-2">Garantia de 30 dias:</p>
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>Solicite reembolso em até 30 dias</li>
              <li>Devolução de 100% do valor pago</li>
              <li>Sem perguntas ou burocracia</li>
              <li>Processamento em até 7 dias úteis</li>
            </ul>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Como solicitar:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a></li>
            <li>WhatsApp: <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a></li>
            <li>Assunto: "Solicitação de Reembolso"</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Após 30 dias:</strong> Reembolso não garantido (análise caso a caso)
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.6. Cancelamento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Como cancelar:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>App: Configurações {">"} Assinatura {">"} Cancelar</li>
            <li>Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a></li>
            <li>WhatsApp: <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a></li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Efeitos do cancelamento:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Acesso Premium até fim do período pago</li>
            <li>Sem cobrança futura</li>
            <li>Dados mantidos por 12 meses (pode solicitar exclusão)</li>
            <li>Histórico preservado (pode exportar antes)</li>
          </ul>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <p className="text-base text-green-800 dark:text-green-200 font-semibold">
              Sem multa ou taxa de cancelamento.
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.7. Atraso de Pagamento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Se o pagamento falhar:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Tentaremos novamente em 3, 5 e 7 dias</li>
            <li>Você será notificado por email</li>
            <li>Acesso Premium suspenso após 7 dias</li>
            <li>Dados preservados por 30 dias</li>
            <li>Reativação: Regularize pagamento</li>
          </ul>
        </section>

        {/* Seção 7 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            7. USO ACEITÁVEL
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">7.1. Você PODE</h3>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>✓ Usar para gestão de sua produção rural</li>
              <li>✓ Compartilhar resultados para fins legítimos</li>
              <li>✓ Exportar seus próprios dados</li>
              <li>✓ Integrar com suas ferramentas (Google Sheets)</li>
              <li>✓ Sugerir melhorias e reportar bugs</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">7.2. Você NÃO PODE</h3>
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 my-4">
            <ul className="ml-6 space-y-2 text-base text-red-700 dark:text-red-300">
              <li>✗ Revender acesso ao sistema</li>
              <li>✗ Compartilhar credenciais de login</li>
              <li>✗ Fazer engenharia reversa do código</li>
              <li>✗ Usar bots ou automação não autorizada</li>
              <li>✗ Sobrecarregar servidores (DDoS)</li>
              <li>✗ Inserir malware ou código malicioso</li>
              <li>✗ Copiar ou plagiar o sistema</li>
              <li>✗ Usar para fins ilícitos ou fraudulentos</li>
              <li>✗ Violar direitos de terceiros</li>
              <li>✗ Criar múltiplas contas para abusar do teste grátis</li>
            </ul>
            <p className="text-base text-red-800 dark:text-red-200 font-semibold mt-4">
              Violações resultam em suspensão ou cancelamento da conta.
            </p>
          </div>
        </section>

        {/* Seção 8 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            8. PROPRIEDADE INTELECTUAL
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">8.1. Nossos Direitos</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            Todos os direitos sobre o Ponto do Cordeiro pertencem à RS Marketer Ltda:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Código-fonte</li>
            <li>Design e interface</li>
            <li>Marca "Ponto do Cordeiro"</li>
            <li>Algoritmos e metodologias</li>
            <li>Conteúdo do site/app</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Protegido por:</strong> Direitos autorais, marcas registradas e propriedade intelectual.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">8.2. Seus Direitos</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você mantém propriedade sobre:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Dados que você insere (peso, custo, preço, etc)</li>
            <li>Simulações criadas</li>
            <li>Relatórios exportados</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Licença concedida a nós:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Usar seus dados para fornecer o serviço</li>
            <li>Gerar estatísticas anônimas</li>
            <li>Melhorar algoritmos (dados anonimizados)</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            Você pode exportar e excluir seus dados a qualquer momento.
          </p>
        </section>

        {/* Seção 9 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            9. PRIVACIDADE E PROTEÇÃO DE DADOS
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">9.1. LGPD</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Tratamos seus dados conforme Lei Geral de Proteção de Dados (Lei 13.709/18).
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            <strong>Consulte nossa <Link to="/politica-privacidade" className="text-emerald-600 underline">Política de Privacidade</Link> para:</strong>
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Quais dados coletamos</li>
            <li>Como usamos</li>
            <li>Com quem compartilhamos</li>
            <li>Seus direitos (acesso, correção, exclusão)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">9.2. Consentimento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            Ao usar o Ponto do Cordeiro, você consente com:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Coleta e tratamento de dados pessoais</li>
            <li>Uso de cookies e tecnologias similares</li>
            <li>Compartilhamento com prestadores de serviço (Ticto, Google, etc)</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Você pode revogar consentimento a qualquer momento.</strong>
          </p>
        </section>

        {/* Seção 10 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            10. LIMITAÇÃO DE RESPONSABILIDADE
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">10.1. Natureza do Serviço</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            O Ponto do Cordeiro é uma <strong>ferramenta de auxílio à decisão</strong>.
          </p>
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 my-4">
            <p className="text-base text-red-800 dark:text-red-200 font-semibold mb-2">NÓS NÃO GARANTIMOS:</p>
            <ul className="ml-6 space-y-2 text-base text-red-700 dark:text-red-300">
              <li>Lucro ou resultados financeiros específicos</li>
              <li>Precisão absoluta dos cálculos (depende dos dados inseridos)</li>
              <li>Adequação a todas as situações de mercado</li>
              <li>Disponibilidade 100% do tempo (podemos ter manutenções)</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">10.2. Uso por sua Conta e Risco</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você é responsável por:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Verificar dados inseridos</li>
            <li>Validar resultados antes de tomar decisões</li>
            <li>Considerar fatores externos (mercado, clima, etc)</li>
            <li>Decisões de venda de seus animais</li>
          </ul>
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 my-4">
            <p className="text-base text-red-800 dark:text-red-200 font-semibold mb-2">O Ponto do Cordeiro não substitui:</p>
            <ul className="ml-6 space-y-2 text-base text-red-700 dark:text-red-300">
              <li>Consultoria profissional</li>
              <li>Análise veterinária</li>
              <li>Assessoria financeira</li>
              <li>Bom senso do produtor</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">10.3. Exclusão de Garantias</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            Na máxima extensão permitida por lei:
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>NÃO GARANTIMOS:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Funcionamento ininterrupto</li>
            <li>Ausência de erros</li>
            <li>Compatibilidade com todos dispositivos</li>
            <li>Segurança 100% contra ataques</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>O SERVIÇO É FORNECIDO "COMO ESTÁ".</strong>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">10.4. Limitação de Danos</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Em nenhuma hipótese seremos responsáveis por:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Lucros cessantes</li>
            <li>Perda de dados (faça backups!)</li>
            <li>Danos indiretos ou consequenciais</li>
            <li>Perdas financeiras por decisões tomadas</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Responsabilidade máxima:</strong> Valor pago nos últimos 12 meses.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">10.5. Força Maior</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Não somos responsáveis por falhas causadas por:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Problemas de internet do usuário</li>
            <li>Falhas de terceiros (Ticto, Google, etc)</li>
            <li>Desastres naturais</li>
            <li>Atos governamentais</li>
            <li>Ataques cibernéticos</li>
          </ul>
        </section>

        {/* Seção 11 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            11. DISPONIBILIDADE E MANUTENÇÃO
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">11.1. Uptime</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Esforçamo-nos para manter o serviço disponível 24/7.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Metas:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Disponibilidade: 99% do tempo</li>
            <li>Tempo de resposta: {"<"} 2 segundos</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Manutenções:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Planejadas: Notificação prévia (preferencialmente madrugada)</li>
            <li>Emergenciais: Sem aviso prévio</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">11.2. Backup</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Realizamos backups regulares, mas:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Recomendamos que você exporte dados importantes</li>
            <li>Não garantimos recuperação 100% em caso de perda</li>
          </ul>
        </section>

        {/* Seção 12 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            12. NOTIFICAÇÕES E COMUNICAÇÕES
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">12.1. Como nos comunicamos</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Canais oficiais:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Email cadastrado</li>
            <li>Notificações in-app</li>
            <li>WhatsApp (se autorizado)</li>
            <li>SMS (em casos urgentes)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">12.2. Suas Responsabilidades</h3>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Manter email atualizado</li>
            <li>Verificar notificações regularmente</li>
            <li>Não marcar nossos emails como spam</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">12.3. Comunicações de Marketing</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você pode:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Optar por não receber emails promocionais</li>
            <li>Continuar recebendo emails transacionais (cobrança, alertas, etc)</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Cancelar inscrição:</strong> Link no rodapé dos emails ou Configurações {">"} Notificações
          </p>
        </section>

        {/* Seção 13 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            13. MODIFICAÇÕES NO SERVIÇO
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">13.1. Atualizações</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos a qualquer momento:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Adicionar novos recursos</li>
            <li>Modificar funcionalidades existentes</li>
            <li>Descontinuar recursos (com aviso prévio de 30 dias)</li>
            <li>Alterar interface</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Grandes mudanças:</strong> Notificação prévia sempre que possível.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">13.2. Preços</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos alterar preços da assinatura Premium:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Aviso prévio de 30 dias</li>
            <li>Novos preços aplicam-se apenas após renovação</li>
            <li>Você pode cancelar antes da cobrança com novo valor</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Usuários Fundadores:</strong> Preço garantido conforme plano contratado.
          </p>
        </section>

        {/* Seção 14 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            14. RESCISÃO
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">14.1. Rescisão por Sua Parte</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            Você pode encerrar sua conta a qualquer momento:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Cancelando assinatura</li>
            <li>Solicitando exclusão de conta</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Efeitos:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Perda de acesso imediato (ou fim do período pago)</li>
            <li>Dados excluídos em 30 dias (conforme Política de Privacidade)</li>
            <li>Sem reembolso proporcional (exceto dentro dos 30 dias de garantia)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">14.2. Rescisão por Nossa Parte</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos encerrar sua conta se:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Violar estes Termos</li>
            <li>Não pagar assinatura</li>
            <li>Usar serviço para fins ilícitos</li>
            <li>Prejudicar sistema ou outros usuários</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Notificação:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Com aviso prévio de 7 dias (quando possível)</li>
            <li>Imediata em casos graves (fraude, ilegalidade)</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Efeitos:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Perda de acesso imediato</li>
            <li>Sem reembolso</li>
            <li>Possível exclusão de dados</li>
          </ul>
        </section>

        {/* Seção 15 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            15. INDENIZAÇÃO
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">
            Você concorda em indenizar, defender e isentar a RS Marketer Ltda de:
          </p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Violações destes Termos</li>
            <li>Uso inadequado do serviço</li>
            <li>Violação de direitos de terceiros</li>
            <li>Informações falsas fornecidas</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Inclui:</strong> Custos legais, honorários advocatícios, multas.
          </p>
        </section>

        {/* Seção 16 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            16. LEGISLAÇÃO E FORO
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">16.1. Lei Aplicável</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Legislação específica:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Lei Geral de Proteção de Dados (13.709/18)</li>
            <li>Marco Civil da Internet (12.965/14)</li>
            <li>Código de Defesa do Consumidor (8.078/90)</li>
            <li>Código Civil Brasileiro</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">16.2. Foro</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Fica eleito o foro da Comarca de <strong>Sorocaba/SP</strong> para dirimir quaisquer controvérsias.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Exceção:</strong> Consumidores podem acionar foro de seu domicílio (CDC).
          </p>
        </section>

        {/* Seção 17 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            17. RESOLUÇÃO DE CONFLITOS
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">17.1. Contato Direto</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Antes de acionar judicial ou administrativa:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Entre em contato conosco</li>
            <li>Prazo de resposta: 15 dias úteis</li>
            <li>Buscamos solução amigável</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">17.2. Mediação e Arbitragem</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos sugerir mediação ou arbitragem para:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Resolver conflitos mais rapidamente</li>
            <li>Reduzir custos</li>
            <li>Manter sigilo</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Participação:</strong> Voluntária
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">17.3. Procon e Consumidor.gov.br</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você pode registrar reclamações em:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Procon de sua cidade</li>
            <li>Plataforma Consumidor.gov.br</li>
            <li>Juizado Especial Cível</li>
          </ul>
        </section>

        {/* Seção 18 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            18. DISPOSIÇÕES GERAIS
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">18.1. Independência das Cláusulas</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Se qualquer cláusula for inválida:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Restante continua válido</li>
            <li>Cláusula será ajustada minimamente para tornar-se válida</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">18.2. Não Renúncia</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Não exercer um direito não significa renúncia.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">18.3. Cessão</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Você não pode transferir seus direitos e obrigações.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Nós podemos ceder este contrato em caso de:</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Venda da empresa</li>
            <li>Fusão ou aquisição</li>
            <li>Reorganização societária</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4">
            <strong>Notificação:</strong> Você será informado.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">18.4. Acordo Integral</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Estes Termos + Política de Privacidade = Acordo completo.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Substitui qualquer acordo anterior verbal ou escrito.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">18.5. Idioma</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            Versão em português prevalece em caso de tradução.
          </p>
        </section>

        {/* Seção 19 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            19. CONTATO E SUPORTE
          </h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">19.1. Canais de Atendimento</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2"><strong>Dúvidas sobre o serviço:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a></li>
            <li>WhatsApp: <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a></li>
            <li>In-app: Menu {">"} Suporte</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Horário:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Segunda a sexta: 8h às 18h</li>
            <li>Sábados: 8h às 12h</li>
            <li>Domingos e feriados: Apenas urgências</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed mt-4 mb-2"><strong>Tempo de resposta:</strong></p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Premium: Até 2 horas úteis</li>
            <li>Gratuito: Até 24 horas úteis</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">19.2. Questões Jurídicas</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Email:</strong> <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a><br />
            <strong>Assunto:</strong> "Jurídico - [Seu Assunto]"
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">19.3. Reportar Problemas Técnicos</h3>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>In-app: Menu {">"} Reportar Bug</li>
            <li>Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a></li>
            <li>Descreva detalhadamente: dispositivo, navegador, o que aconteceu</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">19.4. Sugestões e Feedback</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Adoramos ouvir você!</p>
          <ul className="ml-6 space-y-2 text-base text-muted-foreground">
            <li>Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a></li>
            <li>In-app: Menu {">"} Feedback</li>
            <li>Grupo VIP (Fundadores)</li>
          </ul>
        </section>

        {/* Seção 20 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            20. DECLARAÇÃO FINAL
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Ao usar o Ponto do Cordeiro, você declara e garante:
          </p>
          <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-4 my-4">
            <ul className="ml-6 space-y-2 text-base text-green-700 dark:text-green-300">
              <li>✓ Leu e compreendeu integralmente estes Termos</li>
              <li>✓ Leu e compreendeu a Política de Privacidade</li>
              <li>✓ Tem capacidade legal para contratar</li>
              <li>✓ Forneceu informações verdadeiras</li>
              <li>✓ Usará o serviço de forma ética e legal</li>
              <li>✓ Concorda com todas as cláusulas</li>
            </ul>
          </div>
        </section>

        {/* Resumo Simplificado */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
            RESUMO SIMPLIFICADO
          </h2>
          <p className="text-sm text-muted-foreground italic mb-4">
            (NÃO SUBSTITUI A LEITURA COMPLETA)
          </p>
          <div className="bg-muted/50 p-6 rounded-lg">
            <ul className="space-y-3 text-base text-foreground">
              <li>📌 <strong>O que é:</strong> Sistema para decidir melhor momento de vender cordeiros</li>
              <li>💰 <strong>Planos:</strong> Gratuito (básico) ou Premium (mensal ou anual com desconto)</li>
              <li>🎁 <strong>Teste:</strong> 7 dias grátis sem compromisso</li>
              <li>🛡️ <strong>Garantia:</strong> 30 dias - reembolso 100%</li>
              <li>🔒 <strong>Privacidade:</strong> Seus dados protegidos (LGPD)</li>
              <li>📊 <strong>Seus dados:</strong> Você pode exportar e excluir quando quiser</li>
              <li>🚫 <strong>Não pode:</strong> Revender, compartilhar conta, usar para fins ilícitos</li>
              <li>⚠️ <strong>Importante:</strong> Ferramenta de auxílio - decisões são suas</li>
              <li>📞 <strong>Suporte:</strong> <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a> | <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a></li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-center space-y-4">
            <p className="text-base text-muted-foreground">
              <strong>Data de vigência:</strong> 31 de dezembro de 2024
            </p>
            <div className="space-y-2">
              <p className="text-base text-foreground font-semibold">RS Marketer Ltda</p>
              <p className="text-base text-muted-foreground">CNPJ: 45.674.846/0001-45</p>
              <p className="text-base text-muted-foreground">Ponto do Cordeiro</p>
              <p className="text-base text-muted-foreground">Sorocaba/SP</p>
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-base text-muted-foreground">
                <strong>Dúvidas sobre estes Termos?</strong>
              </p>
              <p className="text-base text-muted-foreground">
                Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-emerald-600 underline">contato@pontodocordeiro.com.br</a>
              </p>
              <p className="text-base text-muted-foreground">
                WhatsApp: <a href="https://wa.me/5515998454589" className="text-emerald-600 underline">+55 15 99845-4589</a>
              </p>
            </div>
            <div className="pt-6">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Agradecemos por escolher o Ponto do Cordeiro!<br />
              Estamos comprometidos em ajudar você a tomar as melhores decisões para sua produção.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TermosDeUso;
