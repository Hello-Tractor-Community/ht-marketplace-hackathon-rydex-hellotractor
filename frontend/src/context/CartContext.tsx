import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "../api/product/getProducts";
import { toast } from "../utils/toast";
import { Button } from "@mui/material";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartContextType = {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  itemCount: number;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  itemCount: 0,
});

type Props = {
  children: ReactNode | ReactNode[];
};
const CartProvider: FC<Props> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cartItems.find(
      (item) => item.product.id === product.id
    );
    let newCartItems: CartItem[] = [];

    if (existingProduct) {
      newCartItems = cartItems
        .map((item) => {
          if (item.product.id === product.id) {
            const newQuantity = item.quantity + quantity;
            if (newQuantity <= 0) {
              toast({
                message: "Item removed from cart",
                severity: "info",
                action: (
                  <Button
                    onClick={() => addToCart(product, 0)}
                    size="small"
                    color="info"
                  >
                    Undo
                  </Button>
                ),
              });
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      setCartItems(newCartItems);
    } else {
      newCartItems = [...cartItems, { product, quantity }];
      setCartItems(newCartItems);
    }
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  const removeFromCart = (productId: number) => {
    const newCartItems = cartItems.filter(
      (item) => item.product.id !== productId
    );
    setCartItems(newCartItems);
    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  };

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
