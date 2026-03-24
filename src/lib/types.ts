export type VerificationStatus = "Vérifié" | "Probable" | "Non vérifié";

export type Lead = {
  id: string;
  user_id?: string;
  collection_id?: string | null;
  full_name: string;
  job_title: string;
  company_name: string;
  sector: string;
  location: string;
  professional_email: string;
  professional_phone: string;
  linkedin_url: string;
  email_status: VerificationStatus;
  phone_status: VerificationStatus;
  primary_source: string;
  collected_at: string;
  created_at?: string;
};

export type Collection = {
  id: string;
  user_id?: string;
  prompt: string;
  region: string;
  sector: string;
  target_count: number;
  results_count: number;
  status: "pending" | "processing" | "completed" | "completed_demo" | "failed";
  created_at: string;
  completed_at?: string | null;
  notes?: string | null;
};

export type Profile = {
  id: string;
  full_name: string;
  company: string;
  plan: string;
  export_preferences?: string;
};

export type DashboardStats = {
  totalLeads: number;
  verifiedEmails: number;
  verifiedPhones: number;
  topSector: string;
  topCountry: string;
  collectionCount: number;
};

export type CollectionFilters = {
  prompt: string;
  region: string;
  sector: string;
  targetCount: number;
};

export type LeadExportRow = {
  "Dirigeant Nom Complet": string;
  Poste: string;
  "Nom Entreprise": string;
  "Secteur d'Activité": string;
  "Localisation (Ville, Pays)": string;
  "Email Professionnel": string;
  "Numéro Téléphone Professionnel": string;
  "LinkedIn URL": string;
  "Statut Email": VerificationStatus;
  "Statut Téléphone": VerificationStatus;
  "Source Principale": string;
  "Date Collecte": string;
};
