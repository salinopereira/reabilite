import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';

const patients = [
  {
    id: '1',
    name: 'Juliana Costa',
    lastConsultation: '2024-05-10',
    avatarId: 'patient-avatar-1',
  },
  {
    id: '2',
    name: 'Marcos Vinicius',
    lastConsultation: '2024-05-08',
    avatarId: 'patient-avatar-2',
  },
  {
    id: '3',
    name: 'Ana Silva',
    lastConsultation: '2024-05-05',
    avatarId: 'patient-avatar-1',
  },
];

export default function PatientsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Pacientes</h2>
          <p className="text-muted-foreground">
            Gerencie as informações e o histórico dos seus pacientes.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <Input placeholder="Buscar paciente..." className="max-w-sm" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Última Consulta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const avatar = placeholderImages.find(p => p.id === patient.avatarId);
                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {avatar && <AvatarImage src={avatar.imageUrl} alt={patient.name} data-ai-hint={avatar.imageHint} />}
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(patient.lastConsultation).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline">
                        <Link href={`/professional/patients/${patient.id}`}>Ver Prontuário</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
