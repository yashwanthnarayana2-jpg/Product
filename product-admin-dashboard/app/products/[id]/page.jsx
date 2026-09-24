 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "../../../api/productApi";
import Loader from "../../../components/Loader";

export default function ProductDetails() {
  const {id}=useParams(), router=useRouter();
  const [product,setProduct]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(false);
  useEffect(()=>{getProduct(id).then(setProduct).catch(()=>setError(true)).finally(()=>setLoading(false));},[id]);
  if(loading)return <Loader/>;
  if(error || !product)return <main className="p-10 text-center"><h1 className="text-2xl font-bold">Product not found</h1><Link href="/products" className="mt-4 inline-block text-blue-600">Back to products</Link></main>;
  return <main className="mx-auto max-w-5xl p-6">
    <div className="mb-4 flex justify-between"><Link href="/products" className="text-blue-600">← Products</Link><Link href={`/products/${id}/edit`} className="text-green-600">Edit</Link></div>
    <div className="grid gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
      <div><img src={product.images?.[0] || product.thumbnail} alt={product.title} className="mx-auto max-h-96 object-contain"/><div className="mt-3 flex gap-2">{product.images?.slice(0,5).map(x=><img key={x} src={x} className="h-16 w-16 rounded object-cover" alt=""/></div></div>
      <div><h1 className="text-3xl font-bold">{product.title}</h1><p className="mt-2 text-slate-500">{product.category}</p><p className="mt-4">{product.description}</p><p className="mt-5 text-2xl font-bold">${product.price}</p><p className="mt-2">Rating: {product.rating} · Stock: {product.stock}</p><h2 className="mt-8 text-xl font-semibold">Reviews</h2><div className="mt-3 space-y-3">{(product.reviews||[]).map((r,i)=><div key={i} className="rounded border p-3"><b>{r.reviewerName}</b><p>{r.comment}</p><small>Rating: {r.rating}</small></div>)}</div></div>
    </div>
  </main>;
}
