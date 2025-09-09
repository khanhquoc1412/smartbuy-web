import { ICart, IUserCarts } from "@/types/cart.types";


interface ICartState {
    carts: ICart[],
    cartLocal: ICart[],
    totalItem: number,
    loadingCart: boolean
}

export default (): ICartState => ({
    carts: [] as ICart[],
    cartLocal: [] as ICart[],
    totalItem: 0,
    loadingCart: false
});
