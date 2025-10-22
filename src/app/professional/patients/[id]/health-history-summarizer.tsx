'use client';

import { useEffect, useState } from 'react';
import { summarizeHealthHistory } from '@/ai/flows/summarize-health-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, FileText, Loader2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type HealthHistorySummarizerProps = {
  patientId: string;
  initialHistory: string;
  onSave: (newHistory: string) => Promise<void>;
};

export function HealthHistorySummarizer({
  patientId,
  initialHistory,
  onSave,
}: HealthHistorySummarizerProps) {
  const [history, setHistory] = useState(initialHistory);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(initialHistory);
    setSummary(''); // Clear summary when patient changes
  }, [initialHistory, patientId]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await summarizeHealthHistory({ healthHistory: history });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to summarize health history:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar resumo',
        description: 'Não foi possível se conectar ao serviço de IA. Tente novamente.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveHistory = async () => {
    setIsSaving(true);
    try {
      await onSave(history);
      toast({
        title: 'Histórico salvo!',
        description: 'As informações do paciente foram atualizadas.',
      });
    } catch (error) {
      console.error('Failed to save health history:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o histórico. Tente novamente.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Histórico de Saúde
              </CardTitle>
              <CardDescription>
                Adicione ou edite as informações de saúde do paciente aqui.
              </CardDescription>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button onClick={handleSaveHistory} disabled={isSaving || isSummarizing} className="flex-1 sm:flex-grow-0">
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar
              </Button>
              <Button onClick={handleSummarize} disabled={isSummarizing || isSaving} variant="outline" className="flex-1 sm:flex-grow-0">
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="mr-2 h-4 w-4" />
                )}
                Gerar Resumo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows={15}
            placeholder="Insira o histórico de saúde do paciente..."
            className="text-sm"
          />
        </CardContent>
      </Card>

      {(isSummarizing || summary) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot />
              Resumo da IA
            </CardTitle>
            <CardDescription>
              Este é um resumo gerado por IA do histórico de saúde. Use-o como um auxílio, mas sempre verifique as informações completas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSummarizing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
