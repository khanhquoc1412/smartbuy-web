export interface IPayment {
    id?: string | number,
    paymentStatus: IPaymentStatus,
    paymentMethod: IPaymentMethod
}

export interface IPaymentStatus {
    id?: string | number,
    name?: string
}
export interface IPaymentMethod {
    id?: string | number,
    name?: string
}