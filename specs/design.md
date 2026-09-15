# Design — Paper Wall

Fonte da verdade de design. Toda cor, fonte e animação do site sai daqui.

## Referências usadas
- **ovo-redsun.webflow.io**: fundo quase preto, laranja com brilho, cards escuros com borda fina, ordem hero → logos → recursos → preços.
- **Colagem (`referencia de fontes em imagens/`)**: títulos grandes e justos (estilo Apple), itálico serifado ("What you don't hear"), texto que se dissolve em granulado, cards de preço de vidro com palavra gigante atrás (Forma AI), brilho de "planeta" no horizonte (Agence).
- **Vídeo da mão** (`site/assets/video/hero.*`): pasta azul, luz laranja, arquivos voando. Ele define o par de cores.

## Conceito visual
**Os arquivos saem da pasta e viram parede.** O vídeo abre o site. Ao rolar a página, os wallpapers saem do centro (como os papéis do vídeo) e se encaixam formando uma parede. Essa é a **assinatura** do site. O resto da página fica calmo para ela aparecer.

## Cores
| Nome | Hex | Uso |
|---|---|---|
| Noite | `#07090F` | Fundo |
| Grafite | `#10131B` | Cards, superfícies |
| Papel | `#F2EEE6` | Texto principal (branco quente, "papel") |
| Névoa | `#8E93A3` | Texto secundário |
| Brasa | `#F66F14` | Destaque, botões, brilho (luz do vídeo) |
| Brasa clara | `#FFAD75` | Itálicos, detalhes, foco |
| Pasta | `#2F7BF6` | Azul da pasta. Só na marca e na palavra gigante de preços |

- Linhas/bordas: `rgba(242,238,230,.08)`.
- Texto em botão laranja é escuro (`#150903`), porque branco em laranja não tem contraste suficiente.
- Textura granulada fixa por cima de tudo (opacidade ~6%).

## Tipografia
| Papel | Fonte | Como usar |
|---|---|---|
| Títulos | **Bricolage Grotesque** | Peso 700, largura 85%, espaçamento -0.045em, altura de linha 0.95 |
| Ênfase no título | **Instrument Serif** itálico | Uma ou duas palavras por título, cor Brasa clara |
| Texto | **Mulish** (vem do ovo-redsun) | 400–700, 16–18px |
| Dados/legendas | **JetBrains Mono** | Nomes de arquivo, resolução, etiquetas. Pequeno, maiúsculo nas etiquetas |

Escala: H1 `clamp(2.8rem, 7.4vw, 6.75rem)` · H2 `clamp(2.25rem, 5vw, 4.25rem)` · H3 `clamp(1.3rem, 2.4vw, 2rem)`.

## Estrutura da página
```
[nav em pílula: marca · links · PT/EN · Começar grátis]
[HERO: etiqueta · título grande · texto · Começar grátis | Ver como funciona]
[      mini tela com borda de brilho (laranja → azul) mostrando vídeos de wallpapers em setups]
[faixa de estéticas rolando (sans / serif itálico)]
[O QUE É: título | descrição + "para quem é" · 3 destaques em linha]
[A PAREDE: tiles voam do centro e formam a parede]  ← assinatura (rolagem fixa)
[COMO FUNCIONA: 3 cards de passo, cada um com mini animação em loop]
[ESTÁTICOS E ANIMADOS: explicação + botão | monitor com imagem × vídeo]
[PALETAS: explicação + paletas | quadro de wallpapers + barra de tarefas]
[MONITORES: explicação + 1/2/3 telas + proteção | 3 monitores]
[PREÇOS: palavra gigante azul dissolvida atrás · Grátis | Pro (vidro)]
[DÚVIDAS: título à esquerda | acordeão à direita]
[CTA final com brilho de planeta laranja no horizonte]
[rodapé]
```

- O site apresenta a ferramenta como **existente** (não é lançamento). Botões levam ao site funcional (`APP_URL` em `site/js/main.js`).
- Cada recurso tem: frase curta → lista "como funciona" (3 itens) → **exemplo animado**.
- Exemplos interativos rodam sozinhos enquanto estão na tela ("Exemplo automático. Toque para testar.") e param quando a pessoa usa o controle.

## Componentes
- **Botão principal**: pílula laranja, texto escuro, brilho laranja, sobe 2px no hover.
- **Botão secundário**: pílula transparente com borda fina.
- **Tile de wallpaper**: 16:10, raio 10px, arte gerada por gradientes. Legenda em mono (nome do arquivo + estética) aparece no hover. Etiqueta "LIVE" nos animados.
- **Card de preço**: vidro (blur 18px), raio 24px, luz que segue o mouse. O Pro tem borda laranja.
- **Controles**: segmentado em pílula (ativo = fundo Papel), interruptor laranja.

## Animações
- **Entrada da página**: nav → etiqueta → título palavra por palavra (sobe de dentro de uma máscara) → texto → formulário → vídeo (cresce e perde o desfoque).
- **Títulos das seções**: mesma animação por palavra quando entram na tela.
- **Blocos**: sobem 26px e aparecem.
- **Parede**: ligada à rolagem. Cada tile sai do centro girado e pequeno e vai para o seu lugar. Quem está mais longe do centro chega depois.
- **Paletas**: os wallpapers se reorganizam (FLIP) e os que não combinam ficam apagados.
- **Monitores**: telas entram e saem suavemente, e o sol se move para ficar dentro de uma tela.
- **Preços**: o número troca deslizando; a palavra gigante se move um pouco com a rolagem.
- Curva padrão: `cubic-bezier(.2,.8,.2,1)`.
- **Sempre ligadas**: todas as animações e o vídeo de entrada (mudo, em loop) rodam em qualquer computador, mesmo com "movimento reduzido" ativado no sistema. Decisão do projeto.

## Idiomas
- PT e EN. Abre no idioma do navegador e lembra a escolha (`localStorage`).
- Todo texto vem de `site/js/i18n.js`. Nada de texto fixo no HTML sem chave.

## Regras de texto
- Frases curtas, voz ativa, falando com quem usa.
- O botão da lista de espera sempre diz "Entrar na lista" / "Join the waitlist". A confirmação diz "Você está na lista" / "You're on the list".
