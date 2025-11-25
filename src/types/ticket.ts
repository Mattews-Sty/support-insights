export interface TicketRow {
  "FECHA DE SOLICITUD": string;
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
}

export interface SprintMetrics {
  sprint: number;
  totalTickets: number;
  totalResolutionTime: number; // in minutes
  averageResolutionTime: number; // in minutes
  closureRate: number; // percentage
  escalationRate: number; // percentage
  priorityDistribution: Record<string, number>;
  slaCompliance: Record<string, number>;
  ticketsPerPerson: Record<string, number>;
  ticketsPerClient: Record<string, number>;
}
