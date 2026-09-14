# Paper Wall

Biblioteca curada de wallpapers para computador, com imagens estáticas e vídeos animados. Os wallpapers são organizados por estética, dá para buscar pelas cores do seu setup e eles funcionam em 1, 2 ou 3 monitores.

## Estrutura

```
site/        Landing page (HTML + CSS + JS, PT/EN)
specs/       Conceito do produto e design (fonte da verdade)
memoria.md   Log de decisões e aprendizados
CLAUDE.md    Regras do projeto
```

## Rodar localmente

```bash
python -m http.server 5500 --directory site
```

Abra http://localhost:5500.

## Deploy

A Vercel publica a pasta `site/` a cada push na branch `main` (configurado em `vercel.json`).
