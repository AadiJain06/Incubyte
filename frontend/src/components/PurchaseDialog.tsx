import { useState } from 'react';
import { Sweet } from '@/types/sweet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

interface PurchaseDialogProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  isLoading: boolean;
}

export function PurchaseDialog({ sweet, isOpen, onClose, onConfirm, isLoading }: PurchaseDialogProps) {
  const [quantity, setQuantity] = useState(1);

  if (!sweet) return null;

  const maxQuantity = sweet.quantity;
  const totalPrice = Number(sweet.price) * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Purchase {sweet.name}</DialogTitle>
          <DialogDescription>
            ${Number(sweet.price).toFixed(2)} each · {sweet.quantity} in stock
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
                min={1}
                max={maxQuantity}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-display font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="candy" onClick={handleConfirm} disabled={isLoading}>
            <ShoppingBag className="w-4 h-4" />
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
