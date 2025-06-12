"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NewPatientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    cpf: "",
    dob: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: "Salvo" });
    router.push("/patients");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 max-w-sm mx-auto p-4">
      <label className="block space-y-1">
        <span>Nome</span>
        <Input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label className="block space-y-1">
        <span>Contato</span>
        <Input name="contact" value={form.contact} onChange={handleChange} />
      </label>
      <label className="block space-y-1">
        <span>CPF</span>
        <Input name="cpf" value={form.cpf} onChange={handleChange} />
      </label>
      <label className="block space-y-1">
        <span>Data de Nascimento</span>
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
      </label>
      <Button type="submit">Salvar</Button>
    </form>
  );
}
