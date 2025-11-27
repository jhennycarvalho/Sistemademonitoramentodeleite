import { useState } from 'react';
import { Cow, QualityRecord } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Droplets, Thermometer, TestTube } from 'lucide-react';

interface MilkQualityFormProps {
  cows: Cow[];
  onAddRecord: (record: Omit<QualityRecord, 'id'>) => void;
}

export function MilkQualityForm({ cows, onAddRecord }: MilkQualityFormProps) {
  const [formData, setFormData] = useState({
    cowId: '',
    date: new Date().toISOString().split('T')[0],
    volume: '',
    fat: '',
    protein: '',
    lactose: '',
    scc: '',
    temperature: '',
    ph: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      cowId: formData.cowId,
      date: formData.date,
      volume: parseFloat(formData.volume),
      fat: parseFloat(formData.fat),
      protein: parseFloat(formData.protein),
      lactose: parseFloat(formData.lactose),
      scc: parseFloat(formData.scc),
      temperature: parseFloat(formData.temperature),
      ph: parseFloat(formData.ph)
    });
    setFormData({
      cowId: '',
      date: new Date().toISOString().split('T')[0],
      volume: '',
      fat: '',
      protein: '',
      lactose: '',
      scc: '',
      temperature: '',
      ph: ''
    });
    alert('Análise de qualidade registrada com sucesso!');
  };

  const activeCows = cows.filter(cow => cow.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Análise de Qualidade</CardTitle>
        <CardDescription>Adicione uma nova análise de qualidade do leite</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cowId">Vaca</Label>
              <Select
                value={formData.cowId}
                onValueChange={(value) => setFormData({ ...formData, cowId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma vaca" />
                </SelectTrigger>
                <SelectContent>
                  {activeCows.map((cow) => (
                    <SelectItem key={cow.id} value={cow.id}>
                      {cow.tag} - {cow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Data da Análise</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h3 className="text-blue-900">Volume e Composição</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volume">Volume (litros)</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fat">Gordura (%)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="protein">Proteína (%)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lactose">Lactose (%)</Label>
                <Input
                  id="lactose"
                  type="number"
                  step="0.1"
                  value={formData.lactose}
                  onChange={(e) => setFormData({ ...formData, lactose: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TestTube className="w-5 h-5 text-purple-600" />
              <h3 className="text-purple-900">Parâmetros de Qualidade</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="scc">CCS (mil/ml)</Label>
                <Input
                  id="scc"
                  type="number"
                  step="1"
                  value={formData.scc}
                  onChange={(e) => setFormData({ ...formData, scc: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Contagem de Células Somáticas</p>
              </div>

              <div>
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ph">pH</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Registrar Análise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
