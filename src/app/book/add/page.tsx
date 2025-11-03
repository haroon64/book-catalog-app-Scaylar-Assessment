"use client";

import React, { useState } from 'react';

const genreOptions = [
  "Fiction",
  "Mystery",
  "Biography",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "History",
  "Self-Help",
  "Horror",
  "Classic",
];

const ratingOptions = Array.from({ length: 9 }, (_, i) => (i * 0.5 + 1).toFixed(1)); 
// 1 → 1.5 → 2 → ... → 5

// Generate years (1950 → current year)
const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => 1950 + i).reverse();


function AddBookPage() {
  const [formData, setFormData] = useState({
    book_name: "",
    author: "",
    book_description: "",
    publication_year: "",
    genre: "",
    rating: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.book_name || !formData.author  || !formData.publication_year  || !formData.rating || !formData.genre) {
      alert('Please fill in all fields');
      return;
    }

    // console.log('Book Data:', formData);
    
    // Add your API call here
    // Example:
   
  try {
    console.log('Submitting book1:', formData);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    console.log('Fetch called');
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add book");
    }

    const data = await response.json();
    console.log("Book created:", data);

    alert('Book added successfully!');

    
    // Reset form
    setFormData({
      book_name: '',
      author: '',
      book_description: "",
      publication_year: "",
      genre: '',
      rating: "",
    });
      window.location.href = '/book';
      } catch (error: any) {
    console.error("Error adding book:", error);
    alert(` Error: ${error.message}`);
  }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto ">
           <div className=" bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-1">Quick Tip</h3>
              <p className="text-sm text-blue-700">
                All fields marked with * are required. Make sure to enter accurate information for better organization.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-7 rounded-xl shadow-lg p-8">
   
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Book</h1>
          <p className="text-gray-600">Fill in the details to add a book to your collection</p>
        </div>
            {/* book_name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="book_name"
                value={formData.book_name}
                onChange={handleChange}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter book book_name"
                required
              />
            </div>

            {/* Author Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Genre Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
               Book Description *
              </label>
              <input
                type="text"
                name="book_description"
                value={formData.book_description}
                onChange={handleChange}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="enter 1 line description about the book"
                required
              />
            </div>
               <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publication Year *
              </label>
             <select
          name="publication_year"
          value={formData.publication_year}
          onChange={handleChange}
          className="w-full text-black mb-4 px-4 py-3 border rounded-lg"
          required
        >
          <option value="">Select year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

            </div>
               <div>
              <label className="block  text-black text-sm font-semibold  mb-2">
                Genre *
              </label>
                <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full mb-4 text-black px-4 py-3 border rounded-lg"
          required
        >
          <option value="">Select Genre</option>
          {genreOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

            </div>
             <div>
              <label className="block text-black text-sm font-semibold mb-2">
                rating *
              </label>
             <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full text-black mb-6 px-4 py-3 border rounded-lg"
        >
          <option value="">Select Rating</option>
          {ratingOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Add Book
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
    
      </div>
  
  );
}

export default AddBookPage;