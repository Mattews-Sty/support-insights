import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MetricCard } from "@/components/MetricCard";
import { PriorityChart } from "@/components/PriorityChart";
import { StatusChart } from "@/components/StatusChart";
import { DistributionTable } from "@/components/DistributionTable";
import { SLAComplianceCard } from "@/components/SLAComplianceCard";
import { parseExcelFile } from "@/utils/excelParser";
import { calculateSprintMetrics, getAvailableSprints, formatMinutesToTime } from "@/utils/metricsCalculator";
import { ProcessedTicket } from "@/types/ticket";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";

const Index = () => {
  const [tickets, setTickets] = useState<ProcessedTicket[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    console.log("File upload started:", file.name, file.type);
    setIsLoading(true);
    try {
      console.log("Parsing Excel file...");
      const parsedTickets = await parseExcelFile(file);
      console.log("Parsed tickets:", parsedTickets.length, parsedTickets);
      setTickets(parsedTickets);
      
      const sprints = getAvailableSprints(parsedTickets);
      console.log("Available sprints:", sprints);
      if (sprints.length > 0) {
        setSelectedSprint(sprints[0]);
      }
      
      toast.success(`Successfully loaded ${parsedTickets.length} support tickets`);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Failed to parse Excel file. Please check the file format.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableSprints = getAvailableSprints(tickets);
  const metrics = selectedSprint ? calculateSprintMetrics(tickets, selectedSprint) : null;

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Panel de Indicadores de Soporte
            </h1>
            <p className="text-muted-foreground">
              Sube tu archivo Excel para visualizar las métricas de soporte automáticamente
            </p>
          </div>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Panel de Indicadores de Soporte
            </h1>
            <p className="text-muted-foreground">
              {tickets.length} tickets cargados desde Excel
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedSprint?.toString()}
              onValueChange={(value) => setSelectedSprint(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Sprint" />
              </SelectTrigger>
              <SelectContent>
                {availableSprints.map((sprint) => (
                  <SelectItem key={sprint} value={sprint.toString()}>
                    Sprint {sprint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>

        {metrics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Tickets"
                value={metrics.totalTickets}
                icon={FileText}
                variant="default"
              />
              <MetricCard
                title="Tiempo Promedio de Resolución"
                value={formatMinutesToTime(metrics.averageResolutionTime)}
                subtitle={`Total: ${formatMinutesToTime(metrics.totalResolutionTime)}`}
                icon={Clock}
                variant="default"
              />
              <MetricCard
                title="Tasa de Cierre"
                value={`${metrics.closureRate.toFixed(1)}%`}
                icon={CheckCircle2}
                variant={metrics.closureRate >= 80 ? "success" : "warning"}
              />
              <MetricCard
                title="Tasa de Escalamiento"
                value={`${metrics.escalationRate.toFixed(1)}%`}
                icon={TrendingUp}
                variant={metrics.escalationRate <= 20 ? "success" : "warning"}
              />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriorityChart data={metrics.priorityDistribution} />
              <StatusChart data={metrics.statusDistribution} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SLAComplianceCard data={metrics.slaCompliance} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistributionTable
                title="Tickets por Persona"
                data={metrics.ticketsPerPerson}
                totalTickets={metrics.totalTickets}
              />
              <DistributionTable
                title="Tickets por Cliente"
                data={metrics.ticketsPerClient}
                totalTickets={metrics.totalTickets}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
