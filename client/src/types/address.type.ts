// ✅ API Response Types (từ backend)
export interface IAddress {
  _id: string;
  userId: string;
  label: string; // 'Nhà riêng', 'Văn phòng', 'Khác'
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string; // Số nhà, tên đường
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ Form Payload (gửi lên backend)
export interface IAddressPayload {
  label?: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault?: boolean;
}

// ✅ Form State (để quản lý form)
export interface IAddressForm {
  label?: string;
  fullName?: string;
  phone?: string;
  province?: IProvince | null;
  district?: IDistrict | null;
  ward?: IWard | null;
  address?: string; // Số nhà, tên đường
  isDefault?: boolean;
}

// ✅ Location Data Types (từ API tỉnh thành)
export interface IProvince {
  province_id: string | number;
  province_name: string;
  province_type: string;
}

export interface IDistrict {
  district_id: string | number;
  district_name: string;
  district_type: string;
}

export interface IWard {
  ward_id: string | number;
  ward_name: string;
  ward_type: string;
}

// ✅ API Response Types
export interface IAddressesResponse {
  success: boolean;
  message: string;
  data: {
    addresses: IAddress[];
    total: number;
  };
}

export interface IAddressResponse {
  success: boolean;
  message: string;
  data: {
    address: IAddress;
  };
}

export interface IDefaultAddressResponse {
  success: boolean;
  message: string;
  data: {
    address: IAddress | null;
  };
}

// ✅ Helper function: Convert form to payload
export const addressFormToPayload = (form: IAddressForm): IAddressPayload => {
  return {
    label: form.label || 'Nhà riêng',
    fullName: form.fullName || '',
    phone: form.phone || '',
    province: form.province?.province_name || '',
    district: form.district?.district_name || '',
    ward: form.ward?.ward_name || '',
    address: form.address || '',
    isDefault: form.isDefault || false,
  };
};

// ✅ Helper function: Convert address to form
export const addressToForm = (address: IAddress): IAddressForm => {
  return {
    label: address.label,
    fullName: address.fullName,
    phone: address.phone,
    province: {
      province_id: '',
      province_name: address.province,
      province_type: '',
    },
    district: {
      district_id: '',
      district_name: address.district,
      district_type: '',
    },
    ward: {
      ward_id: '',
      ward_name: address.ward,
      ward_type: '',
    },
    address: address.address,
    isDefault: address.isDefault,
  };
};

// ✅ Helper function: Format address display
export const formatAddress = (address: IAddress): string => {
  return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
};

// ✅ Helper function: Format full address with name & phone
export const formatFullAddress = (address: IAddress): string => {
  return `${address.fullName} - ${address.phone}\n${formatAddress(address)}`;
};