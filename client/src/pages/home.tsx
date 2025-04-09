import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Cigarette, 
  Timer, 
  PiggyBank, 
  LineChart, 
  Cloud, 
  Bell, 
  Heart 
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 text-blue-900">
            StopClope
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            L'Application web Anti-Tabac qui rend l'arrêt du tabac plus facile que jamais
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Commencer Maintenant
          </button>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Fonctionnalités Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Timer}
            title="Suivi des cigarettes"
            description="Enregistrez et chronométrez chaque cigarette avec un simple clic"
          />
          <FeatureCard
            icon={PiggyBank}
            title="Calculateur d'économies"
            description="Visualisez l'argent économisé jour après jour"
          />
          <FeatureCard
            icon={Heart}
            title="Conseils santé"
            description="Recevez des conseils quotidiens pour vous motiver"
          />
          <FeatureCard
            icon={Bell}
            title="Notifications"
            description="Restez motivé avec des rappels personnalisés"
          />
          <FeatureCard
            icon={LineChart}
            title="Statistiques"
            description="Suivez vos progrès avec des graphiques interactifs"
          />
          <FeatureCard
            icon={Cloud}
            title="Sauvegarde cloud"
            description="Accédez à vos données sur tous vos appareils"
          />
        </div>
      </section>

      {/* Why StopClope Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi Choisir StopClope ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Soutien Immédiat</h3>
              <p className="text-blue-200">Visualisez vos efforts dès le premier jour</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contrôle Total</h3>
              <p className="text-blue-200">Personnalisez tous les paramètres selon vos besoins</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Accessibilité</h3>
              <p className="text-blue-200">Vos données sécurisées et accessibles partout</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Personnalisation</h3>
              <p className="text-blue-200">Une expérience adaptée à votre rythme</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Prêt à arrêter de fumer ?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Rejoignez des milliers d'utilisateurs qui ont déjà commencé leur voyage vers une vie sans tabac
        </p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Commencer Gratuitement
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 StopClope. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
