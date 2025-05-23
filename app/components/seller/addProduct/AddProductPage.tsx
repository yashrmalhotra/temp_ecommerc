"use client";
import AddProductForm from "@/app/components/seller/addProduct/AddProductForm";
import CategorySelector from "@/app/components/seller/addProduct/CategorySelector";
import { useUserDetails } from "@/app/context/UserDetailsProvider";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ThreeDotLoader from "../../ThreeDotLoader";
import SellerNavbar from "../SellerNavbar";
import { ProductInfo } from "@/Types/type";

const AddProductPage = () => {
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>("");
  const [draftProducts, setDraftProducts] = useState<ProductInfo[]>([]);
  const params = useSearchParams();

  const context = useUserDetails();
  const id = params.get("id");
  useEffect(() => {
    if (id) {
      setProductId(id);
      return;
    }
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/seller/draftproduct?uid=${context?.userDetails?.uid}`);
        const product = response.data.draftProducts;

        setDraftProducts(product);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  const handleSelection = (cat: string, subcat: string) => {
    setCategory(cat);
    setSubcategory(subcat);
    setShowForm(true);
  };

  const handleContinue = () => {
    setDraftProducts([]);
  };
  const setSearchParams = (pid: string) => {
    setProductId(pid);
  };
  if (!productId && draftProducts?.length > 0) {
    return (
      <>
        <SellerNavbar />
        {isLoading && <ThreeDotLoader />}
        <section className="mt-[95px]">
          <ul>
            {draftProducts.map((item, i) => (
              <li key={item.pid as string} className="w-full m-3 my-5 md:container md:mx-auto">
                <div className="border-2 rounded-xl p-2">
                  <div>
                    <button onClick={() => setSearchParams(item.pid as string)} className="font-bold text-xl  hover:underline">
                      {item.basicInfo.title}
                    </button>
                  </div>
                  <span className="text-gray-400">PID: {item.pid as string}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-start  md:justify-end  md:container md:mx-auto mt-2">
            <button onClick={handleContinue} className="bg-blue-500 active:bg-blue-400 rounded-xl w-full p-4 text-white text-base md:w-1/4">
              Continue
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section>
        {showForm || productId ? <AddProductForm category={category} subCategory={subcategory} pid={productId} /> : <CategorySelector onSelect={handleSelection} />}
      </section>
    </>
  );
};

export default AddProductPage;
