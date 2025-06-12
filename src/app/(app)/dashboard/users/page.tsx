import { getUsers } from '@/lib/users';
import UsersTable from '@/components/admin/UsersTable';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardUsersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Usuários</h1>
      <UsersTable users={users} />
    </div>
  );
}
