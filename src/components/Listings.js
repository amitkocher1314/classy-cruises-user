import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const Listings = () => {
  const [listings, setListings] = useState([]);      //all data
  const [filteredListings, setFilteredListings] = useState([]);  //data to display
  const [placeFilter, setPlaceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const location = useLocation();
  const history = useHistory();

  const getQueryParams = () => {
    return new URLSearchParams(location.search);    //web API to access url part after ? see my page category=Hotels (read this on web query parameter in url vs dynamic route)
  };

  //fetch all listing in firebase stored
    const fetchListings = async () => {
      try {
        const response = await fetch('https://travel-project-auth-e9607-default-rtdb.firebaseio.com/listings.json');
        const data = await response.json();
        if (data) { 
          setListings(Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })));
        }
      } catch (error) {
        alert('Error fetching listings:', error);
      }
    };
    
    useEffect(() => {
    fetchListings();
  }, []);

  // to fetch data every 10 second
  useEffect(() => {
    const interval = setInterval(fetchListings, 10000);
    return () => clearInterval(interval); // Clean up on unmount
  }, []);
 // this use effect has all dependency placename, sort,location.search so any change in input trigger useeffect and page re render showing filter results
  useEffect(() => {
    const queryParams = getQueryParams();
    const category = queryParams.get('category');    //see my page url how category get urlSearchParams to access  part of url
    let filtered = [...listings];
//first we access all listing from database and then on basis of category show in our page
    if (category) {
      filtered = filtered.filter(listing => listing.category === category);
    }

    if (placeFilter) {
      filtered = filtered.filter(listing => listing.placeName.toLowerCase().includes(placeFilter.toLowerCase()));
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    setFilteredListings(filtered);
  }, [listings, placeFilter, sortOrder, location.search]);
  
  // setting dynamic route for particular listing id
  const handleListingClick = (id, available) => {
    //in db it contain true and false format
    if (available) {
      history.push(`/listings/${id}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Filter by place"
          value={placeFilter}
          onChange={(e) => setPlaceFilter(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4"
        >
          <option value="default">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <ul className="space-y-6">
        {filteredListings.map(listing => (
          <li
            key={listing.id}
            className={`flex bg-white p-2 rounded-lg shadow hover:shadow-lg transition-shadow relative ${listing.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            onClick={() => handleListingClick(listing.id, listing.available)}
          >
            <div className="w-1/3">
              <img
                src={listing.imageUrls}
                alt={listing.placeName}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="w-2/3 pl-4 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{listing.placeName}</h3>
                <p className="text-gray-700 mb-2">{listing.address}</p>
                {listing.available ? (
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-gray-500 line-through">₹{listing.pricePerNight}</p>
                      <p className="text-2xl font-bold text-gray-800">₹{(listing.pricePerNight * 0.9).toFixed(2)}</p>
                      <p className="text-gray-500">
                        ₹{((listing.pricePerNight * 0.9) * 1.18).toFixed(2)} total includes taxes & fees
                        <span className="block text-xs text-gray-500">(18% GST applied)</span>
                      </p>
                    </div>
                    <div className="text-green-600 font-bold">10% off</div>
                  </div>
                ) : (
                  <div className="text-red-500 font-bold">Currently not available</div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listings;
