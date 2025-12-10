import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SprintSummary } from "@/types/ticket";

interface SprintSummaryTableProps {
  data: SprintSummary[];
}

export const SprintSummaryTable = ({ data }: SprintSummaryTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Global por Sprint</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead className="text-center">Sprint</TableHead>
                <TableHead className="text-center">Total de Horas</TableHead>
                <TableHead className="text-center">Total Tickets</TableHead>
                <TableHead className="text-center">Promedio por Ticket</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Clientes con más solicitudes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.sprint}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-center">{row.sprint}</TableCell>
                  <TableCell className="text-center font-mono">{row.totalHours}</TableCell>
                  <TableCell className="text-center">{row.totalTickets}</TableCell>
                  <TableCell className="text-center font-mono">{row.averageTimePerTicket}</TableCell>
                  <TableCell className="text-sm">{row.dateRange}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {row.topClients.map((client, index) => (
                        <div key={index} className="text-sm">
                          {client.name} ({client.count})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
