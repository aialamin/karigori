/**
 * useUserLocation — Detect user's location for "Near Me" search
 *
 * Strategy (in order):
 *  1. Browser GPS (Geolocation API) — most accurate, needs permission
 *  2. IP geolocation (ip-api.com) — automatic, city-level accuracy
 *  3. Manual fallback — user selects from list
 *
 * Returns detected area name matched against our Bangladesh locations list.
 */
import { useState, useCallback } from 'react';
import { ALL_AREAS } from '../constants.js';

/* ── Bangladesh district/upazila → coordinates ──────────────────── */
const BD_COORDS = {
  // Dhaka City areas
  'Dhanmondi':     [23.7461, 90.3742], 'Gulshan':       [23.7925, 90.4078],
  'Banani':        [23.7937, 90.4066], 'Mirpur':        [23.8223, 90.3654],
  'Mohammadpur':   [23.7636, 90.3572], 'Uttara':        [23.8759, 90.3795],
  'Bashundhara':   [23.8141, 90.4271], 'Badda':         [23.7804, 90.4279],
  'Rampura':       [23.7530, 90.4199], 'Tejgaon':       [23.7634, 90.3924],
  'Motijheel':     [23.7298, 90.4185], 'Khilgaon':      [23.7449, 90.4294],
  'Shyamoli':      [23.7726, 90.3580], 'Azimpur':       [23.7240, 90.3865],
  'Wari':          [23.7168, 90.4128], 'Lalbagh':       [23.7196, 90.3882],
  'Hazaribagh':    [23.7302, 90.3661], 'Demra':         [23.7094, 90.4693],
  'Jatrabari':     [23.7035, 90.4290], 'Farmgate':      [23.7531, 90.3873],
  'Kafrul':        [23.7978, 90.3712], 'Pallabi':       [23.8327, 90.3612],
  'Keraniganj':    [23.6826, 90.3784], 'Savar':         [23.8574, 90.2665],

  // Gazipur
  'Gazipur Sadar': [23.9999, 90.4203], 'Joydebpur':     [23.9999, 90.4203],
  'Tongi':         [23.8958, 90.4013], 'Kaliakoir':     [24.0747, 90.2497],
  'Sreepur':       [24.1867, 90.4710], 'Kapasia':       [24.1192, 90.5854],
  'Kaliganj (Gazipur)': [24.0000, 90.5667],

  // Districts — Dhaka Division
  'Dhaka':         [23.8103, 90.4125], 'Gazipur':       [23.9999, 90.4203],
  'Narayanganj':   [23.6238, 90.4996], 'Narsingdi':     [23.9238, 90.7148],
  'Manikganj':     [23.8626, 89.9998], 'Munshiganj':    [23.5443, 90.5314],
  'Rajbari':       [23.7607, 89.6440], 'Gopalganj':     [23.0048, 89.8268],
  'Faridpur':      [23.6070, 89.8428], 'Madaripur':     [23.1643, 90.1956],
  'Shariatpur':    [23.2425, 90.4348], 'Kishoreganj':   [24.4444, 90.7765],
  'Tangail':       [24.2513, 89.9167],

  // Chittagong Division
  'Chittagong':    [22.3419, 91.8155], 'Comilla':       [23.4607, 91.1809],
  'Cox\'s Bazar':  [21.4272, 92.0058], 'Feni':          [23.0159, 91.3976],
  'Brahmanbaria':  [23.9600, 91.1115], 'Chandpur':      [23.2333, 90.6518],
  'Lakshmipur':    [22.9449, 90.8312], 'Noakhali':      [22.8696, 91.0993],
  'Rangamati':     [22.6422, 92.1564], 'Bandarban':     [22.1953, 92.2184],
  'Khagrachhari':  [23.1193, 91.9847],

  // Rajshahi Division
  'Rajshahi':      [24.3745, 88.6042], 'Bogura':        [24.8465, 89.3773],
  'Chapainawabganj': [24.5965, 88.2746], 'Naogaon':    [24.9133, 88.7539],
  'Natore':        [24.4103, 88.9879], 'Joypurhat':     [25.0959, 89.0209],
  'Pabna':         [24.0064, 89.2372], 'Sirajganj':     [24.4534, 89.7006],

  // Khulna Division
  'Khulna':        [22.8456, 89.5403], 'Jessore':       [23.1667, 89.2167],
  'Jashore':       [23.1667, 89.2167], 'Satkhira':      [22.7185, 89.0705],
  'Bagerhat':      [22.6602, 89.7860], 'Narail':        [23.1724, 89.5122],
  'Jhenaidah':     [23.5450, 89.1522], 'Kushtia':       [23.9015, 89.1214],
  'Magura':        [23.4872, 89.4199], 'Meherpur':      [23.7621, 88.6317],
  'Chuadanga':     [23.6401, 88.8415],

  // Barisal Division
  'Barisal':       [22.7010, 90.3535], 'Barishal':      [22.7010, 90.3535],
  'Bhola':         [22.6893, 90.6483], 'Patuakhali':    [22.3596, 90.3298],
  'Pirojpur':      [22.5792, 89.9754], 'Jhalokati':     [22.6402, 90.1982],
  'Barguna':       [22.1524, 90.1125],

  // Sylhet Division
  'Sylhet':        [24.8949, 91.8687], 'Moulvibazar':   [24.4826, 91.7774],
  'Habiganj':      [24.3745, 91.4152], 'Sunamganj':     [25.0654, 91.3977],
  'Sreemangal':    [24.3078, 91.7286],

  // Rangpur Division
  'Rangpur':       [25.7439, 89.2752], 'Dinajpur':      [25.6277, 88.6336],
  'Gaibandha':     [25.3299, 89.5287], 'Kurigram':      [25.8124, 89.6318],
  'Lalmonirhat':   [25.9217, 89.2847], 'Nilphamari':    [25.9311, 88.8561],
  'Panchagarh':    [26.3408, 88.5553], 'Thakurgaon':    [26.0336, 88.4582],
  'Saidpur':       [25.7757, 88.8946],

  // Mymensingh Division
  'Mymensingh':    [24.7471, 90.4203], 'Jamalpur':      [24.9375, 89.9375],
  'Netrokona':     [24.8704, 90.7283], 'Sherpur':       [25.0191, 90.0146],
  'Bhaluka':       [24.4000, 90.4167], 'Trishal':       [24.5667, 90.3500],
};

