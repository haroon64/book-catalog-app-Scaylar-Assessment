"use client";

import React, { useState, useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";

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
  console.log("Books in BookCard:", books);

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
      console.log("Deleting book with ID:", id);
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
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
  const handleView = (book: Book) => {
    console.log("Viewing book:", book);
    // Navigate to detail page
    // window.location.href = `/book/${book.id}`;
  };

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
        <div 
          key={book.id} 
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col"
        >
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {book.book_name}
          </h3>

          {/* Author */}
          <p className="text-gray-600 text-sm mb-4">
            By <span className="font-medium">{book.author}</span>
          </p>

          {/* Badges Row: Genre, Year, Rating */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {/* Genre Badge */}
            <span className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
              {book.genre}
            </span>

            {/* Year Badge */}
            <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{book.publication_year}</span>
            </div>

            {/* Rating Badge */}
            {book.rating !== undefined && book.rating > 0 && (
              <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                <span>⭐</span>
                <span>{book.rating}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex-grow mb-4">
            {book.book_description ? (
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {book.book_description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No description available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
            {/* View Details Button */}
            {/* <button
              onClick={() => handleView(book)}
              className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              View Details
            </button> */}

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(book.id, book.book_name)}
              className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Delete Book"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;