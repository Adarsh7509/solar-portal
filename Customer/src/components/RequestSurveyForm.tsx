import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Loader2, Star, Upload } from 'lucide-react';

type FormTab = 'enquiry' | 'service' | 'feedback' | 'warranty';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export function RequestSurveyForm() {
  const [activeTab, setActiveTab] = useState<FormTab>('service'); // Default to Service tab as it's the primary ticket form
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- Main Enquiry Form Fields ---
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: 'Uttar Pradesh',
    city: '',
    category: 'residential',
    message: '',
  });

  // --- Feedback Form Fields ---
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    phone: '',
    state: 'Uttar Pradesh',
    city: '',
    rating: 5,
    feedbackType: 'Service Quality',
    message: '',
  });

  // --- Warranty Form Fields ---
  const [warrantyForm, setWarrantyForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: 'Uttar Pradesh',
    city: '',
    productModel: '',
    serialNumber: '',
    purchaseDate: '',
    invoiceNo: '',
    installer: '',
    message: '',
  });

  // --- Detailed Service Enquiry (Submit Ticket) Form Fields ---
  const [ticketForm, setTicketForm] = useState({
    // Customer Details
    customerType: 'Residential',
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    
    // Address Details
    doorNo: '',
    street: '',
    landmark: '',
    locality: '',
    postOffice: '',
    tahsil: '',
    state: 'Uttar Pradesh',
    district: '',
    city: '',
    pincode: '',

    // Product Details
    serviceCategory: 'Service Request',
    productCategory: 'Solar PV Modules',
    productSubcategory: 'Mono PERC Cells',
    capacity: '5 kW',
    issueType: 'Low Generation/Efficiency',
    issueDetail: '',
    quantity: 1,
    serialNumber: '',
    purchaseDate: '',

    // Files (Display names)
    invoiceFileName: '',
    serialFileName: '',
  });

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFeedbackForm({ ...feedbackForm, [e.target.name]: e.target.value });
  };

  const handleWarrantyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setWarrantyForm({ ...warrantyForm, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTicketForm({ ...ticketForm, [e.target.name]: e.target.value });
  };

  const handlePhoneInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: any,
    stateObj: any
  ) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/\D/g, '').slice(0, 10);
    setter({
      ...stateObj,
      [e.target.name]: cleanVal
    });
  };

  const handleTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'invoiceFileName' | 'serialFileName') => {
    if (e.target.files && e.target.files.length > 0) {
      setTicketForm({ ...ticketForm, [fieldName]: e.target.files[0].name });
    }
  };

  const handleRatingChange = (stars: number) => {
    setFeedbackForm({ ...feedbackForm, rating: stars });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let payload: any = {};

    try {
      if (activeTab === 'enquiry') {
        const messageText = `
[GENERAL ENQUIRY]
Category Interested: ${enquiryForm.category.toUpperCase()}
Message / Requirements:
${enquiryForm.message}
`;
        payload = {
          name: enquiryForm.name,
          email: enquiryForm.email,
          phone: enquiryForm.phone,
          address: 'N/A - General Enquiry',
          city: enquiryForm.city || 'N/A',
          monthlyElectricityBill: 1,
          solarCapacityInterested: enquiryForm.category === 'residential' ? '3 kW - 5 kW System' : '10+ kW Commercial / Industrial Setup',
          message: messageText.trim(),
        };
      } 
      else if (activeTab === 'feedback') {
        const messageText = `
[FEEDBACK SUBMISSION]
Feedback Category: ${feedbackForm.feedbackType}
Rating Score: ${feedbackForm.rating} Stars
Comments:
${feedbackForm.message}
`;
        payload = {
          name: feedbackForm.name,
          email: feedbackForm.email,
          phone: feedbackForm.phone,
          address: 'N/A - Feedback Form',
          city: feedbackForm.city || 'N/A',
          monthlyElectricityBill: 1,
          solarCapacityInterested: 'Feedback Query',
          message: messageText.trim(),
        };
      } 
      else if (activeTab === 'warranty') {
        const messageText = `
[WARRANTY REGISTRATION]
Product Model: ${warrantyForm.productModel}
Serial Number: ${warrantyForm.serialNumber}
Purchase Date: ${warrantyForm.purchaseDate}
Invoice Number: ${warrantyForm.invoiceNo}
Authorized Installer: ${warrantyForm.installer}
Additional Info:
${warrantyForm.message || 'None'}
`;
        payload = {
          name: warrantyForm.name,
          email: warrantyForm.email,
          phone: warrantyForm.phone,
          address: warrantyForm.address || 'N/A',
          city: warrantyForm.city || 'N/A',
          monthlyElectricityBill: 1,
          solarCapacityInterested: 'Warranty Query',
          message: messageText.trim(),
        };
      } 
      else if (activeTab === 'service') {
        // Detailed Submit Ticket Form
        const formattedAddress = `${ticketForm.doorNo}, ${ticketForm.street}, ${ticketForm.landmark ? `Near ${ticketForm.landmark}, ` : ''}${ticketForm.locality}, Post: ${ticketForm.postOffice}, Tahsil: ${ticketForm.tahsil}, ${ticketForm.city}, ${ticketForm.district}, ${ticketForm.state} - ${ticketForm.pincode}`;
        
        const messageText = `
[TICKET SUBMITTED - CUSTOMER COMPLAINT]
Customer Type: ${ticketForm.customerType}
Alternate Mobile: ${ticketForm.alternatePhone ? `+91 ${ticketForm.alternatePhone}` : 'None'}

Service Request Category: ${ticketForm.serviceCategory}
Product Category: ${ticketForm.productCategory}
Product Subcategory: ${ticketForm.productSubcategory}
Capacity: ${ticketForm.capacity}
Type of Issue/Fault: ${ticketForm.issueType}
Quantity: ${ticketForm.quantity}
Serial Number: ${ticketForm.serialNumber}
Purchase Date: ${ticketForm.purchaseDate || 'N/A'}

File Attachments Logged:
- Invoice copy: ${ticketForm.invoiceFileName || 'Not Uploaded'}
- Serial Plate photo: ${ticketForm.serialFileName || 'Not Uploaded'}

Issue Description:
${ticketForm.issueDetail}
`;

        payload = {
          name: ticketForm.name,
          email: ticketForm.email,
          phone: ticketForm.phone,
          address: formattedAddress,
          city: ticketForm.city,
          monthlyElectricityBill: 1,
          solarCapacityInterested: `Service: ${ticketForm.capacity}`,
          message: messageText.trim(),
        };
      }

      const response = await axios.post(`${apiUrl}/api/queries`, payload);
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit request. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setEnquiryForm({
      name: '',
      email: '',
      phone: '',
      state: 'Uttar Pradesh',
      city: '',
      category: 'residential',
      message: '',
    });
    setFeedbackForm({
      name: '',
      email: '',
      phone: '',
      state: 'Uttar Pradesh',
      city: '',
      rating: 5,
      feedbackType: 'Service Quality',
      message: '',
    });
    setWarrantyForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      state: 'Uttar Pradesh',
      city: '',
      productModel: '',
      serialNumber: '',
      purchaseDate: '',
      invoiceNo: '',
      installer: '',
      message: '',
    });
    setTicketForm({
      customerType: 'Residential',
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      doorNo: '',
      street: '',
      landmark: '',
      locality: '',
      postOffice: '',
      tahsil: '',
      state: 'Uttar Pradesh',
      district: '',
      city: '',
      pincode: '',
      serviceCategory: 'Service Request',
      productCategory: 'Solar PV Modules',
      productSubcategory: 'Mono PERC Cells',
      capacity: '5 kW',
      issueType: 'Low Generation/Efficiency',
      issueDetail: '',
      quantity: 1,
      serialNumber: '',
      purchaseDate: '',
      invoiceFileName: '',
      serialFileName: '',
    });
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-900/30 border border-slate-900 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-950/50 text-yellow-500 mb-6 border border-yellow-900/30">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3">Ticket Submitted Successfully!</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto mb-8">
          Your service ticket and details have been registered. Our solar service coordinators and field engineers will evaluate the complaints/issues and follow up within 24 hours.
        </p>
        <button
          onClick={resetForm}
          className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl transition duration-300 shadow-lg shadow-yellow-500/10 cursor-pointer"
        >
          Submit Another Ticket / Query
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Yellow Tab Nav (Matches site brand) */}
      <div className="relative border-b border-slate-900">
        <div className="flex flex-wrap md:flex-nowrap justify-between gap-1 text-xs md:text-sm font-bold">
          
          {/* Tab 1: Enquiry */}
          <button
            type="button"
            onClick={() => { setActiveTab('enquiry'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center cursor-pointer transition-all duration-300 relative ${
              activeTab === 'enquiry'
                ? 'text-yellow-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:z-10 before:content-[""] before:absolute before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-[4px] before:border-transparent before:border-t-yellow-500 before:z-20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Enquiry
          </button>

          {/* Tab 2: Customer Complaint (Complaints / Ticket Form) */}
          <button
            type="button"
            onClick={() => { setActiveTab('service'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center cursor-pointer transition-all duration-300 relative ${
              activeTab === 'service'
                ? 'text-yellow-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:z-10 before:content-[""] before:absolute before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-[4px] before:border-transparent before:border-t-yellow-500 before:z-20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Complaint
          </button>

          {/* Tab 3: Feedback */}
          <button
            type="button"
            onClick={() => { setActiveTab('feedback'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center cursor-pointer transition-all duration-300 relative ${
              activeTab === 'feedback'
                ? 'text-yellow-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:z-10 before:content-[""] before:absolute before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-[4px] before:border-transparent before:border-t-yellow-500 before:z-20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Feedback
          </button>

          {/* Tab 4: Warranty Registration */}
          <button
            type="button"
            onClick={() => { setActiveTab('warranty'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center cursor-pointer transition-all duration-300 relative ${
              activeTab === 'warranty'
                ? 'text-yellow-500 after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-yellow-500 after:z-10 before:content-[""] before:absolute before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-[4px] before:border-transparent before:border-t-yellow-500 before:z-20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Warranty Registration
          </button>

        </div>
      </div>

      {errorMsg && (
        <div className="p-4 text-xs text-red-400 bg-red-950/20 rounded-2xl border border-red-900/40">
          {errorMsg}
        </div>
      )}

      {/* --- FORM 1: GENERAL ENQUIRY --- */}
      {activeTab === 'enquiry' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
            <span>General Solar Enquiry</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" name="name" required value={enquiryForm.name} onChange={handleEnquiryChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" name="email" required value={enquiryForm.email} onChange={handleEnquiryChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-slate-500 border-r border-slate-800 pr-2.5 select-none">+91</span>
                <input
                  type="text"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder=""
                  value={enquiryForm.phone}
                  onChange={(e) => handlePhoneInputChange(e, setEnquiryForm, enquiryForm)}
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">State / UT</label>
              <select name="state" value={enquiryForm.state} onChange={handleEnquiryChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs cursor-pointer">
                {STATES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
              <input type="text" name="city" required value={enquiryForm.city} onChange={handleEnquiryChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Interested</label>
              <select name="category" value={enquiryForm.category} onChange={handleEnquiryChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs cursor-pointer">
                <option value="residential">Residential Solar Roofs</option>
                <option value="commercial">Commercial Rooftops</option>
                <option value="industrial">Industrial Power Plants</option>
                <option value="pumps">Solar Water Pumps</option>
                <option value="utility">Utility Scale Projects</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message / Requirements</label>
            <textarea name="message" required rows={4} value={enquiryForm.message} onChange={handleEnquiryChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200 resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg shadow-yellow-500/10">
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Submit Enquiry'}
          </button>
        </form>
      )}

      {/* --- FORM 2: DETAILED SERVICE ENQUIRY (SUBMIT A TICKET) --- */}
      {activeTab === 'service' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 space-y-8 text-left">
          
          {/* Header */}
          <div className="border-b border-slate-900 pb-3">
            <h2 className="text-xl font-black text-white">Submit a Ticket</h2>
            <p className="text-slate-400 text-xs mt-1">Please provide comprehensive customer and product details below to log your complaint.</p>
          </div>

          {/* Group 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest border-l-2 border-yellow-500 pl-2">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type of Customer</label>
                <select name="customerType" value={ticketForm.customerType} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Name</label>
                <input type="text" name="name" required value={ticketForm.name} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Email Id</label>
                <input type="email" name="email" required value={ticketForm.email} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Mobile No</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-800 pr-2 select-none">+91</span>
                  <input
                    type="text"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder=""
                    value={ticketForm.phone}
                    onChange={(e) => handlePhoneInputChange(e, setTicketForm, ticketForm)}
                    className="w-full pl-12 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alternate Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 border-r border-slate-800 pr-2 select-none">+91</span>
                  <input
                    type="text"
                    name="alternatePhone"
                    maxLength={10}
                    placeholder=""
                    value={ticketForm.alternatePhone}
                    onChange={(e) => handlePhoneInputChange(e, setTicketForm, ticketForm)}
                    className="w-full pl-12 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Customer Address */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest border-l-2 border-yellow-500 pl-2">Customer Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">House/Flat/Door No</label>
                <input type="text" name="doorNo" required value={ticketForm.doorNo} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lane/Street/Road/Sector/Block</label>
                <input type="text" name="street" required value={ticketForm.street} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Landmark</label>
                <input type="text" name="landmark" value={ticketForm.landmark} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Village/Town/Locality</label>
                <input type="text" name="locality" required value={ticketForm.locality} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Post Office</label>
                <input type="text" name="postOffice" required value={ticketForm.postOffice} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tahsil/Taluka</label>
                <input type="text" name="tahsil" required value={ticketForm.tahsil} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State</label>
                <select name="state" value={ticketForm.state} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  {STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">District</label>
                <input type="text" name="district" required value={ticketForm.district} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
                <input type="text" name="city" required value={ticketForm.city} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pincode</label>
                <input type="text" name="pincode" required pattern="[0-9]{6}" value={ticketForm.pincode} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
            </div>
          </div>

          {/* Group 3: Product Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest border-l-2 border-yellow-500 pl-2">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Service Request Category</label>
                <select name="serviceCategory" value={ticketForm.serviceCategory} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="Service Request">Service Request</option>
                  <option value="Spares Enquiry">Spares Enquiry</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Feedback / Escalation">Feedback / Escalation</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Product Category</label>
                <select name="productCategory" value={ticketForm.productCategory} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="Solar PV Modules">Solar PV Modules</option>
                  <option value="Solar Grid-tie Inverters">Solar Grid-tie Inverters</option>
                  <option value="Hybrid Inverters">Hybrid Inverters</option>
                  <option value="Solar Water Pumps">Solar Water Pumps</option>
                  <option value="Battery Storage">Battery Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Product Subcategory</label>
                <select name="productSubcategory" value={ticketForm.productSubcategory} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="Mono PERC Cells">Mono PERC Cells</option>
                  <option value="Bifacial Modules">Bifacial Modules</option>
                  <option value="Polycrystalline Cells">Polycrystalline Cells</option>
                  <option value="String Inverter Series">String Inverter Series</option>
                  <option value="Micro Inverter Series">Micro Inverter Series</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Capacity</label>
                <select name="capacity" value={ticketForm.capacity} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="1 kW">1 kW</option>
                  <option value="2 kW">2 kW</option>
                  <option value="3 kW">3 kW</option>
                  <option value="5 kW">5 kW</option>
                  <option value="8 kW">8 kW</option>
                  <option value="10 kW">10 kW</option>
                  <option value="15 kW">15 kW</option>
                  <option value="20+ kW">20+ kW</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type of Issue/Fault</label>
                <select name="issueType" value={ticketForm.issueType} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 cursor-pointer">
                  <option value="Low Generation/Efficiency">Low Generation/Efficiency</option>
                  <option value="Inverter Fault code display">Inverter Fault code display</option>
                  <option value="Physical panel micro cracks">Physical panel micro cracks</option>
                  <option value="Wiring short circuit / Earth fault">Wiring short circuit / Earth fault</option>
                  <option value="Net metering connection delay">Net metering connection delay</option>
                  <option value="Other faults / issues">Other faults / issues</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quantity</label>
                <input type="number" name="quantity" min="1" required value={ticketForm.quantity} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Serial Number *</label>
                <input type="text" name="serialNumber" required value={ticketForm.serialNumber} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Purchase Date</label>
                <input type="date" name="purchaseDate" value={ticketForm.purchaseDate} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Issue/Fault In Detail</label>
              <textarea name="issueDetail" required rows={3} value={ticketForm.issueDetail} onChange={handleTicketChange} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-yellow-500 resize-none" />
            </div>
          </div>

          {/* Group 4: Product Attachments */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest border-l-2 border-yellow-500 pl-2">Product Attachments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-center items-center text-center relative border-dashed">
                <Upload className="h-6 w-6 text-slate-500 mb-2" />
                <span className="text-[10px] font-extrabold text-slate-300">Invoice Attachment</span>
                <span className="text-[9px] text-slate-500 mt-1">Allowed formats: JPG, PNG, PDF (Max 5MB)</span>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleTicketFileChange(e, 'invoiceFileName')} className="absolute inset-0 opacity-0 cursor-pointer" />
                {ticketForm.invoiceFileName && (
                  <span className="text-[9px] text-yellow-500 font-bold mt-2 bg-yellow-950/30 px-2 py-0.5 border border-yellow-900/30 rounded-lg">
                    ✓ {ticketForm.invoiceFileName}
                  </span>
                )}
              </div>

              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 flex flex-col justify-center items-center text-center relative border-dashed">
                <Upload className="h-6 w-6 text-slate-500 mb-2" />
                <span className="text-[10px] font-extrabold text-slate-300">Serial No. Attachment</span>
                <span className="text-[9px] text-slate-500 mt-1">Allowed formats: JPG, PNG, PDF (5MB each)</span>
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleTicketFileChange(e, 'serialFileName')} className="absolute inset-0 opacity-0 cursor-pointer" />
                {ticketForm.serialFileName && (
                  <span className="text-[9px] text-yellow-500 font-bold mt-2 bg-yellow-950/30 px-2 py-0.5 border border-yellow-900/30 rounded-lg">
                    ✓ {ticketForm.serialFileName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg shadow-yellow-500/10">
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Submit Ticket'}
          </button>
        </form>
      )}

      {/* --- FORM 3: FEEDBACK --- */}
      {activeTab === 'feedback' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
            <span>Customer Feedback</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" name="name" required value={feedbackForm.name} onChange={handleFeedbackChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" name="email" required value={feedbackForm.email} onChange={handleFeedbackChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-slate-500 border-r border-slate-800 pr-2.5 select-none">+91</span>
                <input
                  type="text"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder=""
                  value={feedbackForm.phone}
                  onChange={(e) => handlePhoneInputChange(e, setFeedbackForm, feedbackForm)}
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Feedback Type</label>
              <select name="feedbackType" value={feedbackForm.feedbackType} onChange={handleFeedbackChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs cursor-pointer">
                <option value="Service Quality">Service Quality</option>
                <option value="Installation Team">Installation Team</option>
                <option value="Product Performance">Product Performance</option>
                <option value="Customer Support">Customer Support Response</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Satisfaction</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => handleRatingChange(star)} className="p-1 cursor-pointer transition transform hover:scale-110">
                    <Star className={`h-6 w-6 ${star <= feedbackForm.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Comments / Suggestions</label>
            <textarea name="message" required rows={4} value={feedbackForm.message} onChange={handleFeedbackChange} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200 resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg shadow-yellow-500/10">
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Submit Feedback'}
          </button>
        </form>
      )}

      {/* --- FORM 4: WARRANTY REGISTRATION --- */}
      {activeTab === 'warranty' && (
        <form onSubmit={handleSubmit} className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
            <span>Product Warranty Registration</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" name="name" required value={warrantyForm.name} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" name="email" required value={warrantyForm.email} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-slate-500 border-r border-slate-800 pr-2.5 select-none">+91</span>
                <input
                  type="text"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder=""
                  value={warrantyForm.phone}
                  onChange={(e) => handlePhoneInputChange(e, setWarrantyForm, warrantyForm)}
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Installation Address</label>
              <input type="text" name="address" required value={warrantyForm.address} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
                <input type="text" name="city" required value={warrantyForm.city} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
                <select name="state" value={warrantyForm.state} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs cursor-pointer">
                  {STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Product Model</label>
              <input type="text" name="productModel" required value={warrantyForm.productModel} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Product Serial Number</label>
              <input type="text" name="serialNumber" required value={warrantyForm.serialNumber} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Purchase</label>
              <input type="date" name="purchaseDate" required value={warrantyForm.purchaseDate} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice / Bill Number</label>
              <input type="text" name="invoiceNo" required value={warrantyForm.invoiceNo} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Installer / Agency Name</label>
              <input type="text" name="installer" required value={warrantyForm.installer} onChange={handleWarrantyChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-white text-xs transition duration-200" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg shadow-yellow-500/10">
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Register Warranty'}
          </button>
        </form>
      )}

    </div>
  );
}
