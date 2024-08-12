import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TravelersModal from './TravelersModal';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/listings/${id}.json`);
        const data = await response.json();
        setListing(data);
      } catch (error) {
        alert('Error fetching listing:', error);
      }
    };

    fetchListing();

    const today = new Date().toISOString().split('T')[0];
    setCheckInDate(today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckOutDate(tomorrow.toISOString().split('T')[0]);
  }, [id]);

  const storeReservationInDatabase = async (reservation) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`https://travel-project-auth-e9607-default-rtdb.firebaseio.com/reservations/${userId}.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });
      const data = await response.json();
      console.log('Reservation stored successfully:', data);
    } catch (error) {
      alert('Error storing reservation:', error);
    }
  };

  const handleReserve = () => {
    const totalDays = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalRooms = rooms.length;
    const basePrice = totalDays * totalRooms * listing.pricePerNight;
    const gst = basePrice * 0.18;
    const discount = basePrice * 0.10;
    const totalPrice = basePrice + gst - discount;

    const reservation = {
      placeName: listing.placeName,
      checkInDate,
      checkOutDate,
      rooms,
      userAddress,
      pricePerNight: listing.pricePerNight,
      totalPrice,
      status: 'pending',
      imageUrls: listing.imageUrls,
      propertyName: listing.propertyName,
      address: listing.address,
      city: listing.city,
    };

    // Store reservation in the database
    storeReservationInDatabase(reservation);

    // Optionally, you could also update the local state or navigate to a different page after reservation
  };

  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);

    const newCheckOutDate = new Date(newCheckInDate);
    newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
    setCheckOutDate(newCheckOutDate.toISOString().split('T')[0]);
  };

  const handleSaveTravelers = (rooms) => {
    setRooms(rooms);
  };

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={listing.imageUrls}
            alt={listing.placeName}
            className="w-full h-96 object-cover"
          />
          <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-3xl font-bold">{listing.propertyName}</h2>
            <p className="text-xl">{listing.placeName}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">{listing.address}</p>
          <p className="text-gray-700 mb-4">{listing.city}</p>
          <p className="text-gray-700 mb-4 italic">₹{listing.pricePerNight} per day</p>
          <p className="text-gray-700 mb-4">Highlights: Close to selfie point</p>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Popular amenities</h3>
            <div className="flex space-x-4">
              <span className="flex items-center">Pet-friendly</span>
              <span className="flex items-center">Bar</span>
              <span className="flex items-center">Spa</span>
              <span className="flex items-center">Pool</span>
              <span className="flex items-center">Breakfast included</span>
              <span className="flex items-center">Room service</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Check-in and check-out date</h3>
            <div className="flex space-x-4">
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={handleCheckInDateChange}
                className="border border-gray-300 rounded-md py-2 px-4 mb-4"
              />
              <input
                type="date"
                id="checkOutDate"
                value={checkOutDate}
                min={new Date(checkInDate).toISOString().split('T')[0]}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 mb-4"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700 mb-2 block" htmlFor="userAddress">User Address</label>
              <input
                type="text"
                id="userAddress"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 mb-4 w-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Rooms:</h3>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-800 mb-2 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Choose Rooms
              </button>
              <TravelersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTravelers}
              />
            </div>
            <button
              onClick={handleReserve}
              className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
