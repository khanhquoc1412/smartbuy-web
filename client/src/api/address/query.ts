import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import {
  getAddresses,
  getAddress,
  getDefaultAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from './address';
import type { IAddressPayload } from '@/types/address.type';

/**
 * Query Keys
 */
export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
  list: () => [...addressKeys.lists()] as const,
  details: () => [...addressKeys.all, 'detail'] as const,
  detail: (id: string) => [...addressKeys.details(), id] as const,
  default: () => [...addressKeys.all, 'default'] as const,
};

/**
 * Query: Get all addresses
 */
export const useAddressesQuery = () => {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: () => getAddresses(),
    select: (response) => ({
      addresses: response.data.addresses,
      total: response.data.total,
    }),
  });
};

/**
 * Query: Get single address
 */
export const useAddressQuery = (addressId: MaybeRefOrGetter<string>) => {
  return useQuery({
    queryKey: addressKeys.detail(toValue(addressId)),
    queryFn: () => getAddress(toValue(addressId)),
    select: (response) => response.data.address,
    enabled: () => !!toValue(addressId),
  });
};

/**
 * Query: Get default address
 */
// export const useDefaultAddressQuery = () => {
//   return useQuery({
//     queryKey: addressKeys.default(),
//     queryFn: () => getDefaultAddress(),
//     select: (response) => response.data.address,
//   });
// };
export const useDefaultAddressQuery = () => {
  return useQuery({
    queryKey: addressKeys.default(),
    queryFn: () => getDefaultAddress(),
    select: (res) => {
      // res có thể là axios response, hoặc res.data, hoặc { address: ... }
      const body = res?.data ?? res;
      // nếu backend trả { success, data: { address } } hoặc { address } hoặc trực tiếp address
      return body?.data?.address ?? body?.address ?? body ?? null;
    },
    // optional: không cache lâu để test
    staleTime: 0,
  });
};

/**
 * Mutation: Add address
 */
export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IAddressPayload) => addAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

/**
 * Mutation: Update address
 */
export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IAddressPayload> }) =>
      updateAddress(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.detail(variables.id) });
    },
  });
};

/**
 * Mutation: Delete address
 */
export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
};

/**
 * Mutation: Set default address
 */
export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.default() });
    },
  });
};