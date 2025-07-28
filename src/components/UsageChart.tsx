import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", requests: 12400, users: 2400 },
  { name: "Tue", requests: 13800, users: 2210 },
  { name: "Wed", requests: 15200, users: 2800 },
  { name: "Thu", requests: 16900, users: 3100 },
  { name: "Fri", requests: 18500, users: 3400 },
  { name: "Sat", requests: 14200, users: 2100 },
  { name: "Sun", requests: 11800, users: 1900 }
];

export const UsageChart = () => {
  return (
    <Card className="p-6 bg-glass border-glass backdrop-blur-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">API Usage</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            <Bar 
              dataKey="requests" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};