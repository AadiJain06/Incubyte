import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, Loader2, Receipt } from 'lucide-react';

export default function PurchaseHistory() {
  const { user, isLoading: authLoading } = useAuth();

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

  // TODO: Implement purchase history when backend endpoint is available
  const purchases: any[] = [];

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
                  <span className="text-xl font-bold text-primary-foreground">₹</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-display font-bold">₹{totalSpent.toFixed(2)}</p>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
