import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPontoCordeiro from "@/assets/logo-ponto-cordeiro.png";

const PoliticaPrivacidade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPontoCordeiro} alt="Ponto do Cordeiro" className="h-10 w-10" />
            <span className="font-bold text-lg">Ponto do Cordeiro</span>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade - Ponto do Cordeiro</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Última atualização:</strong> 31 de dezembro de 2024
        </p>

        {/* Seção 1 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Informações Gerais</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            A presente Política de Privacidade contém informações sobre coleta, uso, armazenamento, tratamento e proteção dos dados pessoais dos usuários do aplicativo <strong>Ponto do Cordeiro</strong>, com a finalidade de demonstrar absoluta transparência quanto ao assunto e esclarecer a todos interessados sobre os tipos de dados que são coletados, os motivos da coleta e a forma como os usuários podem gerenciar ou excluir as suas informações pessoais.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Esta Política de Privacidade aplica-se a todos os usuários do Ponto do Cordeiro e integra os Termos e Condições Gerais de Uso.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            O presente documento foi elaborado em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei 13.709/18), o Marco Civil da Internet (Lei 12.965/14) e o Regulamento da UE n. 2016/679.
          </p>
        </section>

        {/* Seção 2 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Responsável pelo Tratamento de Dados</h2>
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
            <p className="text-base leading-relaxed mb-2"><strong>RS Marketer Ltda</strong></p>
            <p className="text-base text-muted-foreground leading-relaxed">CNPJ: 45.674.846/0001-45</p>
            <p className="text-base text-muted-foreground leading-relaxed">Nome Fantasia: Ponto do Cordeiro</p>
            <p className="text-base text-muted-foreground leading-relaxed">Endereço: Rua Diogo Soler Soler, 261 - Chácara Três Marias - Sorocaba/SP</p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-[#059669] underline">contato@pontodocordeiro.com.br</a>
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              WhatsApp: <a href="https://wa.me/5515998454589" className="text-[#059669] underline">+55 15 99845-4589</a>
            </p>
          </div>
        </section>

        {/* Seção 3 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Quais Dados Coletamos e Para Que Finalidades</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Dados fornecidos pelo usuário</h3>
          
          <h4 className="font-semibold mt-4 mb-2">a) Dados de Cadastro (Versão Premium)</h4>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Nome completo</li>
            <li>• Email</li>
            <li>• Telefone/WhatsApp</li>
            <li>• Dados de login social (Google ou Facebook)</li>
          </ul>
          
          <p className="font-semibold mb-2">Finalidades:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Criação e gerenciamento da conta do usuário</li>
            <li>• Autenticação e acesso ao sistema</li>
            <li>• Comunicação sobre o serviço</li>
            <li>• Suporte técnico</li>
            <li>• Envio de alertas e notificações</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">b) Dados de Simulação</h4>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Peso do cordeiro (kg)</li>
            <li>• Dias em cativeiro</li>
            <li>• Custo diário (R$/dia)</li>
            <li>• Preço de venda (R$/kg)</li>
            <li>• Identificação opcional do animal</li>
            <li>• Data e hora das simulações</li>
          </ul>
          
          <p className="font-semibold mb-2">Finalidades:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Processamento dos cálculos de lucratividade</li>
            <li>• Histórico de simulações (Premium)</li>
            <li>• Geração de relatórios e gráficos (Premium)</li>
            <li>• Melhoria do serviço e análise de uso</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">c) Dados de Pagamento</h4>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Processados pela plataforma <strong>Ticto</strong></li>
            <li>• Não armazenamos dados de cartão de crédito</li>
            <li>• Armazenamos apenas: status da assinatura, data de início, data de renovação</li>
          </ul>
          
          <p className="font-semibold mb-2">Finalidades:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Processamento de assinaturas</li>
            <li>• Controle de acesso aos recursos Premium</li>
            <li>• Emissão de recibos e notas fiscais</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Dados coletados automaticamente</h3>
          
          <h4 className="font-semibold mt-4 mb-2">a) Dados de Navegação</h4>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Endereço IP</li>
            <li>• Tipo de navegador</li>
            <li>• Sistema operacional</li>
            <li>• Páginas visitadas</li>
            <li>• Tempo de permanência</li>
            <li>• Origem do acesso</li>
          </ul>
          
          <p className="font-semibold mb-2">Finalidades:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Segurança da plataforma</li>
            <li>• Análise de performance</li>
            <li>• Estatísticas de uso</li>
            <li>• Melhorias no serviço</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">b) Cookies e Tecnologias Similares</h4>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Cookies de sessão</li>
            <li>• Cookies de preferências</li>
            <li>• Cookies de analytics (Google Analytics, Meta Pixel)</li>
          </ul>
          
          <p className="font-semibold mb-2">Finalidades:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• Manter a sessão do usuário</li>
            <li>• Lembrar preferências</li>
            <li>• Análise de tráfego</li>
            <li>• Publicidade direcionada</li>
          </ul>
        </section>

        {/* Seção 4 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Compartilhamento de Dados</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Seus dados pessoais podem ser compartilhados com:
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Prestadores de Serviço</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• <strong>Ticto</strong>: Processamento de pagamentos</li>
            <li>• <strong>Google</strong>: Analytics, autenticação, armazenamento (Google Sheets)</li>
            <li>• <strong>Meta (Facebook/Instagram)</strong>: Autenticação, publicidade</li>
            <li>• <strong>WhatsApp</strong>: Envio de notificações e compartilhamento</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Autoridades Legais</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Podemos compartilhar dados quando:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Exigido por lei ou ordem judicial</li>
            <li>• Necessário para proteção de direitos</li>
            <li>• Investigação de fraudes ou atividades ilícitas</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Não Vendemos Dados</h3>
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
            <p className="text-base leading-relaxed">
              <strong>NUNCA</strong> vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de marketing.
            </p>
          </div>
        </section>

        {/* Seção 5 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Armazenamento e Segurança</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1. Onde os dados são armazenados</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• <strong>Dados de simulação</strong>: Armazenamento local (navegador) + sincronização em nuvem</li>
            <li>• <strong>Dados de cadastro</strong>: Servidores seguros</li>
            <li>• <strong>Backups</strong>: Realizados periodicamente</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2. Medidas de Segurança</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Criptografia de dados sensíveis (SSL/TLS)</li>
            <li>• Acesso restrito aos dados</li>
            <li>• Monitoramento de atividades suspeitas</li>
            <li>• Backups regulares</li>
            <li>• Autenticação de dois fatores (quando aplicável)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3. Prazo de Armazenamento</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• <strong>Usuários ativos</strong>: Enquanto a conta estiver ativa</li>
            <li>• <strong>Usuários inativos</strong>: Até 12 meses após último acesso</li>
            <li>• <strong>Dados de pagamento</strong>: Conforme legislação fiscal (5 anos)</li>
            <li>• <strong>Após exclusão</strong>: Dados anonimizados para estatísticas</li>
          </ul>
        </section>

        {/* Seção 6 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">Você tem direito a:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6.1. Confirmação e Acesso</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Confirmar se tratamos seus dados</li>
            <li>• Acessar seus dados pessoais</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2. Correção</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Corrigir dados incompletos, inexatos ou desatualizados</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.3. Anonimização, Bloqueio ou Eliminação</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Solicitar anonimização de dados desnecessários</li>
            <li>• Bloquear ou eliminar dados tratados em desconformidade</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.4. Portabilidade</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Solicitar seus dados em formato estruturado (CSV, JSON, PDF)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.5. Revogação do Consentimento</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Revogar consentimento a qualquer momento</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.6. Informação sobre Compartilhamento</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Saber com quem compartilhamos seus dados</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.7. Oposição ao Tratamento</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Opor-se ao tratamento em determinadas situações</li>
          </ul>

          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mt-4">
            <p className="font-semibold mb-2">Como exercer seus direitos:</p>
            <ul className="ml-6 space-y-2 text-muted-foreground">
              <li>• Email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-[#059669] underline">contato@pontodocordeiro.com.br</a></li>
              <li>• WhatsApp: <a href="https://wa.me/5515998454589" className="text-[#059669] underline">+55 15 99845-4589</a></li>
              <li>• Diretamente no app (Configurações {">"} Privacidade)</li>
            </ul>
            <p className="mt-4 text-muted-foreground"><strong>Prazo de resposta:</strong> Até 15 dias úteis</p>
          </div>
        </section>

        {/* Seção 7 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">7.1. Tipos de Cookies Utilizados</h3>
          
          <p className="font-semibold mt-4 mb-2">Cookies Essenciais (obrigatórios)</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Manter sessão do usuário</li>
            <li>• Funcionalidades básicas do sistema</li>
          </ul>

          <p className="font-semibold mt-4 mb-2">Cookies de Preferências</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Lembrar idioma</li>
            <li>• Configurações personalizadas</li>
          </ul>

          <p className="font-semibold mt-4 mb-2">Cookies de Analytics</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Google Analytics</li>
            <li>• Estatísticas de uso anônimas</li>
          </ul>

          <p className="font-semibold mt-4 mb-2">Cookies de Marketing</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Meta Pixel</li>
            <li>• Remarketing (Facebook/Instagram)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2. Gerenciamento de Cookies</h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Você pode:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Aceitar ou recusar cookies não essenciais</li>
            <li>• Limpar cookies pelo navegador</li>
            <li>• Configurar preferências no app</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Atenção:</strong> Desabilitar cookies pode afetar funcionalidades.
          </p>
        </section>

        {/* Seção 8 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">8. Menores de Idade</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            O Ponto do Cordeiro não é direcionado a menores de 18 anos.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-2">Se você é menor de 18 anos:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Não crie uma conta</li>
            <li>• Não forneça dados pessoais</li>
            <li>• Peça autorização de pais/responsáveis</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed">
            Se identificarmos uso por menores, excluiremos a conta imediatamente.
          </p>
        </section>

        {/* Seção 9 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">9. Transferência Internacional de Dados</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Alguns prestadores de serviço (Google, Meta) podem armazenar dados em servidores fora do Brasil.
          </p>
          <p className="font-semibold mb-2">Garantimos:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• Conformidade com LGPD</li>
            <li>• Cláusulas contratuais de proteção</li>
            <li>• Nível adequado de segurança</li>
          </ul>
        </section>

        {/* Seção 10 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">10. Alterações Nesta Política</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Esta Política de Privacidade pode ser atualizada periodicamente.
          </p>
          <p className="font-semibold mb-2">Quando houver alterações:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Notificaremos por email</li>
            <li>• Atualizaremos a data no topo</li>
            <li>• Publicaremos versão atualizada no app</li>
          </ul>
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Uso continuado:</strong> Representa aceitação das alterações.
          </p>
        </section>

        {/* Seção 11 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">11. Exclusão de Conta e Dados</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">11.1. Como excluir sua conta</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground mb-4">
            <li>• Acesse: Configurações {">"} Conta {">"} Excluir conta</li>
            <li>• Ou solicite por email: <a href="mailto:contato@pontodocordeiro.com.br" className="text-[#059669] underline">contato@pontodocordeiro.com.br</a></li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.2. O que acontece</h3>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• Conta desativada imediatamente</li>
            <li>• Dados excluídos em até 30 dias</li>
            <li>• Dados fiscais mantidos por 5 anos (obrigação legal)</li>
            <li>• Processo irreversível</li>
          </ul>
        </section>

        {/* Seção 12 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">12. Base Legal para Tratamento de Dados</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">Tratamos seus dados com base em:</p>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• <strong>Consentimento:</strong> Ao criar conta e aceitar termos</li>
            <li>• <strong>Execução de contrato:</strong> Fornecimento do serviço</li>
            <li>• <strong>Obrigação legal:</strong> Dados fiscais e tributários</li>
            <li>• <strong>Legítimo interesse:</strong> Segurança, prevenção de fraudes, melhorias</li>
          </ul>
        </section>

        {/* Seção 13 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">13. Encarregado de Dados (DPO)</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">Para questões sobre privacidade:</p>
          <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
            <p className="text-base leading-relaxed">
              <strong>Email:</strong> <a href="mailto:contato@pontodocordeiro.com.br" className="text-[#059669] underline">contato@pontodocordeiro.com.br</a>
            </p>
            <p className="text-base leading-relaxed">
              <strong>WhatsApp:</strong> <a href="https://wa.me/5515998454589" className="text-[#059669] underline">+55 15 99845-4589</a>
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mt-2">
              <strong>Assunto:</strong> "Privacidade de Dados - LGPD"
            </p>
          </div>
        </section>

        {/* Seção 14 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">14. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Se não conseguir resolver suas preocupações conosco, você pode contatar a ANPD:
          </p>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>• <strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#059669] underline">https://www.gov.br/anpd</a></li>
            <li>• <strong>Canal de denúncias:</strong> <a href="https://www.gov.br/anpd/pt-br/canais_atendimento" target="_blank" rel="noopener noreferrer" className="text-[#059669] underline">https://www.gov.br/anpd/pt-br/canais_atendimento</a></li>
          </ul>
        </section>

        {/* Seção 15 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">15. Legislação e Foro</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Esta Política é regida pela legislação brasileira.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Foro competente:</strong> Comarca de Sorocaba/SP
          </p>
        </section>

        {/* Seção 16 */}
        <section className="border-b pb-6 mb-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">16. Consentimento</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            Ao utilizar o Ponto do Cordeiro, você declara:
          </p>
          <ul className="ml-6 space-y-2 text-muted-foreground">
            <li>✓ Ter lido e compreendido esta Política de Privacidade</li>
            <li>✓ Concordar com a coleta e tratamento de dados conforme descrito</li>
            <li>✓ Ter ciência de seus direitos</li>
            <li>✓ Poder revogar consentimento a qualquer momento</li>
          </ul>
        </section>

        {/* Footer da página */}
        <footer className="mt-12 pt-8 border-t">
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg mb-6">
            <p className="font-semibold mb-2">Dúvidas?</p>
            <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
              <a href="mailto:contato@pontodocordeiro.com.br" className="flex items-center gap-2 text-[#059669] underline">
                <Mail className="h-4 w-4" />
                contato@pontodocordeiro.com.br
              </a>
              <a href="https://wa.me/5515998454589" className="flex items-center gap-2 text-[#059669] underline">
                <Phone className="h-4 w-4" />
                +55 15 99845-4589
              </a>
            </div>
          </div>

          <div className="text-center text-muted-foreground space-y-4">
            <p><strong>Data de vigência:</strong> 31 de dezembro de 2024</p>
            <div className="pt-4">
              <p className="font-semibold">RS Marketer Ltda</p>
              <p>CNPJ: 45.674.846/0001-45</p>
              <p>Ponto do Cordeiro</p>
              <p>Sorocaba/SP</p>
            </div>
            <Button 
              onClick={() => navigate("/")} 
              className="mt-6 bg-[#059669] hover:bg-[#047857]"
            >
              Voltar ao Início
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PoliticaPrivacidade;
