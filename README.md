# Firebase Studio

This is a Next.js starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
## Environment Variables

Create a `.env.local` file in the project root with your Firebase credentials. Use the `.env.local.example` template below as a guide.

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Teste Local e Deploy

1. Instale dependências com `npm install`.
2. Execute `firebase emulators:start` para rodar Firestore e Functions localmente.
3. Acesse `http://localhost:4000` para a interface dos emuladores.
4. Após testar, faça deploy com `firebase deploy --only hosting,functions`.

Para criar o índice composto necessário para o módulo de tarefas:

```
gcloud firestore indexes composite create --collection-group=tasks \
  --field-config field=patientId,order=asc field=dueDate,order=asc
```
