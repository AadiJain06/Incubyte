import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sweet } from '@/types/sweet';
import { toast } from 'sonner';

export function useSweets(searchQuery?: string, categoryFilter?: string, priceRange?: { min: number; max: number }) {
  return useQuery({
    queryKey: ['sweets', searchQuery, categoryFilter, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('sweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (priceRange) {
        query = query.gte('price', priceRange.min).lte('price', priceRange.max);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Sweet[];
    },
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sweets')
        .insert([sweet])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet added successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add sweet: ${error.message}`);
    },
  });
}

export function useUpdateSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sweet> & { id: string }) => {
      const { data, error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update sweet: ${error.message}`);
    },
  });
}

export function useDeleteSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Sweet deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sweet: ${error.message}`);
    },
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity, userId }: { sweetId: string; quantity: number; userId: string }) => {
      // First get the sweet to check stock and price
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', sweetId)
        .single();

      if (fetchError) throw fetchError;
      if (!sweet) throw new Error('Sweet not found');
      if (sweet.quantity < quantity) throw new Error('Not enough stock');

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert([{
          user_id: userId,
          sweet_id: sweetId,
          quantity,
          total_price: Number(sweet.price) * quantity,
        }]);

      if (purchaseError) throw purchaseError;

      // Update stock
      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity - quantity })
        .eq('id', sweetId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Purchase successful!');
    },
    onError: (error: Error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('quantity')
        .eq('id', sweetId)
        .single();

      if (fetchError) throw fetchError;
      if (!sweet) throw new Error('Sweet not found');

      const { error } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity + quantity })
        .eq('id', sweetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Stock updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Restock failed: ${error.message}`);
    },
  });
}
