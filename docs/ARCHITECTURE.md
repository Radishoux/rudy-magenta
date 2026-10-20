# Architecture

## Périmètre

Page promotionnelle française de **magenta**, artiste indé résidant aux Pays-Bas.
Le site donne accès au titre **balcon**, à sa lyric video, aux trois réseaux
sociaux et à une adresse professionnelle. Il ne contient ni compte visiteur,
ni formulaire, ni base de données, ni paiement.

## Stack et raisons

- HTML sémantique : contenu disponible sans JavaScript, indexable et facile à éditer.
- CSS natif : composition responsive et thème sombre cohérent, sans framework.
- JavaScript navigateur : lecteur YouTube au clic et copie du contact.
- Bun 1.3.7 : scripts de validation, build et serveur local sans paquet tiers.
- GitHub Pages : hébergement statique conforme au brief, domaine possible plus tard.

Les imports `node:fs/promises` et `node:path` sont les modules compatibles
intégrés à Bun ; les commandes de travail utilisent exclusivement Bun.

## Commandes exactes

Depuis la racine du projet, avec Bun installé :

```powershell
bun run dev
bun run check
bun run build
bun run preview
```

`dev` sert `public/` et `preview` sert `dist/`. Un seul doit occuper le port 4174.
Le serveur écoute uniquement `127.0.0.1`. Pour changer de port en PowerShell :

```powershell
$env:PORT = "4175"
bun run dev
```

Il n’y a pas de dépendances à installer. Le check est un contrôle statique de
publication, pas une preuve visuelle. Vérifier aussi le site en navigateur à
390 px et 1440 px, les liens, le lecteur et la navigation clavier.

## Déploiement GitHub Pages

1. Créer un dépôt GitHub dédié et y pousser le contenu de ce projet.
2. Utiliser `main` comme branche de publication, ou adapter `pages.yml`.
3. Dans Settings > Pages, sélectionner **GitHub Actions** comme source.
4. Le push sur `main` ou un lancement manuel du workflow construit puis
   publie `dist/` dans l’environnement `github-pages`.
5. Ouvrir l’URL fournie par le job de déploiement et vérifier mobile, liens,
   vidéo et absence d’erreurs de ressources.

Les chemins CSS/JS/favicon sont relatifs, donc utilisables à la racine ou sous
`/<nom-du-depot>/`. L’adresse publique actuelle est
`https://radishoux.github.io/rudy-magenta/`, également utilisée dans le lien
canonique, `og:url` et les données structurées de `public/index.html`.
Aucun `CNAME` ne présume du futur domaine. Un domaine personnalisé se configure
ensuite dans Pages et chez son fournisseur DNS ; mettre ces trois URL à jour.

Le workflow suit la [documentation officielle GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),
consultée le 20 octobre 2026. L’écriture Pages et le jeton OIDC sont limités au
job `deploy`. Aucun secret personnel n’est nécessaire dans le projet.

## Structure

```text
public/                  Tout ce qui peut être publié
  index.html             Texte, liens, métadonnées, structure
  styles.css             Tokens et responsive
  app.js                 Lecteur au clic, copie d’adresse
  assets/favicon.svg     Monogramme typographique local
  .nojekyll              Désactivation du traitement Jekyll
scripts/
  check.ts               Contrôles statiques
  build.ts               Nettoyage de dist/ et copie d’une liste explicite
  serve.ts               Serveur local
.github/workflows/
  pages.yml              Build et déploiement Pages
docs/                    Documentation technique publique
dist/                    Résultat généré, ignoré par Git
```

## Dépendances entre modules

`index.html` charge `styles.css` et `app.js`. Aucun de ces fichiers ne dépend
des scripts Bun. `check.ts` lit les fichiers publics. `build.ts` vérifie que le
chemin réel de `dist/` reste dans le projet, nettoie ce répertoire généré et
copie seulement la liste publique autorisée. `serve.ts` sert `public/` ou `dist/`.
GitHub Actions exécute le check, puis le build, puis publie seulement `dist/`.

## Données et invariants

Le contenu est directement écrit dans `public/index.html`, sans CMS.

- Nom affiché confirmé : **magenta**, toujours en minuscules, ainsi que les
  titres. L’ensemble des textes publics utilise les minuscules.
