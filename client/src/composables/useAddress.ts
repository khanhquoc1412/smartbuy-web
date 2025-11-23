
import { computed, ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { 
  getAddresses as getAddressesAPI, 
  addAddress as addAddressAPI, 
  updateAddress as updateAddressAPI,
  deleteAddress as deleteAddressAPI,
  setDefaultAddress as setDefaultAddressAPI,
  getDefaultAddress as getDefaultAddressAPI
} from '@/api/address/address';
import type { IAddressPayload } from '@/types/address.type';

export const useAddress = () => {
  const queryClient = useQueryClient();

  // Loading states
  const isAdding = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const isSettingDefault = ref(false);

  // --- QUERIES ---
  const { 
    data: addressesData, 
    isLoading: isLoadingAddresses, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      console.log('🔵 [Query] Fetching addresses...');
      const result = await getAddressesAPI();
      console.log('📦 [Query] Result:', result);
      console.log('  result:', result);
      console.log('  result.addresses:', result?.addresses);  // ✅ FIX: Trực tiếp lấy addresses
      console.log('  result.total:', result?.total);
      return result;
    },
    staleTime: 0,
    gcTime: 0,
  });

  // ✅ FIX: Lấy trực tiếp từ addressesData.value.addresses
  const addresses = computed(() => {
    console.log('🔄 [Computed] Running...');
    console.log('  addressesData.value:', addressesData.value);
    
    // ✅ FIX: Backend trả về {addresses: [...], total: 3}
    const result = addressesData.value?.addresses || [];
    console.log('  ✅ Final addresses:', result);
    console.log('  Count:', result.length);
    
    return result;
  });

  const addressCount = computed(() => addresses.value.length);

  const { data: defaultAddressData, refetch: refetchDefault } = useQuery({
    queryKey: ['defaultAddress'],
    queryFn: async () => {
      console.log('🔵 [Query] Fetching default address...');
      const result = await getDefaultAddressAPI();
      console.log('📦 [Query] Default address result:', result);
      return result;
    },
    staleTime: 0,
    gcTime: 0,
  });

  // ✅ FIX: Lấy trực tiếp từ defaultAddressData.value.address
  const defaultAddress = computed(() => {
    return defaultAddressData.value?.address || null;
  });

  // --- FUNCTIONS ---

  const addAddress = async (payload: IAddressPayload) => {
    console.log('📞 [addAddress] Called');
    
    if (!payload) {
      throw new Error('Payload is null!');
    }

    try {
      isAdding.value = true;
      
      console.log('  Calling API...');
      const result = await addAddressAPI(payload);
      console.log('  ✅ API success:', result);
      
      console.log('  Invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      await queryClient.invalidateQueries({ queryKey: ['defaultAddress'] });
      
      console.log('  ✅ Invalidate complete!');
      console.log('  Current addresses:', addresses.value);
      console.log('  Count:', addressCount.value);
      
      return result;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      isAdding.value = false;
    }
  };

  const updateAddress = async (id: string, payload: Partial<IAddressPayload>) => {
    console.log('📞 [updateAddress] Called');
    
    try {
      isUpdating.value = true;
      
      const result = await updateAddressAPI(id, payload);
      console.log('✅ API success:', result);
      
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      await queryClient.invalidateQueries({ queryKey: ['defaultAddress'] });
      
      return result;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      isUpdating.value = false;
    }
  };

  const deleteAddress = async (id: string) => {
    console.log('📞 [deleteAddress] Called');
    
    try {
      isDeleting.value = true;
      
      const result = await deleteAddressAPI(id);
      console.log('✅ API success:', result);
      
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      await queryClient.invalidateQueries({ queryKey: ['defaultAddress'] });
      
      return result;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      isDeleting.value = false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    console.log('📞 [setDefaultAddress] Called');
    
    try {
      isSettingDefault.value = true;
      
      const result = await setDefaultAddressAPI(id);
      console.log('✅ API success:', result);
      
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      await queryClient.invalidateQueries({ queryKey: ['defaultAddress'] });
      
      return result;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      isSettingDefault.value = false;
    }
  };

  return {
    // Data
    addresses,
    addressCount,
    defaultAddress,
    isLoadingAddresses,
    error,
    
    // Functions
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Loading states
    isAdding: computed(() => isAdding.value),
    isUpdating: computed(() => isUpdating.value),
    isDeleting: computed(() => isDeleting.value),
    isSettingDefault: computed(() => isSettingDefault.value),
    
    // Methods
    refetch,
  };
};