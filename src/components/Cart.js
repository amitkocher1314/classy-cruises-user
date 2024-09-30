import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const [promptShown, setPromptShown] = useState(false); // New state to track if prompt has been shown

  const fetchUserCart = async () => {
    const userId = localStorage.getItem('userId'); 
    try {
      const response = await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/reservations/${userId}.json`);
      const data = await response.json();

      if (data) {
        const items = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
        setCartItems(items);

        // Check for any completed status and show prompt if needed
        if (!promptShown) {
          items.forEach(item => {
            if (item.status === 'completed') {
              setPromptMessage('Your booking is accepted proceed to payment page');
              setShowPrompt(true);
              setPromptShown(true); // Set to true once prompt is shown
            }
          });
        }
      }
    } catch (error) {
      alert('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchUserCart();

    // Set up the interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchUserCart, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [promptShown]); // Add promptShown as a dependency to control when fetchUserCart is run

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

  const handleConfirm = () => {
    setShowPrompt(false);
  };

  const handleCancel = () => {
    setShowPrompt(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 italic';
      case 'rejected':
        return 'text-red-600 italic';
      default:
        return 'text-gray-800';
    }
  };

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold mb-2">{item.placeName}</h3>
          <p className="mb-2">Check-in Date: {item.checkInDate}</p>
          <p className="mb-2">Check-out Date: {item.checkOutDate}</p>
          <p className="mb-2">Total Price: ₹{item.totalPrice}</p>
          <p className={`mb-2 ${getStatusClass(item.status)}`}>Status: {item.status}</p>
          <img src={item.imageUrls} alt={item.placeName} className="w-full h-48 object-cover rounded-md" />
          <button
            onClick={() => handleRemoveItem(item.id)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors mt-4"
          >
            Remove
          </button>
        </div>
      ))}

      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">{promptMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
