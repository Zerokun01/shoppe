// src/reducer/cartReducer.js

// Load cart from localStorage or use empty cart as fallback
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('carcedo-shoppe-cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return { items: [] };
};

// Save cart to localStorage
const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem('carcedo-shoppe-cart', JSON.stringify(cartState));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const initialState = loadCartFromStorage();

export function cartReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case "ADD":
    case "ADD_TO_CART":
      const product = action.payload;
      const exist = state.items.find(item => item.id === product.id);
      if (exist) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...product, qty: 1 }],
        };
      }
      break;
    case "INCREASE_QTY":
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, qty: item.qty + 1 } : item
        ),
      };
      break;
    case "DECREASE_QTY":
      newState = {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.id ? { ...item, qty: item.qty - 1 } : item
          )
          .filter(item => item.qty > 0),
      };
      break;
    case "REMOVE_FROM_CART":
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
      break;
    case "CLEAR_CART":
      newState = { items: [] };
      break;
    default:
      newState = state;
  }
  
  // Save to localStorage whenever state changes
  if (newState !== state) {
    saveCartToStorage(newState);
  }
  
  return newState;
}