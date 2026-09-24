import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>{["Image","Title","Category","Price","Rating","Stock","Actions"].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3"><img src={p.thumbnail} alt={p.title} className="h-12 w-12 rounded object-cover" /></td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">${p.price}</td>
                <td className="px-4 py-3">{p.rating}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3"><Link className="mr-3 text-blue-600" href={`/products/${p.id}`}>View</Link><Link className="mr-3 text-green-600" href={`/products/${p.id}/edit`}>Edit</Link><button onClick={() => onDelete(p)} className="text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:hidden">
        {products.map(p => (
          <div key={p.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex gap-3"><img src={p.thumbnail} alt={p.title} className="h-20 w-20 rounded object-cover" /><div><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-slate-500">{p.category}</p></div></div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm"><span>Price: ${p.price}</span><span>Rating: {p.rating}</span><span>Stock: {p.stock}</span></div>
            <div className="mt-3"><Link href={`/products/${p.id}`} className="mr-4 text-blue-600">View</Link><Link href={`/products/${p.id}/edit`} className="mr-4 text-green-600">Edit</Link><button onClick={() => onDelete(p)} className="text-red-600">Delete</button></div>
          </div>
        ))}
      </div>
    </>
  );
}
