# Firebase Studio

Este é um starter **Next.js 14 + Firebase** criado no Firebase Studio.

Para começar, abra `src/app/page.tsx` e siga a estrutura do App Router.

---

## Environment Variables

Crie um arquivo **`.env.local`** na raiz do projeto com suas credenciais do Firebase.  
Use o template abaixo como guia:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 🔐 Chave de criptografia AES-256-GCM (32 bytes base64). 
# NÃO use esta chave em produção!
CRYPTO_SECRET_KEY=REPLACE_ME_BASE64_32BYTES
