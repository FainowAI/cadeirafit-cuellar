import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Eye, Scan } from 'lucide-react';

interface ModalAjudaProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalAjuda: React.FC<ModalAjudaProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-6 w-6 text-accent" />
            Como descobrir seu Perfil Postural?
          </DialogTitle>
          <DialogDescription>
            Siga estes passos simples para identificar seu perfil postural
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent" />
                Preparação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Posição</p>
                  <p className="text-sm text-muted-foreground">
                    Fique de pé, de lado para um espelho ou peça para alguém observar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Postura natural</p>
                  <p className="text-sm text-muted-foreground">
                    Mantenha sua postura habitual, sem forçar correções
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base text-accent">Equilibrado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  • Curva lombar suave e natural<br/>
                  • Ombros alinhados<br/>
                  • Cabeça alinhada com o corpo
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base text-accent">Lordose Acentuada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  • Curvatura lombar muito pronunciada<br/>
                  • Quadril projetado para frente<br/>
                  • "Bumbum empinado"
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base text-accent">Cifose Acentuada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  • Ombros "caídos" para frente<br/>
                  • Cabeça projetada à frente<br/>
                  • Costas "corcunda"
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-base text-accent">Assimetria Leve</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  • Um ombro mais alto que o outro<br/>
                  • Quadril desalinhado<br/>
                  • Leve inclinação corporal
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Dica:</strong> Em caso de dúvida, escolha "Equilibrado" ou consulte um profissional de saúde.
            </p>
          </div>

          <Button onClick={onClose} className="w-full">
            Entendi!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};