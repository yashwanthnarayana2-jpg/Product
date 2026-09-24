import { useState } from "react";

export default function ProductForm({ initial = {}, onSubmit, saving }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    price: initial.price ?? "",
    stock: initial.stock ?? "",
    category: initial.category || "",
    thumbnail: initial.thumbnail || ""
  });
  const [errors, setErrors] = useState({});

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0) next.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) next.stock = "Enter valid stock";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow">
      {[
        ["title","Title","text"],["category","Category","text"],["price","Price","number"],["stock","Stock","number"],["thumbnail","Image URL","url"]
      ].map(([name,label,type]) => (
        <div key={name}><label className="mb-1 block text-sm font-medium">{label}</label><input name={name} type={type} value={form[name]} onChange={change} className="w-full rounded border px-3 py-2" /><p className="text-sm text-red-600">{errors[name]}</p></div>
      ))}
      <div><label className="mb-1 block text-sm font-medium">Description</label><textarea name="description" value={form.description} onChange={change} rows="5" className="w-full rounded border px-3 py-2" /></div>
      <button disabled={saving} className="rounded bg-slate-900 px-5 py-2 text-white">{saving ? "Saving..." : "Save"}</button>
    </form>
  );
}
