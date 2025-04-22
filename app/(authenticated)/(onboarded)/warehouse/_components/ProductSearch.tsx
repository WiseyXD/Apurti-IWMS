import React, { useState, useEffect } from "react";
import { Search, Package, X, Info } from "lucide-react";

// Mock product data (this would come from a database in the future)
const mockProducts = [
  {
    id: "P001",
    name: "Premium Headphones",
    location: "General Storage",
    position: [12, 3, -2],
    quantity: 45,
    lastUpdated: "2025-04-16T09:30:00",
    category: "Electronics",
    priority: "Medium",
    status: "In Stock",
  },
  {
    id: "P002",
    name: "Organic Coffee Beans",
    location: "Cold Storage",
    position: [-14, 2, -3],
    quantity: 120,
    lastUpdated: "2025-04-18T14:15:00",
    category: "Food & Beverage",
    priority: "High",
    status: "In Stock",
  },
  {
    id: "P003",
    name: "Smart Watch Series X",
    location: "Management Office",
    position: [-8, 1.5, -10],
    quantity: 12,
    lastUpdated: "2025-04-19T11:00:00",
    category: "Electronics",
    priority: "High",
    status: "Limited Stock",
  },
  {
    id: "P004",
    name: "Ergonomic Desk Chair",
    location: "Packaging Station",
    position: [2, 1, 0],
    quantity: 8,
    lastUpdated: "2025-04-15T16:45:00",
    category: "Furniture",
    priority: "Low",
    status: "In Stock",
  },
  {
    id: "P005",
    name: "Waterproof Bluetooth Speaker",
    location: "Receiving Dock",
    position: [0, 1, 13],
    quantity: 30,
    lastUpdated: "2025-04-21T10:20:00",
    category: "Electronics",
    priority: "Medium",
    status: "New Arrival",
  },
];

const ProductSearch = ({ onProductSelect, onClearSelection }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    const filteredResults = mockProducts.filter(
      (product) =>
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResults(filteredResults);
    setDropdownOpen(true);
  }, [searchTerm]);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setDropdownOpen(false);

    // Pass the product data to parent component for highlighting in 3D/2D view
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Handle clearing selection
  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchTerm("");

    // Notify parent component
    if (onClearSelection) {
      onClearSelection();
    }
  };

  // Format timestamp to readable date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800";

    if (status === "In Stock") bgColor = "bg-green-100 text-green-800";
    if (status === "Limited Stock") bgColor = "bg-yellow-100 text-yellow-800";
    if (status === "Out of Stock") bgColor = "bg-red-100 text-red-800";
    if (status === "New Arrival") bgColor = "bg-blue-100 text-blue-800";

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative flex items-center bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search products by ID, name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none focus:ring-0 py-2 px-3 text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={handleClearSelection}
              className="text-gray-400 hover:text-gray-600 mr-3"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {dropdownOpen && searchResults.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                onClick={() => handleProductSelect(product)}
              >
                <Package className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-gray-500">{product.id}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>Location: {product.location}</span>
                    <span className="mx-2">•</span>
                    <span>Qty: {product.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {dropdownOpen && searchTerm && searchResults.length === 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 text-center text-gray-500">
            No products found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Selected Product Details */}
      {selectedProduct && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="font-medium text-blue-600">
                    {selectedProduct.id}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{selectedProduct.category}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={selectedProduct.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Location</div>
              <div className="font-medium">{selectedProduct.location}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Current Quantity</div>
              <div className="font-medium">
                {selectedProduct.quantity} units
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Last Updated</div>
              <div className="font-medium">
                {formatDate(selectedProduct.lastUpdated)}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Priority</div>
              <div className="font-medium">{selectedProduct.priority}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-blue-600 text-sm">
              <Info className="w-4 h-4 mr-1" />
              <span>Product is highlighted in the warehouse view</span>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
