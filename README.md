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
```

### Lista de Variáveis

| Variável | Descrição | Opcional |
|----------|-----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Chave da API do Firebase usada no frontend | não |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação do Firebase | não |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto Firebase | não |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket do Storage | não |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID do Cloud Messaging | não |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID do aplicativo Firebase | não |
| `CRYPTO_SECRET_KEY` | Chave AES para criptografar dados sensíveis | não |
| `FIREBASE_SERVICE_ACCOUNT` | JSON da conta de serviço para o Admin SDK | não |
| `ASSESSMENT_TOKEN_SECRET` | Segredo para assinar links de inventários | não |
| `ASSESSMENT_TOKEN_EXPIRY` | Validade dos links de inventário (padrão 7d) | sim |
| `SENDGRID_API_KEY` | Chave da API SendGrid para envio de e-mails | não |
| `SENDGRID_FROM_EMAIL` | Endereço remetente usado pelo SendGrid | não |
| `TWILIO_SID` | SID da conta Twilio | não |
| `TWILIO_AUTH_TOKEN` | Token de autenticação da Twilio | não |
| `TWILIO_SMS_FROM` | Número de origem para SMS | sim |
| `TWILIO_WHATSAPP_FROM` | Número de origem para WhatsApp | sim |
| `TASK_REMINDER_MINUTES` | Minutos antes do vencimento para disparar lembrete de tarefa (padrão 10) | sim |
| `APPOINTMENT_REMINDER_CRON` | Cron de execução do lembrete de sessões (padrão `* * * * *`) | sim |
| `TASK_REMINDER_CRON` | Cron de execução do lembrete de tarefas (padrão `* * * * *`) | sim |
| `ASSESSMENT_REMINDER_HOURS` | Horas após a criação para lembrar inventários pendentes (padrão 24) | sim |
| `PUBLIC_URL` | URL pública usada nos links (requer HTTPS) | não |

Todos os dados de pacientes são criptografados no cliente usando AES antes de serem manipulados.

## Seeding com dados de exemplo

Para popular o Firestore com dados fictícios, defina as variáveis `FIREBASE_SERVICE_ACCOUNT` e `CRYPTO_SECRET_KEY` em seu ambiente.
Em seguida execute:

```bash
npx ts-node src/scripts/seed-demo-data.ts
```

Isso criará coleções como `patients`, `appointments`, `tasks` e outras com registros de demonstração.

## Controle de notificações

Cada documento em `patients` pode conter o campo opcional `notificationsOptOut`:

```json
{
  "notificationsOptOut": { "email": false, "sms": true }
}
```

Quando definido, as funções de envio respeitam essas preferências e não enviam
mensagens para os canais desativados. Todo envio é registrado na subcoleção
`patients/{patientId}/notificationLog`.

## Sidebar

O botão que alterna a sidebar (ícone de menu) só aparece em telas pequenas graças à classe `lg:hidden`.
Em monitores maiores a sidebar permanece aberta por padrão e somente é renderizada após o login com sucesso,
processado em `src/app/(app)/layout.tsx`.

Se a sidebar não aparecer, verifique se a autenticação está funcionando
e se o CSS foi construído corretamente pelo Tailwind.
