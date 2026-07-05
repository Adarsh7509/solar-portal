import { useState, useEffect } from 'react';
import { Leaf, Landmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export function SolarCalculator() {
  // Input states
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [state, setState] = useState('Uttar Pradesh');
  const [inputMode, setInputMode] = useState<'bill' | 'units'>('bill');
  const [billValue, setBillValue] = useState(4000);
  const [unitsValue, setUnitsValue] = useState(500);
  const [roofArea, setRoofArea] = useState(300);
  const [tariff, setTariff] = useState(7.0);

  // Set default tariffs based on property type
  useEffect(() => {
    if (propertyType === 'residential') {
      setTariff(7.0);
    } else if (propertyType === 'commercial') {
      setTariff(8.5);
    } else {
      setTariff(9.5);
    }
  }, [propertyType]);

  // Sync bill/units roughly
  useEffect(() => {
    if (inputMode === 'bill') {
      setUnitsValue(Math.round(billValue / tariff));
    } else {
      setBillValue(Math.round(unitsValue * tariff));
    }
  }, [billValue, unitsValue, inputMode, tariff]);

  // --- Calculations ---
  // 1. Recommended System Capacity in kW
  // Standard solar formula: Capacity (kW) = Monthly units / (30 days * 4.2 peak hours/day)
  // Let's round to nearest 0.5 kW
  const calculatedCapacity = Math.max(1, Math.round((unitsValue / 125) * 10) / 10);
  
  // Roof check: 1 kW of solar panels needs about 80-100 sq ft.
  // If roof area restricts capacity, let's show both or cap capacity.
  // Let's cap recommended capacity at roofArea / 90 (sq ft per kW) for realistic guidance.
  const cappedCapacityByRoof = Math.max(0.5, Math.round((roofArea / 90) * 10) / 10);
  const finalCapacity = Math.min(calculatedCapacity, cappedCapacityByRoof);

  // 2. Solar Panels Count (450W panels)
  const panelsCount = Math.ceil((finalCapacity * 1000) / 450);

  // 3. System Setup Cost (INR)
  // Commercial/Industrial has slightly cheaper per kW rates due to scale.
  let costPerKw = 55000;
  if (propertyType === 'commercial') costPerKw = 48000;
  if (propertyType === 'industrial') costPerKw = 45000;
  const estimatedCost = Math.round(finalCapacity * costPerKw);

  // 4. PM Surya Ghar Subsidy
  // Only applicable to residential roofs
  let subsidy = 0;
  if (propertyType === 'residential') {
    if (finalCapacity >= 3) {
      subsidy = 78000;
    } else if (finalCapacity >= 2) {
      subsidy = 60000;
    } else {
      subsidy = Math.round(finalCapacity * 30000);
    }
  }

  // 5. Net Cost
  const netCost = Math.max(0, estimatedCost - subsidy);

  // 6. Savings Calculations
  // Estimated generation: 1 kW produces approx 4 units per day
  const dailyGeneration = finalCapacity * 4;
  const monthlyGenerationUnits = dailyGeneration * 30;
  
  // Realized savings: capped by actual user consumption
  const effectiveSavedUnits = Math.min(unitsValue, monthlyGenerationUnits);
  const monthlySavings = Math.round(effectiveSavedUnits * tariff);
  const annualSavings = monthlySavings * 12;
  const lifetimeSavings = annualSavings * 25; // 25 years lifecycle

  // 7. Financial indicators
  const paybackYears = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : '0';

  // 8. Environmental Impact
  // 1 kW solar saves ~1.2 tonnes of CO2 per year, equivalent to ~55 trees
  const co2SavedPerYear = (finalCapacity * 1.2).toFixed(1);
  const treesPlantedEquivalent = Math.round(finalCapacity * 55);

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 md:p-8 shadow-xl transition-colors duration-300">
      
      {/* Property Type Tabs */}
      <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-900 mb-6">
        {(['residential', 'commercial', 'industrial'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setPropertyType(type)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl capitalize transition-all duration-300 cursor-pointer ${
              propertyType === type
                ? 'bg-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* State UT Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select State / UT
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none text-white text-xs focus:ring-1 focus:ring-yellow-500 cursor-pointer"
            >
              {STATES.map((st) => (
                <option key={st} value={st} className="bg-slate-950 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Input Mode Toggle (Monthly Bill vs Monthly Units) */}
          <div>
            <div className="flex justify-between items-center mb-3.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Energy Consumption
              </label>
              <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-900">
                <button
                  type="button"
                  onClick={() => setInputMode('bill')}
                  className={`px-3 py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition ${
                    inputMode === 'bill' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bill (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('units')}
                  className={`px-3 py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition ${
                    inputMode === 'units' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Units (kWh)
                </button>
              </div>
            </div>

            {inputMode === 'bill' ? (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Bill</span>
                  <span className="text-xs font-bold text-yellow-500 font-mono bg-yellow-500/10 px-2.5 py-0.5 border border-yellow-500/20 rounded-lg">
                    ₹{billValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={billValue}
                  onChange={(e) => setBillValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monthly Consumption</span>
                  <span className="text-xs font-bold text-yellow-500 font-mono bg-yellow-500/10 px-2.5 py-0.5 border border-yellow-500/20 rounded-lg">
                    {unitsValue} Units
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="6000"
                  step="50"
                  value={unitsValue}
                  onChange={(e) => setUnitsValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
            )}
          </div>

          {/* Roof Space Input */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Rooftop Area</span>
              <span className="text-xs font-bold text-yellow-500 font-mono bg-yellow-500/10 px-2.5 py-0.5 border border-yellow-500/20 rounded-lg">
                {roofArea} Sq. Ft.
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={roofArea}
              onChange={(e) => setRoofArea(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          {/* Custom Tariff Cost */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Electricity Cost per Unit</span>
              <span className="text-xs font-bold text-yellow-500 font-mono bg-yellow-500/10 px-2.5 py-0.5 border border-yellow-500/20 rounded-lg">
                ₹{tariff.toFixed(2)}/kWh
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              step="0.1"
              value={tariff}
              onChange={(e) => setTariff(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

        </div>

        {/* Right Column: Computed Outputs */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Header Specs Grid (Non-wrapping cells) */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-900 pb-5">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap block">Recommended System</span>
              <p className="text-lg sm:text-xl font-extrabold text-white font-mono">
                {finalCapacity.toFixed(1)} <span className="text-xs text-yellow-500">kW</span>
              </p>
            </div>
            <div className="space-y-1.5 text-center sm:text-left border-l border-r border-slate-900 px-2">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap block">Solar Modules</span>
              <p className="text-lg sm:text-xl font-extrabold text-white font-mono">
                {panelsCount} <span className="text-xs text-yellow-500">x 450W</span>
              </p>
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap block">Payback Period</span>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                {paybackYears} <span className="text-xs">Years</span>
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Estimated Project Cost</span>
              <span className="text-white font-semibold font-mono">₹{estimatedCost.toLocaleString('en-IN')}</span>
            </div>
            {propertyType === 'residential' && (
              <div className="flex justify-between items-center text-xs text-emerald-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Landmark className="h-3.5 w-3.5" /> PM Surya Ghar Subsidy
                </span>
                <span className="font-semibold font-mono">- ₹{subsidy.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-slate-900 pt-2.5 flex justify-between items-center font-bold text-sm">
              <span className="text-slate-300">Estimated Net Investment</span>
              <span className="text-yellow-500 font-mono text-base">₹{netCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Savings Grid (Non-wrapping cell labels) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl py-3 px-1.5 text-center">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold whitespace-nowrap block">Monthly Savings</span>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-1.5 font-mono">₹{monthlySavings.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl py-3 px-1.5 text-center">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold whitespace-nowrap block">Annual Savings</span>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-1.5 font-mono">₹{annualSavings.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl py-3 px-1.5 text-center">
              <span className="text-[8px] min-[380px]:text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold whitespace-nowrap block">25 Yrs Savings</span>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-1.5 font-mono">₹{lifetimeSavings.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Environmental Impact & Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
            <div className="flex items-center gap-3 bg-emerald-950/10 border border-emerald-900/20 px-4 py-2.5 rounded-xl w-full sm:w-auto">
              <Leaf className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[8px] min-[380px]:text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Environmental Impact</span>
                <span className="text-xs text-slate-300 font-medium">
                  Offset <strong className="text-emerald-400 font-mono">{co2SavedPerYear}</strong> Tons CO2 / <strong className="text-emerald-400 font-mono">{treesPlantedEquivalent}</strong> Trees
                </span>
              </div>
            </div>

            <Link
              to="/request-survey"
              className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              <span>Book Site Survey</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
