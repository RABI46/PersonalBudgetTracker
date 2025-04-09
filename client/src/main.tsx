import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Utiliser l'application simplifiée pour vérifier si le rendu fonctionne correctement
createRoot(document.getElementById("root")!).render(<SimpleApp />);
