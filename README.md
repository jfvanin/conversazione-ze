# Conversazione

Conversazione é uma aplicação de prática de idiomas que permite aos usuários brasileiros melhorar suas habilidades em italiano e inglês através de conversas com uma IA.

## Funcionalidades

- Interface de chat intuitiva
- Possibilidade de input por texto ou gravação de áudio
- Transcrição automática de mensagens de áudio
- Feedbacks construtivos sobre erros gramaticais e de pronúncia
- Respostas em áudio para uma experiência de conversa natural
- Suporte para idiomas: Italiano (padrão) e Inglês

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4 para chat, Whisper para transcrição e TTS para áudio)

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   VITE_OPENAI_API_KEY=sua_chave_da_api_openai
   ```
4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

> **Nota de Segurança**: Esta aplicação utiliza a chave da API OpenAI diretamente no navegador, o que é adequado apenas para desenvolvimento ou uso pessoal. Para um ambiente de produção, é recomendado criar uma API de backend para intermediar as chamadas à OpenAI, evitando expor sua chave API.

## Uso

1. Escolha o idioma que deseja praticar (Italiano ou Inglês)
2. Digite mensagens ou clique no botão de microfone para gravar áudio
3. A IA responderá em texto e áudio no idioma escolhido
4. A IA fornecerá feedback em português sobre sua mensagem, corrigindo erros ou elogiando quando apropriado

## Construção para Produção

Para construir o aplicativo para produção, execute:

```
npm run build
```

### Versão Protegida por Senha

Para construir uma versão do aplicativo protegida por senha, utilize:

```
npm run build:secure
```

Isso criará uma versão da aplicação onde o arquivo index.html está criptografado e protegido por senha. Os usuários precisarão inserir a senha para acessar a aplicação. Esta funcionalidade é útil para compartilhar a aplicação com um grupo limitado de pessoas sem a necessidade de configurar um sistema completo de autenticação.

Por padrão, a senha é `Fallback123!`. Você pode alterá-la modificando o script `_encrypt` no arquivo `package.json`, ou executando seu build da seguinte forma: npm run build:secure --password=YourActualPassword

> **Nota**: A proteção por senha é implementada usando o [StaticCrypt](https://github.com/robinmoisson/staticrypt), que criptografa o conteúdo HTML no lado do cliente. Esta não é uma solução de segurança robusta para dados sensíveis, mas é adequada para controlar o acesso casual à aplicação.

## Licença

MIT

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
