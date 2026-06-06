/**
 * Complete Bangladesh administrative hierarchy
 * Division → District → Upazila
 * Used for smart search: typing "Rajshahi" returns ALL upazilas inside Rajshahi
 */

export const BD = [
  {
    division: 'Dhaka', divisionBn: 'ঢাকা',
    districts: [
      { district: 'Dhaka', districtBn: 'ঢাকা', upazilas: [
        'Dhamrai','Dohar','Keraniganj','Nawabganj (Dhaka)','Savar',
        'Dhanmondi','Gulshan','Banani','Mirpur','Mohammadpur','Uttara',
        'Bashundhara','Badda','Rampura','Khilgaon','Wari','Motijheel',
        'Tejgaon','Shyamoli','Azimpur','Lalbagh','Demra','Jatrabari',
        'Farmgate','Kafrul','Pallabi','Adabor','Basabo','Sabujbagh',
        'Gendaria','Sutrapur','Chakbazar','Kamrangirchar','New Market',
        'Ramna','Uttara DOHS','Aftabnagar','Vatara','Malibagh','Shantinagar',
      ]},
      { district: 'Gazipur', districtBn: 'গাজীপুর', upazilas: [
        'Gazipur Sadar','Joydebpur','Tongi','Kaliakoir','Kapasia','Sreepur','Kaliganj (Gazipur)','Gazipur City Corporation',
      ]},
      { district: 'Narayanganj', districtBn: 'নারায়ণগঞ্জ', upazilas: [
        'Narayanganj Sadar','Araihazar','Bandar','Rupganj','Sonargaon','Fatullah','Siddhirganj',
      ]},
      { district: 'Narsingdi', districtBn: 'নরসিংদী', upazilas: [
        'Narsingdi Sadar','Belabo','Monohardi','Palash','Raipura','Shibpur',
      ]},
      { district: 'Manikganj', districtBn: 'মানিকগঞ্জ', upazilas: [
        'Manikganj Sadar','Daulatpur (Manikganj)','Ghior','Harirampur','Saturia','Shivalaya','Singair',
      ]},
      { district: 'Munshiganj', districtBn: 'মুন্সিগঞ্জ', upazilas: [
        'Munshiganj Sadar','Gazaria','Lohajang','Sirajdikhan','Sreenagar','Tongibari',
      ]},
      { district: 'Rajbari', districtBn: 'রাজবাড়ী', upazilas: [
        'Rajbari Sadar','Baliakandi','Goalandaghat','Kalukhali','Pangsha',
      ]},
      { district: 'Gopalganj', districtBn: 'গোপালগঞ্জ', upazilas: [
        'Gopalganj Sadar','Kashiani','Kotalipara','Muksudpur','Tungipara',
      ]},
      { district: 'Faridpur', districtBn: 'ফরিদপুর', upazilas: [
        'Faridpur Sadar','Alfadanga','Bhanga','Boalmari','Charbhadrasan','Madhukhali','Nagarkanda','Sadarpur','Saltha',
      ]},
      { district: 'Madaripur', districtBn: 'মাদারীপুর', upazilas: [
        'Madaripur Sadar','Kalkini','Rajoir','Shibchar',
      ]},
      { district: 'Shariatpur', districtBn: 'শরীয়তপুর', upazilas: [
        'Shariatpur Sadar','Bhedarganj','Damudya','Gosairhat','Naria','Zanjira',
      ]},
      { district: 'Kishoreganj', districtBn: 'কিশোরগঞ্জ', upazilas: [
        'Kishoreganj Sadar','Austagram','Bajitpur','Bhairab','Hossainpur','Itna','Karimganj','Katiadi','Kuliarchar','Mithamain','Nikli','Pakundia','Tarail',
      ]},
      { district: 'Tangail', districtBn: 'টাঙ্গাইল', upazilas: [
        'Tangail Sadar','Basail','Bhuapur','Delduar','Dhanbari','Ghatail','Gopalpur','Kalihati','Madhupur','Mirzapur','Nagarpur','Sakhipur',
      ]},
    ],
  },
  {
    division: 'Chittagong', divisionBn: 'চট্টগ্রাম',
    districts: [
      { district: 'Chittagong', districtBn: 'চট্টগ্রাম', upazilas: [
        'Anwara','Banshkhali','Boalkhali','Chandanaish','Fatikchhari','Hathazari','Karnaphuli','Lohagara','Mirsharai','Patiya','Rangunia','Raozan','Sandwip','Satkania','Sitakunda',
        'Agrabad','Halishahar','Nasirabad','Pahartali','Panchlaish','Bayazid','Chandgaon','Bakalia','Double Mooring',
      ]},
      { district: 'Comilla', districtBn: 'কুমিল্লা', upazilas: [
        'Comilla Sadar','Barura','Brahmanpara','Burichang','Chandina','Chauddagram','Daudkandi','Debidwar','Homna','Laksam','Lalmai','Meghna','Muradnagar','Nangalkot','Titas',
      ]},
      { district: "Cox's Bazar", districtBn: "কক্সবাজার", upazilas: [
        "Cox's Bazar Sadar",'Chakaria','Kutubdia','Maheshkhali','Pekua','Ramu','Teknaf','Ukhia',
      ]},
      { district: 'Brahmanbaria', districtBn: 'ব্রাহ্মণবাড়িয়া', upazilas: [
        'Brahmanbaria Sadar','Akhaura','Ashuganj','Bancharampur','Bijoynagar','Kasba','Nabinagar','Nasirnagar','Sarail',
      ]},
      { district: 'Chandpur', districtBn: 'চাঁদপুর', upazilas: [
        'Chandpur Sadar','Faridganj','Haimchar','Haziganj','Kachua (Chandpur)','Matlab Uttar','Matlab Dakshin','Shahrasti',
      ]},
      { district: 'Noakhali', districtBn: 'নোয়াখালী', upazilas: [
        'Noakhali Sadar','Begumganj','Chatkhil','Companiganj (Noakhali)','Hatiya','Kabirhat','Senbagh','Sonaimuri','Subarnachar',
      ]},
      { district: 'Feni', districtBn: 'ফেনী', upazilas: [
        'Feni Sadar','Chhagalnaiya','Daganbhuiyan','Fulgazi','Parshuram','Sonagazi',
      ]},
      { district: 'Lakshmipur', districtBn: 'লক্ষ্মীপুর', upazilas: [
        'Lakshmipur Sadar','Kamalnagar','Ramganj','Ramgati','Raipur',
      ]},
      { district: 'Rangamati', districtBn: 'রাঙ্গামাটি', upazilas: [
        'Rangamati Sadar','Bagaichhari','Barkal','Belaichhari','Juraichhari','Kaptai','Kaukhali','Langadu','Naniarchar','Rajasthali',
      ]},
      { district: 'Bandarban', districtBn: 'বান্দরবান', upazilas: [
        'Bandarban Sadar','Ali Kadam','Lama','Naikhongchhari','Rowangchhari','Ruma','Thanchi',
      ]},
      { district: 'Khagrachhari', districtBn: 'খাগড়াছড়ি', upazilas: [
        'Khagrachhari Sadar','Dighinala','Lakshmichhari','Mahalchhari','Manikchhari','Matiranga','Panchhari','Ramgarh',
      ]},
    ],
  },
  {
    division: 'Rajshahi', divisionBn: 'রাজশাহী',
    districts: [
      { district: 'Rajshahi', districtBn: 'রাজশাহী', upazilas: [
        'Rajshahi City','Rajshahi Sadar','Bagha','Bagmara','Charghat','Durgapur','Godagari','Mohanpur','Paba','Puthia','Tanore',
        'Boalia','Rajpara','Motihar','Shah Makhdum',
      ]},
      { district: 'Bogura', districtBn: 'বগুড়া', upazilas: [
        'Bogura Sadar','Adamdighi','Dhunat','Dhupchanchia','Gabtali','Kahaloo','Nandigram','Sariakandi','Shajahanpur','Sherpur (Bogura)','Shibganj (Bogura)','Sonatola',
      ]},
      { district: 'Chapainawabganj', districtBn: 'চাঁপাইনবাবগঞ্জ', upazilas: [
        'Chapainawabganj Sadar','Bholahat','Gomastapur','Nachol','Shibganj',
      ]},
      { district: 'Naogaon', districtBn: 'নওগাঁ', upazilas: [
        'Naogaon Sadar','Atrai','Badalgachhi','Dhamoirhat','Manda','Mahadebpur','Niamatpur','Patnitala','Porsha','Raninagar','Sapahar',
      ]},
      { district: 'Natore', districtBn: 'নাটোর', upazilas: [
        'Natore Sadar','Bagatipara','Baraigram','Gurudaspur','Lalpur','Singra',
      ]},
      { district: 'Joypurhat', districtBn: 'জয়পুরহাট', upazilas: [
        'Joypurhat Sadar','Akkelpur','Kalai','Khetlal','Panchbibi',
      ]},
      { district: 'Pabna', districtBn: 'পাবনা', upazilas: [
        'Pabna Sadar','Atgharia','Bera','Bhangura','Chatmohar','Faridpur (Pabna)','Ishwardi','Santhia','Sujanagar',
      ]},
      { district: 'Sirajganj', districtBn: 'সিরাজগঞ্জ', upazilas: [
        'Sirajganj Sadar','Belkuchi','Chauhali','Kamarkhanda','Kazipur','Raiganj','Shahjadpur','Tarash','Ullahpara',
      ]},
    ],
  },
  {
    division: 'Khulna', divisionBn: 'খুলনা',
    districts: [
      { district: 'Khulna', districtBn: 'খুলনা', upazilas: [
        'Khulna City','Khulna Sadar','Batiaghata','Dacope','Dumuria','Dighalia','Koyra','Paikgachha','Phultala','Rupsa','Terokhada',
        'Sonadanga','Khalishpur','Khan Jahan Ali',
      ]},
      { district: 'Jessore', districtBn: 'যশোর', upazilas: [
        'Jashore Sadar','Abhaynagar','Bagherpara','Chaugachha','Jhikargachha','Keshabpur','Manirampur','Sharsha',
      ]},
      { district: 'Satkhira', districtBn: 'সাতক্ষীরা', upazilas: [
        'Satkhira Sadar','Assasuni','Debhata','Kalaroa','Kaliganj (Satkhira)','Shyamnagar','Tala',
      ]},
      { district: 'Bagerhat', districtBn: 'বাগেরহাট', upazilas: [
        'Bagerhat Sadar','Chitalmari','Fakirhat','Kachua (Bagerhat)','Mollahat','Mongla','Morrelganj','Rampal','Sarankhola',
      ]},
      { district: 'Jhenaidah', districtBn: 'ঝিনাইদহ', upazilas: [
        'Jhenaidah Sadar','Harinakunda','Kaliganj (Jhenaidah)','Kotchandpur','Maheshpur','Shailkupa',
      ]},
      { district: 'Narail', districtBn: 'নড়াইল', upazilas: [
        'Narail Sadar','Kalia','Lohagara (Narail)',
      ]},
      { district: 'Magura', districtBn: 'মাগুরা', upazilas: [
        'Magura Sadar','Mohammadpur (Magura)','Shalikha','Sreepur (Magura)',
      ]},
      { district: 'Kushtia', districtBn: 'কুষ্টিয়া', upazilas: [
        'Kushtia Sadar','Bheramara','Daulatpur (Kushtia)','Khoksa','Kumarkhali','Mirpur (Kushtia)',
      ]},
      { district: 'Meherpur', districtBn: 'মেহেরপুর', upazilas: [
        'Meherpur Sadar','Gangni','Mujibnagar',
      ]},
      { district: 'Chuadanga', districtBn: 'চুয়াডাঙ্গা', upazilas: [
        'Chuadanga Sadar','Alamdanga','Damurhuda','Jibannagar',
      ]},
    ],
  },
  {
    division: 'Barisal', divisionBn: 'বরিশাল',
    districts: [
      { district: 'Barishal', districtBn: 'বরিশাল', upazilas: [
        'Barishal City','Barishal Sadar','Agailjhara','Babuganj','Bakerganj','Banaripara','Gaurnadi','Hizla','Mehendiganj','Muladi','Wazirpur',
      ]},
      { district: 'Bhola', districtBn: 'ভোলা', upazilas: [
        'Bhola Sadar','Borhanuddin','Char Fasson','Daulatkhan','Lalmohan','Manpura','Tazumuddin',
      ]},
      { district: 'Patuakhali', districtBn: 'পটুয়াখালী', upazilas: [
        'Patuakhali Sadar','Bauphal','Dashmina','Dumki','Galachipa','Kalapara','Mirzaganj','Rangabali',
      ]},
      { district: 'Pirojpur', districtBn: 'পিরোজপুর', upazilas: [
        'Pirojpur Sadar','Bhandaria','Kawkhali','Mathbaria','Nazirpur','Nesarabad (Swarupkati)','Zianagar',
      ]},
      { district: 'Jhalokati', districtBn: 'ঝালকাঠি', upazilas: [
        'Jhalokati Sadar','Kathalia','Nalchity','Rajapur',
      ]},
      { district: 'Barguna', districtBn: 'বরগুনা', upazilas: [
        'Barguna Sadar','Amtali','Bamna','Betagi','Patharghata','Taltali',
      ]},
    ],
  },
  {
    division: 'Sylhet', divisionBn: 'সিলেট',
    districts: [
      { district: 'Sylhet', districtBn: 'সিলেট', upazilas: [
        'Sylhet City','Sylhet Sadar','Balaganj','Beanibazar','Bishwanath','Companiganj (Sylhet)','Dakshin Surma','Fenchuganj','Golapganj','Gowainghat','Jaintiapur','Kanaighat','Osmani Nagar','Zakiganj',
        'Amberkhana','Zindabazar','Shahjalal Upashahar',
      ]},
      { district: 'Moulvibazar', districtBn: 'মৌলভীবাজার', upazilas: [
        'Moulvibazar Sadar','Barlekha','Juri','Kamalganj','Kulaura','Rajnagar','Sreemangal',
      ]},
      { district: 'Habiganj', districtBn: 'হবিগঞ্জ', upazilas: [
        'Habiganj Sadar','Ajmiriganj','Bahubal','Baniachong','Chunarughat','Lakhai','Madhabpur','Nabiganj',
      ]},
      { district: 'Sunamganj', districtBn: 'সুনামগঞ্জ', upazilas: [
        'Sunamganj Sadar','Bishwamvarpur','Chhatak','Derai','Dharamapasha','Dowarabazar','Jagannathpur','Jamalganj','Sulla','Tahirpur',
      ]},
    ],
  },
  {
    division: 'Rangpur', divisionBn: 'রংপুর',
    districts: [
      { district: 'Rangpur', districtBn: 'রংপুর', upazilas: [
        'Rangpur City','Rangpur Sadar','Badarganj','Gangachara','Kaunia','Mithapukur','Pirgacha','Pirganj (Rangpur)','Taraganj',
      ]},
      { district: 'Dinajpur', districtBn: 'দিনাজপুর', upazilas: [
        'Dinajpur Sadar','Birampur','Birganj','Biral','Bochaganj','Chirirbandar','Fulbari (Dinajpur)','Ghoraghat','Hakimpur','Kaharole','Khansama','Nawabganj (Dinajpur)','Parbatipur',
      ]},
      { district: 'Gaibandha', districtBn: 'গাইবান্ধা', upazilas: [
        'Gaibandha Sadar','Fulchhari','Gobindaganj','Palashbari','Sadullapur','Saghata','Sundarganj',
      ]},
      { district: 'Kurigram', districtBn: 'কুড়িগ্রাম', upazilas: [
        'Kurigram Sadar','Bhurungamari','Char Rajibpur','Chilmari','Nageshwari','Phulbari (Kurigram)','Rajibpur','Rajarhat','Raumari','Ulipur',
      ]},
      { district: 'Lalmonirhat', districtBn: 'লালমনিরহাট', upazilas: [
        'Lalmonirhat Sadar','Aditmari','Hatibandha','Kaliganj (Lalmonirhat)','Patgram',
      ]},
      { district: 'Nilphamari', districtBn: 'নীলফামারী', upazilas: [
        'Nilphamari Sadar','Dimla','Domar','Jaldhaka','Kishorganj (Nilphamari)','Saidpur',
      ]},
      { district: 'Panchagarh', districtBn: 'পঞ্চগড়', upazilas: [
        'Panchagarh Sadar','Atwari','Boda','Debiganj','Tetulia',
      ]},
      { district: 'Thakurgaon', districtBn: 'ঠাকুরগাঁও', upazilas: [
        'Thakurgaon Sadar','Baliadangi','Haripur','Pirganj (Thakurgaon)','Ranisankail',
      ]},
    ],
  },
  {
    division: 'Mymensingh', divisionBn: 'ময়মনসিংহ',
    districts: [
      { district: 'Mymensingh', districtBn: 'ময়মনসিংহ', upazilas: [
        'Mymensingh City','Mymensingh Sadar','Bhaluka','Dhobaura','Fulbaria','Gaffargaon','Gauripur','Haluaghat','Ishwarganj','Muktagachha','Nandail','Phulpur','Trishal',
      ]},
      { district: 'Jamalpur', districtBn: 'জামালপুর', upazilas: [
        'Jamalpur Sadar','Bakshiganj','Dewanganj','Islampur','Madarganj','Melandaha','Sarishabari',
      ]},
      { district: 'Netrokona', districtBn: 'নেত্রকোণা', upazilas: [
        'Netrokona Sadar','Atpara','Barhatta','Durgapur (Netrokona)','Kalmakanda','Kendua','Khaliajuri','Madan','Mohanganj','Purbadhala',
      ]},
      { district: 'Sherpur', districtBn: 'শেরপুর', upazilas: [
        'Sherpur Sadar','Jhenaigati','Nakla','Nalitabari','Sreebardi',
      ]},
    ],
  },
];

