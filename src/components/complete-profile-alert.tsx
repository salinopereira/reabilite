'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type Professional } from '@/lib/types';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompleteProfileAlertProps {
  professional: Professional | null;
}

export function CompleteProfileAlert({ professional }: CompleteProfileAlertProps) {
  if (!professional) {
    return null;
  }

  const isProfileIncomplete =
    !professional.areaOfExpertise ||
    !professional.consultationFee ||
    !professional.bio;

  if (!isProfileIncomplete) {
    return null;
  }

  return (
    <Alert className="border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-bold">Seu perfil está incompleto!</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <p>
          Complete seu perfil para começar a receber agendamentos. Pacientes não podem te encontrar até que você preencha todas as suas informações.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/professional/profile">
            Completar Perfil
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
