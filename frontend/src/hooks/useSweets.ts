import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsAPI } from '@/services/api';
import { Sweet } from '@/types/sweet';
import { toast } from 'sonner';

export function useSweets(searchQuery?: string, categoryFilter?: string, priceRange?: { min: number; max: number }) {
  return useQuery({
    queryKey: ['sweets', searchQuery, categoryFilter, priceRange],
    queryFn: async () => {
      const params: { name?: string; category?: string; minPrice?: string; maxPrice?: string } = {};
      
      if (searchQuery) {
        params.name = searchQuery;
      }
      
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      if (priceRange) {
        params.minPrice = priceRange.min.toString();
        params.maxPrice = priceRange.max.toString();
      }

      // If we have any filters, use search endpoint, otherwise use getAll
      const hasFilters = Object.keys(params).length > 0;
      const data = hasFilters 
        ? await sweetsAPI.search(params)
        : await sweetsAPI.getAll();
      
      return data as Sweet[];
    },
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
      return await sweetsAPI.create({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add sweet: ${error.response?.data?.error || error.message}`);
    },
  });
}

export function useUpdateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sweet> & { id: string }) => {
      return await sweetsAPI.update(id, {
        name: updates.name,
        category: updates.category,
        price: updates.price,
        quantity: updates.quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update sweet: ${error.response?.data?.error || error.message}`);
    },
  });
}

export function useDeleteSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sweetsAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete sweet: ${error.response?.data?.error || error.message}`);
    },
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity, userId }: { sweetId: string; quantity: number; userId: string }) => {
      return await sweetsAPI.purchase(sweetId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Purchase successful!');
    },
    onError: (error: any) => {
      toast.error(`Purchase failed: ${error.response?.data?.error || error.message}`);
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      return await sweetsAPI.restock(sweetId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Stock updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Restock failed: ${error.response?.data?.error || error.message}`);
    },
  });
}
