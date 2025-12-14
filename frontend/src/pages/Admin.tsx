import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSweets, useCreateSweet, useUpdateSweet, useDeleteSweet, useRestockSweet } from '@/hooks/useSweets';
import { Header } from '@/components/Header';
import { Sweet, SWEET_CATEGORIES } from '@/types/sweet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Package, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SweetFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  quantity: string;
  image_url: string;
}

const initialFormData: SweetFormData = {
  name: '',
  category: '',
  description: '',
  price: '',
  quantity: '0',
  image_url: '',
};

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: sweets, isLoading } = useSweets();
  const createMutation = useCreateSweet();
  const updateMutation = useUpdateSweet();
  const deleteMutation = useDeleteSweet();
  const restockMutation = useRestockSweet();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [formData, setFormData] = useState<SweetFormData>(initialFormData);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleOpenCreate = () => {
    setEditingSweet(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      description: sweet.description || '',
      price: String(sweet.price),
      quantity: String(sweet.quantity),
      image_url: sweet.image_url || '',
    });
    setIsFormOpen(true);
  };

  const handleOpenRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockQuantity('');
    setIsRestockOpen(true);
  };

  const handleOpenDelete = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setIsDeleteOpen(true);
  };

  const handleSubmitForm = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const sweetData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      // Note: description and image_url are stored locally but not sent to backend yet
      description: formData.description || null,
      image_url: formData.image_url || null,
    };

    if (editingSweet) {
      updateMutation.mutate(
        { id: editingSweet.id, ...sweetData },
        { onSuccess: () => setIsFormOpen(false) }
      );
    } else {
      createMutation.mutate(sweetData, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleRestock = () => {
    if (!selectedSweet || !restockQuantity) return;
    
    const quantity = parseInt(restockQuantity);
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    restockMutation.mutate(
      { sweetId: selectedSweet.id, quantity },
      { onSuccess: () => setIsRestockOpen(false) }
    );
  };

  const handleDelete = () => {
    if (!selectedSweet) return;
    
    deleteMutation.mutate(selectedSweet.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to shop
            </Link>
            <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your sweet inventory</p>
          </div>
          <Button variant="candy" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Add Sweet
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sweets Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sweets && sweets.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sweets.map((sweet) => (
                      <TableRow key={sweet.id}>
                        <TableCell className="font-medium">{sweet.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sweet.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(sweet.price).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={sweet.quantity === 0 ? 'destructive' : 'outline'}
                          >
                            {sweet.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenRestock(sweet)}
                              title="Restock"
                            >
                              <Package className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(sweet)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDelete(sweet)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No sweets in inventory. Add your first sweet!
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </DialogTitle>
            <DialogDescription>
              {editingSweet ? 'Update the sweet details below.' : 'Fill in the details for your new sweet.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chocolate Truffles"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SWEET_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your sweet..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="9.99"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="candy" 
              onClick={handleSubmitForm}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? 'Saving...' 
                : editingSweet ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Restock {selectedSweet?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedSweet?.quantity} units
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="restock-quantity">Add Quantity</Label>
            <Input
              id="restock-quantity"
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Enter quantity to add"
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="mint" 
              onClick={handleRestock}
              disabled={restockMutation.isPending}
            >
              <Package className="w-4 h-4" />
              {restockMutation.isPending ? 'Restocking...' : 'Restock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Sweet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSweet?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
