import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/reservations/${userId}.json`);
        const data = await response.json();

        if (data) {
          const ordersArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setOrderHistory(ordersArray);
        }
      } catch (error) {
        console.error('Failed to fetch order history:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Order History</h2>
      {orderHistory.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        orderHistory.map((order, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold mb-2">{order.placeName}</h3>
            <p className="mb-2">Check-in Date: {order.checkInDate}</p>
            <p className="mb-2">Check-out Date: {order.checkOutDate}</p>
            <p className="mb-2">Total Price: ₹{order.totalPrice}</p>
            <p className="mb-2">Status: {order.status}</p>
            <img src={order.imageUrls ? order.imageUrls.split(',')[0].trim() : ''} alt={order.placeName} className="w-full h-48 object-cover rounded-md" />
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
