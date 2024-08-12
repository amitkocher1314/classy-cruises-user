import React, { useState } from 'react';

const TravelersModal = ({ isOpen, onClose, onSave }) => {
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]); // Default to 1 adult per room

  const addRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0 }]);
  };

  const updateTraveler = (index, type, value) => {
    const newRooms = [...rooms];
    newRooms[index][type] = Math.min(value, type === 'adults' ? 2 : 2); // Limit to 2 adults and 2 children per room
    setRooms(newRooms);
  };

  const handleSave = () => {
    onSave(rooms);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Select Travelers</h2>
        {rooms.map((room, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl mb-2">Room {index + 1}</h3>
            <div className="flex space-x-4">
              <div>
                <label htmlFor={`adults-${index}`} className="block mb-1">Adults</label>
                <input
                  id={`adults-${index}`}
                  type="number"
                  value={room.adults}
                  onChange={(e) => updateTraveler(index, 'adults', e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4"
                  min="1"
                  max="2"
                />
              </div>
              <div>
                <label htmlFor={`children-${index}`} className="block mb-1">Children</label>
                <input
                  id={`children-${index}`}
                  type="number"
                  value={room.children}
                  onChange={(e) => updateTraveler(index, 'children', e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4"
                  min="0"
                  max="2"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addRoom}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mb-4"
        >
          Add Another Room
        </button>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelersModal;
