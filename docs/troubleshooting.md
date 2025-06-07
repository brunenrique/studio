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

## Erro: `Missing or insufficient permissions`

Esse erro indica que as regras do Firestore bloquearam a leitura ou escrita do
documento. Para fins de desenvolvimento, certifique-se de que as regras
`docs/firestore.rules` estejam importadas pelo emulador e que a função
`isPsychologist` utilize o claim `role` configurado no usuário mock.

Caso tenha alterado as regras, execute `firebase emulators:start` novamente para
recarregá‑las. Com as regras atualizadas, as operações de login e leitura devem
funcionar normalmente.
