import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DistributionData } from "@/types/ticket";

interface RequestTypeChartProps {
  data: Record<string, DistributionData>;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

export const RequestTypeChart = ({ data }: RequestTypeChartProps) => {
  const chartData = Object.entries(data).map(([name, { percentage, count }]) => ({
    name,
    value: Math.round(percentage),
    count,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; count: number } }> }) => {
    if (active && payload && payload.length) {
      const { name, value, count } = payload[0].payload;
      return (
        <div className="bg-popover border rounded-md shadow-md p-3">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{value}%</p>
          <p className="text-sm font-semibold">{count} {count === 1 ? 'ticket' : 'tickets'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Tipo de Solicitud</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
