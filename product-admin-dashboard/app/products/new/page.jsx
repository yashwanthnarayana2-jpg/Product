 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../../components/ProductForm";
import { addProduct } from "../../../api/productApi";

export default function NewProduct() {
  const router=useRouter(),[saving,setSaving]=useState(false);
  async function submit(product){if(saving)return;setSaving(true);try{await addProduct(product);router.push("/products");}catch{alert("Unable to add product.");}finally{setSaving(false);}}
  return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-6 text-2xl font-bold">Add Product</h1><ProductForm onSubmit={submit} saving={saving}/></main>;
}
