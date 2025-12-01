import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SLAComplianceCardProps {
  data: Record<string, number>;
}

export const SLAComplianceCard = ({ data }: SLAComplianceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumplimiento de SLA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(data).map(([priority, compliance]) => (
          <div key={priority} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{priority}</span>
              <span className="text-sm text-muted-foreground">
                {compliance.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={compliance} 
              className={
                compliance >= 80 
                  ? "bg-success/20 [&>div]:bg-success" 
                  : compliance >= 60 
                  ? "bg-warning/20 [&>div]:bg-warning" 
                  : "bg-destructive/20 [&>div]:bg-destructive"
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
