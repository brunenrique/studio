"use client";

import { SmartModal } from "@/components/SmartModal";
import { useAppointmentHistory } from "@/hooks/useAppointmentHistory";

interface AppointmentHistoryModalProps {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentHistoryModal({ appointmentId, open, onOpenChange }: AppointmentHistoryModalProps) {
  const { history } = useAppointmentHistory(appointmentId);

  const formatTimestamp = (ts: any) => {
    if (!ts) return "";
    if (typeof ts === "string") return new Date(ts).toLocaleString();
    return ts.toDate().toLocaleString();
  };

  return (
    <SmartModal id="appointment-history" open={open} onClose={() => onOpenChange(false)} title="Histórico">
      <div className="max-h-60 overflow-y-auto space-y-2 text-sm">
        {history.map(item => (
          <div key={item.id} className="border-b pb-1">
            <p>
              <span className="font-medium mr-2">{item.action || "update"}</span>
              por {item.userId || "sistema"} em {formatTimestamp(item.timestamp)}
            </p>
          </div>
        ))}
        {history.length === 0 && <p>Nenhum registro.</p>}
      </div>
    </SmartModal>
  );
}
