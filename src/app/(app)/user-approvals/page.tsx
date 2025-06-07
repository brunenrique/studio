"use client";

import { useEffect, useState } from "react";
import { RoleGate } from "@/components/auth/RoleGate";
import { db } from "@/lib/firebaseClient";
import { collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { User } from "@/lib/types";
import { UserApprovalTable } from "@/components/admin/UserApprovalTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function UserApprovalsPage() {
  const [pending, setPending] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "users"), where("isApproved", "==", false));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as User[];
      setPending(data);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "users", id), { isApproved: true });
    toast({ title: "Usuário aprovado" });
  };

  return (
    <RoleGate allowed={["ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Aprovar Usuários</h1>
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Pendentes</CardTitle>
            <CardDescription>{pending.length} usuário(s) aguardando aprovação.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserApprovalTable users={pending} onApprove={handleApprove} />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
