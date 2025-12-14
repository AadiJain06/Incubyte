import { Sweet } from '@/types/sweet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSweetImage } from '@/lib/sweetImages';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
  isAuthenticated: boolean;
}

const categoryColors: Record<string, string> = {
  Chocolates: 'bg-candy-chocolate text-primary-foreground',
  Gummies: 'bg-candy-coral text-primary-foreground',
  'Hard Candy': 'bg-candy-pink text-primary-foreground',
  Lollipops: 'bg-candy-lemon text-candy-chocolate',
  Caramels: 'bg-candy-caramel text-primary-foreground',
  Mints: 'bg-candy-mint text-candy-chocolate',
  Licorice: 'bg-foreground text-background',
  Other: 'bg-muted text-foreground',
};

export function SweetCard({ sweet, onPurchase, isAuthenticated }: SweetCardProps) {
  const isOutOfStock = sweet.quantity === 0;
  const imageUrl = getSweetImage(sweet.name, sweet.category, sweet.image_url);

  return (
    <Card className={cn(
      "group overflow-hidden animate-fade-in",
      isOutOfStock && "opacity-75"
    )}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={sweet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gradient-cream">
            <Sparkles className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        <Badge 
          className={cn(
            "absolute top-3 left-3 rounded-lg font-body",
            categoryColors[sweet.category] || categoryColors.Other
          )}
        >
          {sweet.category}
        </Badge>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2 rounded-xl">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold truncate">{sweet.name}</h3>
        {sweet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-display font-bold text-primary">
            ${Number(sweet.price).toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="w-4 h-4" />
            <span className="text-sm font-body">{sweet.quantity} left</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="candy"
          size="lg"
          className="w-full"
          onClick={() => onPurchase(sweet)}
          disabled={isOutOfStock || !isAuthenticated}
        >
          <ShoppingBag className="w-4 h-4" />
          {!isAuthenticated ? 'Sign in to buy' : isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
}
