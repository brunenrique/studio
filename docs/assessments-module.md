# Módulo de Inventários e Testes Psicológicos

## Estrutura do Firestore

| Coleção / Documento | Campos Principais |
|---------------------|-------------------|
| `testsLibrary` | `name`, `domain`, `numQuestions`, `instructions`, `scoringAlgorithm` |
| `patients/{patientId}/assessments/{assessmentId}` | `testId`, `status`, `linkToken`, `score`, `rawAnswers`, `createdAt`, `completedAt` |

## Deploy

1. Configure variáveis em `.env.local` e `.env` para chaves do Firebase, SendGrid e Twilio (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `ASSESSMENT_TOKEN_SECRET`, `CRYPTO_SECRET_KEY`). Veja `docs/env.md` para detalhes sobre `CRYPTO_SECRET_KEY`.
2. Execute `npm install` para instalar dependências.
3. Inicie os emuladores com `firebase emulators:start` para testes locais.
4. Para deploy, rode `firebase deploy --only functions,firestore`.

## Arquitetura

- **Next.js App Router** consome o Firestore diretamente pelo SDK web.
- **Firebase Admin SDK** é usado em server components e funções para gerar tokens JWT dos formulários.
- **Cloud Functions** enviam links por e-mail/WhatsApp via SendGrid e Twilio.
- Regras de segurança limitam o acesso à biblioteca de testes e permitem que o formulário público atualize apenas o documento vinculado ao token.
- Tokens expiram após sete dias.

