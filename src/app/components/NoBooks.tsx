interface NoBooksProps {
  handleAddBook: () => void;
}

const NoBooks = ({ handleAddBook }: NoBooksProps) => {

    return (
    <div className="bg-white p-10 text-center rounded-xl">
        <p className="text-gray-500 text-xl">No books found</p>
        <button
        onClick={handleAddBook}
        className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
        Add Your First Book
        </button>
    </div>
);
};

export default NoBooks;
