import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Heart, Brain, Stethoscope, Droplets, Activity } from "lucide-react";

interface TipCardProps {
  title: string;
  content: string;
  category?: string;
}

function TipCard({ title, content, category }: TipCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {category && (
            <Badge variant="outline" className="ml-2">
              {category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm">{content}</p>
      </CardContent>
    </Card>
  );
}

export default function Tips() {
  // Fetch health tips from API
  const { data: healthTips, isLoading } = useQuery({
    queryKey: ['/api/health-tips'],
  });
  
  // Default tips in case API fails
  const defaultTips = [
    {
      id: 1,
      title: "Respiration 4-7-8",
      content: "Lorsque vous avez une envie de fumer, essayez la technique de respiration 4-7-8 : inspirez pendant 4 secondes, retenez pendant 7 secondes, expirez pendant 8 secondes. Répétez 3 fois.",
      category: "Gestion des envies"
    },
    {
      id: 2,
      title: "Buvez beaucoup d'eau",
      content: "Rester bien hydraté peut aider à réduire les envies et à éliminer plus rapidement la nicotine de votre corps.",
      category: "Santé générale"
    },
    {
      id: 3,
      title: "Activité physique",
      content: "Même une courte promenade de 5 minutes peut réduire significativement l'intensité d'une envie de fumer.",
      category: "Activité physique"
    },
    {
      id: 4,
      title: "Évitez les déclencheurs",
      content: "Identifiez les situations qui vous donnent envie de fumer et essayez de les éviter pendant les premières semaines.",
      category: "Gestion des envies"
    },
    {
      id: 5,
      title: "Occupez vos mains",
      content: "Gardez vos mains occupées avec un stylo, une balle anti-stress ou tout autre petit objet pour distraire votre esprit.",
      category: "Gestion des envies"
    }
  ];
  
  const tips = healthTips || defaultTips;
  
  // FAQ data
  const faqs = [
    {
      question: "Combien de temps durent les envies de fumer ?",
      answer: "Les envies de fumer durent généralement entre 3 et 5 minutes. Elles peuvent être intenses mais elles passent rapidement. Avec le temps, leur fréquence et leur intensité diminuent."
    },
    {
      question: "Les substituts nicotiniques sont-ils efficaces ?",
      answer: "Oui, les substituts nicotiniques (patchs, gommes, etc.) peuvent doubler vos chances de réussite. Ils aident à gérer les symptômes de sevrage en fournissant une dose contrôlée de nicotine sans les autres produits chimiques nocifs présents dans la cigarette."
    },
    {
      question: "Vais-je prendre du poids en arrêtant de fumer ?",
      answer: "Certaines personnes prennent un peu de poids (2-4 kg) après avoir arrêté de fumer, mais pas tout le monde. Cela est dû à plusieurs facteurs, notamment un métabolisme ralenti et parfois une tendance à remplacer la cigarette par des collations. Une alimentation équilibrée et une activité physique régulière peuvent aider à limiter cette prise de poids."
    },
    {
      question: "Combien de temps faut-il pour que mon risque de cancer diminue ?",
      answer: "Le risque de cancer commence à diminuer dès que vous arrêtez de fumer. Après 10 ans sans tabac, votre risque de cancer du poumon est réduit d'environ 50% par rapport à celui d'un fumeur. Après 15-20 ans, votre risque se rapproche de celui d'une personne qui n'a jamais fumé."
    },
    {
      question: "Est-il vraiment plus difficile d'arrêter après plusieurs tentatives ?",
      answer: "Non, au contraire. La plupart des fumeurs font plusieurs tentatives avant de réussir définitivement. Chaque tentative est une expérience d'apprentissage qui vous rapproche du succès final. Ne vous découragez pas si vous avez déjà essayé sans succès."
    }
  ];
  
  // Health improvement milestones
  const healthMilestones = [
    {
      time: "20 minutes",
      improvement: "Votre rythme cardiaque et votre tension artérielle commencent à baisser.",
      icon: <Heart className="h-8 w-8 text-red-500" />
    },
    {
      time: "12 heures",
      improvement: "Le taux de monoxyde de carbone dans votre sang revient à la normale.",
      icon: <Droplets className="h-8 w-8 text-blue-500" />
    },
    {
      time: "2 semaines à 3 mois",
      improvement: "Votre circulation sanguine s'améliore et votre fonction pulmonaire augmente.",
      icon: <Stethoscope className="h-8 w-8 text-green-500" />
    },
    {
      time: "1 à 9 mois",
      improvement: "La toux et l'essoufflement diminuent. Les cils des poumons commencent à fonctionner normalement.",
      icon: <Activity className="h-8 w-8 text-yellow-500" />
    },
    {
      time: "1 an",
      improvement: "Votre risque de maladie coronarienne est réduit de moitié par rapport à celui d'un fumeur.",
      icon: <Heart className="h-8 w-8 text-red-500" />
    },
    {
      time: "5 ans",
      improvement: "Votre risque d'AVC est réduit au même niveau que celui d'un non-fumeur.",
      icon: <Brain className="h-8 w-8 text-purple-500" />
    }
  ];
  
  return (
    <Layout 
      title="Conseils et astuces" 
      subtitle="Découvrez des conseils pour vous aider à arrêter de fumer"
    >
      <Tabs defaultValue="tips">
        <TabsList className="mb-6">
          <TabsTrigger value="tips">Conseils quotidiens</TabsTrigger>
          <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
          <TabsTrigger value="health">Améliorations santé</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tips" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle>Conseil du jour</AlertTitle>
            <AlertDescription>
              Tenez un journal de vos envies de fumer. Notez quand elles surviennent, ce qui les déclenche et comment vous y faites face. Cela vous aidera à identifier des schémas et à développer des stratégies efficaces.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                title={tip.title}
                content={tip.content}
                category={tip.category}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Réponses aux questions les plus courantes sur l'arrêt du tabac
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Améliorations pour votre santé</CardTitle>
              <CardDescription>
                Découvrez comment votre corps récupère après l'arrêt du tabac
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {healthMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">
                      {milestone.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {milestone.time}
                      </h3>
                      <p className="text-gray-600">{milestone.improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
