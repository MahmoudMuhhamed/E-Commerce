import Link from 'next/link';
import { FaLayerGroup, FaTags } from 'react-icons/fa';
import { FaArrowRightLong } from "react-icons/fa6";
interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

async function getAllCategories(): Promise<CategoryType[] | null> {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

export default async function Categories() {
  const categories = await getAllCategories();

  if (!categories) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-gray-500 text-sm">Failed to load categories.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white ">
      {/* Breadcrumb */}
      <div className="bg-linear-to-br h-60 from-green-600 via-green-500 to-green-400 text-white px-6 sm:px-10 lg:px-4 pt-16 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white font-medium">Categories</span>
        </div>
 
        {/* Title Row */}
        <div className="flex items-center gap-4">
          <div className="w-17 h-17 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <FaLayerGroup className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">All Categories</h1>
            <p className="text-white/80 text mt-1 font-medium">Browse our wide range of product categories</p>
          </div>
        </div>
      </div>

        <section className="px-4 sm:px-4 bg-gray-50 py-10">
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 ">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group flex pb-8 shadow flex-col items-center hover:-translate-y-1.5 justify-center gap-3 p-4 bg-white rounded-2xl hover:border-green-200 border border-gray-100 hover:shadow-lg "
          >
            {/* Image */}
            <div className="w-[231] h-[231] rounded-[12] overflow-hidden flex  border border-gray-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Name */}
            <p className="font-bold text-gray-700 text-center leading-tight group-hover:text-green-600 ">
              {category.name}
            </p>
            <p className='group-hover:opacity-100 flex opacity-0 transition-transform duration-300 items-center text-green-600 text-xs'>View Subcategories <FaArrowRightLong className="w-2.5 h-2.5 ms-1"/></p>
          </Link>
        ))}
      </div>
    </section>






    </div>
  );
}
