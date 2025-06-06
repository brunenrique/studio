"use client";

import type { Patient, SessionNote } from "@/lib/types";
import { getMockPatientById, updateMockPatient } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle, CalendarDays as CalendarIcon, Phone, Gift } from "lucide-react";
import Link from "next/link";
import { SessionNotesSection } from "./SessionNotesSection";
import { AIInsightsSection } from "./AIInsightsSection";
import { PatientFormDialog } from "./PatientFormDialog";
import { format, parseISO, differenceInYears } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePatientAssessments } from "@/hooks/usePatientAssessments";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CustomImage from "@/components/ui/custom-image";

interface PatientDetailsClientProps {
  patientId: string;
}
