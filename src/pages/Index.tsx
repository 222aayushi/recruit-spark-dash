import { MetricCard } from "@/components/MetricCard";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { PerformanceChart } from "@/components/PerformanceChart";
import { UsageChart } from "@/components/UsageChart";
import { DataManager } from "@/components/DataManager";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Users, 
  Zap, 
  TrendingUp, 
  Activity,
  Settings,
  Download,
  Bell
} from "lucide-react";
import heroImage from "@/assets/dashboard-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-glass bg-glass/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Analytics Pro</h1>
                <p className="text-xs text-muted-foreground">Advanced ML Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="glass" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="gradient" size="sm">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-secondary opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Analytics
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time insights, intelligent predictions, and comprehensive model monitoring 
              for enterprise-scale machine learning operations.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="gradient" size="lg" className="text-lg px-8">
                <TrendingUp className="h-5 w-5" />
                View Live Demo
              </Button>
              <Button variant="glass" size="lg" className="text-lg px-8">
                <Activity className="h-5 w-5" />
                Model Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <DataManager />
        </div>
      </section>

      {/* Metrics Overview */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-bold text-foreground mb-8">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Model Accuracy"
              value="97.3%"
              change="+2.1% from last week"
              changeType="positive"
              icon={Brain}
            />
            <MetricCard
              title="Active Users"
              value="24,891"
              change="+12.5% from last month"
              changeType="positive"
              icon={Users}
            />
            <MetricCard
              title="API Requests"
              value="1.2M"
              change="+8.3% from yesterday"
              changeType="positive"
              icon={Zap}
            />
            <MetricCard
              title="Response Time"
              value="82ms"
              change="-15ms from baseline"
              changeType="positive"
              icon={Activity}
            />
          </div>
        </div>
      </section>

      {/* Charts and Insights */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <PerformanceChart />
              <UsageChart />
            </div>
            <div>
              <AIInsightsPanel />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-glass bg-glass/30 backdrop-blur-lg py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">AI Analytics Pro</span>
            </div>
            <p className="text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS. Designed to impress.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;