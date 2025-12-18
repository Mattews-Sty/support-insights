import { ProcessedTicket, SprintMetrics, SprintSummary, DistributionData } from '@/types/ticket';

export const calculateSprintMetrics = (
  tickets: ProcessedTicket[],
  sprint: number
): SprintMetrics => {
  const sprintTickets = tickets.filter((t) => t.sprint === sprint);
  const totalTickets = sprintTickets.length;

  if (totalTickets === 0) {
    return {
      sprint,
      totalTickets: 0,
      totalResolutionTime: 0,
      averageResolutionTime: 0,
      closureRate: 0,
      closedTickets: 0,
      escalationRate: 0,
      escalatedTickets: 0,
      priorityDistribution: {},
      statusDistribution: {},
      slaCompliance: {},
      ticketsPerPerson: {},
      ticketsPerClient: {},
      requestTypeDistribution: {},
    };
  }

  // Total and average resolution time
  const totalResolutionTime = sprintTickets.reduce((sum, t) => sum + t.resolutionTime, 0);
  const averageResolutionTime = totalResolutionTime / totalTickets;

  // Closure rate
  const closedTickets = sprintTickets.filter(
    (t) => t.status.toLowerCase() === 'closed' || t.status.toLowerCase() === 'cerrado'
  ).length;
  const closureRate = (closedTickets / totalTickets) * 100;

  // Escalation rate
  const escalatedTickets = sprintTickets.filter((t) => t.isEscalated).length;
  const escalationRate = (escalatedTickets / totalTickets) * 100;

  // Priority distribution
  const priorityCounts: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const priority = t.priority || 'Unknown';
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });

  // Convert to DistributionData with percentage and count
  const priorityDistribution: Record<string, DistributionData> = {};
  Object.keys(priorityCounts).forEach((key) => {
    priorityDistribution[key] = {
      percentage: (priorityCounts[key] / totalTickets) * 100,
      count: priorityCounts[key],
    };
  });

  // Status distribution
  const statusCounts: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const status = t.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Convert to DistributionData with percentage and count
  const statusDistribution: Record<string, DistributionData> = {};
  Object.keys(statusCounts).forEach((key) => {
    statusDistribution[key] = {
      percentage: (statusCounts[key] / totalTickets) * 100,
      count: statusCounts[key],
    };
  });

  // SLA Compliance
  const slaCompliance = calculateSLACompliance(sprintTickets);

  // Tickets per person
  const ticketsPerPerson: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const assignee = t.assignee || 'Unassigned';
    ticketsPerPerson[assignee] = (ticketsPerPerson[assignee] || 0) + 1;
  });

  // Convert to percentages
  Object.keys(ticketsPerPerson).forEach((key) => {
    ticketsPerPerson[key] = (ticketsPerPerson[key] / totalTickets) * 100;
  });

  // Tickets per client
  const ticketsPerClient: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const client = t.client || 'Unknown';
    ticketsPerClient[client] = (ticketsPerClient[client] || 0) + 1;
  });

  // Convert to percentages
  Object.keys(ticketsPerClient).forEach((key) => {
    ticketsPerClient[key] = (ticketsPerClient[key] / totalTickets) * 100;
  });

  // Request type distribution
  const requestTypeCounts: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const requestType = t.requestType || 'Sin tipo';
    requestTypeCounts[requestType] = (requestTypeCounts[requestType] || 0) + 1;
  });

  // Convert to DistributionData with percentage and count
  const requestTypeDistribution: Record<string, DistributionData> = {};
  Object.keys(requestTypeCounts).forEach((key) => {
    requestTypeDistribution[key] = {
      percentage: (requestTypeCounts[key] / totalTickets) * 100,
      count: requestTypeCounts[key],
    };
  });

  return {
    sprint,
    totalTickets,
    totalResolutionTime,
    averageResolutionTime,
    closureRate,
    closedTickets,
    escalationRate,
    escalatedTickets,
    priorityDistribution,
    statusDistribution,
    slaCompliance,
    ticketsPerPerson,
    ticketsPerClient,
    requestTypeDistribution,
  };
};

