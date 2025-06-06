"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

// Reuse sidebar sections for search index
const sections = [
  {
    title: 'Consultório',
    items: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/patients', label: 'Pacientes' },
      { href: '/appointments', label: 'Agendamentos' },
      { href: '/waiting-list', label: 'Lista de Espera' },
    ],
  },
  {
    title: 'Ferramentas',
    items: [
      { href: '/templates', label: 'Modelos' },
      { href: '/medications', label: 'Guia Rápido' },
      { href: '/self-care', label: 'Saúde Mental' },
      { href: '/knowledge-base', label: 'Base de Conhecimento' },
      { href: '/analytics', label: 'Tendências' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { href: '/settings', label: 'Configurações' },
    ],
  },
];

const index = sections.flatMap(s => s.items);

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get('q') || '');

  useEffect(() => {
    const q = params.get('q') || '';
    if (q !== query) setQuery(q);
  }, [params, query]);

  const results = index.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <Input
          placeholder="Buscar..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full"
        />
      </form>
      <ul className="space-y-2">
        {results.map(r => (
          <li key={r.href}>
            <Link href={r.href} className="text-primary underline">
              {r.label}
            </Link>
          </li>
        ))}
        {results.length === 0 && <p>Nenhum resultado encontrado.</p>}
      </ul>
    </div>
  );
}
