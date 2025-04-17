import { products } from '../constants';
import { useCartContext } from '../context/cart/CartContext';
import CartItem from './CartItem';

const CartItemList = () => {
    const { cartItems } = useCartContext();

    return (
        <div>
            {cartItems.map((item) => {
                const product = products.filter((product) => product.id === item.productId)[0];
                return <CartItem key={product.id} {...product} />;
            })}
        </div>
    );
};

export default CartItemList;
