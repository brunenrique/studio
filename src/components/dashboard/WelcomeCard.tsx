"use client";

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useBannerImage } from '@/hooks/useBannerImage';

export default function WelcomeCard() {
  const { user } = useAuth();
  const banner = useBannerImage();

  if (!user) return null;

  return (
    <div className="bg-primary/10 rounded-xl p-6 grid gap-4 lg:grid-cols-3 items-center">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold">Bem-vindo(a), {user.name}!</h2>
        <p className="text-muted-foreground mt-1">Aqui está um resumo da sua atividade recente.</p>
      </div>
      {banner && (
        <Image
          src={banner}
          alt="Banner"
          width={300}
          height={200}
          className="rounded-lg mx-auto lg:mx-0"
        />
      )}
    </div>
  );
}
