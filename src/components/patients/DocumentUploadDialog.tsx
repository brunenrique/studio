"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";

export interface DocumentUploadDialogProps {
  onUpload: (name: string) => Promise<void>;
  children: React.ReactNode;
}

export function DocumentUploadDialog({ onUpload, children }: DocumentUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fileName) return;
    setLoading(true);
    await onUpload(fileName);
    setLoading(false);
    setFileName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
          <DialogDescription>Selecione o arquivo a ser adicionado.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Nome do arquivo"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !fileName}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
