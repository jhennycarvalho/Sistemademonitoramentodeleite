import { useState } from 'react';
import { Cow } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CowRegistryProps {
  cows: Cow[];
  onAddCow: (cow: Omit<Cow, 'id'>) => void;
  onUpdateCow: (id: string, cow: Omit<Cow, 'id'>) => void;
  onDeleteCow: (id: string) => void;
}

export function CowRegistry({ cows, onAddCow, onUpdateCow, onDeleteCow }: CowRegistryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    breed: '',
    birthDate: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCow) {
      onUpdateCow(editingCow.id, formData);
    } else {
      onAddCow(formData);
    }
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tag: '',
      breed: '',
      birthDate: '',
      status: 'active'
    });
    setEditingCow(null);
  };

  const handleEdit = (cow: Cow) => {
    setEditingCow(cow);
    setFormData({
      name: cow.name,
      tag: cow.tag,
      breed: cow.breed,
      birthDate: cow.birthDate,
      status: cow.status
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vaca?')) {
      onDeleteCow(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cadastro de Vacas</CardTitle>
            <CardDescription>Gerencie as vacas em produção</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Vaca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCow ? 'Editar Vaca' : 'Cadastrar Nova Vaca'}</DialogTitle>
                <DialogDescription>
                  Preencha os dados da vaca
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tag">Brinco/Identificação</Label>
                  <Input
                    id="tag"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Raça</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {editingCow ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brinco</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Nenhuma vaca cadastrada
                </TableCell>
              </TableRow>
            ) : (
              cows.map((cow) => (
                <TableRow key={cow.id}>
                  <TableCell>{cow.tag}</TableCell>
                  <TableCell>{cow.name}</TableCell>
                  <TableCell>{cow.breed}</TableCell>
                  <TableCell>{new Date(cow.birthDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={cow.status === 'active' ? 'default' : 'secondary'}>
                      {cow.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cow)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cow.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
