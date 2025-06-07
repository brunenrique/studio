"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, setHours, setMinutes, isValid } from "date-fns";
import type { BlockedTime } from "@/lib/types";

const schema = z.object({
  date: z.date({ required_error: "Data obrigatória" }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  durationMinutes: z.coerce.number().int().positive(),
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface BlockTimeDialogProps {
  onSave: (data: BlockedTime) => void;
  children: React.ReactNode;
  defaultDate?: Date;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BlockTimeDialog({
  onSave,
  children,
  defaultDate,
  isOpen: controlled,
  onOpenChange,
}: BlockTimeDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [internal, setInternal] = React.useState(false);

  const isOpen = controlled !== undefined ? controlled : internal;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternal;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultDate || new Date(),
      time: "09:00",
      durationMinutes: 60,
      reason: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        date: defaultDate || new Date(),
        time: "09:00",
        durationMinutes: 60,
        reason: "",
      });
    }
  }, [isOpen, defaultDate, form]);

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const total = i * 30;
    const h = String(Math.floor(total / 60)).padStart(2, "0");
    const m = String(total % 60).padStart(2, "0");
    return `${h}:${m}`;
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const [h, m] = values.time.split(":" ).map(Number);
    const dt = setMinutes(setHours(values.date, h), m);
    const result: BlockedTime = {
      id: `blk-${Date.now()}`,
      dateTime: dt.toISOString(),
      durationMinutes: values.durationMinutes,
      reason: values.reason,
    };
    onSave(result);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Bloquear Horário</DialogTitle>
          <DialogDescription>Defina um período de indisponibilidade.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}> 
                          {field.value && isValid(field.value) ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        <SelectValue placeholder="HH:MM" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper" className="max-h-60">
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (min)</FormLabel>
                  <FormControl>
                    <Input type="number" min={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