/* Haversine distance in km */
function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Find closest area from our locations list to a lat/lng point */
function findNearestArea(lat, lng) {
  let nearest = null;
  let minDist = Infinity;
  for (const [name, coords] of Object.entries(BD_COORDS)) {
    // Only match if it's in our ALL_AREAS list
    if (!ALL_AREAS.includes(name) && !ALL_AREAS.some((a) => a.toLowerCase().includes(name.toLowerCase()))) continue;
    const d = haversine([lat, lng], coords);
    if (d < minDist) { minDist = d; nearest = name; }
  }
  return nearest;
}

/* Try to match a city name string against our areas list */
function matchAreaName(city) {
  if (!city) return null;
  const q = city.toLowerCase().trim();
  // Exact match first
  const exact = ALL_AREAS.find((a) => a.toLowerCase() === q);
  if (exact) return exact;
  // Partial match
  const partial = ALL_AREAS.find((a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase().split(' ')[0]));
  return partial || null;
}

export function useUserLocation() {
  const [state, setState] = useState({
    area:      null,   // detected area name (matches our list)
    rawCity:   null,   // raw city name from API
    lat:       null,
    lng:       null,
    method:    null,   // 'gps' | 'ip' | null
    loading:   false,
    error:     null,
  });

  /* ── GPS detect ── */
  const detectGPS = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));

    if (!navigator.geolocation) {
      detectIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Find nearest area from our coordinates map
        const area = findNearestArea(lat, lng);

        // Also try reverse geocoding for a human-readable name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
            { headers: { 'Accept-Language': 'en-US,en', 'User-Agent': 'karigori.org' } }
          );
          const data = await res.json();
          const addr = data?.address || {};
          const rawCity = addr.city || addr.town || addr.suburb || addr.county || addr.state_district || '';
          const matchedArea = matchAreaName(rawCity) || area;

          setState({ area: matchedArea, rawCity, lat, lng, method: 'gps', loading: false, error: null });
        } catch {
          setState({ area, rawCity: area, lat, lng, method: 'gps', loading: false, error: null });
        }
      },
      () => {
        // Permission denied or unavailable — try IP
        detectIP();
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  /* ── IP detect (fallback) ── */
  const detectIP = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('https://ip-api.com/json/?fields=city,regionName,district,lat,lon,status');
      const data = await res.json();
      if (data.status !== 'success') throw new Error('IP lookup failed');

      const rawCity = data.district || data.city || data.regionName || '';
      const area    = matchAreaName(rawCity) || matchAreaName(data.city) || matchAreaName(data.regionName);
      const lat     = data.lat;
      const lng     = data.lon;

      setState({ area, rawCity, lat, lng, method: 'ip', loading: false, error: null });
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Could not detect location. Please select manually.' }));
    }
  }, []);

  /* ── Auto detect (GPS first, IP fallback) ── */
  const detect = useCallback(() => {
    detectGPS();
  }, [detectGPS]);

  /* ── Clear ── */
  const clear = useCallback(() => {
    setState({ area: null, rawCity: null, lat: null, lng: null, method: null, loading: false, error: null });
  }, []);

  return { ...state, detect, detectIP, clear };
}
