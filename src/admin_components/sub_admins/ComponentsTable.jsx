// ComponentsTable.jsx
import React, { useState, useMemo } from "react";
import CategoryDetailModal from "./CategoryDetailModel";

// ---------- tiny CSV helper ----------
const downloadCSV = (rows, filename) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map(r => r.join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", filename);
  link.click();
};

const ComponentsTable = ({ data, onViewModeChange, onDeleteProduct }) => {
  const [byCategory, setByCategory] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleToggle = () => {
    setByCategory(prev => {
      const newMode = !prev ? "category" : "product";
      if (onViewModeChange) onViewModeChange(newMode);
      return !prev;
    });
  };

  const groupedData = useMemo(() => {
    if (!byCategory) return [];
    const map = {};
    data.forEach(comp => {
      const categoryName = comp.category?.name || "Uncategorized";
      if (!map[categoryName]) {
        map[categoryName] = { category: categoryName, totalQty: 0 };
      }
      map[categoryName].totalQty += comp.qty;
    });
    return Object.values(map);
  }, [data, byCategory]);

  // filter products for the selected category
  const categoryProducts = selectedCategory
    ? data.filter(
        prod =>
          (prod.category?.name || "Uncategorized") === selectedCategory
      )
    : [];

  // ---------- CSV generators ----------
  const downloadCategoryCSV = () => {
    const header = ["Sl No.", "Category", "Total Qty"];
    const rows = groupedData.map((d, i) => [i + 1, d.category, d.totalQty]);
    downloadCSV([header, ...rows], "categories.csv");
  };

  const downloadProductCSV = () => {
    const header = ["Sl No.", "Name", "HSN", "Qty", "Brand", "Category"];
    const rows = data.map((p, i) => [
      i + 1,
      p.name,
      p.hsn,
      p.qty,
      p.brand,
      p.category?.name || "Uncategorized"
    ]);
    downloadCSV([header, ...rows], "products.csv");
  };

  const handleDelete = (id) => {
    
      if (onDeleteProduct) {
        onDeleteProduct(id); // Parent handles actual deletion
      }
    
  };

  return (
    <div className="flex flex-col justify-center items-start gap-5 w-full">
      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={handleToggle}
        >
          {byCategory ? "By Product" : "By Category"}
        </button>

        <button
          onClick={byCategory ? downloadCategoryCSV : downloadProductCSV}
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          Download CSV
        </button>
      </div>

      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-2">Sl No.</th>
            {byCategory ? (
              <>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Total Qty</th>
              </>
            ) : (
              <>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">HSN</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {byCategory ? (
            groupedData.map((item, index) => (
              <tr
                key={`${item.category}-${index}`}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedCategory(item.category)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 text-blue-600">{item.category}</td>
                <td
                  className={`px-4 py-2 ${
                    item.totalQty === 0 ? "text-red-600" : ""
                  }`}
                >
                  {item.totalQty}
                </td>
              </tr>
            ))
          ) : (
            data.map((comp, index) => (
              <tr
                key={`${comp.id}-${index}`}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{comp.name}</td>
                <td className="px-4 py-2">{comp.hsn}</td>
                <td
                  className={`px-4 py-2 ${
                    comp.qty === 0 ? "text-red-600" : ""
                  }`}
                >
                  {comp.qty}
                </td>
                <td className="px-4 py-2">{comp.brand}</td>
                <td className="px-4 py-2">
                  {comp.category?.name || "Uncategorized"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedCategory && (
        <CategoryDetailModal
          categoryName={selectedCategory}
          products={categoryProducts}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
};

export default ComponentsTable;
