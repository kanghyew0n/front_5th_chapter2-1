import { CartItem, Product } from '../../types';

export interface CartContextType {
    cartItems: CartItem[];
    addCartItem: (item: Product['id']) => void;
    pushCartItems: (item: Product['id']) => void;
}
