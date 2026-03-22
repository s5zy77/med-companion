import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Bell, Camera, MessageSquare, UploadCloud, 
  ChevronRight, CheckCircle2, Search, X, Loader2
} from 'lucide-react';

// --- Shared Framer Motion Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const hoverScale = { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } };
const tapScale = { scale: 0.98 };

// --- UI Components ---
const Card = ({ children, className = "", onClick }) => {
  const isInteractive = !!onClick;
  return (
    <motion.div
      onClick={onClick}
      whileHover={isInteractive ? hoverScale : {}}
      whileTap={isInteractive ? tapScale : {}}
      variants={itemVariant}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${isInteractive ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl border border-slate-800"
  >
    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-slate-800 p-1 rounded-full transition-colors">
      <X className="w-4 h-4 text-slate-400 hover:text-white" />
    </button>
  </motion.div>
);

// --- Main Application ---
export default function App() {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Metformin 500mg", category: "Diabetes", time: "08:00 AM", icon: Pill, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 2, name: "Amlodipine 5mg", category: "Blood Pressure", time: "09:00 PM", icon: Pill, color: "text-emerald-500", bg: "bg-emerald-50" }
  ]);
  const [toast, setToast] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    // Simulate AI processing time
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        name: "Paracetamol 650mg",
        category: "Pain Relief",
        use: "Used to treat mild to moderate pain and reduce fever.",
        dosage: "Take 1 tablet every 6 hours after food.",
        warnings: ["Do not exceed 4 tablets in 24 hours.", "Avoid alcohol while taking this medicine."]
      });
    }, 4000);
  };

  const addMedicine = () => {
    setMedicines(prev => [...prev, {
      id: Date.now(),
      name: scanResult.name,
      category: scanResult.category,
      time: "As needed",
      icon: Pill,
      color: "text-purple-500",
      bg: "bg-purple-50"
    }]);
    setScanResult(null);
    showToast(`Added ${scanResult.name} successfully`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-10">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
              Good Evening, Subhasree 👋
            </h1>
            <p className="text-slate-500 text-lg">Your health summary for today, beautifully organized.</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              className="bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </motion.header>

        {/* Bento Grid layout */}
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Main Action Block - Scanner */}
          <Card className="md:col-span-2 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 z-0" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold tracking-wider text-slate-500 uppercase shadow-sm border border-slate-100">AI Powered</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Smart Medicine Scanner</h2>
              <p className="text-slate-500 max-w-sm mb-8 line-clamp-2">
                Scan any medicine strip or box. Our AI instantly extracts the dosage, side effects, and warnings in simple terms.
              </p>
              
              <AnimatePresence mode="wait">
                {!isScanning && !scanResult && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={simulateScan}
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-medium w-full md:w-auto shadow-lg shadow-slate-900/20"
                  >
                    <Camera className="w-5 h-5" /> Start Scanning
                  </motion.button>
                )}

                {isScanning && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-emerald-400 rounded-full"
                        />
                      </div>
                      <span className="text-slate-900 font-medium">Gemini AI is analyzing...</span>
                    </div>
                    {/* Pulsing Skeleton */}
                    <div className="space-y-3">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-4 bg-slate-200 rounded-full w-3/4" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="h-4 bg-slate-200 rounded-full w-1/2" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="h-4 bg-slate-200 rounded-full w-5/6" />
                    </div>
                  </motion.div>
                )}

                {scanResult && !isScanning && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{scanResult.name}</h3>
                        <p className="text-sm font-medium text-emerald-600">{scanResult.category}</p>
                      </div>
                      <button onClick={() => setScanResult(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{scanResult.use}</p>
                    <div className="mb-4 bg-amber-50 rounded-lg p-3 border border-amber-100">
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Important Warnings</p>
                      <ul className="text-sm text-amber-900 space-y-1">
                        {scanResult.warnings.map((w, i) => <li key={i} className="flex gap-2"><span>•</span> {w}</li>)}
                      </ul>
                    </div>
                    <motion.button
                      whileHover={hoverScale}
                      whileTap={tapScale}
                      onClick={addMedicine}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Save to Library
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* User Stats / Focus */}
          <div className="space-y-6 flex flex-col">
            <Card className="flex-1 flex flex-col justify-center bg-slate-900 text-white border-transparent">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-400 font-medium">Next Reminder</h3>
                <Bell className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">09:00 PM</div>
                <div className="text-slate-300 font-medium">Amlodipine 5mg</div>
                <div className="text-sm text-slate-500 mt-2">After dinner · 1 tablet</div>
              </div>
            </Card>
            
            <Card onClick={() => {}} className="flex items-center gap-4 bg-indigo-50 border-indigo-100 group">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Ask AI Assistant</h3>
                <p className="text-sm text-slate-500">Analyze symptoms</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </Card>
          </div>

        </motion.div>

        {/* Saved Library Section */}
        <motion.div variants={itemVariant} initial="hidden" animate="show">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Medical Library</h2>
            <button className="text-emerald-600 font-medium hover:text-emerald-700 text-sm flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {medicines.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Card className="flex flex-col h-full group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${med.bg} ${med.color} flex items-center justify-center`}>
                        <med.icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-normal mb-1">Schedule</div>
                        <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{med.time}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{med.name}</h3>
                      <p className="text-slate-500 text-sm font-medium">{med.category}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {/* Add New Placeholder Container */}
              <motion.div layout variants={itemVariant}>
                <Card onClick={() => document.getElementById('file-upload').click()} className="h-full border-dashed border-2 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 flex flex-col items-center justify-center text-center gap-3 py-10 min-h-[160px]">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Upload Prescription</span>
                    <p className="text-sm text-slate-500 mt-1">Extract medicines instantly</p>
                  </div>
                  <input id="file-upload" type="file" className="hidden" />
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
