
import { PatientDetailsClient } from '@/components/patients/PatientDetailsClient';

interface PatientDetailPageProps {
  params: {
    id: string;
  };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  return <PatientDetailsClient patientId={params.id} />;
}

// Optional: Add metadata generation if needed
// export async function generateMetadata({ params }: PatientDetailPageProps): Promise<Metadata> {
//   // Fetch patient data here if you want to set title dynamically
//   return {
//     title: `Detalhes do Paciente - ${params.id}`,
//   };
// }
