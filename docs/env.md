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
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCkp-Yp3CPOVl5jkmprh7BwP86Es-H9RzI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=plataforma-bpsy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=plataforma-bpsy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=plataforma-bpsy.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=115174793204
NEXT_PUBLIC_FIREBASE_APP_ID=1:115174793204:web:dd38de43781c2ac5a423a1
```
