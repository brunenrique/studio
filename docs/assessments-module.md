# Módulo de Inventários e Testes Psicológicos

## Estrutura do Firestore

| Coleção / Documento | Campos Principais |
|---------------------|-------------------|
| `testsLibrary` | `name`, `domain`, `numQuestions`, `instructions`, `scoringAlgorithm` |
| `patients/{patientId}/assessments/{assessmentId}` | `testId`, `status`, `linkToken`, `score`, `rawAnswers`, `createdAt`, `completedAt` |

## Deploy

1. Copie `.env.local.example` para `.env.local` e adicione as chaves do Firebase abaixo, além das variáveis do SendGrid e Twilio (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `ASSESSMENT_TOKEN_SECRET`, `CRYPTO_SECRET_KEY`).

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```
2. Execute `npm install` para instalar dependências.
3. Inicie os emuladores com `firebase emulators:start` para testes locais.
4. Para deploy, rode `firebase deploy --only functions,firestore`.

## Arquitetura

- **Next.js App Router** consome o Firestore diretamente pelo SDK web.
- **Firebase Admin SDK** é usado em server components e funções para gerar tokens JWT dos formulários.
- **Cloud Functions** enviam links por e-mail/WhatsApp via SendGrid e Twilio.
- Regras de segurança limitam o acesso à biblioteca de testes e permitem que o formulário público atualize apenas o documento vinculado ao token.
- Tokens expiram após sete dias.

