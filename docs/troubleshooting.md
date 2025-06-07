# Solução de Problemas

## Problemas de Login

Erros ao logar como "Could not reach Cloud Firestore backend" ou `auth/internal-error` costumam indicar variáveis de ambiente ausentes ou falta de conectividade.

### Checklist de variáveis obrigatórias

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT`
- `ASSESSMENT_TOKEN_SECRET`

### Verificações de conectividade

- Confirme que sua máquina está online.
- Caso esteja usando os emuladores do Firebase, execute `firebase emulators:start` e mantenha o terminal aberto.

### Resetar sessão local

- Abra o DevTools do navegador e limpe `Local Storage` e `Session Storage`.
- Recarregue a página e tente logar novamente.

### Exemplo de saída no console

```text
Could not reach Cloud Firestore backend. Connection failed 1 times.
FirebaseError: [code=auth/internal-error] Failed to fetch auth token.
```

### Passos adicionais

1. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Preencha as chaves do Firebase e demais segredos no arquivo `.env.local`.
3. Garanta que as variáveis `FIREBASE_SERVICE_ACCOUNT` e `ASSESSMENT_TOKEN_SECRET` estão definidas.
4. Reinicie o servidor de desenvolvimento (`npm run dev`).

