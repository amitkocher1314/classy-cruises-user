import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const searchQuery = useSelector((state) => state.search.query);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://travel-project-auth-e9607-default-rtdb.firebaseio.com/categories.json');
        const data = await response.json();
       // console.log(data)
        if (data) {
          setCategories(Object.values(data));
        }
      } catch (error) {
        alert('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    history.push(`/listings?category=${category.name}`);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <img src={category.imageUrl} alt={category.name} className="w-full h-40 object-cover rounded-md mb-4" />
            <span className="text-xl text-gray-700">{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
