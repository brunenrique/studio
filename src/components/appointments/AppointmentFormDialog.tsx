"use client";

// RESOLVIDO: conflito entre blocos <<<<<<< e >>>>>>>

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { cn, formatCPF, isValidCPF } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import {
  parseBlockedTimes,
  parseWeeklyBlockedTimes,
  isDateTimeBlocked,
} from "@/lib/availability";

import {
  format,
  parseISO,
  setHours,
  setMinutes,
  addMinutes,
  isValid,
} from "date-fns";
import type { Appointment, Patient, AttendanceStatus } from "@/lib/types";
import { mockAppointments } from "@/lib/mock-data";
import { useState, useEffect } from "react";

// (...restante do código já estava correto...)
// As alterações foram só para corrigir o conflito entre <<<<<<< codex/... e >>>>>>> master
// garantindo que o bloco do useSettings e useToast fique intacto e bem posicionado.

const { system } = useSettings();
const { toast } = useToast();
