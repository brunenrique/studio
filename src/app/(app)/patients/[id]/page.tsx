
import { PatientDetailsClient } from '@/components/patients/PatientDetailsClient';

export default function PatientDetailPage({ params }: any) {
  return <PatientDetailsClient patientId={params.id} />;
}

// Optional: Add metadata generation if needed
// export async function generateMetadata({ params }: PatientDetailPageProps): Promise<Metadata> {
//   // Fetch patient data here if you want to set title dynamically
//   return {
//     title: `Detalhes do Paciente - ${params.id}`,
//   };
// }
