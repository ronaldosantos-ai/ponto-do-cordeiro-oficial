## Objetivo

Adicionar duas novas landing pages públicas em `/landing-v3` e `/landing-v4` para testes A/B, sem afetar a landing atual em `/`.

## Recomendação de formato

**Converter ambas para componentes React (TSX)** em `src/pages/`. Motivos:
- Consistência com o resto do app (todas as outras páginas são React).
- Permite reaproveitar componentes shadcn, navegação via React Router (`navigate("/auth")`), e o sistema de auth/premium.
- Para a página em HTML puro com `<style>` inline: dá para preservar 100% do visual injetando o CSS dentro de uma tag `<style>` no próprio componente (ou em um arquivo `.css` importado). Zero perda visual.
- HTML estático em `/public` funcionaria, mas perderia integração com rotas SPA, auth e analytics — não recomendo.

## Plano de implementação

### 1. Criar os arquivos das páginas
- `src/pages/LandingV3.tsx` — receberá o código da primeira página (HTML puro convertido para JSX, com `<style>` preservado).
- `src/pages/LandingV4.tsx` — receberá o código da segunda página (já em React, só adaptar imports).

### 2. Registrar rotas em `src/App.tsx`
Adicionar dentro de `<Routes>`:
```tsx
<Route path="/landing-v3" element={<LandingV3 />} />
<Route path="/landing-v4" element={<LandingV4 />} />
```
E os imports correspondentes no topo.

### 3. Fluxo para colar o código
Como o código virá em duas mensagens, o fluxo será:
1. Aprovar este plano → entro em modo build e crio a estrutura vazia das duas páginas + rotas.
2. Você cola o código da **Página 1** → eu colo dentro de `LandingV3.tsx`, ajustando:
   - Tags HTML puras (`<a href>`) trocadas por `<Link>` ou `navigate()` do React Router quando apontarem para rotas internas.
   - `class=` → `className=`.
   - `<style>` inline preservado dentro do componente.
   - Imagens/logos: trocar caminhos para os assets do projeto (`src/assets/...`) quando aplicável.
3. Você cola o código da **Página 2** → mesmo processo em `LandingV4.tsx`.

### 4. Navegação
As páginas ficam **acessíveis apenas por URL direta** (sem link no menu/footer), já que são para teste A/B. Você distribui os links manualmente.

### 5. Verificação
Abro `/landing-v3` e `/landing-v4` no preview para conferir o visual antes de finalizar.

## O que NÃO será alterado
- Landing atual em `/` (LandingV2) — permanece intacta.
- Preços, checkout Ticto, BottomNav, auth, premium — sem mudanças.
