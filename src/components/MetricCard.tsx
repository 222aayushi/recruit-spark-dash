import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, change, changeType, icon: Icon }: MetricCardProps) => {
  const changeColorClass = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="p-6 bg-glass border-glass backdrop-blur-md hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <p className={`text-sm mt-1 ${changeColorClass[changeType]}`}>
            {change}
          </p>
        </div>
        <div className="p-3 bg-gradient-accent rounded-lg group-hover:shadow-ai-glow transition-all duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};