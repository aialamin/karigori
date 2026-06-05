/* ── Default categories ─────────────────────────────────────────── */
export const CATEGORIES = [
  { key: 'plumber',     label: 'Plumber',     labelBn: 'প্লাম্বার',       color: '#1e6fa8', bg: '#e8f1f8' },
  { key: 'electrician', label: 'Electrician', labelBn: 'ইলেক্ট্রিশিয়ান', color: '#c67f00', bg: '#fef6e4' },
  { key: 'cleaner',     label: 'Cleaner',     labelBn: 'ক্লিনার',         color: '#0f7a5a', bg: '#e6f4ef' },
  { key: 'bua',         label: 'Bua / Help',  labelBn: 'বুয়া',            color: '#9b3fbf', bg: '#f4ecfb' },
  { key: 'painter',     label: 'Painter',     labelBn: 'পেইন্টার',        color: '#c0392b', bg: '#fbeae9' },
  { key: 'ac_repair',   label: 'AC Repair',   labelBn: 'এসি মেকানিক',    color: '#2980b9', bg: '#eaf3fb' },
  { key: 'carpenter',   label: 'Carpenter',   labelBn: 'কাঠমিস্ত্রি',     color: '#7d4f2a', bg: '#f5ede5' },
  { key: 'gas_fitter',  label: 'Gas Fitter',  labelBn: 'গ্যাস ফিটার',     color: '#e05c00', bg: '#fdf0e6' },
];

export const getCategoryInfo = (key, extraCategories = []) =>
  [...CATEGORIES, ...extraCategories].find((c) => c.key === key)
  || { key, label: key, labelBn: key, color: '#555', bg: '#eee' };

/* ── All Bangladesh locations by division ───────────────────────── */
export const BANGLADESH_LOCATIONS = {
  'ঢাকা বিভাগ': [
    // Dhaka city areas
    'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohammadpur', 'Uttara',
    'Bashundhara', 'Badda', 'Rampura', 'Khilgaon', 'Wari', 'Motijheel',
    'Tejgaon', 'Shyamoli', 'Azimpur', 'Baridhara', 'Niketan', 'Mohakhali',
    'Farmgate', 'Kafrul', 'Pallabi', 'Hazaribagh', 'Lalbagh', 'Kotwali',
    'Khilkhet', 'Demra', 'Jatrabari', 'Keraniganj', 'Savar', 'Tongi',
    'Narayanganj', 'Uttara DOHS', 'Aftabnagar', 'Vatara', 'Malibagh',
    'Shantinagar', 'Segunbagicha', 'Eskaton', 'Nakhalpara', 'Tejturi Bazar',
    // Gazipur city areas
    'Gazipur Sadar', 'Joydebpur', 'Tongi', 'Kaliakoir', 'Kapasia',
    'Sreepur', 'Kaliganj', 'Gazipur City Corporation',
    // Dhaka Division districts
    'Dhaka (District)', 'Gazipur', 'Narayanganj (District)', 'Narsingdi',
    'Manikganj', 'Munshiganj', 'Rajbari', 'Gopalganj', 'Faridpur',
    'Madaripur', 'Shariatpur',
  ],
  'চট্টগ্রাম বিভাগ': [
    'Chittagong (Chattogram)', 'Cox\'s Bazar', 'Rangamati', 'Bandarban',
    'Khagrachhari', 'Feni', 'Comilla', 'Brahmanbaria', 'Chandpur',
    'Lakshmipur', 'Noakhali',
  ],
  'রাজশাহী বিভাগ': [
    'Rajshahi', 'Chapainawabganj', 'Pabna', 'Sirajganj', 'Naogaon',
    'Natore', 'Bogura', 'Joypurhat',
  ],
  'খুলনা বিভাগ': [
    'Khulna', 'Jessore (Jashore)', 'Satkhira', 'Bagerhat', 'Narail',
    'Magura', 'Jhenaidah', 'Kushtia', 'Meherpur', 'Chuadanga',
  ],
  'বরিশাল বিভাগ': [
    'Barisal (Barishal)', 'Bhola', 'Patuakhali', 'Pirojpur',
    'Jhalokati', 'Barguna',
  ],
  'সিলেট বিভাগ': [
    'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj',
  ],
  'রংপুর বিভাগ': [
    'Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat',
    'Nilphamari', 'Panchagarh', 'Thakurgaon',
  ],
  'ময়মনসিংহ বিভাগ': [
    'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur',
  ],
};

/* Flat list of all areas (for simple selects / search) */
export const ALL_AREAS = Object.values(BANGLADESH_LOCATIONS).flat();

/* Backward compat — still used in some older imports */
export const DHAKA_AREAS = BANGLADESH_LOCATIONS['ঢাকা বিভাগ'];
