import { useState } from 'react';
import { CowRegistry } from './components/CowRegistry';
import { QualityDashboard } from './components/QualityDashboard';
import { MilkQualityForm } from './components/MilkQualityForm';
import { VoiceChatBot } from './components/VoiceChatBot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Milk, BarChart3, Plus } from 'lucide-react';

export interface Cow {
  id: string;
  name: string;
  tag: string;
  breed: string;
  birthDate: string;
  status: 'active' | 'inactive';
}

export interface QualityRecord {
  id: string;
  cowId: string;
  date: string;
  volume: number; // litros
  fat: number; // % gordura
  protein: number; // % proteína
  lactose: number; // % lactose
  scc: number; // Contagem de Células Somáticas (mil/ml)
  temperature: number; // °C
  ph: number;
}

export default function App() {
  const [cows, setCows] = useState<Cow[]>([
    {
      id: '1',
      name: 'Mimosa',
      tag: 'BR001',
      breed: 'Holandesa',
      birthDate: '2021-03-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Estrela',
      tag: 'BR002',
      breed: 'Jersey',
      birthDate: '2020-07-22',
      status: 'active'
    }
  ]);

  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>([
    {
      id: '1',
      cowId: '1',
      date: '2025-11-27',
      volume: 25,
      fat: 3.8,
      protein: 3.2,
      lactose: 4.5,
      scc: 180,
      temperature: 4.2,
      ph: 6.7
    },
    {
      id: '2',
      cowId: '2',
      date: '2025-11-27',
      volume: 22,
      fat: 4.2,
      protein: 3.5,
      lactose: 4.6,
      scc: 150,
      temperature: 4.0,
      ph: 6.6
    },
    {
      id: '3',
      cowId: '1',
      date: '2025-11-26',
      volume: 24,
      fat: 3.7,
      protein: 3.1,
      lactose: 4.4,
      scc: 190,
      temperature: 4.3,
      ph: 6.7
    }
  ]);

  const addCow = (cow: Omit<Cow, 'id'>) => {
    const newCow = {
      ...cow,
      id: Date.now().toString()
    };
    setCows([...cows, newCow]);
  };

  const updateCow = (id: string, cow: Omit<Cow, 'id'>) => {
    setCows(cows.map(c => c.id === id ? { ...cow, id } : c));
  };

  const deleteCow = (id: string) => {
    setCows(cows.filter(c => c.id !== id));
    setQualityRecords(qualityRecords.filter(r => r.cowId !== id));
  };

  const addQualityRecord = (record: Omit<QualityRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setQualityRecords([...qualityRecords, newRecord]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-600 rounded-lg">
              <Milk className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-green-900">Sistema de Monitoramento de Qualidade do Leite</h1>
              <p className="text-green-700">Gestão completa da produção leiteira</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="cows" className="flex items-center gap-2">
              <Milk className="w-4 h-4" />
              Vacas
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Registrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <QualityDashboard cows={cows} qualityRecords={qualityRecords} />
          </TabsContent>

          <TabsContent value="cows" className="space-y-4">
            <CowRegistry
              cows={cows}
              onAddCow={addCow}
              onUpdateCow={updateCow}
              onDeleteCow={deleteCow}
            />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <MilkQualityForm cows={cows} onAddRecord={addQualityRecord} />
          </TabsContent>
        </Tabs>
      </div>
      
      <VoiceChatBot />
    </div>
  );
}
