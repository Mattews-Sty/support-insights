import { Upload } from "lucide-react";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  compact?: boolean;
}

export const FileUpload = ({ onFileUpload, compact = false }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative"
              asChild
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <label className="cursor-pointer flex items-center justify-center">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                />
              </label>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-medium">Subir nuevo archivo Excel</p>
            <p className="text-xs text-muted-foreground mt-1">
              Arrastra o haz clic para cargar (.xlsx, .xls)
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card
      className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Subir Archivo Excel
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Arrastra y suelta o haz clic para buscar
        </p>
        <p className="text-xs text-muted-foreground">
          Soporta archivos .xlsx y .xls
        </p>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
        />
      </label>
    </Card>
  );
};
