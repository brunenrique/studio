# Firebase Studio

This is a Next.js starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Firestore Structure

| Collection | Subcollections |
|------------|----------------|
| `patients` | `sessions`, `notes`, `payments`, `documents`, `treatmentPlans` |

Each patient document contains basic demographic data and a `ownerId` field. The subcollections store the historical data for that patient.

## Firebase Configuration

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY={...JSON service account...}
```

## Running locally

```bash
npm install
firebase emulators:start &
npm run dev
```

## Deploy

Deploy using the Firebase CLI once the project is configured:

```bash
firebase deploy
```

## Security Rules

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{patientId}/{document=**} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.ownerId ||
         request.auth.token.role == 'Psychologist');
    }
  }
}
```

## Document Upload Example

```ts
import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

async function uploadDocument(file: File, patientId: string) {
  const fileRef = ref(storage, `patients/${patientId}/${file.name}`);
  await uploadBytes(fileRef, file);
  await addDoc(collection(db, 'patients', patientId, 'documents'), {
    name: file.name,
    url: fileRef.fullPath,
    uploadedAt: new Date().toISOString(),
  });
}
```
