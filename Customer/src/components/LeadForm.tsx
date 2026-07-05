import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, BadgeIndianRupee, Zap, Loader2, CheckCircle2 } from 'lucide-react';

export function CustomerLeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    monthlyElectricityBill: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate suggested Solar system capacity
  const calculateSuggestedCapacity = (bill: string): string => {
    const numericBill = parseFloat(bill);
    if (isNaN(numericBill) || numericBill <= 0) return '';
    if (numericBill < 1500) return '1 kW - 2 kW System';
    if (numericBill < 4000) return '3 kW - 5 kW System';
    if (numericBill < 8000) return '5 kW - 8 kW System';
    return '10+ kW Commercial / Industrial Setup';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const solarCapacityInterested = calculateSuggestedCapacity(formData.monthlyElectricityBill);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const response = await axios.post(`${apiUrl}/api/queries`, {
        ...formData,
        monthlyElectricityBill: parseFloat(formData.monthlyElectricityBill),
        solarCapacityInterested,
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-lg mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl animate-fade-in backdrop-blur-md">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-950/50 text-emerald-400 mb-5 border border-emerald-900/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">
          We have forwarded your details to our team. An engineer will perform a preliminary satellite shadow analysis of your roof and reach out to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              monthlyElectricityBill: '',
              message: '',
            });
          }}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold rounded-xl transition duration-300 shadow-lg shadow-yellow-500/10 cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950/40 backdrop-blur-xl border border-slate-900 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="mb-6 text-center md:text-left">
        <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
          Get Free Feasibility Analysis
        </span>
        <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
          Request Site Survey
        </h2>
        <p className="text-slate-400 mt-1.5 text-xs">
          Provide your monthly usage details below for an engineering assessment.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 text-xs text-red-400 bg-red-950/20 rounded-xl border border-red-900/40">
          {errorMsg}
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Zap className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder=""
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
            />
          </div>
        </div>

        {/* Email and Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder=""
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Phone className="h-4.5 w-4.5" />
              </span>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder=""
                pattern="[0-9]{10}"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Monthly Bill Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Average Monthly Electricity Bill (INR)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <BadgeIndianRupee className="h-4.5 w-4.5" />
            </span>
            <input
              type="number"
              name="monthlyElectricityBill"
              required
              value={formData.monthlyElectricityBill}
              onChange={handleInputChange}
              placeholder=""
              min="1"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
            />
          </div>
          {formData.monthlyElectricityBill && (
            <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Zap className="h-3.5 w-3.5 fill-current" /> Suggested: {calculateSuggestedCapacity(formData.monthlyElectricityBill)}
            </div>
          )}
        </div>

        {/* Address and City */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Installation Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder=""
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              placeholder=""
              className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200"
            />
          </div>
        </div>

        {/* Optional message */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Additional Notes / Roof Area (Optional)
          </label>
          <textarea
            name="message"
            rows={2}
            value={formData.message}
            onChange={handleInputChange}
            placeholder=""
            className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-sm transition duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25"
        >
          {loading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Routing to Engineer...
            </>
          ) : (
            <>Submit Feasibility Request</>
          )}
        </button>
      </form>
    </div>
  );
}
