import type { Brand } from '@/lib/products';

export const ECOMMERCE_API = 'https://ecommerce.routemisr.com/api/v1';

interface ProductsResponse<T> {
  data?: T[];
  metadata?: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
  };
}

async function fetchAllPages<T>(
  buildUrl: (page: number, limit: number) => string,
  limit = 50
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await fetch(buildUrl(page, limit), {
      next: { revalidate: 120 },
    });
    if (!res.ok) break;

    const json: ProductsResponse<T> = await res.json();
    const chunk = json.data ?? [];
    all.push(...chunk);
    totalPages = json.metadata?.numberOfPages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch(`${ECOMMERCE_API}/brands`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await fetchBrands();
  const decoded = decodeURIComponent(slug);
  return (
    brands.find((b) => b.slug === slug || b.slug === decoded) ?? null
  );
}

export async function fetchProductsByBrandId(brandId: string) {
  return fetchAllPages(
    (page, limit) =>
      `${ECOMMERCE_API}/products?brand=${brandId}&limit=${limit}&page=${page}`
  );
}

export async function fetchAllProducts() {
  return fetchAllPages((page, limit) => `${ECOMMERCE_API}/products?limit=${limit}&page=${page}`);
}

export interface CategoryListItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
}

export async function fetchCategories(): Promise<CategoryListItem[]> {
  try {
    const res = await fetch(`${ECOMMERCE_API}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Failed to fetch categories:', res.status);
      return [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryListItem | null> {
  try {
    const categories = await fetchCategories();
    if (!categories.length) return null;

    const decoded = decodeURIComponent(slug);
    return (
      categories.find((c) => c.slug === slug || c.slug === decoded) ?? null
    );
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function fetchProductsByCategoryId(categoryId: string) {
  try {
    return fetchAllPages(
      (page, limit) =>
        `${ECOMMERCE_API}/products?category=${categoryId}&limit=${limit}&page=${page}`
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function fetchSubCategories(): Promise<SubCategory[]> {
  try {
    const res = await fetch(`${ECOMMERCE_API}/subcategories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Failed to fetch subcategories:', res.status);
      return [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export async function fetchSubCategoryById(id: string): Promise<SubCategory | null> {
  try {
    const res = await fetch(`${ECOMMERCE_API}/subcategories/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Failed to fetch subcategory:', res.status);
      return null;
    }
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return null;
  }
}

export async function fetchSubCategoriesByCategory(categoryId: string): Promise<SubCategory[]> {
  try {
    const res = await fetch(`${ECOMMERCE_API}/categories/${categoryId}/subcategories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Failed to fetch category subcategories:', res.status);
      return [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error('Error fetching category subcategories:', error);
    return [];
  }
}
