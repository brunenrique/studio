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

# JSON da service account (para admin/scripts)
FIREBASE_SERVICE_ACCOUNT={"project_id":"demo"}
# Token para formulários de inventário
ASSESSMENT_TOKEN_SECRET=secret

# SendGrid (opcional)
SENDGRID_API_KEY=SG.x
SENDGRID_FROM_EMAIL=from@example.com

# Twilio (opcional)
TWILIO_SID=ACxxx
TWILIO_AUTH_TOKEN=token
TWILIO_WHATSAPP_FROM=whatsapp:+5511999999999
TWILIO_SMS_FROM=+5511999999999

# URLs e agendamentos
PUBLIC_URL=http://localhost:9003
TASK_REMINDER_MINUTES=10
ASSESSMENT_REMINDER_HOURS=24
```

Todos os dados de pacientes são criptografados no cliente usando AES antes de serem manipulados.

## Seeding com dados de exemplo

Para popular o Firestore com dados fictícios, defina as variáveis `FIREBASE_SERVICE_ACCOUNT` e `CRYPTO_SECRET_KEY` em seu ambiente.
Em seguida execute:

```bash
npx ts-node src/scripts/seed-demo-data.ts
```

Isso criará coleções como `patients`, `appointments`, `tasks` e outras com registros de demonstração.

## Sidebar

O botão que alterna a sidebar (ícone de menu) só aparece em telas pequenas graças à classe `lg:hidden`.
Em monitores maiores a sidebar permanece aberta por padrão e somente é renderizada após o login com sucesso,
processado em `src/app/(app)/layout.tsx`.

Se a sidebar não aparecer, verifique se a autenticação está funcionando
e se o CSS foi construído corretamente pelo Tailwind.
