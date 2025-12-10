import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import ProductCard from "../components/ProductCard";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("featured");
    setPriceRange({ min: "", max: "" });
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["", ...Array.from(cats)].map(cat => ({
      value: cat,
      label: cat || "All Categories"
    }));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = search.trim() === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      const matchesPriceRange = (
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max))
      );
      
      return matchesSearch && matchesCategory && matchesPriceRange;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  }, [products, search, selectedCategory, priceRange, sortBy]);

  const hasActiveFilters = search || selectedCategory || priceRange.min || priceRange.max || sortBy !== "featured";

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">
            Our Collection
          </h1>
          <p className="text-gray-600 text-sm tracking-wide">
            Discover timeless pieces crafted for Cloudscape
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:border-black transition-colors duration-300 outline-none text-sm tracking-wide"
              />
            </div>

            {/* Category Dropdown */}
            <div className="lg:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 focus:border-black transition-colors duration-300 outline-none text-sm tracking-wide appearance-none bg-white cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                {categories.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 focus:border-black transition-colors duration-300 outline-none text-sm tracking-wide appearance-none bg-white cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 border transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide ${
                showFilters 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Price Range</span>
            </button>
          </div>

          {/* Price Range Filter (Collapsible) */}
          {showFilters && (
            <div className="mt-4 p-6 border border-gray-300 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-colors duration-300 outline-none text-sm"
                    min="0"
                  />
                </div>
                <div className="hidden sm:flex items-center pb-3">
                  <span className="text-gray-400">—</span>
                </div>
                <div className="flex-1">
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black transition-colors duration-300 outline-none text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters and Reset */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <span className="px-3 py-1 bg-black text-white text-xs tracking-wide flex items-center gap-2">
                    Search: {search}
                    <button onClick={() => setSearch("")} className="hover:text-gray-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-black text-white text-xs tracking-wide flex items-center gap-2">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")} className="hover:text-gray-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="px-3 py-1 bg-black text-white text-xs tracking-wide flex items-center gap-2">
                    ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                    <button onClick={() => setPriceRange({ min: "", max: "" })} className="hover:text-gray-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-black transition-colors duration-300 tracking-wide underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
            <p className="text-gray-600 text-sm tracking-widest">LOADING COLLECTION...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 text-sm tracking-wide">
                {filteredAndSortedProducts.length === 0 ? (
                  "No products found"
                ) : (
                  <>
                    Showing <span className="font-medium text-black">{filteredAndSortedProducts.length}</span> {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
                    {selectedCategory && <span> in <span className="font-medium text-black">{selectedCategory}</span></span>}
                  </>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="max-w-md mx-auto">
                  <p className="text-2xl font-light tracking-wide text-gray-400 mb-4">
                    No Products Found
                  </p>
                  <p className="text-gray-500 text-sm mb-8">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm tracking-widest"
                  >
                    VIEW ALL PRODUCTS
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;