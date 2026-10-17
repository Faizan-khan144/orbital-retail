export const SUPPLIERS = [
  { id: "sup_aurora", name: "Aurora Components", region: "Shenzhen, CN", leadTime: 14, reliability: 96, onTime: 97, openPOs: 2 },
  { id: "sup_north", name: "Northwind Supply", region: "Rotterdam, NL", leadTime: 9, reliability: 91, onTime: 93, openPOs: 1 },
  { id: "sup_pacific", name: "Pacific Forge", region: "Ho Chi Minh, VN", leadTime: 21, reliability: 88, onTime: 86, openPOs: 3 },
  { id: "sup_helix", name: "Helix Materials", region: "Austin, US", leadTime: 6, reliability: 94, onTime: 95, openPOs: 0 },
  { id: "sup_kestrel", name: "Kestrel Electronics", region: "Taipei, TW", leadTime: 17, reliability: 92, onTime: 90, openPOs: 2 },
  { id: "sup_meridian", name: "Meridian Textiles", region: "Istanbul, TR", leadTime: 12, reliability: 90, onTime: 89, openPOs: 1 },
]

export const CHANNELS = [
  { id: "ch_storefront", name: "Storefront", type: "Direct", share: 0.34 },
  { id: "ch_amazon", name: "Amazon", type: "Marketplace", share: 0.27 },
  { id: "ch_shopify", name: "Shopify", type: "Direct", share: 0.18 },
  { id: "ch_tiktok", name: "TikTok Shop", type: "Social", share: 0.13 },
  { id: "ch_wholesale", name: "Wholesale (B2B)", type: "B2B", share: 0.08 },
]

export const BINS = [
  { id: "A1", zone: "Zone A", capacity: 1200, used: 980 },
  { id: "A2", zone: "Zone A", capacity: 1200, used: 1110 },
  { id: "B1", zone: "Zone B", capacity: 900, used: 610 },
  { id: "B2", zone: "Zone B", capacity: 900, used: 845 },
  { id: "C1", zone: "Cold / Secure", capacity: 400, used: 210 },
  { id: "C2", zone: "Returns", capacity: 300, used: 96 },
]

