import { Upload } from "lucide-react";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
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
