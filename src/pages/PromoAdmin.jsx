import React, { useEffect, useState } from "react";
</select>
<input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="p-2 border rounded" />
<input type="date" value={expiry} onChange={(e)=>setExpiry(e.target.value)} className="p-2 border rounded" />
<label className="flex items-center gap-2"><input type="checkbox" checked={oneTimeUse} onChange={(e)=>setOneTimeUse(e.target.checked)} />One-time use</label>
<label className="flex items-center gap-2"><input type="checkbox" checked={newUserOnly} onChange={(e)=>setNewUserOnly(e.target.checked)} />New users only</label>
</div>
<div className="mt-3"><button disabled={loading} onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded">Create Promo</button></div>
</div>


<div className="bg-white p-4 rounded shadow">
<h3 className="font-semibold mb-3">Existing Promos</h3>
<table className="w-full text-sm">
<thead><tr><th>Code</th><th>Type</th><th>Amount</th><th>Expiry</th><th>One-time</th><th>New-user</th><th>Action</th></tr></thead>
<tbody>
{promos.map(p=> (
<tr key={p.id} className="border-t">
<td>{p.code}</td>
<td>{p.type}</td>
<td>{p.amount}</td>
<td>{p.expiry || "—"}</td>
<td>{p.one_time_use? 'Yes': 'No'}</td>
<td>{p.new_user_only? 'Yes': 'No'}</td>
<td><button onClick={()=>handleDelete(p.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button></td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}
