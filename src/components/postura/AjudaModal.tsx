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
import { CheckCircle, Eye, AlertTriangle } from 'lucide-react';

interface AjudaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AjudaModal: React.FC<AjudaModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-accent" />
            Como identificar seu Perfil Postural?
          </DialogTitle>
          <DialogDescription>
            Siga estes passos simples para descobrir seu perfil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Passos para identificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Posicione-se de lado</p>
                    <p className="text-sm text-muted-foreground">
                      Fique de perfil em frente a um espelho ou peça para alguém observar
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Observe as curvas da coluna</p>
                    <p className="text-sm text-muted-foreground">
                      Note a curva lombar (parte baixa das costas) e torácica (parte média)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Identifique seu perfil</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Curva lombar muito "para dentro" → <strong>Lordose acentuada</strong></p>
                      <p>• Curva torácica "arredondada para frente" → <strong>Cifose acentuada</strong></p>
                      <p>• Um ombro mais alto ou desvio lateral → <strong>Assimetria leve</strong></p>
                      <p>• Nada chamou atenção → <strong>Equilibrado</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Importante</p>
              <p className="text-muted-foreground">
                Esta é uma orientação visual básica e não substitui uma avaliação profissional.
                Em caso de dúvidas ou desconforto, consulte um fisioterapeuta.
              </p>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Entendi!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};