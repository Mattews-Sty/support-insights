import { ProcessedTicket, SprintMetrics } from '@/types/ticket';

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
      escalationRate: 0,
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
  const priorityDistribution: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const priority = t.priority || 'Unknown';
    priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
  });

  // Convert to percentages
  Object.keys(priorityDistribution).forEach((key) => {
    priorityDistribution[key] = (priorityDistribution[key] / totalTickets) * 100;
  });

  // Status distribution
  const statusDistribution: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const status = t.status || 'Unknown';
    statusDistribution[status] = (statusDistribution[status] || 0) + 1;
  });

  // Convert to percentages
  Object.keys(statusDistribution).forEach((key) => {
    statusDistribution[key] = (statusDistribution[key] / totalTickets) * 100;
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
  const requestTypeDistribution: Record<string, number> = {};
  sprintTickets.forEach((t) => {
    const requestType = t.requestType || 'Sin tipo';
    requestTypeDistribution[requestType] = (requestTypeDistribution[requestType] || 0) + 1;
  });

  // Convert to percentages
  Object.keys(requestTypeDistribution).forEach((key) => {
    requestTypeDistribution[key] = (requestTypeDistribution[key] / totalTickets) * 100;
  });

  return {
    sprint,
    totalTickets,
    totalResolutionTime,
    averageResolutionTime,
    closureRate,
    escalationRate,
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
