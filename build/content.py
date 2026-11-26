"""All texts of the landing page, in both languages.

SHARED holds values that are the same in every language.
LANGS holds one dictionary per language. Keys must match in both.
After editing, run:  python3 build/build.py
"""

SHARED = {
    "site_url": "https://balibeach.cloud",
    "wa_number": "420604276271",
    "wa_display": "+420 604 276 271",
    "maps_url": (
        "https://www.google.com/maps?q=Jumpai,+Klungkung,+Klungkung+Regency,+Bali,+Indonesia"
        "&amp;ftid=0x2dd213ca19a9c965:0x3b13e880c8a6ce84"
    ),
    "photo": "/assets/plot-today.jpg",
    "pixel_id": "884397061610419",  # Meta Pixel "Ales Vrana's Pixel"
}

LANGS = {
    "en": {
        "file": "index.html",
        "path": "/",
        "lang_label": "English",
        "og_locale": "en_US",
        "wa_message": "Hi, I'm interested in the 400 m² land at Jumpai Beach.",
        "page_title": "Land for sale by Jumpai Beach, East Bali | 400 m² freehold",
        "meta_description": (
            "400 m² of freehold land, 100 m from Jumpai Beach in East Bali. A calm road, "
            "town 10 minutes away. IDR 2.2 billion, sold directly by the owners."
        ),
        "brand": "Jumpai Beach Land",
        "brand_header": "Jumpai Beach Land for sale - available now",
        "tagline": "For sale by owner",
        "lang_nav_label": "Language",
        "hero_eyebrow": "East Bali · 10 minutes from town",
        "hero_h1": "Your home in BALI<br>by the beach,<br>no traffic",
        "hero_lede": (
            "400 m² of freehold land, 100 m from Jumpai Beach. A calm road, the sea at the end "
            "of it, and town 10 minutes away. Pink zone - building permit for home or commercial."
        ),
        "price_label": "Asking price",
        "price_amount": "IDR 2.2 billion",
        "price_per_are": "IDR 550 million per are (100 m²)",
        "price_approx": "approx. USD 122,000 · approx. EUR 106,000",
        "cta_main": "Message the owner on WhatsApp",
        "lead_cta": "Send me info to my email",
        "lead_title": "Get the details by email",
        "lead_text": "Enter your email and we will send you the link and the price right away.",
        "lead_label": "Your email",
        "lead_submit": "Send me the info",
        "lead_sending": "Sending...",
        "lead_ok": "Sent. Check your inbox, and the spam folder just in case.",
        "lead_err": "That did not work. Please try again, or message us on WhatsApp.",
        "lead_invalid": "Please enter a valid email address.",
        "lead_close": "Close",
        "lead_privacy": "We use your email only to send you this information.",
        "cta_small": "We reply in English or Bahasa Indonesia. No agent, no commission.",
        "map_aria": (
            "Site sketch: a rectangular plot with its 16.6 metre short side on the beach road and a side lane along its north edge, about 100 metres north of Jumpai Beach"
        ),
        "map_plot": "THE PLOT",
        "map_lane": "SIDE LANE 2.8 m",
        "map_front": "16.6 m",
        "map_distance": "approx. 100 m",
        "map_beach": "Jumpai Beach",
        "map_road": "BEACH ROAD",
        "map_road_width": "7 m wide",
        "map_north": "N",
        "map_note": "Site sketch, not to scale. Exact map pin sent on request.",
        "facts_eyebrow": "The facts",
        "fact1_num": "400 m²",
        "fact1_cap": "Land size (4 are)",
        "fact2_num": "100 m",
        "fact2_cap": "Walk to Jumpai Beach",
        "fact3_num": "16.6 m",
        "fact3_cap": "Frontage on a 7 m road",
        "fact4_num": "Freehold",
        "fact4_cap": "Hak Milik certificate (SHM)",
        "fact5_num": "Pink zone",
        "fact5_cap": "Residential and commercial use",
        "fact6_num": "10 min",
        "fact6_cap": "Drive to Semarapura town",
        "facts_note": "All utilities are available at the plot. One owner, one certificate.",
        "photo_eyebrow": "The plot today",
        "photo_h2": "Flat, green and ready for your home",
        "photo_alt": (
            "The plot today: flat grassy land with trees at the back, a boundary wall on the "
            "left and a neighbouring Balinese roof on the right"
        ),
        "photo_caption": (
            "An unedited photo taken on the plot. Level ground, clear boundaries, neighbours on "
            "both sides and the beach a short walk down the road."
        ),
        "loc_eyebrow": "Life in Jumpai",
        "loc_h2": "The sea down the road, town ten minutes away",
        "loc_p1": (
            "Jumpai is a local beach village on Bali's east coast. The beach is a two-minute "
            "walk from the plot, and the road in front of it stays calm. Days here start with "
            "the sound of the sea, not scooters."
        ),
        "loc_p2": (
            "When you need shops, markets and services, Semarapura, the main town of Klungkung, "
            "is 10 minutes away. And there is culture on the doorstep: the new Bali Cultural "
            "Centre is being built 800 m from the plot, with the 50th Bali Arts Festival planned "
            "there for 2028."
        ),
        "stat1_num": "2 minutes",
        "stat1_cap": "On foot to Jumpai Beach",
        "stat2_num": "10 minutes",
        "stat2_cap": "By car to Semarapura, the main town of Klungkung",
        "stat3_num": "45 minutes",
        "stat3_cap": "To Sanur, and about 1 hour to the airport",
        "loc_source": (
            "Drive times are typical and depend on the time of day. Cultural centre plans as "
            "reported by Antara News Bali; government timelines can change."
        ),
        "who_eyebrow": "Who it is for",
        "who_h2": "For people who want a home by the sea",
        "card1_title": "This is for you if",
        "card1_text": (
            "You want to live by the beach in peace. A house and a garden of your own, a quiet "
            "road, a village around you and a town close enough for everyday life."
        ),
        "card2_title": "It is probably not for you if",
        "card2_text": (
            "You want beach clubs, coworking cafés and nightlife at your door. The south of "
            "Bali will suit you better, and we would rather tell you now."
        ),
        "card3_title": "Room for your plans to grow",
        "card3_text": (
            "Pink zoning also allows commercial use, so a rental villa or a small guesthouse "
            "stays possible with the right permits."
        ),
        "own_eyebrow": "Ownership and buying",
        "own_h2": "Clean title, honest answers",
        "own_intro": (
            "The land is held under a single freehold certificate (SHM, Hak Milik). You can ask "
            "for a copy on WhatsApp and have your own notary check it with the land office "
            "before you commit to anything."
        ),
        "own_q1": "Can a foreigner buy this land?",
        "own_a1": (
            "Indonesian citizens can take over the freehold title directly. Foreign buyers "
            "usually purchase through a foreign-owned company (PT PMA), with the title converted "
            "to a Right to Build (HGB), or under a Right to Use (Hak Pakai) with a residence "
            "permit. A licensed notary (PPAT) handles the transfer."
        ),
        "own_q2": "What does pink zone mean?",
        "own_a2": (
            "The plot sits in a zone where both residential and commercial buildings are "
            "permitted. Your notary or architect can confirm the current zoning letter for "
            "your project."
        ),
        "own_q3": "Who am I dealing with?",
        "own_a3": (
            "The owners directly. No broker in between, so no agent fee and no telephone game."
        ),
        "note_eyebrow": "A note from the owners",
        "note_quote": (
            "We searched a long time for this plot and bought it to build our own home. Our "
            "plans have changed, so we will not be building, and we would like to pass it on to "
            "someone it will serve well."
        ),
        "note_after": "It is a beautiful, quiet place close to town, right by the beach.",
        "how_eyebrow": "How it works",
        "how_h2": "From first message to signed deed",
        "step1_t": "Say hello",
        "step1_d": "Message us on WhatsApp with your questions.",
        "step2_t": "See the details",
        "step2_d": "Get the exact map pin and a copy of the certificate.",
        "step3_t": "Visit the plot",
        "step3_d": "Visit the land in person, or ask for a video from the place.",
        "step4_t": "Sign with a notary",
        "step4_d": "Your notary checks the title and prepares the deed.",
        "faq_eyebrow": "Good to know",
        "faq_h2": "Frequently asked questions",
        "faq_q1": "Can I pay in USD or EUR?",
        "faq_a1": "Yes. Payment is made by bank wire transfer, preferably in EUR or USD.",
        "faq_q2": "Who pays the notary fees and taxes?",
        "faq_a2": (
            "Each side pays its own tax, and we share the notary. We pay the seller's income "
            "tax (2.5%). The buyer pays the acquisition tax (BPHTB, 5%) and the land office "
            "registration. The notary fee, usually 0.5 to 1% of the price, is split 50/50. As a "
            "buyer, budget around 5 to 6% on top of the price."
        ),
        "faq_q3": "What is the payment schedule?",
        "faq_a3": (
            "Payment is made in full at the signing of the sale deed (AJB) in front of the "
            "notary (PPAT). The notary checks the certificate with the land office beforehand "
            "and registers the transfer to your name afterwards, so both sides are protected: "
            "you pay only against a verified title, and we hand over the title only against "
            "payment."
        ),
        "faq_q4": "Can I buy without travelling to Bali?",
        "faq_a4": "Yes. The purchase can be arranged remotely with the notary.",
        "faq_q5": "How long does the sale take?",
        "faq_a5": "The transaction can be completed with no delays on our side.",
        "faq_q6": "Can I start building right away?",
        "faq_a6": "The land is in the pink zone and is ready to build on.",
        "faq_q7": "How far is it from the airport and Sanur?",
        "faq_a7": (
            "About 10 minutes to Semarapura, the main town of Klungkung, 45 minutes to Sanur "
            "and 1 hour to the airport."
        ),
        "final_eyebrow": "One plot, one buyer",
        "final_h2": "Could this be your place by the sea?",
        "final_prices": "IDR 2.2 billion (IDR 550 million per are) · approx. USD 122,000 · approx. EUR 106,000",
        "final_cta": "Chat on WhatsApp",
        "final_contact_langs": "English and Bahasa Indonesia",
        "final_map": "Open Jumpai on Google Maps",
        "final_legal": (
            "USD and EUR amounts are approximate, converted at mid-market rates in November "
            "2026. The sale is priced in Indonesian rupiah. Payment can be done in USD, EUR or "
            "IDR. Information on this page is provided by the owners and is not legal advice. "
            "Please verify title and zoning with your own notary."
        ),
        "bar_p1": "IDR 2.2 billion",
        "bar_p2": "IDR 550 million per are",
        "bar_cta": "WhatsApp",
    },
    "id": {
        "file": "id/index.html",
        "path": "/id/",
        "lang_label": "Bahasa",
        "og_locale": "id_ID",
        "wa_message": "Halo, saya tertarik dengan tanah 400 m² di Pantai Jumpai.",
        "page_title": "Dijual tanah dekat Pantai Jumpai, Bali Timur | 400 m² SHM",
        "meta_description": (
            "Tanah SHM 400 m², 100 m dari Pantai Jumpai, Bali Timur. Jalan tenang, kota hanya "
            "10 menit. Rp 2,2 miliar, dijual langsung oleh pemilik."
        ),
        "brand": "Tanah Pantai Jumpai",
        "brand_header": "Tanah Pantai Jumpai dijual - tersedia sekarang",
        "tagline": "Dijual langsung oleh pemilik",
        "lang_nav_label": "Bahasa",
        "hero_eyebrow": "Bali Timur · 10 menit dari kota",
        "hero_h1": "Rumah Anda di BALI<br>dekat pantai,<br>tanpa macet",
        "hero_lede": (
            "Tanah SHM 400 m², 100 m dari Pantai Jumpai. Jalan yang tenang, laut di ujungnya, "
            "dan kota hanya 10 menit. Zona pink - izin bangun untuk hunian atau komersial."
        ),
        "price_label": "Harga penawaran",
        "price_amount": "Rp 2,2 miliar",
        "price_per_are": "Rp 550 juta per are (100 m²)",
        "price_approx": "sekitar USD 122.000 · sekitar EUR 106.000",
        "cta_main": "Hubungi pemilik lewat WhatsApp",
        "lead_cta": "Kirim info ke email saya",
        "lead_title": "Dapatkan detailnya lewat email",
        "lead_text": "Masukkan email Anda, kami langsung mengirim tautan dan harganya.",
        "lead_label": "Email Anda",
        "lead_submit": "Kirim infonya",
        "lead_sending": "Mengirim...",
        "lead_ok": "Terkirim. Silakan cek kotak masuk Anda, dan folder spam untuk berjaga-jaga.",
        "lead_err": "Gagal mengirim. Silakan coba lagi, atau hubungi kami lewat WhatsApp.",
        "lead_invalid": "Mohon masukkan alamat email yang valid.",
        "lead_close": "Tutup",
        "lead_privacy": "Email Anda hanya kami gunakan untuk mengirim informasi ini.",
        "cta_small": (
            "Kami membalas dalam Bahasa Indonesia atau Inggris. Tanpa perantara, tanpa komisi."
        ),
        "map_aria": (
            "Sketsa lokasi: tanah persegi panjang dengan sisi pendek 16,6 meter di jalan pantai dan gang di sisi utara, sekitar 100 meter di utara Pantai Jumpai"
        ),
        "map_plot": "TANAH INI",
        "map_lane": "GANG 2,8 m",
        "map_front": "16,6 m",
        "map_distance": "± 100 m",
        "map_beach": "Pantai Jumpai",
        "map_road": "JALAN PANTAI",
        "map_road_width": "lebar 7 m",
        "map_north": "U",
        "map_note": "Sketsa lokasi, tidak sesuai skala. Titik peta dikirim atas permintaan.",
        "facts_eyebrow": "Fakta singkat",
        "fact1_num": "400 m²",
        "fact1_cap": "Luas tanah (4 are)",
        "fact2_num": "100 m",
        "fact2_cap": "Jalan kaki ke Pantai Jumpai",
        "fact3_num": "16,6 m",
        "fact3_cap": "Lebar muka di jalan 7 m",
        "fact4_num": "SHM",
        "fact4_cap": "Sertifikat Hak Milik",
        "fact5_num": "Zona pink",
        "fact5_cap": "Hunian dan komersial",
        "fact6_num": "10 menit",
        "fact6_cap": "Berkendara ke Kota Semarapura",
        "facts_note": "Semua utilitas tersedia di lokasi. Satu pemilik, satu sertifikat.",
        "photo_eyebrow": "Kondisi tanah saat ini",
        "photo_h2": "Datar, hijau, dan siap dibangun rumah Anda",
        "photo_alt": (
            "Kondisi tanah saat ini: lahan datar berumput dengan pepohonan di bagian belakang, "
            "tembok pembatas di kiri dan atap rumah Bali milik tetangga di kanan"
        ),
        "photo_caption": (
            "Foto asli tanpa editan, diambil di lokasi. Tanah datar, batas jelas, tetangga di "
            "kedua sisi, dan pantai hanya beberapa langkah menyusuri jalan."
        ),
        "loc_eyebrow": "Hidup di Jumpai",
        "loc_h2": "Laut di ujung jalan, kota sepuluh menit saja",
        "loc_p1": (
            "Jumpai adalah desa pantai di pesisir timur Bali. Pantainya dua menit jalan kaki "
            "dari tanah ini, dan jalan di depannya tetap tenang. Hari di sini dimulai dengan "
            "suara ombak, bukan suara motor."
        ),
        "loc_p2": (
            "Untuk belanja, pasar, dan layanan lainnya, Semarapura, ibu kota Kabupaten "
            "Klungkung, hanya 10 menit. Budaya pun dekat: Pusat Kebudayaan Bali sedang dibangun "
            "800 m dari tanah ini, dan Pesta Kesenian Bali ke-50 direncanakan digelar di sana "
            "pada 2028."
        ),
        "stat1_num": "2 menit",
        "stat1_cap": "Jalan kaki ke Pantai Jumpai",
        "stat2_num": "10 menit",
        "stat2_cap": "Naik mobil ke Semarapura, ibu kota Kabupaten Klungkung",
        "stat3_num": "45 menit",
        "stat3_cap": "Ke Sanur, dan sekitar 1 jam ke bandara",
        "loc_source": (
            "Waktu tempuh adalah perkiraan dan bergantung pada jam perjalanan. Rencana pusat "
            "kebudayaan sesuai pemberitaan Antara News Bali; jadwal pemerintah dapat berubah."
        ),
        "who_eyebrow": "Untuk siapa",
        "who_h2": "Untuk Anda yang ingin rumah di tepi laut",
        "card1_title": "Cocok untuk Anda jika",
        "card1_text": (
            "Anda ingin tinggal dekat pantai dengan tenang. Rumah dan taman sendiri, jalan yang "
            "sepi, suasana desa di sekitar, dan kota yang cukup dekat untuk kebutuhan "
            "sehari-hari."
        ),
        "card2_title": "Mungkin kurang cocok jika",
        "card2_text": (
            "Anda mencari beach club, kafe coworking, dan hiburan malam di depan pintu. Bali "
            "selatan akan lebih sesuai, dan lebih baik kami sampaikan dari awal."
        ),
        "card3_title": "Ruang untuk rencana berkembang",
        "card3_text": (
            "Zona pink juga mengizinkan penggunaan komersial, sehingga vila sewa atau guesthouse "
            "kecil tetap memungkinkan dengan izin yang sesuai."
        ),
        "own_eyebrow": "Kepemilikan dan pembelian",
        "own_h2": "Sertifikat bersih, jawaban jujur",
        "own_intro": (
            "Tanah ini berada di bawah satu Sertifikat Hak Milik (SHM). Anda dapat meminta "
            "salinannya lewat WhatsApp dan meminta notaris Anda memeriksanya di kantor "
            "pertanahan sebelum memutuskan apa pun."
        ),
        "own_q1": "Siapa yang bisa membeli tanah ini?",
        "own_a1": (
            "WNI dapat membeli langsung, dan sertifikat dibalik nama atas nama pembeli. WNA "
            "umumnya membeli melalui PT PMA dengan sertifikat diubah menjadi Hak Guna Bangunan "
            "(HGB), atau dengan Hak Pakai bagi pemegang izin tinggal. Proses peralihan ditangani "
            "oleh PPAT."
        ),
        "own_q2": "Apa arti zona pink?",
        "own_a2": (
            "Tanah berada di zona yang mengizinkan bangunan hunian maupun komersial. Notaris "
            "atau arsitek Anda dapat memastikan keterangan tata ruang terbaru untuk rencana Anda."
        ),
        "own_q3": "Dengan siapa saya berurusan?",
        "own_a3": (
            "Langsung dengan pemilik. Tanpa perantara, jadi tanpa komisi agen dan tanpa "
            "informasi yang simpang siur."
        ),
        "note_eyebrow": "Pesan dari pemilik",
        "note_quote": (
            "Kami lama mencari tanah ini dan membelinya untuk membangun rumah kami sendiri. "
            "Rencana kami berubah, jadi kami tidak akan membangun, dan kami ingin menyerahkannya "
            "kepada orang yang benar-benar akan memanfaatkannya."
        ),
        "note_after": "Tempatnya indah dan tenang, dekat kota, tepat di tepi pantai.",
        "how_eyebrow": "Cara kerjanya",
        "how_h2": "Dari pesan pertama hingga akta ditandatangani",
        "step1_t": "Sapa kami",
        "step1_d": "Kirim pertanyaan Anda lewat WhatsApp.",
        "step2_t": "Lihat detailnya",
        "step2_d": "Dapatkan titik peta yang tepat dan salinan sertifikat.",
        "step3_t": "Kunjungi lokasi",
        "step3_d": "Datang langsung ke lokasi, atau minta video dari tempatnya.",
        "step4_t": "Tanda tangan di notaris",
        "step4_d": "Notaris Anda memeriksa sertifikat dan menyiapkan akta.",
        "faq_eyebrow": "Perlu diketahui",
        "faq_h2": "Pertanyaan yang sering diajukan",
        "faq_q1": "Bagaimana cara pembayarannya?",
        "faq_a1": (
            "Melalui transfer bank. Pembayaran dapat dilakukan dalam Rupiah, USD, atau EUR."
        ),
        "faq_q2": "Siapa yang menanggung biaya notaris dan pajak?",
        "faq_a2": (
            "Masing-masing pihak membayar pajaknya sendiri, dan biaya notaris dibagi dua. Kami "
            "membayar PPh penjual (2,5%). Pembeli membayar BPHTB (5%) dan biaya balik nama di "
            "kantor pertanahan. Biaya notaris, biasanya 0,5 sampai 1% dari harga, dibagi 50/50. "
            "Sebagai pembeli, siapkan sekitar 5 sampai 6% di luar harga tanah."
        ),
        "faq_q3": "Bagaimana jadwal pembayarannya?",
        "faq_a3": (
            "Pembayaran dilakukan lunas saat penandatanganan Akta Jual Beli (AJB) di hadapan "
            "PPAT. Sebelumnya notaris memeriksa sertifikat di kantor pertanahan, lalu "
            "mendaftarkan balik nama atas nama Anda. Dengan begitu kedua pihak terlindungi: Anda "
            "membayar hanya untuk sertifikat yang sudah terverifikasi, dan kami menyerahkan "
            "sertifikat hanya setelah pembayaran."
        ),
        "faq_q4": "Bisakah membeli tanpa datang ke Bali?",
        "faq_a4": "Bisa. Pembelian dapat diatur dari jarak jauh bersama notaris.",
        "faq_q5": "Berapa lama proses jual belinya?",
        "faq_a5": "Dari pihak kami, transaksi dapat diselesaikan tanpa penundaan.",
        "faq_q6": "Bisakah langsung membangun?",
        "faq_a6": "Tanah berada di zona pink dan siap dibangun.",
        "faq_q7": "Seberapa jauh dari bandara dan Sanur?",
        "faq_a7": (
            "Sekitar 10 menit ke Semarapura, ibu kota Kabupaten Klungkung, 45 menit ke Sanur, "
            "dan 1 jam ke bandara."
        ),
        "final_eyebrow": "Satu tanah, satu pembeli",
        "final_h2": "Mungkinkah ini tempat Anda di tepi laut?",
        "final_prices": "Rp 2,2 miliar (Rp 550 juta per are) · sekitar USD 122.000 · sekitar EUR 106.000",
        "final_cta": "Chat lewat WhatsApp",
        "final_contact_langs": "Bahasa Indonesia dan Inggris",
        "final_map": "Buka Jumpai di Google Maps",
        "final_legal": (
            "Nilai USD dan EUR adalah perkiraan, dikonversi dengan kurs tengah pada November "
            "2026. Harga jual ditetapkan dalam Rupiah. Pembayaran dapat dilakukan dalam Rupiah, "
            "USD, atau EUR. Informasi di halaman ini disampaikan oleh pemilik dan bukan "
            "merupakan nasihat hukum. Mohon verifikasi sertifikat dan tata ruang dengan notaris "
            "Anda sendiri."
        ),
        "bar_p1": "Rp 2,2 miliar",
        "bar_p2": "Rp 550 juta per are",
        "bar_cta": "WhatsApp",
    },
}
