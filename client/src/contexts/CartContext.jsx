import React, { useState, useContext, createContext } from 'react';

// Contexto do Carrinho
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (gift) => {
    setCartItems(prev => {
      // Verificar se o item já está no carrinho
      const existingItem = prev.find(item => item.id === gift.id);
      if (existingItem) {
        return prev; // Item já está no carrinho, não adiciona novamente
      }
      return [...prev, { ...gift, quantity: 1 }];
    });
  };
  
  const removeFromCart = (giftId) => {
    setCartItems(prev => prev.filter(item => item.id !== giftId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartCount = () => {
    return cartItems.length;
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook com fallback seguro para evitar erros quando o contexto não está disponível
export const useCart = () => {
  const context = useContext(CartContext);
  
  // Fallback seguro: se o contexto não estiver disponível, retorna um objeto vazio com valores padrão
  if (!context) {
    return {
      cartItems: [],
      addToCart: () => console.warn('CartProvider não encontrado'),
      removeFromCart: () => console.warn('CartProvider não encontrado'),
      clearCart: () => console.warn('CartProvider não encontrado'),
      getCartTotal: () => 0,
      getCartCount: () => 0
    };
  }
  
  return context;
};
