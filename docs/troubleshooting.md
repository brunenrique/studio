# Solução de Problemas

## Erro ao logar: "Could not reach Cloud Firestore backend" ou `auth/internal-error`

Esses erros normalmente indicam que as variáveis de ambiente do Firebase não foram definidas ou que a conexão de rede está indisponível.

### Passos para resolver

1. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Preencha as chaves do Firebase e demais segredos no arquivo `.env.local`.
3. Verifique se as variáveis `FIREBASE_SERVICE_ACCOUNT` e `ASSESSMENT_TOKEN_SECRET` também estão definidas.
4. Garanta que sua máquina está conectada à internet ou, se preferir trabalhar offline, execute:
   ```bash
   firebase emulators:start
   ```
5. Reinicie o servidor de desenvolvimento (`npm run dev`).
