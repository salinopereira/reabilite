import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function FinancesPage() {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
                    <p className="text-muted-foreground">
                        Acompanhe seus ganhos e transações.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>
                        Esta funcionalidade está em desenvolvimento.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-64 flex-col items-center justify-center">
                    <DollarSign className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">O registro de transações aparecerá aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
