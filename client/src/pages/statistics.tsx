import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { getDefaultUserData } from "@/lib/get-default-user-data";
import { CHART_PERIODS, CRAVING_CONTEXTS } from "@/lib/constants";

export default function Statistics() {
  // For demo purposes, we're using a default user ID
  const userId = 1;
  const [selectedPeriod, setSelectedPeriod] = useState(CHART_PERIODS[0].id);
  
  // Fetch user stats and cravings from API
  const { data: userStats } = useQuery({
    queryKey: ['/api/users/' + userId + '/stats'],
  });
  
  const { data: cravings } = useQuery({
    queryKey: ['/api/cravings/user/' + userId],
  });
  
  // Fall back to demo data if API not available
  const defaultData = getDefaultUserData();
  const stats = userStats || defaultData.stats;
  
  // Generate sample data for charts based on the period
  const selectedPeriodDays = CHART_PERIODS.find(p => p.id === selectedPeriod)?.days || 7;
  
  // Savings data
  const generateSavingsData = () => {
    const { moneySaved, daysSinceSmoking } = stats;
    const savingsPerDay = moneySaved / daysSinceSmoking;
    
    return Array.from({ length: selectedPeriodDays }).map((_, index) => {
      const day = index + 1;
      return {
        day,
        savings: Math.round(savingsPerDay * Math.min(day, daysSinceSmoking))
      };
    });
  };
  
  // Cigarettes avoided data
  const generateCigarettesData = () => {
    const { cigarettesAvoided, daysSinceSmoking } = stats;
    const cigarettesPerDay = cigarettesAvoided / daysSinceSmoking;
    
    return Array.from({ length: selectedPeriodDays }).map((_, index) => {
      const day = index + 1;
      return {
        day,
        cigarettes: Math.round(cigarettesPerDay * Math.min(day, daysSinceSmoking))
      };
    });
  };
  
  // Craving context distribution
  const generateCravingContextData = () => {
    // If we have real cravings data, use it
    if (cravings && cravings.length > 0) {
      const contextCounts = cravings.reduce((acc: Record<string, number>, craving: any) => {
        acc[craving.context] = (acc[craving.context] || 0) + 1;
        return acc;
      }, {});
      
      return CRAVING_CONTEXTS.map(ctx => ({
        name: ctx.label,
        value: contextCounts[ctx.id] || 0
      }));
    }
    
    // Otherwise, generate sample data
    return [
      { name: "Après un repas", value: 25 },
      { name: "Stress", value: 30 },
      { name: "Café", value: 20 },
      { name: "Alcool", value: 10 },
      { name: "Pause", value: 15 },
      { name: "Autre", value: 5 }
    ];
  };
  
  // Resistance rate
  const generateResistanceData = () => {
    // If we have real cravings data, use it
    if (cravings && cravings.length > 0) {
      const resistedCount = cravings.filter((c: any) => c.resisted).length;
      const smokedCount = cravings.length - resistedCount;
      
      return [
        { name: "Résisté", value: resistedCount },
        { name: "Fumé", value: smokedCount }
      ];
    }
    
    // Otherwise, generate sample data
    return [
      { name: "Résisté", value: 70 },
      { name: "Fumé", value: 30 }
    ];
  };
  
  const savingsData = generateSavingsData();
  const cigarettesData = generateCigarettesData();
  const cravingContextData = generateCravingContextData();
  const resistanceData = generateResistanceData();
  
  // Colors for charts
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  
  return (
    <Layout
      title="Statistiques"
      subtitle="Visualisez votre progression et vos tendances"
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Toutes les stats
            </TabsTrigger>
            <TabsTrigger value="savings" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Économies
            </TabsTrigger>
            <TabsTrigger value="cravings" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Envies
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                {CHART_PERIODS.map(period => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {/* Savings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Économies réalisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#9CA3AF" tickFormatter={(value) => `J${value}`} />
                      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => [`${value}€`, 'Économies']} labelFormatter={(value) => `Jour ${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="savings" name="Économies (€)" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Cigarettes Avoided Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cigarettes évitées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cigarettesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#9CA3AF" tickFormatter={(value) => `J${value}`} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip formatter={(value) => [`${value}`, 'Cigarettes']} labelFormatter={(value) => `Jour ${value}`} />
                      <Legend />
                      <Bar dataKey="cigarettes" name="Cigarettes évitées" fill="#EF4444" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Craving Context Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Contextes des envies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cravingContextData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {cravingContextData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Occurrences']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Resistance Rate Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Taux de résistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resistanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Occurrences']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="savings">
            <Card>
              <CardHeader>
                <CardTitle>Économies réalisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="day" stroke="#9CA3AF" tickFormatter={(value) => `J${value}`} />
                      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value}€`} />
                      <Tooltip formatter={(value) => [`${value}€`, 'Économies']} labelFormatter={(value) => `Jour ${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="savings" name="Économies (€)" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Économies totales</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.moneySaved} €</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Économies mensuelles</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {Math.round(stats.moneySaved / (stats.daysSinceSmoking / 30))} €
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Économies annuelles</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {Math.round(stats.moneySaved / (stats.daysSinceSmoking / 365))} €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cravings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Craving Context Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Contextes des envies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cravingContextData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {cravingContextData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Occurrences']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Resistance Rate Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Taux de résistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resistanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, 'Occurrences']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
