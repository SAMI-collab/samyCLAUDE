# « En mouvement » : vidéo de 20 secondes sur l'immigration

## 1. Vue d'ensemble
- **Durée** : 20 s (600 images à 30 ips)
- **Format** : 1080x1920 (vertical, réseaux sociaux)
- **Style** : motion design minimaliste, carte du monde en points, lignes de trajets lumineuses
- **Ton** : humain, factuel, porteur d'espoir. Pas de position politique.
- **Palette** : nuit `#0B1220`, sable `#F2E8D5`, corail `#FF6B4A`, turquoise `#2EC4B6`
- **Typographie** : Inter (titres en 800, texte en 500)

## 2. Stratégie audio
- **Musique** : piano doux et cordes légères (environ 90 BPM). Entrée en fondu de 0 à 1 s, montée à 10 s, sortie en fondu de 18 à 20 s. Volume à 50 %.
- **Effets sonores** :
  - 0,2 s : souffle léger, le point apparaît.
  - 3,0 s : whoosh, les trajets se tracent.
  - 8,0 s : impact doux, le chiffre apparaît.
  - 13,0 s : carillon, les visages apparaissent.
  - 17,5 s : swoosh, le titre final arrive.

## 3. Script scène par scène

### Scène 1 : le point de départ (0-3 s, images 0-90)
**Visuel** : écran nuit. Un seul point corail pulse au centre.
**Texte** : « Partir. » (sable, 120 px, centré sous le point)
**Animation** : le point apparaît avec un ressort (spring, damping 12) à l'image 6. Le texte monte en fondu de l'image 20 à l'image 40. Deux ondes concentriques s'élargissent depuis le point.
**Focus** : le point, c'est-à-dire une personne.

### Scène 2 : les trajets (3-8 s, images 90-240)
**Visuel** : un dézoom révèle une carte du monde en points sable (opacité 30 %). Depuis plusieurs continents, 12 lignes courbes corail et turquoise se tracent progressivement.
**Texte** : « Chaque année, des millions de personnes changent de pays. » (70 px, en haut)
**Animation** : la caméra passe d'une échelle de 3 à 1 entre les images 90 et 130 (easing inOut). Chaque ligne se dessine avec un décalage de 6 images. Le texte apparaît mot par mot (3 images par mot).
**Focus** : le mouvement des lignes.

### Scène 3 : le chiffre (8-13 s, images 240-390)
**Visuel** : la carte s'estompe à 10 %. Au centre, un grand compteur.
**Texte** : « 281 millions » (turquoise, 160 px, 800), puis « de migrants internationaux dans le monde » (60 px) et la source « ONU / OIM, 2020 » (32 px, opacité 60 %).
**Animation** : le compteur va de 0 à 281 en 45 images (easing out). Petit rebond d'échelle (1,08) quand il s'arrête. Le sous-texte monte en fondu 10 images après.
**Focus** : le chiffre.

### Scène 4 : des visages (13-17,5 s, images 390-525)
**Visuel** : une grille de 3x3 silhouettes stylisées et colorées (étudiante, médecin, enfant, cuisinier, ouvrière, etc.).
**Texte** : « Des étudiants. Des soignants. Des familles. » (une phrase par ligne, 64 px)
**Animation** : les silhouettes apparaissent en cascade avec un ressort (décalage de 4 images). Chaque phrase apparaît toutes les 25 images.
**Focus** : la diversité humaine, au-delà du chiffre.

### Scène 5 : conclusion (17,5-20 s, images 525-600)
**Visuel** : les silhouettes se transforment en points qui reforment la carte, puis fondu vers le fond nuit.
**Texte** : « Derrière chaque trajet, une histoire. » (sable, 80 px, 800, centré)
**Animation** : transition morph sur 20 images. Le titre arrive avec un ressort (damping 200). Fondu au noir sur les 10 dernières images.
**Focus** : le message final.

## 4. Spécifications Remotion
- Composition `Immigration` : 1080x1920, 30 ips, 600 images.
- Une `<Sequence>` par scène.
- Animations avec `spring()` et `interpolate()`.
- Carte : points SVG générés en code. Silhouettes : formes SVG simples, sans images externes.
- Audio : à ajouter plus tard. Version 1 muette.
