# Navigation Configuration

The main menu items are defined in `src/lib/navigation.ts`.
Each entry has four fields:

- `label`: short text shown in the UI.
- `description`: up to 15 words describing the page.
- `href`: route path used for navigation.
- `category`: grouping name used by the sidebar and top tabs.

Example:

```ts
export const navigation = [
  { label: 'Dashboard', description: 'Visão geral rápida das métricas', href: '/dashboard', category: 'Consultório' }
]
```

Components such as `Sidebar` and `TopTabs` import this array to build the UI.
Keeping the list centralized ensures new routes appear across the app.
