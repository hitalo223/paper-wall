# Memória do projeto

Log de decisões e aprendizados.

## 2026-09-13
- Nome do projeto: **Paper Wall** (inversão de "wallpaper").
- Conceito definido: micro-SaaS de wallpapers curados (estáticos + animados), foco estético, modelo freemium. Detalhes em `specs/conceito.md`.
- Recursos do lançamento: **Paletas de cores** + **Múltiplos monitores** (funcionam só no navegador, sem app instalado).
- Primeira entrega: **landing page** (apresentação, recursos, preços, lista de espera), não o app completo.
- Pasta do projeto renomeada de `site-10k` para `paper-wall`.

## 2026-09-14
- Landing page em **HTML + CSS + JS puro**, bilíngue **PT/EN** (abre no idioma do navegador, lembra a escolha). Código em `site/`.
- Todo texto fica em `site/js/i18n.js`; design documentado em `specs/design.md`.
- Vídeo da mão otimizado para web em `site/assets/video/` (MP4 983 KB + WebM 487 KB, sem áudio, capa JPG). Original continua em Downloads.
- Assinatura do site: "a parede". Os wallpapers saem do centro e se encaixam ao rolar a página, como os arquivos do vídeo.
- Os wallpapers do site são arte gerada por gradientes (placeholder). Trocar por wallpapers reais quando existirem.
- **Provisório, falta decidir:** preços (Pro R$ 14,90/mês ou R$ 9,90/mês no anual; US$ 3.99 / US$ 2.66), o que entra no Grátis (hoje: biblioteca básica, até 1080p, sem marca d'água).
- **Falta:** backend da lista de espera. Hoje o formulário só valida e mostra "Você está na lista".
- Para rodar: `python -m http.server 5500 --directory paper-wall/site` (config em `.claude/launch.json`).
- Aprendizado: o navegador guarda CSS/JS antigos em cache. Ao mudar esses arquivos, subir o `?v=` no `index.html`.
- Aprendizado: o Windows deste PC está com **"Efeitos de animação" desligado**. Por isso o navegador pede movimento reduzido e o site mostra tudo parado, de propósito. Para ver as animações: Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação = Ativado.
- Teste visual feito com Edge headless via CDP (script na pasta temporária da sessão): desktop 1280px e celular 390px, PT/EN, paletas, monitores, preços, FAQ, formulário. Sem erros no console.
- Decisão: o vídeo de entrada **roda sempre** ao abrir o site, mesmo com movimento reduzido ligado (antes ficava parado e parecia quebrado).
- Decisão: **todas as animações** (títulos, blocos, parede, faixa, preços) também rodam sempre. O site não segue mais a opção "movimento reduzido" do sistema.
- Decisão: **não é lançamento.** Saíram lista de espera, "Em breve" e textos de pré-lançamento. O site apresenta a ferramenta como pronta, com descrição ("O que é") e exemplos animados de cada função.
- Decisão: a **ferramenta funcional (app)** vai ser construída neste projeto. Os botões "Começar grátis"/"Assinar o Pro" apontam para `APP_URL` em `site/js/main.js` (hoje `#`), a trocar quando o app existir.
- Funções mostradas no site (primeira versão do app): biblioteca por estética, estáticos e animados, paletas de cores, vários monitores. IA, kits de setup, dinâmicos e app para PC ficam fora até existirem.
## 2026-09-15 — Infra
- **GitHub:** repositório público `hitalo223/paper-wall` (branch `main`).
- **Vercel:** projeto `paper-wall` ligado ao GitHub; cada push na `main` publica. Serve a pasta `site/` (`vercel.json`). URL: https://paper-wall.vercel.app
- **Supabase:** projeto novo `paper-wall` (ref `mwculaoyknpyqnevvlvq`, região São Paulo, plano grátis, custo 0). Banco ainda vazio.
- O projeto antigo `wallpaper-gallery-app` do Supabase foi **pausado** (não excluído) para liberar a vaga do plano grátis. Pode ser restaurado no painel. O app antigo na Vercel (`wallpaper-gallery-app`) usava esse banco e deixa de funcionar.
- Decisão: começar o app do zero; o app antigo fica só como referência.
- Supabase `paper-wall` **pausado** a pedido, enquanto o site não precisa de banco. Para voltar a usar: painel do Supabase → projeto → Restore (ou pedir ao Claude).
- **Mudança de modelo:** não é mais micro-SaaS. O produto é um **pack com mais de 500 wallpapers premium exclusivos**. A sub-headline já diz isso; o resto do site (preços por assinatura, "Começar grátis", "aplicativo web", FAQ de cancelamento) ainda precisa ser ajustado.
- Topo do site: o vídeo da mão saiu do fundo. Abaixo dos botões fica um **carrossel curvo de vídeos verticais** de wallpapers em setups, girando em loop. Passar o mouse (ou tocar) num quadro pausa o carrossel e toca aquele vídeo inteiro, do começo. Só os quadros perto do centro rodam, para não pesar.
- Vídeos do carrossel: `assets/video/NOME.mp4`, `.webm` e `-poster.jpg` (720px de largura, sem áudio). Para adicionar, colocar o nome em `HERO_CLIPS` no `main.js`, na ordem desejada. Com menos de 9 vídeos a lista se repete.
- Curva **côncava** como na referência: quadros por dentro de um cilindro, centro mais longe e bordas maiores viradas para o meio. Ajustes em `layoutReel` no `main.js`: `R` (raio, menor = mais curvo) e `gap` (espaço entre quadros); no CSS, `perspective` do `.reel` (menor = bordas maiores) e `--cw` (largura do quadro).
- Ideia alternativa (quadros parados embaralhados) ficou de lado.
- Carrossel com 5 vídeos (`setup-01` a `setup-05`), todos gerados na mesma mesa com wallpapers diferentes. Os vídeos têm 10 s, 720px e 30 fps.
- `setup-06` e `setup-07` são 2 vídeos baixados do TikTok (`ssstik.io`, um do @exo..tech), com setups e wallpapers de outros criadores. **Adicionados a pedido**, depois do alerta sobre direitos autorais e sobre dar a entender que aqueles wallpapers são do pack. Se houver reclamação, remover da lista `HERO_CLIPS` e apagar os arquivos.
- **Atenção a marcas nos wallpapers dos vídeos:** logo da Ralph Lauren (`setup-01`) e relógio de luxo (`setup-02`). Evitar marcas registradas num pack vendido como exclusivo.
- **Pendências do app:** o site promete "tirar as cores de uma foto", "porcentagem de combinação", "download na resolução da tela" e "novos wallpapers toda semana" — o app precisa entregar isso (ou ajustar o texto).
- Corrigido nos testes: palavras do título grudadas, vídeo alargando a página no celular, palavra "Preços" atrás do título, título em EN com palavra sozinha na última linha.
- Referências salvas em `referencia-site/`: link em `referencias de site em links/` e colagem em `referencia de fontes em imagens/`.
