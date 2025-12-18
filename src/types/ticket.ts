export interface TicketRow {
  "FECHA DE SOLICITUD": string;
  "SPRINT": number;
  "DÍA": string;
  "CLIENTE": string;
  "TIPO DE SOLICITUD": string;
  "TICKET": string;
  "PRIORIDAD": string;
  "ASIGNACIÓN": string;
  "ESTADO": string;
  "FECHA DE SOLUCIÓN": string;
  "SP": number;
  "TIEMPO DE SOLUCIÓN": string;
  "ENLACE CLICKUP": string;
  "QA": string;
  "OBSERVACIONES": string;
}

export interface ProcessedTicket {
  id: string;
  requestDate: Date;
  client: string;
  priority: string;
  assignee: string;
  status: string;
  resolutionDate?: Date;
  sprint: number;
  resolutionTime: number; // in minutes
  isEscalated: boolean;
  requestType: string;
}

export interface DistributionData {
  percentage: number;
  count: number;
}

export interface SprintMetrics {
  sprint: number;
  totalTickets: number;
  totalResolutionTime: number; // in minutes
  averageResolutionTime: number; // in minutes
  closureRate: number; // percentage
  closedTickets: number; // count
  escalationRate: number; // percentage
  escalatedTickets: number; // count
  priorityDistribution: Record<string, DistributionData>;
  statusDistribution: Record<string, DistributionData>;
  slaCompliance: Record<string, number>;
  ticketsPerPerson: Record<string, number>;
  ticketsPerClient: Record<string, number>;
  requestTypeDistribution: Record<string, DistributionData>;
}

export interface SprintSummary {
  month: string;
  sprint: number;
  totalHours: string;
  totalTickets: number;
  averageTimePerTicket: string;
  dateRange: string;
  topClients: { name: string; count: number }[];
}
