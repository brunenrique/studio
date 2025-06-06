# Variáveis de Ambiente

Esta aplicação utiliza criptografia AES para campos sensíveis. Para funcionar em qualquer ambiente é necessário definir `CRYPTO_SECRET_KEY` com uma chave em base64 **sem o prefixo `NEXT_PUBLIC_`**.

## Gerar chave

Execute:

```bash
openssl rand -base64 32
```

## Desenvolvimento

Crie um arquivo `.env.local` na raiz do projeto e adicione:

```dotenv
CRYPTO_SECRET_KEY=SEU_VALOR_BASE64
```

Se a variável não estiver presente em desenvolvimento, `getCryptoKey()` gera uma chave aleatória e mostra um aviso. Os dados criptografados nesse modo não poderão ser lidos após reiniciar o servidor.

## CI/CD (GitHub Actions)

Adicione `CRYPTO_SECRET_KEY` aos *Secrets* do repositório e exporte como variável de ambiente nos workflows.

## Firebase Functions

Defina a chave nos parâmetros do projeto e garanta que ela seja exposta como variável durante o deploy:

```bash
firebase functions:config:set secrets.crypto_key="<base64>"
```

## Snippet de regras (opcional)

```firestore
match /secrets/{document=**} {
  allow read, write: if false;
}
```

## Checklist de deploy

1. `npm install`
2. Criar/atualizar `.env.local`
3. `firebase emulators:start` (testes locais)
4. `npm run build`
5. `firebase deploy --only functions,firestore`
6. Verificar logs e regras publicadas
