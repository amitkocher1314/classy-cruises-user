import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchUserCart = async () => {
      const userId = localStorage.getItem('userId'); 
      try {
        const response = await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/reservations/${userId}.json`);
        const data = await response.json();

        if (data) {
          setCartItems(Object.entries(data).map(([key, value]) => ({ ...value, id: key })));
        }
      } catch (error) {
        alert('Error fetching cart data:', error);
      }
    };

    fetchUserCart();
  }, []);

  const handleRemoveItem = async (id) => {
    const userId = localStorage.getItem('userId');
    try {
      await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/reservations/${userId}/${id}.json`, {
        method: 'DELETE',
      });
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      alert('Error removing item from cart:', error);
    }
  };

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold mb-2">{item.placeName}</h3>
          <p className="mb-2">Check-in Date: {item.checkInDate}</p>
          <p className="mb-2">Check-out Date: {item.checkOutDate}</p>
          <p className="mb-2">Total Price: ₹{item.totalPrice}</p>
          <p className="mb-2">Status: {item.status}</p>
          <img src={item.imageUrls} alt={item.placeName} className="w-full h-48 object-cover rounded-md" />
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mt-4"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
