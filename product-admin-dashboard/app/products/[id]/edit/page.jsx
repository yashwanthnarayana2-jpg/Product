 "use client";
import { useEffect,useState } from "react";
import { useParams,useRouter } from "next/navigation";
import ProductForm from "../../../../components/ProductForm";
import Loader from "../../../../components/Loader";
import { getProduct,updateProduct } from "../../../../api/productApi";

export default function EditProduct(){
 const {id}=useParams(),router=useRouter(); const [product,setProduct]=useState(null),[saving,setSaving]=useState(false);
 useEffect(()=>{getProduct(id).then(setProduct).catch(()=>setProduct(false));},[id]);
 if(product===null)return <Loader/>; if(product===false)return <main className="p-10 text-center">Product not found.</main>;
 async function submit(data){if(saving)return;setSaving(true);try{await updateProduct(id,data);router.push("/products");}catch{alert("Unable to update product.");}finally{setSaving(false);}}
 return <main className="mx-auto max-w-2xl p-6"><h1 className="mb-6 text-2xl font-bold">Edit Product</h1><ProductForm initial={product} onSubmit={submit} saving={saving}/></main>;
}
