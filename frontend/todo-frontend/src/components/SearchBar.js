import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchQuery, onSearch }) => {
  return (
    <div className="relative mb-6">
      <Search className="h-5 w-5 absolute left-3 top-3 text-blue-400" />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
