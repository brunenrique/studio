# Módulo de Linha do Tempo Interativa

Este módulo gera, apenas no client, uma lista unificada de eventos de pacientes e sessões.
Não cria novas coleções ou campos no Firestore.

## Uso

- Rota: `/tools/timeline`
- Hook: `useTimeline(patientId?)`
- Context opcional: `TimelineProvider`

## Testes manuais

1. `npm run dev` e acesse `/tools/timeline`.
2. Altere o paciente no seletor e verifique que apenas os eventos relacionados aparecem.

## Deploy

Nenhum comando adicional é necessário.
