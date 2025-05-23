"use client";
import React, { useState } from "react";
import { CategorySelectorProps } from "@/Types/type";
import SellerNavbar from "../SellerNavbar";
const categories: any = {
  Electronics: ["Mobiles", "Laptops", "Cameras"],
  Fashion: ["Men", "Women", "Kids"],
  Home: ["Furniture", "Decor", "Kitchen"],
  Books: ["Fiction", "Novel", "Comics"],
  Sports: ["Cricket", "Football", "Fitness"],
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(""); // reset subcategory on new category selection
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const handleNext = () => {
    if (selectedCategory && selectedSubcategory) {
      onSelect(selectedCategory, selectedSubcategory);
    } else {
      alert("Please select both category and subcategory.");
    }
  };

  return (
    <>
      <SellerNavbar />
      <div className="p-5 gap-10 w-full border-2 mt-[90px]">
        {/* Categories */}
        <div className="flex gap-3">
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Category</h2>
            <div className="flex flex-col">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`text-left px-4 py-2 border-b-[0.5px] rounded ${selectedCategory === category ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          {selectedCategory && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Select Subcategory</h2>
              <div className="flex flex-col">
                {categories[selectedCategory].map((sub: string) => (
                  <button
                    key={sub}
                    onClick={() => handleSubcategoryClick(sub)}
                    className={`text-left px-4 py-2 border-b-[0.5px] rounded ${selectedSubcategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        {selectedCategory && selectedSubcategory && (
          <div className="mt-2 flex justify-end">
            <button onClick={handleNext} className=" bg-blue-600 text-white px-4 py-2 rounded  border border-yellow-500">
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CategorySelector;
