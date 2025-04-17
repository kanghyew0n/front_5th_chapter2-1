import { CartItem, Product } from '../../types';

export interface CartContextType {
    cartItems: CartItem[];
    addNewCartItem: (item: Product['id']) => void;
    increaseItemQuantity: (item: Product['id']) => void;
}
