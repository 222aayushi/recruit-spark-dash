import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", accuracy: 85, latency: 120 },
  { name: "Feb", accuracy: 88, latency: 115 },
  { name: "Mar", accuracy: 92, latency: 108 },
  { name: "Apr", accuracy: 89, latency: 125 },
  { name: "May", accuracy: 94, latency: 95 },
  { name: "Jun", accuracy: 96, latency: 88 },
  { name: "Jul", accuracy: 97, latency: 82 }
];

export const PerformanceChart = () => {
  return (
    <Card className="p-6 bg-glass border-glass backdrop-blur-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">Model Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="hsl(var(--warning))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--warning))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--warning))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};