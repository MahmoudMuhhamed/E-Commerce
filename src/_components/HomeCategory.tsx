import Link from "next/link";
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

export default async function HomeCategory() {
  const categories = await getAllCategories();

  if (!categories) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-gray-500 text-sm">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-4 py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-green-600 rounded-full inline-block"></span>
          Shop By{" "}
          <span className="text-green-600">Category</span>
        </h2>
        <Link
          href="/categories"
          className="font-medium text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
        >
          View All Categories
          <FaArrowRightLong className="w-4 h-4 ms-1"/>
        </Link>
      </div>
    
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            {/* Circle Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden flex">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <p className="font-medium text-gray-700 text-center transition-colors leading-tight">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
