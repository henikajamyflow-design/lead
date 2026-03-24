import { CollectionLauncher } from "@/components/collection-launcher";
import { Card } from "@/components/ui/card";

export default function NewCollectionPage() {
  return (
    <div className="space-y-4">
      <CollectionLauncher defaultPrompt="Collecte pour : France, secteur Cybersecurity, cible 25 dirigeants" />
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Sources publiques", "LinkedIn publics, sites corporate, registres officiels, filings, communiqués de presse."],
          ["Vérification", "Email et téléphone doivent toujours garder un statut visible : Vérifié / Probable / Non vérifié."],
          ["Conformité", "Jamais d'adresse privée, numéro personnel ou donnée non professionnelle."],
        ].map(([title, text]) => (
          <Card key={title} className="rounded-[28px] p-5">
            <p className="font-medium text-white">{title}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
