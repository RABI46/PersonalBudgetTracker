// App constants
export const APP_NAME = "StopClope";

// Context types for cravings
export const CRAVING_CONTEXTS = [
  { id: "afterMeal", label: "Après un repas" },
  { id: "stress", label: "Stress" },
  { id: "coffee", label: "Café" },
  { id: "alcohol", label: "Alcool" },
  { id: "break", label: "Pause" },
  { id: "other", label: "Autre" }
];

// Intensity types for cravings
export const CRAVING_INTENSITIES = [
  { id: "low", label: "Faible" },
  { id: "medium", label: "Moyenne" },
  { id: "high", label: "Forte" }
];

// Achievement types
export const ACHIEVEMENT_TYPES = [
  { id: "firstDay", label: "Premier jour réussi", icon: "Headphones" },
  { id: "firstWeek", label: "Première semaine", icon: "Calendar" },
  { id: "firstMonth", label: "Premier mois", icon: "Award" },
  { id: "hundredDays", label: "100 jours", icon: "Calendar" }
];

// Health milestones in days
export const HEALTH_MILESTONES = [
  { days: 1, title: "Diminution du risque cardiaque", description: "Votre risque d'infarctus commence à diminuer après 24h sans tabac." },
  { days: 14, title: "Amélioration de la circulation sanguine", description: "Votre circulation sanguine s'est normalisée après 2 semaines sans tabac." },
  { days: 30, title: "Capacité pulmonaire", description: "Après 1 mois, votre capacité pulmonaire commence à s'améliorer significativement." },
  { days: 90, title: "Fonction pulmonaire", description: "Votre fonction pulmonaire s'est améliorée de près de 30%." },
  { days: 365, title: "Risque d'AVC", description: "Votre risque d'accident vasculaire cérébral a été réduit de moitié." }
];

// Default chart periods (in days)
export const CHART_PERIODS = [
  { id: "7days", label: "7 jours", days: 7 },
  { id: "30days", label: "30 jours", days: 30 },
  { id: "90days", label: "3 mois", days: 90 },
  { id: "365days", label: "1 an", days: 365 }
];

// Navigation items
export const NAV_ITEMS = [
  { path: "/home", label: "Accueil", icon: "Home" },
  { path: "/dashboard", label: "Tableau de bord", icon: "LayoutDashboard" },
  { path: "/statistics", label: "Statistiques", icon: "BarChart" },
  { path: "/profile", label: "Profil", icon: "User" },
  { path: "/tips", label: "Conseils", icon: "BookOpen" }
];

// Default cigarette price in cents (adjust based on your country)
export const DEFAULT_CIGARETTE_PACK_PRICE = 1050; // 10.50€
export const DEFAULT_CIGARETTES_PER_PACK = 20;
