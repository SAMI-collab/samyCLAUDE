# Boucle : relance des clients fidélité (boutique téléphonie)

| Partie | Définition |
|---|---|
| Rythme de vérification | Chaque lundi, 8 h 36 (heure d'Alger) |
| Agit quand | Au moins 1 client sans visite depuis ≥ N jours (réglage « Relancer après », 30 par défaut) ET pas déjà relancé depuis 14 jours |
| Objectif | Faire revenir en magasin les clients qui s'éloignent |
| Données | App « Carte Fidélité Mobile » : https://claude.ai/artifact/BU5tUQ4R3Yh3esV2tgYHbo (collections `clients`, `config`) |
| Étapes | 1. Lire `config/boutique` et `clients`. 2. Garder ceux dont `dernier` ≥ N jours. 3. Retirer ceux présents dans l'état ci-dessous depuis < 14 jours. 4. Pour chacun, écrire un message WhatsApp perso (prénom, achats restants avant le cadeau). 5. Mettre à jour l'état ci-dessous, commit + push. |
| Auto-vérification | Si `clients` est vide ou illisible, ou si plus de 50 % des clients sont « absents » (probable bug ou magasin fermé), ne rien préparer et prévenir le propriétaire. |
| Garde-fou | La boucle PRÉPARE les messages, elle n'envoie JAMAIS rien. Le propriétaire envoie lui-même sur WhatsApp. Maximum 20 messages par semaine. Pas de relance à un client qui a demandé à ne plus être contacté (champ `stop: true`). |
| Arrêt | Désactiver la routine « Relance clients fidélité ». Arrêt automatique et alerte si l'app est inaccessible 2 semaines de suite. |
| Sortie | Un résumé dans la conversation : nombre de clients à relancer + messages prêts à copier. |

## État (mis à jour à chaque passage)
<!-- format : AAAA-MM-JJ | id_client | nom -->
Dernier passage : jamais
