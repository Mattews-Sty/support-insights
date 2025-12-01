import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DistributionTableProps {
  title: string;
  data: Record<string, number>;
  totalTickets: number;
}

export const DistributionTable = ({
  title,
  data,
  totalTickets,
}: DistributionTableProps) => {
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Porcentaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map(([name, percentage]) => {
              const count = Math.round((percentage / 100) * totalTickets);
              return (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                  <TableCell className="text-right">
                    {percentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
