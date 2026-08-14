export type ServicePillar = {
  slug: string;
  title: string;
  shortTitle: string;
  iconName: string;
  summary: string;
  description: string;
  bullets: string[];
  keyFeatures: { title: string; desc: string }[];
  applications: string[];
  specs: { label: string; value: string }[];
  badge?: string;
  /** Path to the pillar hero image inside /public — e.g. "/services/surveillance.jpg" */
  image?: string;
  /** Short caption shown on image placeholders */
  imageCaption?: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  metrics: { label: string; value: string }[];
  deliverables: string[];
  image: string;
  mapCoordinates?: string;
  highlightText: string;
};

export type TeamWorkflowNode = {
  id: string;
  step: number;
  title: string;
  role: string;
  description: string;
  responsibilities: string[];
  icon: string;
  sla: string;
};

export type PMBOKStage = {
  id: string;
  step: number;
  title: string;
  tagline: string;
  description: string;
  activities: string[];
  deliverable: string;
  color: string;
};

export type FrameworkStage = {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  outcomes: string[];
};

export type ContactFormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  serviceCategory: string;
  message: string;
};
