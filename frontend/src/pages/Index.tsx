import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSweets, usePurchaseSweet } from '@/hooks/useSweets';
import { Header } from '@/components/Header';
import { SearchFilter } from '@/components/SearchFilter';
import { SweetCard } from '@/components/SweetCard';
import { PurchaseDialog } from '@/components/PurchaseDialog';
import { Sweet } from '@/types/sweet';
import { Candy, Sparkles, Gift, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.png';

export default function Index() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  const { data: sweets, isLoading } = useSweets(
    searchQuery || undefined,
    categoryFilter,
    priceRange
  );

  const purchaseMutation = usePurchaseSweet();

  const handlePurchase = (sweet: Sweet) => {
    setSelectedSweet(sweet);
  };

  const confirmPurchase = (quantity: number) => {
    if (selectedSweet && user) {
      purchaseMutation.mutate(
        { sweetId: selectedSweet.id, quantity, userId: user.id },
        { 
          onSuccess: () => {
            setSelectedSweet(null);
          },
          onError: () => {
            // Error is handled by the mutation
          }
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with Image */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroBanner} 
              alt="Sweet Shop Interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          </div>
          
          <div className="relative container py-16 md:py-24 space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground shadow-candy animate-float">
              <Sparkles className="w-4 h-4" />
              <span className="font-body text-sm font-medium">Fresh sweets daily</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
              Welcome to <span className="text-gradient-candy">Sweet Shop</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto font-body drop-shadow">
              Discover our delightful collection of handcrafted candies, chocolates, and treats.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 shadow-soft backdrop-blur-sm">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-body text-sm font-medium">Free gift wrapping</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 shadow-soft backdrop-blur-sm">
                <Heart className="w-5 h-5 text-candy-coral" />
                <span className="font-body text-sm font-medium">Made with love</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 shadow-soft backdrop-blur-sm">
                <Candy className="w-5 h-5 text-candy-mint" />
                <span className="font-body text-sm font-medium">100+ varieties</span>
              </div>
            </div>

            {!user && (
              <div className="pt-4">
                <Button variant="candy" size="xl" asChild className="shadow-lifted">
                  <Link to="/auth">
                    <Sparkles className="w-5 h-5" />
                    Start Shopping
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="container py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Our Sweet Collection</h2>
            <p className="text-muted-foreground font-body">Find your perfect treat from our handpicked selection</p>
          </div>

          {/* Search & Filter */}
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          {/* Sweets Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : sweets && sweets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet, index) => (
                <div key={sweet.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <SweetCard
                    sweet={sweet}
                    onPurchase={handlePurchase}
                    isAuthenticated={!!user}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Candy className="w-16 h-16 mx-auto text-muted-foreground/50" />
              <h3 className="font-display text-xl font-semibold">No sweets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </section>
      </main>

      <PurchaseDialog
        sweet={selectedSweet}
        isOpen={!!selectedSweet}
        onClose={() => setSelectedSweet(null)}
        onConfirm={confirmPurchase}
        isLoading={purchaseMutation.isPending}
      />
    </div>
  );
}
