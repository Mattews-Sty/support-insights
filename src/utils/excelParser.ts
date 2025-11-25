import * as XLSX from 'xlsx';
import { TicketRow, ProcessedTicket } from '@/types/ticket';

const LEVEL_2_AGENTS = ['Agent1', 'Agent2']; // Configure as needed

export const parseExcelFile = async (file: File): Promise<ProcessedTicket[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const allTickets: ProcessedTicket[] = [];

        // Process all sheets except "Resumen"
        workbook.SheetNames.forEach((sheetName) => {
          if (sheetName.toLowerCase() === 'resumen') return;

          const worksheet = workbook.Sheets[sheetName];
          const jsonData: TicketRow[] = XLSX.utils.sheet_to_json(worksheet);

          // Filter only "Soporte" tickets and process them
          const supportTickets = jsonData
            .filter((row) => row["TIPO DE SOLICITUD"] === "Soporte")
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
  const requestDate = parseExcelDate(row["FECHA DE SOLICITUD"]);
  const resolutionDate = row["FECHA DE SOLUCIÓN"] 
    ? parseExcelDate(row["FECHA DE SOLUCIÓN"]) 
    : undefined;
  
  const resolutionTime = parseTimeToMinutes(row["TIEMPO DE SOLUCIÓN"]);
  const isEscalated = LEVEL_2_AGENTS.includes(row["ASIGNACIÓN"]);

  return {
    id,
    requestDate,
    client: row["CLIENTE"],
    priority: row["PRIORIDAD"],
    assignee: row["ASIGNACIÓN"],
    status: row["ESTADO"],
    resolutionDate,
    sprint: row["SP"],
    resolutionTime,
    isEscalated,
  };
};

const parseExcelDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'number') {
    // Excel serial date number
    return new Date((dateValue - 25569) * 86400 * 1000);
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
