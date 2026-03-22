export const TAG_COLORS = {
  'Diabetes': { bg: '#e8f3ee', text: '#2f6b4f' },
  'Sugar Control': { bg: '#e8f3ee', text: '#2f6b4f' },
  'BP': { bg: '#e8f2fc', text: '#2a6b9b' },
  'Heart': { bg: '#fce8e8', text: '#9b2a2a' },
  'Cholesterol': { bg: '#fdf0e8', text: '#b85c2a' },
  'Pain': { bg: '#f0e8fc', text: '#7a4fb5' },
  'Fever': { bg: '#f0e8fc', text: '#7a4fb5' },
  'Acidity': { bg: '#fef3e8', text: '#c9732a' },
  'Stomach': { bg: '#fef3e8', text: '#c9732a' },
  'Morning': { bg: '#fff8e1', text: '#b8860b' },
  'Evening': { bg: '#e8f0fe', text: '#3949ab' },
  'Night': { bg: '#ede7f6', text: '#512da8' },
  'Antibiotic': { bg: '#e8f3ee', text: '#2f6b4f' },
  'Vitamin': { bg: '#fff8e1', text: '#b8860b' },
  'Allergy': { bg: '#fce8e8', text: '#9b2a2a' },
};

export const INITIAL_MEDICINES = [
  {
    id: 1,
    name: 'Metformin 500mg',
    category: 'Diabetes',
    color: '#2f6b4f',
    use: 'Controls blood sugar levels in Type 2 Diabetes. Helps the body use insulin properly.',
    dosage: 'Usually 1 tablet, twice daily — morning and evening with food.',
    warnings: ['Always take with food to avoid stomach upset.', 'Do not skip meals while taking this.', 'Inform doctor if you feel dizzy or very tired.'],
    sideEffects: 'May cause mild nausea or stomach upset initially.',
    tags: ['Diabetes', 'Sugar Control'],
    icon: '💊',
    notes: 'Prescribed by Dr. Sharma on Jan 2025. Take with breakfast and dinner.',
    reminder: { enabled: true, times: ['08:00', '20:00'] },
    addedDate: '2025-01-15',
  },
  {
    id: 2,
    name: 'Amlodipine 5mg',
    category: 'Blood Pressure',
    color: '#2a6b9b',
    use: 'Lowers high blood pressure and reduces chest pain (angina). Relaxes blood vessels.',
    dosage: '1 tablet per day, at the same time each day. Can be taken with or without food.',
    warnings: ["Do not stop suddenly without doctor's advice.", 'Avoid grapefruit juice.', 'May cause ankle swelling — inform doctor.'],
    sideEffects: 'Mild headache or flushing may occur in first few days.',
    tags: ['BP', 'Heart'],
    icon: '💉',
    notes: 'Started for hypertension. Check BP weekly.',
    reminder: { enabled: true, times: ['09:00'] },
    addedDate: '2025-02-10',
  },
  {
    id: 3,
    name: 'Atorvastatin 10mg',
    category: 'Cholesterol',
    color: '#b85c2a',
    use: "Reduces 'bad' cholesterol (LDL) in blood. Protects heart and blood vessels.",
    dosage: '1 tablet daily, preferably in the evening or at night.',
    warnings: ['Avoid alcohol.', 'Report any unusual muscle pain immediately.', 'Regular blood tests needed.'],
    sideEffects: 'Rarely causes muscle pain or weakness. Mild digestive issues possible.',
    tags: ['Cholesterol', 'Heart'],
    icon: '🫀',
    notes: 'Cholesterol was high. Follow low-fat diet.',
    reminder: { enabled: false, times: ['22:00'] },
    addedDate: '2025-03-01',
  },
];

export const FONT_SIZES = {
  normal: { label: 'Normal', scale: 1 },
  large: { label: 'Large', scale: 1.15 },
  extraLarge: { label: 'Extra Large', scale: 1.3 },
};

export const NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'scanner', icon: 'scan', label: 'Scan' },
  { id: 'medicines', icon: 'pill', label: 'Meds' },
  { id: 'reminders', icon: 'bell', label: 'Remind' },
  { id: 'assistant', icon: 'chat', label: 'AI' },
];

export const SIDEBAR_ITEMS = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'scanner', icon: 'scan', label: 'Medicine Scanner' },
  { id: 'medicines', icon: 'pill', label: 'My Medicines' },
  { id: 'assistant', icon: 'chat', label: 'AI Assistant' },
  { id: 'reminders', icon: 'bell', label: 'Reminders' },
  { id: 'prescription', icon: 'upload', label: 'Prescription Upload' },
  { id: 'family', icon: 'users', label: 'Family Access' },
];
