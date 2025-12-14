import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SWEET_CATEGORIES } from '@/types/sweet';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: SearchFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([priceRange.min, priceRange.max]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
  };

  const applyPriceFilter = () => {
    onPriceRangeChange({ min: localPriceRange[0], max: localPriceRange[1] });
    setIsFiltersOpen(false);
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onPriceRangeChange({ min: 0, max: 100 });
    setLocalPriceRange([0, 100]);
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || priceRange.min > 0 || priceRange.max < 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => onSearchChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Sweets</SheetTitle>
              <SheetDescription>
                Narrow down your sweet selection
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Price Range</Label>
                <div className="pt-4">
                  <Slider
                    value={localPriceRange}
                    onValueChange={handlePriceChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${localPriceRange[0]}</span>
                    <span>${localPriceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button variant="candy" onClick={applyPriceFilter} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="rounded-full"
        >
          All
        </Button>
        {SWEET_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
