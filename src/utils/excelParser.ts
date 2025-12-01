import * as XLSX from 'xlsx';
import { TicketRow, ProcessedTicket } from '@/types/ticket';

const LEVEL_2_AGENTS = ['Agent1', 'Agent2']; // Configure as needed

const getColumnValue = (row: any, columnName: string): any => {
  // Normalize the column name to lowercase for case-insensitive comparison
  const normalizedSearch = columnName.toLowerCase();

  // Find the actual key in the row that matches (case-insensitive)
  for (const key of Object.keys(row)) {
    if (key.toLowerCase() === normalizedSearch) {
      return row[key];
    }
  }

  return undefined;
};

export const parseExcelFile = async (file: File): Promise<ProcessedTicket[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const allTickets: ProcessedTicket[] = [];

        // Valid month names in Spanish
        const validMonths = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        // Process only sheets with month names
        workbook.SheetNames.forEach((sheetName) => {
          const normalizedName = sheetName.toLowerCase().trim();

          // Skip if not a valid month name
          if (!validMonths.includes(normalizedName)) return;

          const worksheet = workbook.Sheets[sheetName];
          const jsonData: TicketRow[] = XLSX.utils.sheet_to_json(worksheet);

          // Filter only "Soporte" tickets and process them
          const supportTickets = jsonData
            .filter((row) => {
              const tipoSolicitud = getColumnValue(row, "TIPO DE SOLICITUD");
              return tipoSolicitud === "Soporte";
            })
            .map((row, index) => processTicket(row, `${sheetName}-${index}`));

          allTickets.push(...supportTickets);
        });

        resolve(allTickets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

const processTicket = (row: TicketRow, id: string): ProcessedTicket => {
  // Handle different column name variations (case-insensitive)
  const requestDateValue = getColumnValue(row, "FECHA DE SOLICITUD");
  const resolutionDateValue = getColumnValue(row, "FECHA DE SOLUCIÓN");
  const resolutionTimeValue = getColumnValue(row, "TIEMPO DE SOLUCIÓN");
  const assigneeValue = getColumnValue(row, "ASIGNACIÓN");
  const clientValue = getColumnValue(row, "CLIENTE");
  const priorityValue = getColumnValue(row, "PRIORIDAD");
  const statusValue = getColumnValue(row, "ESTADO");
  const sprintValue = getColumnValue(row, "SPRINT");

  const requestDate = parseExcelDate(requestDateValue);
  const resolutionDate = resolutionDateValue
    ? parseExcelDate(resolutionDateValue)
    : undefined;

  const resolutionTime = parseTimeToMinutes(resolutionTimeValue);
  const isEscalated = LEVEL_2_AGENTS.includes(assigneeValue);

  // Use sprint from SPRINT column, default to 0 if not available
  const sprint = typeof sprintValue === 'number' ? sprintValue : parseInt(sprintValue) || 0;

  return {
    id,
    requestDate,
    client: clientValue,
    priority: priorityValue,
    assignee: assigneeValue,
    status: statusValue,
    resolutionDate,
    sprint,
    resolutionTime,
    isEscalated,
  };
};

const parseExcelDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'number') {
    // Excel serial date number - use UTC to avoid timezone issues
    // Add 12 hours (43200000 ms) to center the date and avoid edge cases
    const utcDays = Math.floor(dateValue - 25569);
    const utcValue = utcDays * 86400 * 1000;
    return new Date(utcValue + 43200000); // +12 hours
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  return new Date();
};

const parseTimeToMinutes = (timeStr: any): number => {
  if (!timeStr) return 0;
  
  // Convert to string if it's a number (Excel sometimes stores time as decimal)
  const timeString = typeof timeStr === 'number' 
    ? new Date(timeStr * 24 * 60 * 60 * 1000).toISOString().substr(11, 8)
    : String(timeStr);
  
  const parts = timeString.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return hours * 60 + minutes + seconds / 60;
  }
  return 0;
};
