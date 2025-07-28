import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const insights = [
  {
    type: "optimization",
    title: "Model Performance Optimized",
    description: "Your ML model accuracy improved by 12% this week",
    icon: TrendingUp,
    severity: "success"
  },
  {
    type: "alert",
    title: "Data Drift Detected",
    description: "Input distribution has shifted 8% from baseline",
    icon: AlertTriangle,
    severity: "warning"
  },
  {
    type: "insight",
    title: "Peak Usage Pattern",
    description: "API calls peak at 2-4 PM daily. Consider auto-scaling",
    icon: Brain,
    severity: "info"
  },
  {
    type: "success",
    title: "SLA Compliance",
    description: "99.8% uptime maintained this month",
    icon: CheckCircle,
    severity: "success"
  }
];

export const AIInsightsPanel = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "bg-success/10 text-success border-success/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "info": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <Card className="p-6 bg-glass border-glass backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
        <Badge variant="secondary" className="ml-auto bg-gradient-primary text-primary-foreground">
          Live
        </Badge>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-glass hover:bg-gradient-accent transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${getSeverityColor(insight.severity)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">
                  {insight.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};