- Contact public fourni par l’artiste : `rudy.magenta74@gmail.com`.
- Instagram : `https://www.instagram.com/rudy_magenta/`
- TikTok : `https://www.tiktok.com/@rudy.magenta`
- YouTube : `https://www.youtube.com/@Magenta74`
- Smartlink vérifié dans Chrome, avec les destinations d’écoute affichées :
  `https://release.landr.com/991061284891`
- Vidéo vérifiée : `https://www.youtube.com/watch?v=QyZS4qw0xKk`,
  titre « magenta - balcon (official lyric video) », publiée le 10 octobre 2026.
- La miniature externe provient de l’URL observée sur YouTube, conservée dans
  le HTML et les métadonnées Open Graph. Elle représente le vrai clip.
- Le prochain morceau **tes bras** est en cours : paroles et boucle existantes,
  d’après l’artiste. Aucune date de sortie n’est annoncée.

Ne pas placer d’analyses de compte, statistiques privées, exports d’écoute,
identifiants, rushes inédits ou documents stratégiques dans ce dépôt destiné
à être public. Le build ne doit jamais publier la racine du dépôt.

Le lecteur n’existe pas au chargement : seule la miniature externe est
présente. Cela implique néanmoins une requête image à YouTube. Au clic simple,
`app.js` crée un iframe `youtube-nocookie.com`. Le clic modifié et l’absence de
JavaScript conservent le lien YouTube normal. Le lien externe sous la vidéo
reste disponible en cas de lecteur indisponible.

## Un parcours de bout en bout

Un visiteur arrive sur `index.html`, lit le nom et voit la miniature de balcon.
Un clic sur **Écouter balcon** ouvre le smartlink LANDR. Un clic sur l’image
charge le lecteur YouTube dans la même zone 16:9, sans déplacement de mise en
page. Plus bas, les liens sociaux ouvrent les profils exacts. Le contact
ouvre le logiciel mail, ou le bouton copie l’adresse quand Clipboard API est
disponible. Les résultats de copie et de chargement sont annoncés par une
zone `role="status"`.

## Difficultés et pièges

- GitHub Pages est statique : aucun serveur Bun n’y est lancé. Le serveur est
  exclusivement un outil de prévisualisation.
- Les chemins absolus `/styles.css` casseraient un site de projet Pages.
  Garder les chemins `./`.
- Le build utilise une liste explicite. Si un nouvel asset est ajouté sous
  `public/assets/`, il est copié ; un fichier à la racine de `public/` doit
  aussi être ajouté à la liste de `build.ts`.
- La miniature est externe et peut être indisponible. Le lien, son nom
  accessible et le titre du clip restent utilisables. La remplacer par un
  asset fourni par l’artiste est une évolution possible.
- L’iframe peut être bloqué par le navigateur ou les restrictions YouTube.
  Garder le lien direct, ne pas promettre que `load` signifie lecture réussie.
- La copie nécessite un contexte sécurisé ; le bouton est caché si
  l’API n’existe pas. Le lien mail fonctionne dans tous les cas.
- Le thème sombre suit la direction artistique demandée, sans bascule
  automatique. Les mouvements sont de simples retours d’interaction et
  disparaissent en préférence de mouvement réduit.
- Z-index : seul le lien d’évitement utilise `1`, pour rester accessible
  au-dessus du contenu.
- Le dépôt est un nouveau projet sans graphify. Un petit graphe propre au
  projet pourra être ajouté s’il gagne plusieurs pages ou modules.

## Validation initiale

Le 20 octobre 2026 : check statique et build Bun réussis. Les réponses HTTP de
la page, du CSS, du JavaScript et du favicon sont 200. Dans Chrome, l’inspection
desktop a confirmé le rendu, le lancement de balcon après clic et le message
« adresse copiée » après copie du contact. Les mises en page étroites ont été
inspectées dans des iframes de 390 et 768 px sous Chrome, sans débordement
horizontal (largeurs utiles 375 et 753 px avec barres de défilement). Il ne
s’agit pas d’un test sur téléphone physique. Le premier workflow
`39434733563` a terminé avec succès ; le site public a été ouvert dans Chrome,
avec son contenu et sa mise en page. Le smartlink LANDR affiche bien
« magenta - balcon » et les destinations Spotify, Apple Music, Deezer,
YouTube Music, Amazon Music et TIDAL.
