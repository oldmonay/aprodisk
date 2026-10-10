/* =========================================================
   APRODISC — DONNÉES DU SITE
   C'est le SEUL fichier à modifier pour :
     - changer les infos de l'association (adresse, e-mail…)
     - régler les permanences (mardis / samedis)
     - ajouter un article dans une rubrique
   Voir le fichier README.md pour le mode d'emploi.
   ========================================================= */

var APRODISC = {};

/* ---------- Informations générales ----------
   Mettez null pour une info inconnue : elle s'affichera
   en jaune « à compléter » pour qu'on pense à la remplir. */
APRODISC.infos = {
  nom: "APRODISC",
  slogan: "L'informatique pour tous, à votre rythme",
  nomComplet: "Association pour la promotion et le développement de l'informatique à Saint-Caprais-de-Bordeaux",
  ville: "Saint-Caprais-de-Bordeaux",
  adresse: null,          // ex. "12 rue de la Mairie, 33880 Saint-Caprais-de-Bordeaux"
  lieu: null,             // ex. "Salle polyvalente, 1er étage"
  email: null,            // ex. "contact@aprodisc.org"
  cotisation: null        // ex. "15 € par an"
};

/* ---------- Permanences ----------
   Deux façons d'indiquer le rythme :
     - semaines: "impaires" (ou "paires") → numéro de semaine du calendrier
     - reference: "AAAA-MM-JJ" → une date connue, puis toutes les 2 semaines
   Le site calcule tout seul les dates suivantes. */
APRODISC.permanences = {
  samedi: { libelle: "Permanence", semaines: "impaires",
            horaire: "14h30 – 22h (et souvent plus !)" },
  mardi:  { libelle: "Atelier FabLab", semaines: "paires",   // à confirmer
            horaire: "14h – 17h" },
  // Dates où l'association est exceptionnellement fermée (vacances, jours fériés…)
  fermetures: [
    // "2026-12-26",
  ]
};

/* ---------- Rubriques ----------
   L'ordre ici est l'ordre d'affichage.
   "mission: true" = grandes tuiles en haut de l'accueil. */
APRODISC.rubriques = [
  { id: "reparation", titre: "Réparation", page: "reparation.html", mission: true,
    resume: "Un ordinateur lent, un téléphone en panne ? On regarde ensemble.",
    action: "Faire réparer" },
  { id: "arnaques", titre: "Arnaques & sécurité", page: "arnaques.html", mission: true,
    resume: "Reconnaître les faux mails, SMS et appels. Bien se protéger.",
    action: "Se protéger" },
  { id: "cours", titre: "Cours informatique", page: "cours.html", mission: true,
    resume: "Ordinateur, tablette, internet, e-mails : apprendre pas à pas.",
    action: "Apprendre" },
  { id: "word", titre: "Tutos Word", page: "word.html",
    resume: "Écrire une lettre, la mettre en forme, l'imprimer.",
    action: "Voir les tutos" },
  { id: "excel", titre: "Tutos Excel", page: "excel.html",
    resume: "Faire ses comptes, des listes, des tableaux.",
    action: "Voir les tutos" },
  { id: "fablab", titre: "Fablab", page: "fablab.html",
    resume: "Impression 3D, bricolage numérique, créations.",
    action: "Découvrir" },
  { id: "actualites", titre: "Actualités", page: "actualites.html",
    resume: "Les nouvelles de l'association et du numérique.",
    action: "Lire" }
];

/* ---------- Articles ----------
   Le plus récent EN HAUT de la liste.
   Pour ajouter un article : copiez le fichier articles/modele.html,
   écrivez votre texte, puis ajoutez une ligne ici. */
APRODISC.articles = [
  { rubrique: "actualites", titre: "Bienvenue sur notre nouveau site !",
    resume: "Un site plus simple, plus lisible, pensé pour vous.",
    date: "2026-10-10", duree: "2 min de lecture",
    url: "articles/nouveau-site.html", motsCles: "site internet nouveau bienvenue" },

  { rubrique: "arnaques", titre: "Faux SMS « Votre colis est en attente »",
    resume: "Le piège le plus courant du moment, et comment l'éviter.",
    date: "2026-10-08", duree: "3 min de lecture",
    url: "articles/faux-sms-colis.html", motsCles: "sms texto colis livraison la poste chronopost lien arnaque phishing hameconnage" },

  { rubrique: "reparation", titre: "Bien préparer sa venue à l'atelier réparation",
    resume: "Ce qu'il faut apporter pour qu'on puisse vous aider rapidement.",
    date: "2026-10-06", duree: "3 min de lecture",
    url: "articles/preparer-reparation.html", motsCles: "réparation panne ordinateur téléphone chargeur mot de passe sauvegarde" },

  { rubrique: "arnaques", titre: "Faux conseiller bancaire : les phrases qui doivent vous alerter",
    resume: "Votre banque ne vous demandera jamais vos codes par téléphone.",
    date: "2026-10-03", duree: "4 min de lecture",
    url: "articles/faux-conseiller-bancaire.html", motsCles: "banque téléphone appel code carte bancaire arnaque escroquerie" },

  { rubrique: "word", titre: "Écrire et imprimer une lettre avec Word",
    resume: "De la page blanche à la feuille imprimée, en 6 étapes.",
    date: "2026-10-01", duree: "6 étapes",
    url: "articles/lettre-word.html", motsCles: "word lettre courrier écrire imprimer traitement de texte" },

  { rubrique: "excel", titre: "Suivre ses dépenses du mois avec Excel",
    resume: "Un petit tableau pour savoir où va son argent.",
    date: "2026-09-29", duree: "6 étapes",
    url: "articles/budget-excel.html", motsCles: "excel tableau budget dépenses comptes somme calcul" },

  { rubrique: "cours", titre: "Créer un bon mot de passe (et s'en souvenir)",
    resume: "La méthode de la phrase secrète, simple et solide.",
    date: "2026-09-26", duree: "4 min de lecture",
    url: "articles/mot-de-passe.html", motsCles: "mot de passe sécurité compte phrase secrète" },

  { rubrique: "actualites", titre: "Windows 10 n'est plus suivi : que faire ?",
    resume: "Pas de panique : voici les solutions, sans jargon.",
    date: "2026-09-22", duree: "4 min de lecture",
    url: "articles/fin-windows-10.html", motsCles: "windows 10 11 mise à jour microsoft ordinateur linux" },

  { rubrique: "fablab", titre: "Le fablab, c'est quoi ?",
    resume: "Un atelier pour fabriquer, bricoler et créer avec le numérique.",
    date: "2026-09-18", duree: "2 min de lecture",
    url: "articles/fablab-cest-quoi.html", motsCles: "fablab imprimante 3d atelier fabrication création" }
];
