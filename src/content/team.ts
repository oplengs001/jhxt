import { FrameworkStage, PMBOKStage, TeamWorkflowNode } from "@/lib/types";

export const frameworkStages: FrameworkStage[] = [
  {
    id: "design",
    letter: "D",
    title: "Design",
    subtitle: "Architecture & Blueprinting",
    description: "We analyze client requirements, conduct site surveys, and engineer tailored IT and security blueprints adhering to global technical standards.",
    outcomes: ["Technical Specifications", "CAD Schematic Layouts", "BOM & Cost Estimation"]
  },
  {
    id: "build",
    letter: "B",
    title: "Build",
    subtitle: "Procurement & Deployment",
    description: "Our certified engineering team executes physical installation, structured cabling, hardware mounting, network configuration, and system commissioning.",
    outcomes: ["Hardware Installation", "Fluke Certified Cabling", "System Integration"]
  },
  {
    id: "operate",
    letter: "O",
    title: "Operate",
    subtitle: "24/7 Monitoring & SLA Support",
    description: "We provide round-the-clock remote monitoring, preventative maintenance, rapid troubleshooting, and technical help desk SLA response.",
    outcomes: ["Help Desk SLA Support", "Health Monitoring", "Hardware Repairs"]
  },
  {
    id: "transfer",
    letter: "T",
    title: "Transfer",
    subtitle: "Knowledge & Full Ownership",
    description: "We train client personnel, hand over comprehensive system documentation, and transfer complete operational control with full warranty backing.",
    outcomes: ["Administrator Training", "As-Built Documentation", "Complete Ownership"]
  }
];

export const pmbokStages: PMBOKStage[] = [
  {
    id: "analyze",
    step: 1,
    title: "Analyze",
    tagline: "Needs Assessment & Feasibility",
    description: "Identify client goals, existing infrastructure bottlenecks, security vulnerabilities, and budget parameters.",
    activities: [
      "Site Inspection & Survey",
      "Network Throughput Audits",
      "Risk & Compliance Assessment"
    ],
    deliverable: "Gap Analysis Report",
    color: "#3B82F6"
  },
  {
    id: "design-pm",
    step: 2,
    title: "Design",
    tagline: "System Engineering",
    description: "Develop detailed schematics, bandwidth calculations, hardware bills of materials, and project timelines.",
    activities: [
      "Network Topology Diagramming",
      "Camera FOV & Lens Selection",
      "Power Budget Calculation"
    ],
    deliverable: "Final Design Blueprint",
    color: "#8B5CF6"
  },
  {
    id: "develop",
    step: 3,
    title: "Develop",
    tagline: "Pre-Staging & Configuration",
    description: "Pre-configure routers, firewalls, cameras, and access control servers in JHXTES lab environments prior to field deployment.",
    activities: [
      "Firmware Updates & Flashing",
      "IP Address Scheme Assignment",
      "Lab Stress & Load Testing"
    ],
    deliverable: "Staged Hardware Package",
    color: "#EC4899"
  },
  {
    id: "implement",
    step: 4,
    title: "Implement",
    tagline: "Onsite Installation & Cutover",
    description: "Deploy physical hardware onsite, run certified cabling, mount devices, and execute seamless production cutover.",
    activities: [
      "Structured Cabling & Trunking",
      "Camera & Barrier Mounting",
      "Core Switch Cutover"
    ],
    deliverable: "Commissioned System",
    color: "#F59E0B"
  },
  {
    id: "monitor",
    step: 5,
    title: "Monitor",
    tagline: "SLA Support & Performance Tracking",
    description: "Perform continuous system monitoring, log analysis, uptime reporting, and fast ticket dispatching.",
    activities: [
      "Automated Alerting Systems",
      "Quarterly Hardware Servicing",
      "Bandwidth & Packet Inspection"
    ],
    deliverable: "SLA Health Scorecards",
    color: "#10B981"
  },
  {
    id: "evaluate",
    step: 6,
    title: "Evaluate",
    tagline: "Post-Implementation Audit & Optimization",
    description: "Conduct review meetings with stakeholders to evaluate KPI delivery, gather feedback, and recommend upgrade pathways.",
    activities: [
      "Client Satisfaction Survey",
      "Performance Benchmark Comparison",
      "Future Scalability Roadmap"
    ],
    deliverable: "Project Evaluation Sign-Off",
    color: "#06B6D4"
  }
];

export const teamWorkflow: TeamWorkflowNode[] = [
  {
    id: "client",
    step: 1,
    title: "Client / User",
    role: "Incident Originator",
    description: "Discovers issue or requests system modifications via call, email, or client portal.",
    responsibilities: [
      "Submits ticket via portal or hotlines",
      "Provides site access and problem details",
      "Receives real-time ticket progress updates"
    ],
    icon: "UserCheck",
    sla: "Instant Trigger"
  },
  {
    id: "help-desk",
    step: 2,
    title: "Help Desk Support",
    role: "First Line Dispatch & Triage",
    description: "Logs incident tickets, performs initial diagnostic triage, and categorizes severity levels.",
    responsibilities: [
      "24/7 Multilingual phone & ticketing desk",
      "Initial L1 remote diagnosis & quick fixes",
      "Escalation routing within 15 minutes"
    ],
    icon: "Headphones",
    sla: "< 15 Mins Response"
  },
  {
    id: "remote-team",
    step: 3,
    title: "Remote Service Team",
    role: "L2/L3 Network & Systems Engineers",
    description: "Handles complex software, firewall, database, and system reconfigurations remotely.",
    responsibilities: [
      "Remote VPN access & CLI diagnostics",
      "Firewall rule changes & camera reboots",
      "NVR storage recovery & patch updates"
    ],
    icon: "Laptop",
    sla: "< 1 Hour Resolution"
  },
  {
    id: "field-team",
    step: 4,
    title: "Field Support Team",
    role: "Onsite Hardware Engineers",
    description: "Dispatched directly to client facilities equipped with spare parts and testing equipment for hardware repairs.",
    responsibilities: [
      "Onsite camera/cable replacement",
      "Boom barrier mechanical overhaul",
      "Emergency site dispatch within SLA window"
    ],
    icon: "Wrench",
    sla: "< 2 Hours Onsite"
  }
];
