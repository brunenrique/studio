# Variáveis de Ambiente

## CRYPTO_SECRET_KEY

Chave usada para encriptar dados sensíveis. Deve ser uma string em base64 de 32 bytes.

### Gerar chave

```bash
openssl rand -base64 32
```

### Onde definir

- **Desenvolvimento**: crie um arquivo `.env.local` e coloque a chave.
- **CI/CD (GitHub Actions)**: adicione como secret no repositório e carregue no workflow.
- **Firebase Functions**:
  ```bash
  firebase functions:config:set secrets.crypto_key="<CHAVE_BASE64>"
  ```
  Após rodar `firebase deploy`, a chave fica acessível via `process.env.CRYPTO_SECRET_KEY`.

### Importante

Não use o prefixo `NEXT_PUBLIC_`; a chave não deve ir para o código do cliente.

### Exemplo de `.env.local`

```env
CRYPTO_SECRET_KEY=PASTE_BASE64_KEY_HERE
```

### Regras Firebase (bloqueio opcional)

```javascript
match /secrets/{document=**} {
  allow read, write: if false;
}
```

### Checklist de Deploy

1. Teste com `firebase emulators:start`.
2. Execute `firebase deploy`.
3. Verifique nos logs se a função leu `process.env.CRYPTO_SECRET_KEY` corretamente.
