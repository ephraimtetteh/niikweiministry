// Cart state will be stored in localStorage to persist between page refreshes
const CART_STORAGE_KEY = 'shopping_cart';

// Initialize cart from localStorage or create empty cart
export const initializeCart = () => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to localStorage
const saveCart = (cart) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
};

// Add item to cart
export const addToCart = (item, quantity = 1) => {
    const cart = initializeCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
        // Item exists, update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            ...item,
            quantity
        });
    }

    saveCart(cart);
    return cart;
};

// Remove item from cart
export const removeFromCart = (itemId) => {
    const cart = initializeCart();
    const updatedCart = cart.filter((item) => item.id !== itemId);
    saveCart(updatedCart);
    return updatedCart;
};

// Update item quantity
export const updateQuantity = (itemId, quantity) => {
    const cart = initializeCart();
    const updatedCart = cart.map((item) => {
        if (item.id === itemId) {
            return {
                ...item,
                quantity: Math.max(0, quantity) // Ensure quantity is not negative
            };
        }
        return item;
    }).filter((item) => item.quantity > 0); // Remove items with 0 quantity

    saveCart(updatedCart);
    return updatedCart;
};

// Calculate cart total
export const calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Clear cart (after successful purchase)
export const clearCart = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
    }
    return [];
};

// Get cart item count
export const getCartItemCount = () => {
    const cart = initializeCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

// Format price to currency string
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

// Check if item is in cart
export const isItemInCart = (itemId) => {
    const cart = initializeCart();
    return cart.some((item) => item.id === itemId);
};

// Get specific item from cart
export const getCartItem = (itemId) => {
    const cart = initializeCart();
    return cart.find((item) => item.id === itemId);
};
