import { userAxios } from '@/plugins/axios/axios';
import type { IAddressPayload } from '@/types/address.type';

// GET /api/user/addresses
export const getAddresses = async () => {
  const response = await userAxios.get('/user/addresses');
  return response.data;
};

// GET /api/user/addresses/:id
export const getAddress = async (id: string) => {
  const response = await userAxios.get(`/user/addresses/${id}`);
  return response.data;
};

// GET /api/user/addresses/default
export const getDefaultAddress = async () => {
  // Bypass potential proxy/browser caching by sending no-cache header
  // and a timestamp query param to ensure we get fresh data (avoid 304 responses)
  const response = await userAxios.get('/user/addresses/default', {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    params: {
      _ts: Date.now(),
    },
  });

  return response.data;
};

// POST /api/user/addresses
export const addAddress = async (payload: IAddressPayload) => {
  // Nếu payload vẫn null thì báo lỗi để debug
  if (!payload) {
    console.error('❌ [API Error] Payload is MISSING inside API call');
    throw new Error('Payload is missing');
  }
  
  const response = await userAxios.post('/user/addresses', payload);
  return response.data;
};

// PUT /api/user/addresses/:id
export const updateAddress = async (id: string, payload: Partial<IAddressPayload>) => {
  console.log('🚀 [API] updateAddress executing:', { id, payload });
  const response = await userAxios.put(`/user/addresses/${id}`, payload);
  return response.data;
};

// DELETE /api/user/addresses/:id
export const deleteAddress = async (id: string) => {
  const response = await userAxios.delete(`/user/addresses/${id}`);
  return response.data;
};

// PATCH /api/user/addresses/:id/default
export const setDefaultAddress = async (id: string) => {
  const response = await userAxios.patch(`/user/addresses/${id}/default`);
  return response.data;
};