import api from "./axios";

export async function getProducts({ limit, skip, signal }) {
  const response = await api.get("/products", { params: { limit, skip }, signal });
  return response.data;
}

export async function searchProducts({ q, limit, skip, signal }) {
  const response = await api.get("/products/search", {
    params: { q, limit, skip },
    signal
  });
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/products/categories");
  return response.data;
}

export async function getProductsByCategory({ category, limit, skip, signal }) {
  const response = await api.get(`/products/category/${encodeURIComponent(category)}`, {
    params: { limit, skip },
    signal
  });
  return response.data;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function addProduct(product) {
  const response = await api.post("/products/add", product);
  return response.data;
}

export async function updateProduct(id, product) {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
