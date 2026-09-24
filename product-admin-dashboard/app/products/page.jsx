 "use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductTable from "../../components/ProductTable";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import useDebounce from "../../hooks/useDebounce";
import { getProducts, searchProducts, getCategories, getProductsByCategory, deleteProduct } from "../../api/productApi";
import { logout, isLoggedIn } from "../../utils/auth";

export default function ProductsPage() {
  const router = useRouter(), pathname = usePathname(), params = useSearchParams();
  const rawPage = Number(params.get("page")), rawLimit = Number(params.get("limit"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = [10,20,50].includes(rawLimit) ? rawLimit : 10;
  const initialSearch = params.get("search") || "", initialCategory = params.get("category") || "", initialSort = params.get("sort") || "";
  const [search, setSearch] = useState(initialSearch), debouncedSearch = useDebounce(search);
  const [category, setCategory] = useState(initialCategory), [sort, setSort] = useState(initialSort);
  const [data, setData] = useState({products:[], total:0});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");

  useEffect(() => { if (!isLoggedIn()) router.replace("/login"); }, [router]);

  useEffect(() => { getCategories().then(setCategories).catch(()=>{}); }, []);

  useEffect(() => {
    if (search !== initialSearch) return;
    const controller = new AbortController();
    setLoading(true); setError("");
    const load = async () => {
      try {
        let result;
        const skip = (page - 1) * limit;
        if (debouncedSearch) result = await searchProducts({q:debouncedSearch,limit,skip,signal:controller.signal});
        else if (category) result = await getProductsByCategory({category,limit,skip,signal:controller.signal});
        else result = await getProducts({limit,skip,signal:controller.signal});
        setData(result);
      } catch (e) { if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") setError("Unable to load products."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [page,limit,debouncedSearch,category,initialSearch]);

  function update(next) {
    const q = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k,v]) => v ? q.set(k,String(v)) : q.delete(k));
    router.push(`${pathname}?${q.toString()}`);
  }

  useEffect(() => {
    if (debouncedSearch !== initialSearch) update({search:debouncedSearch,page:1});
  }, [debouncedSearch]); // intentional URL sync

  function sortedProducts() {
    const copy = [...(data.products || [])];
    if (sort === "price-asc") copy.sort((a,b)=>a.price-b.price);
    if (sort === "price-desc") copy.sort((a,b)=>b.price-a.price);
    if (sort === "rating") copy.sort((a,b)=>b.rating-a.rating);
    if (sort === "title") copy.sort((a,b)=>a.title.localeCompare(b.title));
    return copy;
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await deleteProduct(p.id);
      setData(d => ({...d, products:d.products.filter(x=>x.id!==p.id), total:Math.max(0,d.total-1)}));
    } catch { alert("Delete failed."); }
  }

  if (!isLoggedIn()) return null;
  const total = data.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page,totalPages);

  return <main className="mx-auto max-w-7xl p-4 sm:p-6">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">Product Admin Dashboard</h1>
      <div className="flex gap-2"><Link href="/products/new" className="rounded bg-green-600 px-4 py-2 text-white">Add Product</Link><button onClick={()=>{logout();router.replace("/login")}} className="rounded bg-slate-900 px-4 py-2 text-white">Logout</button></div>
    </header>
    <section className="mb-4 grid gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-4">
      <input value={search} onChange={e=>{setSearch(e.target.value);update({search:e.target.value,page:1})}} placeholder="Search products..." className="rounded border px-3 py-2 sm:col-span-2"/>
      <select value={category} onChange={e=>{setCategory(e.target.value);update({category:e.target.value,page:1,search:""})}} className="rounded border px-3 py-2"><option value="">All categories</option>{categories.map(c=><option key={typeof c==="string"?c:c.slug} value={typeof c==="string"?c:c.slug}>{typeof c==="string"?c:c.name}</option>)}</select>
      <select value={sort} onChange={e=>{setSort(e.target.value);update({sort:e.target.value})}} className="rounded border px-3 py-2"><option value="">Sort</option><option value="price-asc">Price low-high</option><option value="price-desc">Price high-low</option><option value="rating">Rating</option><option value="title">Title</option></select>
    </section>
    {loading ? <Loader/> : error ? <ErrorMessage message={error} onRetry={()=>router.refresh()}/> : data.products?.length ? <div className="overflow-hidden rounded-xl bg-white shadow"><ProductTable products={sortedProducts()} onDelete={remove}/><Pagination page={safePage} total={total} limit={limit} onPageChange={p=>update({page:p})} onLimitChange={n=>update({limit:n,page:1})}/></div> : <div className="rounded-xl bg-white p-10 text-center">No products found.</div>}
  </main>;
}
