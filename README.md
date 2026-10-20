# magenta

Site public de l’artiste : sortie **balcon**, lyric video, morceau **tes bras** en cours,
réseaux et contact. HTML/CSS/JavaScript sans dépendance.

```powershell
bun run dev       # http://127.0.0.1:4174
bun run check     # chemins, ancres et invariants de publication
bun run build     # fichiers publics dans dist/
bun run preview   # servir dist/ sur le même port, arrêter dev avant
```

Installer Bun 1.3.7 ou plus récent. Aucune installation de paquets n’est requise.

Le workflow `.github/workflows/pages.yml` publie `dist/` après un push sur
`main`, une fois GitHub Pages configuré avec la source **GitHub Actions**.
Le dépôt distant et la première publication sont à effectuer séparément.

Lire [l’architecture](docs/ARCHITECTURE.md) pour déployer et modifier le site,
et [les décisions](docs/DECISIONS.md) pour comprendre les choix.
