# Variáveis de Ambiente

Para gerar uma chave segura para `CRYPTO_SECRET_KEY` execute:

```bash
openssl rand -base64 32
```

Configure essa chave em `.env.local` durante o desenvolvimento e também nas funções do Firebase:

```bash
firebase functions:config:set secrets.crypto_key="<SUA_CHAVE>"
```

## Exemplo de `.env.local`

Adicione também as chaves do Firebase usadas no projeto:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
# Hosts dos emuladores (opcional para desenvolvimento)
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9100
FIRESTORE_EMULATOR_HOST=127.0.0.1:8081
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
```
- `SESSION_VALIDATION_MS`: intervalo em milissegundos para validar a sessão do usuário (padrão 60000).