const calculateSLACompliance = (tickets: ProcessedTicket[]): Record<string, number> => {
  const slaTargets: Record<string, number> = {
    Urgente: 1 * 24 * 60, // 1 day in minutes
    Alta: 3 * 24 * 60, // 3 days in minutes
  };

  const slaCompliance: Record<string, { met: number; total: number }> = {};

  tickets.forEach((ticket) => {
    const priority = ticket.priority;
    if (!slaTargets[priority]) return;

    if (!slaCompliance[priority]) {
      slaCompliance[priority] = { met: 0, total: 0 };
    }

    slaCompliance[priority].total += 1;

    if (ticket.resolutionDate && ticket.requestDate) {
      const resolutionMinutes =
        (ticket.resolutionDate.getTime() - ticket.requestDate.getTime()) / (1000 * 60);
      
      if (resolutionMinutes <= slaTargets[priority]) {
        slaCompliance[priority].met += 1;
      }
    }
  });

  // Convert to percentages
  const result: Record<string, number> = {};
  Object.keys(slaCompliance).forEach((priority) => {
    const { met, total } = slaCompliance[priority];
    result[priority] = total > 0 ? (met / total) * 100 : 0;
  });

  return result;
};

export const getAvailableSprints = (tickets: ProcessedTicket[]): number[] => {
  const sprints = new Set(
    tickets
      .map((t) => t.sprint)
      .filter((sprint): sprint is number => sprint != null && !isNaN(sprint))
  );
  return Array.from(sprints).sort((a, b) => b - a);
};

export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const getMonthFromSprint = (sprint: number): string => {
  // 2 sprints per month: sprints 1-2 = Enero, 3-4 = Febrero, etc.
  const monthIndex = Math.floor((sprint - 1) / 2);
  return MONTH_NAMES[monthIndex] || 'Desconocido';
};

const formatDateRange = (startDate: Date, endDate: Date): string => {
  const formatDate = (date: Date) => {
    const day = date.getUTCDate();
    const month = MONTH_NAMES[date.getUTCMonth()].toLowerCase();
    const year = date.getUTCFullYear();
    return `${day} de ${month}`;
  };

  const start = formatDate(startDate);
  const endDay = endDate.getUTCDate();
  const endMonth = MONTH_NAMES[endDate.getUTCMonth()].toLowerCase();
  const endYear = endDate.getUTCFullYear();

  return `${start} al ${endDay} de ${endMonth} ${endYear}`;
};

export const calculateAllSprintsSummary = (tickets: ProcessedTicket[]): SprintSummary[] => {
  const sprints = getAvailableSprints(tickets);

  return sprints
    .sort((a, b) => a - b) // Order by sprint number ascending
    .map((sprint) => {
      const sprintTickets = tickets.filter((t) => t.sprint === sprint);
      const totalTickets = sprintTickets.length;

      if (totalTickets === 0) {
        return {
          month: getMonthFromSprint(sprint),
          sprint,
          totalHours: '00:00:00',
          totalTickets: 0,
          averageTimePerTicket: '00:00:00',
          dateRange: '-',
          topClients: [],
        };
      }

      // Total resolution time
      const totalResolutionTime = sprintTickets.reduce((sum, t) => sum + t.resolutionTime, 0);
      const averageResolutionTime = totalResolutionTime / totalTickets;

      // Date range
      const dates = sprintTickets
        .map((t) => t.requestDate)
        .filter((d) => d instanceof Date && !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      const dateRange = dates.length > 0
        ? formatDateRange(dates[0], dates[dates.length - 1])
        : '-';

      // Top clients (count, not percentage)
      const clientCounts: Record<string, number> = {};
      sprintTickets.forEach((t) => {
        const client = t.client || 'Unknown';
        clientCounts[client] = (clientCounts[client] || 0) + 1;
      });

      const topClients = Object.entries(clientCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Top 3 clients

      return {
        month: getMonthFromSprint(sprint),
        sprint,
        totalHours: formatMinutesToTime(totalResolutionTime),
        totalTickets,
        averageTimePerTicket: formatMinutesToTime(averageResolutionTime),
        dateRange,
        topClients,
      };
    });
};
