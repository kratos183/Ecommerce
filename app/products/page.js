import ProductsClient from './ProductsClient';

async function getProducts(page = 1, search = '', category = '', sort = '', minPrice = '', maxPrice = '', rating = '') {
  try {
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (rating) params.append('rating', rating);

    const res = await fetch(`http://127.0.0.1:3000/api/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { products: [], pagination: { currentPage: 1, totalPages: 1, total: 0 } };
    return await res.json();
  } catch (err) {
    console.error('getProducts fetch error:', err);
    return { products: [], pagination: { currentPage: 1, totalPages: 1, total: 0 } };
  }
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const search = params.search || '';
  const category = params.category || '';
  const sort = params.sort || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const rating = params.rating || '';

  const { products, pagination } = await getProducts(page, search, category, sort, minPrice, maxPrice, rating);

  return (
    <ProductsClient
      initialProducts={products}
      initialPagination={pagination}
      initialFilters={{ search, category, sort, minPrice, maxPrice, rating, page }}
    />
  );
}