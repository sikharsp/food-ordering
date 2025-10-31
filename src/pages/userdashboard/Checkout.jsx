import React, { useState, useEffect } from "react";
</div>


{/* Upload Screenshot */}
<div className="mb-6">
<label className="block text-gray-700 font-medium mb-3 flex items-center gap-2"><FiUpload className="text-orange-500" /> Upload Payment Screenshot</label>
<label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
{preview ? (
<div className="space-y-3">
<img src={preview} alt="Payment proof" className="mx-auto max-h-48 rounded-lg shadow-md" />
<p className="text-sm text-green-600 flex items-center justify-center gap-1"><FiCheckCircle /> Screenshot uploaded</p>
</div>
) : (
<div className="text-gray-500">
<FiUpload className="mx-auto text-4xl mb-2 text-gray-400" />
<p>Click to upload</p>
</div>
)}
<input type="file" accept="image/*" className="hidden" onChange={handleImage} />
</label>
</div>


{/* Confirm Button */}
<button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
{loading ? (<span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</span>) : (<><FiCheckCircle className="text-xl" /> Confirm Payment</>)}
</button>


<p className="text-center text-xs text-gray-500 mt-4">Secure Payment • Verified in 2–5 mins • Support: 9867391430</p>
</div>
</div>
</div>
</div>
);
};


export default Checkout;