export const PRODUCTS = [
  { id: "p_lumen", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/A_desk_lamp.jpg/500px-A_desk_lamp.jpg", sku: "ORB-LMP-001", name: "Lumen Desk Lamp", category: "Lighting", price: 89, cost: 38, hue: 268, rating: 4.7, supplierId: "sup_helix", bin: "B1", stock: 142, reorder: 60, velocity: 8.4, tag: "Bestseller", desc: "Warm-to-cool dimmable LED bar with a magnetic head and contactless gesture control." },
  { id: "p_nebula", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Beautiful_Mechanical_Keyboard.jpg/960px-Beautiful_Mechanical_Keyboard.jpg", sku: "ORB-KEY-014", name: "Nebula Mechanical Keyboard", category: "Peripherals", price: 149, cost: 61, hue: 232, rating: 4.8, supplierId: "sup_kestrel", bin: "A1", stock: 58, reorder: 70, velocity: 11.2, tag: "Low stock", desc: "75% hot-swappable board with gasket mount, PBT keycaps and tri-mode wireless." },
  { id: "p_orbit", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/A_black_wireless_computer_mouse.jpg/960px-A_black_wireless_computer_mouse.jpg", sku: "ORB-MSE-007", name: "Orbit Wireless Mouse", category: "Peripherals", price: 69, cost: 24, hue: 190, rating: 4.6, supplierId: "sup_kestrel", bin: "A1", stock: 231, reorder: 80, velocity: 14.1, tag: "Bestseller", desc: "Ultra-light 58g shell, 8K polling and a silent tactile scroll wheel." },
  { id: "p_pulsar", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Computer_monitor_remix_transparent.png/960px-Computer_monitor_remix_transparent.png", sku: "ORB-DSP-002", name: "Pulsar 4K Monitor", category: "Displays", price: 429, cost: 268, hue: 212, rating: 4.5, supplierId: "sup_aurora", bin: "A2", stock: 34, reorder: 25, velocity: 3.1, tag: "New", desc: "27\" 4K 144Hz IPS display with 98% DCI-P3 and single-cable USB-C PD." },
  { id: "p_comet", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/2023_Hub_USB_2.0.jpg/960px-2023_Hub_USB_2.0.jpg", sku: "ORB-HUB-021", name: "Comet USB-C Hub", category: "Accessories", price: 59, cost: 19, hue: 322, rating: 4.4, supplierId: "sup_aurora", bin: "B2", stock: 176, reorder: 90, velocity: 12.8, tag: "", desc: "9-in-1 dock with dual 4K HDMI, 100W passthrough and a 2.5GbE port." },
  { id: "p_aurora", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Headphones_%2856330%29.jpg/960px-Headphones_%2856330%29.jpg", sku: "ORB-AUD-011", name: "Aurora ANC Headphones", category: "Audio", price: 279, cost: 132, hue: 276, rating: 4.9, supplierId: "sup_north", bin: "C1", stock: 92, reorder: 40, velocity: 6.7, tag: "Bestseller", desc: "Adaptive hybrid noise cancellation with 40h battery and spatial audio." },
  { id: "p_quasar", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/JBL_Flip_bluetooth_speaker.jpg/960px-JBL_Flip_bluetooth_speaker.jpg", sku: "ORB-AUD-018", name: "Quasar Bluetooth Speaker", category: "Audio", price: 119, cost: 47, hue: 200, rating: 4.5, supplierId: "sup_north", bin: "C1", stock: 121, reorder: 50, velocity: 7.3, tag: "", desc: "360Ã‚Â° room-filling sound, IP67 rated, with 24h playtime and USB-C." },
  { id: "p_meteor", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/960px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg", sku: "ORB-STO-003", name: "Meteor Portable SSD 1TB", category: "Storage", price: 129, cost: 58, hue: 156, rating: 4.7, supplierId: "sup_pacific", bin: "B2", stock: 204, reorder: 80, velocity: 9.9, tag: "", desc: "2,000MB/s NVMe portable drive with a shockproof aluminium shell." },
  { id: "p_gravity", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Laptop_stand.jpg/500px-Laptop_stand.jpg", sku: "ORB-ACC-009", name: "Gravity Laptop Stand", category: "Accessories", price: 79, cost: 27, hue: 38, rating: 4.6, supplierId: "sup_helix", bin: "B1", stock: 88, reorder: 45, velocity: 5.2, tag: "", desc: "CNC aluminium riser with friction hinges and hidden cable routing." },
  { id: "p_stellar", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/USB_webcam_for_PC.jpg/960px-USB_webcam_for_PC.jpg", sku: "ORB-CAM-005", name: "Stellar 4K Webcam", category: "Peripherals", price: 159, cost: 66, hue: 244, rating: 4.4, supplierId: "sup_kestrel", bin: "A2", stock: 63, reorder: 40, velocity: 4.8, tag: "Low stock", desc: "Sony STARVIS sensor, 4K60 with AI framing and a dual-mic array." },
  { id: "p_photon", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Wireless_Charger_white_front.jpg/500px-Wireless_Charger_white_front.jpg", sku: "ORB-PWR-006", name: "Photon Charging Dock", category: "Power", price: 99, cost: 34, hue: 52, rating: 4.5, supplierId: "sup_pacific", bin: "B1", stock: 149, reorder: 70, velocity: 8.8, tag: "", desc: "3-in-1 MagSafe dock for phone, watch and buds with 15W fast charge." },
  { id: "p_ion", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/IMG_of_power_bank.jpg/500px-IMG_of_power_bank.jpg", sku: "ORB-PWR-012", name: "Ion Power Bank 20K", category: "Power", price: 89, cost: 31, hue: 168, rating: 4.6, supplierId: "sup_pacific", bin: "B2", stock: 112, reorder: 60, velocity: 6.1, tag: "", desc: "140W GaN bank that charges a laptop, with a colour status display." },
  { id: "p_cosmos", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Logitech_Red_mouse_on_a_mouse_pad.jpg/500px-Logitech_Red_mouse_on_a_mouse_pad.jpg", sku: "ORB-ACC-019", name: "Cosmos Desk Mat", category: "Accessories", price: 39, cost: 11, hue: 300, rating: 4.5, supplierId: "sup_meridian", bin: "C2", stock: 305, reorder: 120, velocity: 15.4, tag: "Bestseller", desc: "Stitched-edge felt-and-cork mat with a spill-resistant surface." },
  { id: "p_vector", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Standing_desk.jpg/500px-Standing_desk.jpg", sku: "ORB-FRN-004", name: "Vector Standing Desk", category: "Furniture", price: 649, cost: 388, hue: 12, rating: 4.7, supplierId: "sup_meridian", bin: "C1", stock: 18, reorder: 15, velocity: 1.6, tag: "Low stock", desc: "Dual-motor sit-stand frame with memory presets and a bamboo top." },
  { id: "p_halo", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Arri_SkyPanel_X_LED_Light_Panel.jpg/960px-Arri_SkyPanel_X_LED_Light_Panel.jpg", sku: "ORB-LMP-010", name: "Halo Ring Light", category: "Lighting", price: 69, cost: 22, hue: 350, rating: 4.3, supplierId: "sup_helix", bin: "B1", stock: 167, reorder: 60, velocity: 7.7, tag: "", desc: "Bi-colour 18\" ring with a desk clamp and a USB-C powered control puck." },
  { id: "p_drift", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Office_Chair.jpg/960px-Office_Chair.jpg", sku: "ORB-FRN-016", name: "Drift Ergonomic Chair", category: "Furniture", price: 449, cost: 254, hue: 222, rating: 4.6, supplierId: "sup_meridian", bin: "C2", stock: 27, reorder: 20, velocity: 2.4, tag: "", desc: "Adaptive lumbar support, 4D armrests and a breathable mesh back." },
]

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].sort()
