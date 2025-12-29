import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  
  const [whatsappTexto, setWhatsappTexto] = useState('Receber resultado no WhatsApp');
  const [whatsappTemplate, setWhatsappTemplate] = useState('Olá! Resultado da simulação:\n\nAnimal: {nome}\nPeso: {peso}kg\nDias: {dias}\nDecisão: {decisao}\nLucro: {lucro}');
  const [notificacoesGlobais, setNotificacoesGlobais] = useState(true);
  const [alertasEmail, setAlertasEmail] = useState(false);
  const [emailNotificacoes, setEmailNotificacoes] = useState('');
  const [simulacoesGratuitas, setSimulacoesGratuitas] = useState('5');
  const [maxAlertas, setMaxAlertas] = useState('10');
  const [maxHistorico, setMaxHistorico] = useState('100');
  const [modoManutencao, setModoManutencao] = useState(false);
  const [mensagemManutencao, setMensagemManutencao] = useState('Sistema em manutenção. Voltamos em breve!');
  const [urlTermos, setUrlTermos] = useState('');
  const [urlPrivacidade, setUrlPrivacidade] = useState('');

  const handleSave = () => {
    const config = {
      whatsappTexto, whatsappTemplate, notificacoesGlobais, alertasEmail,
      emailNotificacoes, simulacoesGratuitas, maxAlertas, maxHistorico,
      modoManutencao, mensagemManutencao, urlTermos, urlPrivacidade
    };
    localStorage.setItem('admin_config', JSON.stringify(config));
    toast({ title: 'Configurações salvas', description: 'Todas as alterações foram aplicadas' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Configurações Globais</h1><p className="text-muted-foreground">Ajustes do sistema</p></div>

        <Card>
          <CardHeader><CardTitle>WhatsApp</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm text-muted-foreground">Texto do Botão</label>
              <Select value={whatsappTexto} onValueChange={setWhatsappTexto}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receber resultado no WhatsApp">Receber resultado no WhatsApp</SelectItem>
                  <SelectItem value="Salvar resultado no WhatsApp">Salvar resultado no WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-sm text-muted-foreground">Template de Mensagem</label><Textarea value={whatsappTemplate} onChange={e => setWhatsappTemplate(e.target.value)} rows={5} /></div>
            <p className="text-xs text-muted-foreground">Variáveis: {'{nome}'}, {'{peso}'}, {'{dias}'}, {'{decisao}'}, {'{lucro}'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notificações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><span>Notificações globais</span><Switch checked={notificacoesGlobais} onCheckedChange={setNotificacoesGlobais} /></div>
            <div className="flex items-center justify-between"><span>Alertas por email</span><Switch checked={alertasEmail} onCheckedChange={setAlertasEmail} /></div>
            {alertasEmail && <Input placeholder="Email para notificações" value={emailNotificacoes} onChange={e => setEmailNotificacoes(e.target.value)} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Limites e Quotas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm text-muted-foreground">Simulações gratuitas/dia</label><Input type="number" value={simulacoesGratuitas} onChange={e => setSimulacoesGratuitas(e.target.value)} /></div>
              <div><label className="text-sm text-muted-foreground">Máx. alertas/usuário</label><Input type="number" value={maxAlertas} onChange={e => setMaxAlertas(e.target.value)} /></div>
              <div><label className="text-sm text-muted-foreground">Máx. histórico</label><Input type="number" value={maxHistorico} onChange={e => setMaxHistorico(e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Manutenção</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><span>Modo manutenção</span><Switch checked={modoManutencao} onCheckedChange={setModoManutencao} /></div>
            {modoManutencao && <Textarea value={mensagemManutencao} onChange={e => setMensagemManutencao(e.target.value)} placeholder="Mensagem de manutenção" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Termos e Privacidade</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm text-muted-foreground">URL Termos de Uso</label><Input value={urlTermos} onChange={e => setUrlTermos(e.target.value)} placeholder="https://..." /></div>
            <div><label className="text-sm text-muted-foreground">URL Política de Privacidade</label><Input value={urlPrivacidade} onChange={e => setUrlPrivacidade(e.target.value)} placeholder="https://..." /></div>
          </CardContent>
        </Card>

        <Button size="lg" onClick={handleSave}>Salvar Configurações</Button>
      </div>
    </AdminLayout>
  );
}
