# Site web de l'association APRODISC — V1

Site simple, pensé pour un public de 60 à 99 ans : gros texte, fort contraste,
grandes zones cliquables, boutons A- / A+ pour agrandir le texte.

Site **statique** (HTML + CSS + un peu de JavaScript) : pas de base de données,
pas de mise à jour de sécurité à faire, hébergement gratuit possible.

## Voir le site sur son ordinateur
Double-cliquez simplement sur `index.html`.

## Ce qu'il reste à compléter
Tout ce qui apparaît **surligné en jaune** sur le site est à compléter.
La plupart se règle dans `assets/js/donnees.js` :

| Info | Où |
|---|---|
| Adresse, lieu, e-mail, cotisation | `donnees.js` → `APRODISC.infos` |
| Horaires des permanences | `donnees.js` → `APRODISC.permanences` → `horaire` |
| Une vraie date de permanence (mardi et samedi) | `donnees.js` → `reference` (le site calcule les suivantes, une semaine sur deux) |
| Fermetures exceptionnelles | `donnees.js` → `fermetures` |
| N° RNA, président(e), hébergeur | `mentions-legales.html` |
| Équipement du fablab | `articles/fablab-cest-quoi.html` |

## Ajouter un article
1. Copier `articles/modele.html` et le renommer (sans accents ni espaces), ex. `articles/arnaque-faux-livreur.html`.
2. Dans le nouveau fichier, changer `data-rubrique="..."` : `reparation`, `arnaques`, `cours`, `word`, `excel`, `fablab` ou `actualites`.
3. Écrire le titre, le résumé et le texte (des blocs « étapes », « à retenir », « astuce », « attention » sont prêts à l'emploi).
4. Ajouter une ligne **en haut** de la liste `APRODISC.articles` dans `assets/js/donnees.js`.

L'article apparaît alors automatiquement sur l'accueil, dans sa rubrique et dans la recherche.

## Organisation des fichiers
```
index.html              Accueil
reparation.html …       Une page par rubrique (7 au total)
permanences.html        Dates, horaires, adresse
association.html        Qui sommes-nous, adhérer, bénévolat
recherche.html          Résultats de recherche
mentions-legales.html
articles/               Les articles (+ modele.html)
assets/css/style.css    Toute la mise en forme
assets/js/donnees.js    LES CONTENUS À MODIFIER
assets/js/site.js       Le fonctionnement (menu, recherche, dates…)
maquettes/              Les 3 maquettes de départ (la B a été retenue)
captures/               Aperçus de la V1
```

## Mettre en ligne
N'importe quel hébergement de pages web statiques convient : GitHub Pages (gratuit),
l'hébergement inclus avec le nom de domaine, etc. Il suffit d'y copier tous les fichiers.
