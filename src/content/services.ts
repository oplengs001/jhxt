import { ServicePillar } from "@/lib/types";

export const services: ServicePillar[] = [
  {
    slug: "surveillance-solutions",
    title: "Surveillance Solutions",
    shortTitle: "Surveillance & CCTV",
    iconName: "Camera",
    badge: "Enterprise Security",
    summary: "End-to-end CCTV system design, deployment, and 24/7 maintenance across wired and wireless infrastructure.",
    description: "JHXTES delivers industrial-grade surveillance ecosystems engineered for high-density environments, municipal control rooms, and commercial facilities. We integrate high-resolution digital IP and analog camera networks with wireless microwave links and centralized monitoring centers.",
    bullets: [
      "CCTV System Setup & Architecture",
      "Digital IP & Ultra-HD Analog Cameras",
      "Proactive Repair & Preventative Maintenance",
      "Wireless Point-to-Point & Wired Networks",
      "Dome, Bullet, PTZ & Speed Dome Installations",
      "Centralized Command Center Integration"
    ],
    keyFeatures: [
      { title: "Multi-Form Factor", desc: "Deployment of Vandal-proof Dome, Long-range Bullet, and 360° PTZ cameras." },
      { title: "Hybrid Infrastructure", desc: "Seamless bridge between legacy analog coaxial and modern fiber/IP digital cameras." },
      { title: "24/7 Health Monitoring", desc: "Automated alert systems for camera signal loss, disk storage, and power status." }
    ],
    applications: ["Municipal Command Centers", "Barangay Public Safety", "Commercial Outlets", "Industrial Warehouses"],
    specs: [
      { label: "Resolution Support", value: "Up to 4K UHD (8MP / 12MP)" },
      { label: "Storage Architecture", value: "NVR / SAN / RAID 5/6 Redundancy" },
      { label: "Connectivity", value: "Cat6 Ethernet / Fiber Optic / 5GHz Wireless" }
    ]
  },
  {
    slug: "cabling-solutions",
    title: "Structured Cabling Solutions",
    shortTitle: "Structured Cabling",
    iconName: "Cable",
    badge: "Infrastructure Backbone",
    summary: "High-performance copper horizontal cabling, fiber backbone installation, termination, testing, and cabinet rehabilitation.",
    description: "A resilient physical layer is the foundation of modern IT infrastructure. JHXTES provides certified copper and fiber optic cabling solutions compliant with TIA/EIA standards, ensuring maximum bandwidth, low latency, and organized rack cabinets.",
    bullets: [
      "Copper Horizontal & Vertical Cabling",
      "Cable Trunking & Cabinet Rehabilitation",
      "High-Precision Termination & Fluke Testing",
      "Ongoing Maintenance & Cable Audits",
      "Single-Mode & Multi-Mode Fiber Optic Backbone",
      "Structured Rack & Patch Panel Cable Management"
    ],
    keyFeatures: [
      { title: "TIA/EIA Certified", desc: "Strict adherence to Category 6 / 6A and optical fiber standards." },
      { title: "Rack Aesthetics & Hygiene", desc: "Transform messy wire clutter into color-coded, labeled, easily auditable racks." },
      { title: "Certified OTDR Testing", desc: "Comprehensive attenuation loss report for every fiber core and copper link." }
    ],
    applications: ["Data Centers", "Multi-Story Commercial Buildings", "Corporate Offices", "Educational Campuses"],
    specs: [
      { label: "Media Types", value: "Cat6, Cat6A, Cat7, Single-Mode & Multi-Mode Fiber" },
      { label: "Testing Standard", value: "Fluke Networks CableAnalyzer Certified" },
      { label: "Warranty", value: "Up to 25-Year System Performance Guarantee" }
    ]
  },
  {
    slug: "network-solution",
    title: "Network Solutions & Security",
    shortTitle: "Network & Wireless",
    iconName: "Network",
    badge: "High-Speed Connectivity",
    summary: "Robust LAN architecture, IP Radio microwave links, enterprise wireless LAN, and next-gen network security.",
    description: "JHXTES designs, deploys, and secures high-availability enterprise networks. From enterprise LAN switching and VLAN segmentation to outdoor microwave point-to-point links and wireless mesh networks, we keep your business connected.",
    bullets: [
      "Enterprise LAN & Core Switch Architecture",
      "IP Radio & Microwave Long-Distance Links",
      "Network Security, Firewalls & VPN Gateways",
      "High-Density Wireless LAN (Wi-Fi 6/6E)",
      "Bandwidth Management & QoS Optimization",
      "VLAN Segmentation & Network Isolation"
    ],
    keyFeatures: [
      { title: "Long-Range Wireless Microwave", desc: "Bridge networks across several kilometers without trenching expensive fiber cables." },
      { title: "Next-Gen Firewall Defense", desc: "Deep packet inspection, intrusion prevention, and secure remote VPN access." },
      { title: "Seamless Wi-Fi Roaming", desc: "Zero-handoff wireless coverage across large facilities." }
    ],
    applications: ["Remote Site Bridging", "Smart Campuses", "Hotel & Hospitality Wi-Fi", "Enterprise Headquarters"],
    specs: [
      { label: "Wireless Standard", value: "Wi-Fi 6 (802.11ax) & Wi-Fi 6E Multi-Gigabit" },
      { label: "Microwave Throughput", value: "Up to 2.5 Gbps Full Duplex" },
      { label: "Security Layer", value: "Zero-Trust Architecture / IPSec VPN / IDS/IPS" }
    ]
  },
  {
    slug: "telephony-solution",
    title: "Telephony & Unified Communications",
    shortTitle: "Telephony & IP-PBX",
    iconName: "PhoneCall",
    badge: "Voice & Contact Center",
    summary: "Integrated contact center solutions, IP/Analog/Digital PABX systems, and VoIP communication channels.",
    description: "Modernize corporate voice communications with JHXTES's unified telephony architectures. We deliver scalable IP-PBX systems, call center agent setups, IVR menus, and traditional analog PBX migrations.",
    bullets: [
      "Contact Center Infrastructure & Agent Queues",
      "Analog, Digital & IP Phone Deployments",
      "IP-PBX & Hybrid PABX Server Setup",
      "SIP Trunking & VoIP Routing",
      "Interactive Voice Response (IVR) & Auto-Attendant",
      "Call Recording & Analytics Reporting"
    ],
    keyFeatures: [
      { title: "Omnichannel Contact Center", desc: "Queue management, live call wallboards, and CRM VoIP integration." },
      { title: "Hybrid PABX Integration", desc: "Retain legacy analog extensions while expanding with modern IP SIP phones." },
      { title: "Crystal Clear Voice Quality", desc: "Dedicated voice VLANs to eliminate packet drop and call lag." }
    ],
    applications: ["BPO & Call Centers", "Customer Support Desks", "Hospitality / Hotels", "Corporate Executive Suites"],
    specs: [
      { label: "Protocols Supported", value: "SIP, H.323, ISDN PRI, FXS/FXO" },
      { label: "Capacity", value: "10 to 10,000+ Concurrent Extensions" },
      { label: "Integration", value: "Microsoft Teams, CRM, WebRTC" }
    ]
  },
  {
    slug: "electronic-door-lock",
    title: "Electronic Door Lock Solutions",
    shortTitle: "Smart Door Locks",
    iconName: "Lock",
    badge: "Smart Access Control",
    summary: "Centralized access management featuring real-time wireless control, multi-ID tech, and UL10C fire resistance.",
    description: "Upgrade facility security with intelligent electronic door locks. Engineered with UL10C 3-hour fire resistance ratings, real-time wireless status reporting, and multi-modal credentials (RFID, Keypad, PIN, Mobile Bluetooth).",
    bullets: [
      "Centralized Multi-Door Access Management",
      "Wireless Real-Time Status & Audit Logging",
      "UL10C Compliant Fire-Resistant Locks",
      "Multi-ID Credentials (RFID, Mobile, PIN, Key)",
      "Anti-Panic Emergency Mechanical Override",
      "Hotel & Tenant Master Key System"
    ],
    keyFeatures: [
      { title: "UL10C Fire Resistance", desc: "Certified 3-hour fire rating safety compliance for commercial doors." },
      { title: "Wireless Online Monitoring", desc: "Real-time door status alerts, low-battery warnings, and door-ajar alarms." },
      { title: "Mobile Key Support", desc: "Issue temporary digital keys via smartphone app for guests or contractors." }
    ],
    applications: ["Hotels & Hospitality", "Residential Condominiums", "Corporate Office Suites", "Server Rooms"],
    specs: [
      { label: "Fire Rating", value: "UL10C Positive Pressure Fire Test (3 Hours)" },
      { label: "Wireless Spectrum", value: "Zigbee / Bluetooth LE / Sub-GHz" },
      { label: "Battery Life", value: "Up to 18 Months (100,000 operations)" }
    ]
  },
  {
    slug: "cctv-ai-technology",
    title: "CCTV with AI Analytics",
    shortTitle: "AI Vision & Analytics",
    iconName: "BrainCircuit",
    badge: "Intelligent Video",
    summary: "Next-gen AI camera surveillance: Facial recognition, people counting, thermal scanning, LPR, and perimeter intrusion.",
    description: "Transform video monitoring from passive recording into proactive intelligence. JHXTES AI vision systems automatically identify license plates, detect unauthorized perimeter breaches, count foot traffic, and monitor thermal anomalies in real time.",
    bullets: [
      "AI Facial Recognition & Watchlist Alerts",
      "Bi-Directional People & Vehicle Counting",
      "License Plate Recognition (ANPR / LPR)",
      "Thermal Body Temperature & Fire Scanner",
      "Intrusion Line Crossing & Object Detection",
      "Smart Forensic Video Search Engine"
    ],
    keyFeatures: [
      { title: "ANPR / LPR Engine", desc: "Automated license plate reading for parking access and municipal traffic surveillance." },
      { title: "Perimeter Intrusion AI", desc: "Eliminates 95%+ of false alarms caused by rain, wind, or animals." },
      { title: "Heat Mapping & Foot Traffic", desc: "Generate actionable analytics on customer flow in retail environments." }
    ],
    applications: ["Smart Cities & Toll Gates", "Retail Stores & Malls", "High-Security Logistics", "Subdivision Gates"],
    specs: [
      { label: "Recognition Speed", value: "< 200 milliseconds" },
      { label: "Accuracy", value: "99.2% ANPR / 98.7% Facial Recognition" },
      { label: "Integration", value: "VMS API, Access Gates, Boom Barriers" }
    ]
  },
  {
    slug: "fire-detection-alarm",
    title: "Fire Detection & Alarm System (FDAS)",
    shortTitle: "FDAS Systems",
    iconName: "Flame",
    badge: "Life Safety",
    summary: "Addressable and conventional fire alarm installations, smoke detectors, pull stations, and emergency warning horns.",
    description: "Protect life and assets with JHXTES's certified Fire Detection and Alarm Systems (FDAS). We design fully addressable systems that pinpoint exact alarm zones, triggering automated ventilation shutdown and emergency evacuation signals.",
    bullets: [
      "Addressable & Conventional FDAS Control Panels",
      "Optical Smoke & Rate-of-Rise Heat Detectors",
      "Manual Break-Glass Pull Stations & Strobes",
      "Integrated Evacuation Alarm Siren & Horns",
      "HVAC & Elevator Interlock Systems",
      "Annual Bureau of Fire Protection (BFP) Compliance"
    ],
    keyFeatures: [
      { title: "Pinpoint Zone Mapping", desc: "Addressable panels show the exact room and sensor location of smoke or heat." },
      { title: "Automated HVAC Shutdown", desc: "Interlocks stop air handling units to prevent smoke propagation during fire." },
      { title: "Auxiliary Power Backup", desc: "Uninterrupted battery system guarantees operation during power outages." }
    ],
    applications: ["High-Rise Buildings", "Manufacturing Plants", "Shopping Centers", "Hospitals & Schools"],
    specs: [
      { label: "Standards", value: "NFPA 72 & BFP Code Compliant" },
      { label: "Panel Types", value: "Addressable Loop 1 - 8 Loops / Conventional 4 - 32 Zones" },
      { label: "Backup Runtime", value: "24 Hours Standby + 30 Mins Alarm" }
    ]
  },
  {
    slug: "access-control",
    title: "Access Control Systems",
    shortTitle: "Access Control",
    iconName: "ShieldCheck",
    badge: "Perimeter Security",
    summary: "Biometric fingerprint, face recognition, RFID card readers, and centralized time-attendance management software.",
    description: "Control who enters your physical facilities with JHXTES access control solutions. Enforce strict permissions per department, track visitor logs, and integrate attendance records directly into payroll software.",
    bullets: [
      "Biometric Fingerprint & 3D Face Verification",
      "RFID Contactless Smart Card Readers",
      "Time & Attendance Shift Software Integration",
      "Multi-Door Controller Panels & Electric Locks",
      "Anti-Passback & Door Interlock Rules",
      "Visitor Management System & QR Badging"
    ],
    keyFeatures: [
      { title: "Touchless Facial Verification", desc: "Hygienic, high-speed access authentication in under 0.3 seconds." },
      { title: "Centralized Audit Trail", desc: "Real-time web dashboard tracking entry/exit events across all branches." },
      { title: "Emergency Lockdown Mode", desc: "Instant single-button lockdown or fire panic exit release." }
    ],
    applications: ["Corporate Headquarters", "Research Laboratories", "Data Centers", "Government Facilities"],
    specs: [
      { label: "Authentication Modes", value: "Face / Fingerprint / RFID Card / Mobile NFC / PIN" },
      { label: "Capacity", value: "Up to 50,000 Users / 100,000 Transaction Logs" },
      { label: "Communication", value: "TCP/IP, Wiegand, OSDP 2.0, RS485" }
    ]
  },
  {
    slug: "parking-boom-barrier",
    title: "Parking Boom Barriers",
    shortTitle: "Boom Barriers",
    iconName: "Construction",
    badge: "Traffic Management",
    summary: "Automated high-speed vehicle barrier gates, loop detectors, RFID long-range tags, and ticketing systems.",
    description: "Streamline vehicle entrance and exit flows with JHXTES heavy-duty parking boom barriers. Integrated with ANPR cameras and long-range UHF RFID tags for seamless hands-free entry.",
    bullets: [
      "High-Speed Automatic Boom Barrier Arm",
      "Long-Range UHF RFID Reader (Up to 10m)",
      "Safety Ground Loop & Infrared Anti-Smash",
      "Ticket Dispenser & Automatic Payment Terminal",
      "Manual Override Crank for Power Failures",
      "LED Directional Traffic Light Integration"
    ],
    keyFeatures: [
      { title: "Anti-Smash Protection", desc: "Double safety protection via ground induction loops and photo-electric sensors." },
      { title: "Fast Opening Speeds", desc: "Adjustable 1.5s to 6s opening speed for high-volume traffic congestion control." },
      { title: "Weatherproof Housing", desc: "IP54 / IP65 powder-coated chassis built for tropical outdoor conditions." }
    ],
    applications: ["Subdivision Gates", "Commercial Parking Lots", "Industrial Parks", "Toll Booths"],
    specs: [
      { label: "Arm Length", value: "3m to 6m Telescopic / Folding Arm" },
      { label: "Opening Speed", value: "1.5s (High Speed) to 6s (Standard)" },
      { label: "Motor Type", value: "Brushless DC Motor (3 Million MTBF Cycles)" }
    ]
  },
  {
    slug: "xray-baggage-scanner",
    title: "X-Ray Baggage Scanners",
    shortTitle: "X-Ray Scanners",
    iconName: "Scan",
    badge: "Inspection Tech",
    summary: "Dual-energy X-ray screening machines for luggage, parcels, and cargo with organic/inorganic color identification.",
    description: "Provide high-assurance security screening at entry checkpoints. JHXTES X-ray inspection systems feature multi-energy imaging that highlights explosives, weapons, drugs, and contraband with color-coded material separation.",
    bullets: [
      "Dual-Energy X-Ray Imaging Generator",
      "Organic / Inorganic Material Color Separation",
      "Threat Image Projection (TIP) Training System",
      "High-Density Metal Penetration (Up to 40mm steel)",
      "Bi-Directional Heavy-Duty Conveyor Belt",
      "Operator Console with HD Split-Screen Displays"
    ],
    keyFeatures: [
      { title: "Color-Coded Material ID", desc: "Orange for organics (explosives/drugs), Blue for metals (guns/knives), Green for mixed materials." },
      { title: "Real-Time AI Threat Assist", desc: "Automated visual bounding boxes highlighting suspicious objects." },
      { title: "Low Radiation Output", desc: "Strict safety shielding compliance protecting operators and passengers." }
    ],
    applications: ["Airports & Seaports", "Government Buildings", "Embassies", "Event Venues & Stadiums"],
    specs: [
      { label: "Tunnel Sizes", value: "5030 (Small Parcel) / 6550 (Standard) / 100100 (Cargo)" },
      { label: "Steel Penetration", value: "38mm to 43mm Standard" },
      { label: "Conveyor Load", value: "150 kg to 200 kg Distributed Load" }
    ]
  },
  {
    slug: "walkthrough-metal-detector",
    title: "Walkthrough Metal Detectors",
    shortTitle: "Metal Detectors",
    iconName: "Footprints",
    badge: "Personal Security",
    summary: "Multi-zone walkthrough detection archways with LED zone positioning, sensitivity tuning, and pass-through counters.",
    description: "Screen individuals rapidly without causing queues. Our multi-zone walkthrough metal detectors pinpoint the exact height and side of concealed metal objects using bright LED indicator columns.",
    bullets: [
      "18 to 33 Pinpoint Detection Zones",
      "Dual LED Column Displays Showing Threat Location",
      "Adjustable Sensitivity (0 to 999 Levels)",
      "Passenger In/Out Traffic Counter",
      "Password Protected Control System",
      "Harmless to Pacemakers, Pregnant Women & Magnetic Media"
    ],
    keyFeatures: [
      { title: "Precise Zone Pinpointing", desc: "LED strips illuminate on the left/right frame at the exact height of detected metal." },
      { title: "High Throughput Screening", desc: "Inspect up to 60 persons per minute with minimal false alarms from belt buckles." },
      { title: "Interference Immunity", desc: "Advanced digital signal filtering prevents crosstalk between adjacent gateways." }
    ],
    applications: ["Courthouses & Prisons", "Hotel Entrances", "Shopping Malls", "Factories & Warehouses"],
    specs: [
      { label: "Detection Zones", value: "18 / 24 / 33 Independent Zones" },
      { label: "Pass Rate", value: "Up to 60 Persons / Minute" },
      { label: "Power Supply", value: "AC 110V-240V with Battery Backup Option" }
    ]
  },
  {
    slug: "turnstile",
    title: "Turnstiles & Pedestrian Speed Gates",
    shortTitle: "Turnstiles & Gates",
    iconName: "DoorClosed",
    badge: "Crowd Control",
    summary: "Tripod turnstiles, flap barriers, and optical speed gates integrated with access readers and emergency auto-drop.",
    description: "Manage pedestrian access smoothly in lobbies, transit stations, and office entrances. JHXTES turnstiles combine sleek stainless steel aesthetics with high-speed brushless motors and anti-tailgating sensors.",
    bullets: [
      "Tripod Turnstile Gates with Auto-Drop Arm",
      "Optical Acrylic Flap & Swing Speed Gates",
      "Anti-Tailgating & Anti-Reverse Entry Sensors",
      "Fire Alarm Emergency Automatic Fail-Safe",
      "Integrated Biometric / RFID / QR Reader Slots",
      "304 Stainless Steel Waterproof Construction"
    ],
    keyFeatures: [
      { title: "Anti-Tailgating Infrared Grid", desc: "Sensors detect unauthorized followers and trigger sound alarms." },
      { title: "Emergency Arm Drop", desc: "Arms automatically drop flat upon power loss or fire alarm trigger for panic escape." },
      { title: "Sleek Glass & LED Lighting", desc: "Architectural designs with LED passage status arrows." }
    ],
    applications: ["Commercial Lobby Towers", "Gyms & Sports Clubs", "Theme Parks & Venues", "Transit Stations"],
    specs: [
      { label: "Passage Width", value: "550mm (Standard) to 900mm (Handicap / Wheelchair)" },
      { label: "Throughput", value: "35 to 45 Persons / Minute" },
      { label: "MTBF", value: "5 Million Operations" }
    ]
  },
  {
    slug: "managed-services",
    title: "Managed IT Services & Support",
    shortTitle: "Managed IT Services",
    iconName: "Headphones",
    badge: "24/7 Outsourcing",
    summary: "Comprehensive computer repair, server maintenance, backup & recovery, website dev, and dedicated onsite SLA support.",
    description: "Focus on growing your core business while JHXTES manages your complete IT ecosystem. From desktop/laptop repair and automated cloud backups to full IT outsourcing and custom website maintenance.",
    bullets: [
      "Computer, Laptop & Server Hardware Repair",
      "Automated Data Backup & Disaster Recovery",
      "Full IT Outsourcing & Remote Service Desk",
      "Website Development & Continuous Maintenance",
      "Onsite Technical Support & Emergency Response",
      "Custom Maintenance Agreement Plans (SLA)"
    ],
    keyFeatures: [
      { title: "Guaranteed SLA Response", desc: "Under 15-minute response time for critical infrastructure tickets." },
      { title: "Preventative Maintenance", desc: "Regular quarterly hardware cleaning, disk defrag, and security patching." },
      { title: "Complete Web & Digital Stack", desc: "Design, hosting, domain, SSL, and ongoing website updates." }
    ],
    applications: ["SMB Companies", "Retail Chains", "Educational Institutions", "Corporate Enterprises"],
    specs: [
      { label: "Support Coverage", value: "24/7/365 Remote Desk + Onsite Technicians" },
      { label: "SLA Response", value: "15-Min Remote / 2-Hour Onsite Emergency" },
      { label: "Backup System", value: "Encrypted Cloud + On-Premises NAS Mirror" }
    ]
  }
];
