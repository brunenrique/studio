"use client";

import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FAQItem = { question: string; answer: string };

const faqs: FAQItem[] = [
  {
    question: "Como agendar uma consulta?",
    answer: "Acesse a agenda e escolha um horário disponível para o paciente.",
  },
  {
    question: "Posso editar um atendimento já registrado?",
    answer: "Sim, navegue até o histórico do paciente e clique em editar.",
  },
  {
    question: "Onde encontro os relatórios financeiros?",
    answer: "Na seção de Finanças você tem acesso a todos os relatórios.",
  },
  {
    question: "Como redefinir minha senha?",
    answer: "Vá em Configurações > Conta e clique em 'Alterar Senha'.",
  },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Base de Conhecimento e FAQ</h1>
      <Input placeholder="Pesquisar na base de conhecimento..." />
      <Accordion type="multiple" className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
