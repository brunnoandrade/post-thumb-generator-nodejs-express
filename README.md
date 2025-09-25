# Post Thumb Generator

<img width="974" height="485" alt="Captura de Tela 2025-09-23 às 21 21 25" src="https://github.com/user-attachments/assets/c67b5093-7fc7-4359-9782-fa1e71529d83" />
<br/><br/>

Um serviço em **Node.js + Express** que gera **thumbnails (Open Graph images)** de forma automática para posts de blog, artigos e conteúdos digitais.  

## Funcionalidades

- Geração de imagens dinâmicas em tempo real (`/generate-cover`)
- Personalização com:
  - **Título**
  - **Autor**
  - **Data**
  - **Tags**
- Layout responsivo no padrão **1200x630** (Open Graph, ideal para redes sociais)
- Suporte a múltiplas tags
- API simples baseada em query params

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [canvas](https://www.npmjs.com/package/canvas)

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/brunnoandrade/post-thumb-generator-nodejs-express.git
cd post-thumb-generator-nodejs-express
yarn install
```

## Como usar

Inicie o servidor local:

```bash
npm run dev
```

O serviço ficará disponível em:

```
http://localhost:3000/generate-cover
```

## Exemplos de Requisição

### GET /generate-cover

```http
GET /generate-cover
```

```http
GET /generate-cover?title=Como%20criar%20um%20serviço%20Node.js&author=Bruno%20Andrade&date=21%20de%20setembro%20de%202025&tags=carreira&tags=programacao&tags=aprendizado
```

## Query Params disponíveis

| Parâmetro | Tipo     | Obrigatório | Exemplo                         |
|-----------|----------|-------------|---------------------------------|
| `title`   | string   | ✅           | `Como criar um serviço Node.js` |
| `author`  | string   | ✅           | `Bruno Andrade`                 |
| `date`    | string   | ✅           | `21 de setembro de 2025`        |
| `tags`    | string[] | ✅           | `carreira`, `programacao`, `devops` |