/* ── Flat lists ─────────────────────────────────────────────────── */
export const ALL_DIVISIONS  = BD.map((d) => d.division);
export const ALL_DISTRICTS  = BD.flatMap((d) => d.districts.map((x) => x.district));
export const ALL_UPAZILAS   = BD.flatMap((d) => d.districts.flatMap((x) => x.upazilas));
export const ALL_LOCATIONS  = [...new Set([...ALL_DIVISIONS, ...ALL_DISTRICTS, ...ALL_UPAZILAS])];

/* ── Smart search expansion ─────────────────────────────────────── */
/**
 * Given a search term (e.g. "Rajshahi"), returns all child locations.
 * - Division → all districts + upazilas inside
 * - District → all upazilas inside
 * - Upazila → [itself]
 * - Unknown → [term] (pass through)
 */
export function expandLocation(term) {
  if (!term?.trim()) return [];
  const q = term.trim().toLowerCase();

  // Division match
  const div = BD.find((d) =>
    d.division.toLowerCase() === q || d.divisionBn.includes(term)
  );
  if (div) {
    return [
      div.division,
      ...div.districts.map((x) => x.district),
      ...div.districts.flatMap((x) => x.upazilas),
    ];
  }

  // District match
  for (const div of BD) {
    const dist = div.districts.find((d) =>
      d.district.toLowerCase() === q ||
      d.districtBn.includes(term) ||
      d.district.toLowerCase().includes(q)
    );
    if (dist) return [dist.district, ...dist.upazilas];
  }

  // Partial match on district (e.g. "Rajshahi" still matches "Rajshahi Sadar" etc.)
  const upazilaMatches = ALL_UPAZILAS.filter((u) => u.toLowerCase().includes(q));
  if (upazilaMatches.length > 0) return upazilaMatches;

  return [term];
}

/**
 * Build a grouped <optgroup> structure for select elements
 */
export function getLocationGroups() {
  return BD.map((div) => ({
    label: `${div.divisionBn} (${div.division} Division)`,
    options: div.districts.flatMap((dist) => [
      { value: dist.district, label: `── ${dist.district}`, isDistrict: true },
      ...dist.upazilas.map((u) => ({ value: u, label: `   ${u}` })),
    ]),
  }));
}
