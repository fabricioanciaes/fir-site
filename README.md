# Boilerplate Gulp

Boilerplate pessoal para fazer sites rápido.

![sass logo](https://user-images.githubusercontent.com/10498583/31125541-e2a732e6-a848-11e7-959d-7d7b0c138124.jpg)
![gulp logo](https://user-images.githubusercontent.com/10498583/31125542-e2a78b88-a848-11e7-8ac5-c396f46e811f.jpg)
![browsersync logo](https://user-images.githubusercontent.com/10498583/31125540-e2a6eed0-a848-11e7-817a-69c5619f772a.jpg)

## TL;DR:
- Clone esse repositório
- Rode `npm install -g gulp`
- Rode `npm install`
- Rode `gulp dev`
- Coloque seus arquivos html/css/js/imagens/fontes na pasta `src`
- Quando quiser enviar pra produção rode `gulp deploy`

Algumas observações sobre a estrutura de pastas:

- Javascript global vai na pasta `assets/js`
- Javascript específico por página vai na pasta `assets/js/pages`
- Plugins e bibliotecas vão sempre na pasta `vendors`

---

## O que esse boilerplate faz:
- Cria um servidor de desenvolvimento local
- Minifica e Concatena javascript (uglify, gulp-concat)
- Otimiza as imagens (gulp-imagemin, suporte para jpg,png,gif e svg. Não afeta a qualidade final da imagem)
- Compila o SASS
- Executa as seguintes otimizações no css (através do postcss):
    - **autoprefixing:** inclui prefixos para navegadores
    - **cssnano:** minifica o css
    - **uncss:** faz crawling pelas páginas do projeto e elimina CSS que não é utilizado
    - **pxtorem:** converte pixels para rem
    - **critical:** faz crawling pelas páginas do projeto e verifica o css necessário para renderizar a página acima do fold e então deixa ele inline dentro dos HTMLs

Eu criei uma diferenciação entre Javascript "Local" e "Global".
- Global é tudo que é usado por todas as páginas.
- Local é usado apenas por uma/algumas página em específico e são incluidos conforme a necessidade

Todos os javascripts "Locais" ficam dentro de `assets/js/pages`

Procure manter a mesma estrutura de pastas tanto para o `src` quanto para o `dist`

## Como usar

### Para desenvolver

- Rode `gulp dev` para começar a desenvolver
    - Este comando abrirá um servidor local na sua máquina
    - Mexa nos arquivos na pasta `/src`.
    - Qualquer mudança no código causará um refresh na página em tempo real

### Preparando para produção

- Rode `gulp deploy` para preparar o site pra produção
    - Todos os arquivos para produção vão para pasta `/dist`

## Requisitos
- Instale o node.js
- Instale o gulp globalmente: `npm install -g gulp`
- Vá até a pasta do projeto e rode `npm install` para instalar as dependências do projeto