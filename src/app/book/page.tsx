"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/header";
import { IoBookOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6"; 
import { FaRegHeart } from "react-icons/fa";
import BookCard from "../components/bookCard";
import NoBooks from "../components/NoBooks";
import StatBox from "../components/StatBox";

const BookPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [books, setBooks] = useState<any[]>([{}]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const genres = ["all", "Fiction", "Fantasy", "Sci-Fi", "Romance", "History"];

  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        console.log("Fetched books:", data);
        setBooks(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // ✅ Filter + Search Logic
  const filteredBooks = useMemo(() => {
  if (!Array.isArray(books)) return [];

  return books.filter((book: any) => {
    const title = book?.book_name?.toLowerCase() || "";
    const author = book?.author?.toLowerCase() || "";
    const genre = book?.genre?.toLowerCase() || "";

    const searchTermLower = searchTerm.toLowerCase();
    const filterGenreLower = filterGenre.toLowerCase();

    const matchSearch =
      title.includes(searchTermLower) ||
      author.includes(searchTermLower);

    const matchGenre =
      filterGenreLower === "all" || genre === filterGenreLower;

    return matchSearch && matchGenre;
  });
}, [searchTerm, filterGenre, books]);


  const handleAddBook = () => {

    window.location.href = '/book/add';

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

     
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold">Book Catalog App</h1>
          <p className="text-indigo-100 mt-2">
            Discover, organize, and manage your personal library
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
            <StatBox Icon={IoBookOutline} label="Total Books" value={books.length} />
            <StatBox Icon={LuUsersRound} label="Authors" value={new Set(books.map(b => b.author)).size} />
            <StatBox Icon={FaArrowTrendUp} label="Genres" value={genres.length - 1} />
            <StatBox Icon={FaRegHeart} label="Books Found" value={filteredBooks.length} />
          </div>
        </div>
      </section>

      {/* ✅ Search + Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white p-6 shadow-md rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by title or author..."
              className="flex-1 border px-4 py-3 rounded-lg text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Genre Filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="border px-4 py-3 rounded-lg"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === "all" ? "All Genres" : g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ Error / Loading / Books */}
        {loading && <p className="text-center text-lg">Loading books...</p>}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}

        {!loading && !error && (
          <>
            {filteredBooks.length === 0 ? (
               <NoBooks handleAddBook={handleAddBook} />
            ) : (
              <BookCard
                searchTerm={searchTerm}
                filterGenre={filterGenre}
                books={filteredBooks}
                errors={undefined}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};



export default BookPage;
