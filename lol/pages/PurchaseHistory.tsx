import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, Calendar, Loader2, Receipt } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface PurchaseWithSweet {
  id: string;
  quantity: number;
  total_price: number;
  created_at: string;
  sweet: {
    name: string;
    category: string;
    image_url: string | null;
  } | null;
}

export default function PurchaseHistory() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          quantity,
          total_price,
          created_at,
          sweet:sweets(name, category, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurchaseWithSweet[];
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const totalSpent = purchases?.reduce((sum, p) => sum + Number(p.total_price), 0) || 0;
  const totalItems = purchases?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-6">
        <div className="space-y-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to shop
          </Link>
          <h1 className="font-display text-3xl font-bold">Purchase History</h1>
          <p className="text-muted-foreground">View your past sweet purchases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-candy flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-display font-bold">{purchases?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-mint flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-candy-chocolate" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items Purchased</p>
                  <p className="text-2xl font-display font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-caramel flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">$</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-display font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase List */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : purchases && purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div 
                    key={purchase.id}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-card hover:shadow-soft transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      {purchase.sweet?.image_url ? (
                        <img 
                          src={purchase.sweet.image_url} 
                          alt={purchase.sweet?.name || 'Sweet'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full gradient-cream flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-primary/30" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold truncate">
                        {purchase.sweet?.name || 'Unknown Sweet'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {purchase.sweet?.category || 'N/A'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          × {purchase.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-primary">
                        ${Number(purchase.total_price).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(purchase.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="font-display text-xl font-semibold">No purchases yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Start shopping to see your purchase history!
                  </p>
                </div>
                <Button variant="candy" asChild>
                  <Link to="/">Browse Sweets</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
