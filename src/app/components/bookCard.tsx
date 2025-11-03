"use client";

import React, { useState, useMemo } from "react";
import { FaStar, FaRegStar, FaCalendarAlt } from "react-icons/fa";

interface Book {
  id: number;
  book_name: string;
  author: string;
  book_description: string;
  genre: string;
  publication_year: number;
  rating?: number;
}

interface BookCardProps {
  searchTerm: string;
  filterGenre: string;
  books: Book[];
  errors?: string | undefined;
}

const BookCard: React.FC<BookCardProps> = ({ searchTerm, filterGenre, books }) => {
  const [localBooks, setLocalBooks] = useState<Book[]>(books);


  // Memoized Filter Logic (with safe checks)
  const filteredBooks = useMemo(() => {
    return localBooks?.filter((book) => {
      const name = book?.book_name?.toLowerCase() || "";
      const author = book?.author?.toLowerCase() || "";
      const search = searchTerm?.toLowerCase() || "";

      const matchesSearch = name.includes(search) || author.includes(search);
      const matchesGenre = filterGenre === "all" || book?.genre === filterGenre;

      return matchesSearch && matchesGenre;
    });
  }, [searchTerm, filterGenre, localBooks]);

  // Delete book
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/api/books/${id}`, { method: "DELETE" });
      console.log("Delete response:", res);
      if (!res.ok) throw new Error("Failed to delete");

      setLocalBooks((prev) => prev.filter((b) => b.id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error deleting book");
    }
  };
  

  // View details
 
  // Empty State UI
  if (!filteredBooks || filteredBooks.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-gray-500 text-lg mb-4">No books found</p>
        <button
          onClick={() => (window.location.href = "/book/add")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Book
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBooks.map((book) => (
        <div key={book.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{book.book_name}</h3>
          <p className="text-gray-600 mb-3">By {book.author}</p>

          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
            {book.genre}
          </span>
          
          
           <div className="flex items-center gap-1 text-gray-600">
              <FaCalendarAlt className="w-4 h-4" />
              <span className="text-sm font-medium">{book.publication_year}</span>
            </div>
             {book.rating !== undefined && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                <span>⭐</span>
                <span>{book.rating}</span>
              </div>
            )}
            {/* Description */}
          {book.book_description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {book.book_description}
            </p>
          )}
          
          <div className="mt-4 flex gap-2">
            
            <button
              onClick={() => handleDelete(book.id, book.book_name)}
              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;
