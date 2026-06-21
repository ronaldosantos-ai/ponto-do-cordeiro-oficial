## Situação atual

Verifiquei o backend (Lovable Cloud / Supabase) e a sua conta **já está configurada como super admin** — não há código a alterar.

- **Usuário**: ronaldosantosjp01@gmail.com  
- **ID**: 4ccc39c6-a7e4-4f1f-a031-98fed0bd00cf  
- **E-mail confirmado**: sim  
- **Role no banco** (`public.user_roles`): `admin`  
- **Premium**: liberado automaticamente — a função `is_premium_user` já trata `admin` como Premium vitalício
- **Acesso ao painel `/admin/*`**: liberado via `AdminRoute` + `has_role(uid, 'admin')`

Nos logs de autenticação também aparece um **login bem-sucedido às 11:29** vindo da preview, confirmando que o fluxo de auth está funcionando. As falhas anteriores (`400 invalid_credentials`) foram apenas tentativas com senha errada.

## Plano

Como nada precisa ser corrigido no código nem nas permissões, o plano é apenas **destravar seu login na preview**:

1. **Disparar um e-mail de redefinição de senha** para ronaldosantosjp01@gmail.com pela tela `/auth → "Esqueci minha senha"` (ou eu posso acionar via backend após sua confirmação).
2. Você define uma senha nova pelo link recebido.
3. Faz login na preview — você cairá direto no fluxo Premium e terá acesso ao menu `/admin`.

### Se preferir não usar reset por e-mail
Como alternativa eu posso, em modo build:
- Confirmar/forçar reconfirmação do e-mail no backend, ou
- Definir uma senha temporária via Admin API (em uma edge function de uso único) que você troca depois.

## Nada será alterado no código

Nenhum arquivo do projeto precisa ser editado para essa tarefa. Se você confirmar este plano, eu apenas executo o passo escolhido (reset de senha por padrão).
