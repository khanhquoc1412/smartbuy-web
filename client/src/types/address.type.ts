export interface IAddress {
    id?: string | number
    province: string,
    district: string,
    ward: string,
    houseNumber: string
}
export interface IAddressForm {
    province?: IProvince | null,
    district?: IDistrict | null,
    ward?: IWard | null,
    houseNumber?: string | null
}
export interface IProvince {
    province_id: string | number,
    province_name: string,
    province_type: string
}
export interface IDistrict {
    district_id: string | number,
    district_name: string,
}
export interface IWard {
    ward_id: string | number,
    ward_name: string,
}