import { Cow, QualityRecord } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Droplets, Beef } from 'lucide-react';

interface QualityDashboardProps {
  cows: Cow[];
  qualityRecords: QualityRecord[];
}

export function QualityDashboard({ cows, qualityRecords }: QualityDashboardProps) {
  const activeCows = cows.filter(c => c.status === 'active');
  
  const totalVolume = qualityRecords.reduce((sum, record) => sum + record.volume, 0);
  const avgFat = qualityRecords.length > 0
    ? qualityRecords.reduce((sum, record) => sum + record.fat, 0) / qualityRecords.length
    : 0;
  const avgProtein = qualityRecords.length > 0
    ? qualityRecords.reduce((sum, record) => sum + record.protein, 0) / qualityRecords.length
    : 0;
  const avgSCC = qualityRecords.length > 0
    ? qualityRecords.reduce((sum, record) => sum + record.scc, 0) / qualityRecords.length
    : 0;

  const qualityStatus = avgSCC < 200 ? 'excellent' : avgSCC < 400 ? 'good' : 'attention';

  const chartData = qualityRecords
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => {
      const cow = cows.find(c => c.id === record.cowId);
      return {
        date: new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        vaca: cow?.name || 'Desconhecida',
        volume: record.volume,
        gordura: record.fat,
        proteina: record.protein,
        ccs: record.scc,
        temperatura: record.temperature,
        ph: record.ph
      };
    });

  const cowProductionData = activeCows.map(cow => {
    const cowRecords = qualityRecords.filter(r => r.cowId === cow.id);
    const totalVol = cowRecords.reduce((sum, r) => sum + r.volume, 0);
    const avgFatCow = cowRecords.length > 0
      ? cowRecords.reduce((sum, r) => sum + r.fat, 0) / cowRecords.length
      : 0;
    return {
      name: cow.name,
      volume: totalVol,
      gordura: parseFloat(avgFatCow.toFixed(2))
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Vacas Ativas</CardDescription>
            <CardTitle className="text-green-600">{activeCows.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-700">
              <Beef className="w-4 h-4" />
              <span className="text-xs">em produção</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Volume Total</CardDescription>
            <CardTitle className="text-blue-600">{totalVolume.toFixed(1)}L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-blue-700">
              <Droplets className="w-4 h-4" />
              <span className="text-xs">registrados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gordura Média</CardDescription>
            <CardTitle className="text-purple-600">{avgFat.toFixed(2)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">proteína: {avgProtein.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Qualidade (CCS)</CardDescription>
            <CardTitle className={
              qualityStatus === 'excellent' ? 'text-green-600' :
              qualityStatus === 'good' ? 'text-yellow-600' :
              'text-red-600'
            }>
              {avgSCC.toFixed(0)} mil/ml
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={
              qualityStatus === 'excellent' ? 'default' :
              qualityStatus === 'good' ? 'secondary' :
              'destructive'
            }>
              {qualityStatus === 'excellent' && <CheckCircle className="w-3 h-3 mr-1" />}
              {qualityStatus === 'attention' && <AlertCircle className="w-3 h-3 mr-1" />}
              {qualityStatus === 'excellent' ? 'Excelente' :
               qualityStatus === 'good' ? 'Bom' :
               'Atenção'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produção por Vaca</CardTitle>
            <CardDescription>Volume total e gordura média</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cowProductionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume (L)" />
                <Bar yAxisId="right" dataKey="gordura" fill="#8b5cf6" name="Gordura (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução da Qualidade</CardTitle>
            <CardDescription>Gordura e proteína ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gordura" stroke="#8b5cf6" name="Gordura (%)" strokeWidth={2} />
                <Line type="monotone" dataKey="proteina" stroke="#10b981" name="Proteína (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contagem de Células Somáticas (CCS)</CardTitle>
            <CardDescription>Indicador de qualidade e saúde do rebanho</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ccs" stroke="#ef4444" name="CCS (mil/ml)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{'< 200 mil/ml: Excelente'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">200-400 mil/ml: Bom</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">{`> 400 mil/ml: Atenção`}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parâmetros Físico-Químicos</CardTitle>
            <CardDescription>Temperatura e pH</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperatura" stroke="#06b6d4" name="Temperatura (°C)" strokeWidth={2} />
                <Line type="monotone" dataKey="ph" stroke="#f59e0b" name="pH" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
