import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
});

export async function getProducts(params?: Record<string, any>) {
  const response = await api.get('/products', {
    params: {
      populate: '*',
      ...params,
    },
  });
  return response.data;
}

export async function getProduct(slug: string) {
  const response = await api.get('/products', {
    params: {
      filters: { slug: { $eq: slug } },
      populate: '*',
    },
  });
  return response.data.data[0] || null;
}

export async function getCategories() {
  const response = await api.get('/categories', {
    params: {
      populate: '*',
    },
  });
  return response.data;
}

export async function getBrands() {
  const response = await api.get('/brands', {
    params: {
      populate: '*',
    },
  });
  return response.data;
}

export async function getProductsByCategory(categorySlug: string) {
  const response = await api.get('/products', {
    params: {
      filters: { categories: { slug: { $eq: categorySlug } } },
      populate: '*',
    },
  });
  return response.data;
}

export default api;
