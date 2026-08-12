import { CaseStudy } from "@/lib/types";

export const projects: CaseStudy[] = [
  {
    id: "tarlac-city-surveillance",
    title: "Tarlac City Municipal CCTV & Command Center",
    category: "Smart City & Municipal Surveillance",
    location: "Tarlac City, Philippines",
    year: "2024",
    summary: "City-wide digital IP surveillance network and centralized 24/7 emergency control room deployment equipped with AI License Plate Recognition and video wall matrix.",
    metrics: [
      { label: "IP Cameras Deployed", value: "150+" },
      { label: "Control Room Video Wall", value: "12 Screens" },
      { label: "Wireless Backbone", value: "10 Gbps" },
      { label: "Incidents Resolved", value: "99.4%" }
    ],
    deliverables: [
      "High-speed fiber optic backbone & IP radio wireless links across key intersections",
      "Centralized 24/7 Emergency Command Center with multi-view video wall",
      "AI ANPR / License Plate Recognition on major thoroughfares",
      "Field maintenance team SLA for emergency camera repairs"
    ],
    image: "/images/projects/tarlac-command-center.jpg",
    mapCoordinates: "15.4802° N, 120.5979° E",
    highlightText: "Transformed municipal public safety monitoring with real-time incident tracking and rapid dispatch capability."
  },
  {
    id: "barangay-cctv-network",
    title: "Barangay Wired Public Safety CCTV Network",
    category: "Community & Local Government",
    location: "Central Luzon, Philippines",
    year: "2024",
    summary: "Comprehensive barangay-wide outdoor CCTV setup using heavy-duty weatherized poles, optical fiber horizontal cabling, and local monitoring station.",
    metrics: [
      { label: "Coverage Zone", value: "24 Barangays" },
      { label: "Outdoor Bullet/PTZ", value: "85 Nodes" },
      { label: "Fiber Cabling", value: "12.5 km" },
      { label: "Crime Reduction", value: "35%" }
    ],
    deliverables: [
      "Heavy-duty pole mounting with vandal-proof dome and speed PTZ cameras",
      "Dedicated fiber backbone with surge protection and UPS power backup",
      "Barangay Hall local monitoring station with simple playback controls",
      "Community safety reporting interface"
    ],
    image: "/images/projects/barangay-cctv.jpg",
    mapCoordinates: "15.4500° N, 120.6000° E",
    highlightText: "Empowered local community leaders with high-definition video evidence and round-the-clock perimeter security."
  },
  {
    id: "retail-store-installations",
    title: "Commercial Store Outlets & Mall Installations",
    category: "Commercial & Retail Enterprise",
    location: "Metro Manila & Luzon",
    year: "2024",
    summary: "Integrated surveillance, electronic access control, and structured cabling for multi-branch retail stores and commercial establishments.",
    metrics: [
      { label: "Store Outlets", value: "40+ Branches" },
      { label: "Access Doors", value: "120 Doors" },
      { label: "AI People Counters", value: "40 Units" },
      { label: "Uptime SLA", value: "99.9%" }
    ],
    deliverables: [
      "Store POS & cashier dedicated CCTV camera angles",
      "AI People Counting & Foot Traffic Heatmap Analytics",
      "Electronic magnetic locks with keycard access control for inventory rooms",
      "Centralized cloud video audit for store managers"
    ],
    image: "/images/projects/store-installation.jpg",
    mapCoordinates: "14.5995° N, 120.9842° E",
    highlightText: "Standardized IT and security deployment across retail branches, cutting inventory shrinkage and enhancing customer analytics."
  }
];
