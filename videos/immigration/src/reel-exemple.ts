import type {ReelProps} from './Reel';
// Pour une nouvelle vidéo : change le fond, la voix et les phrases (temps en secondes)
export const exemple: ReelProps = {
  fond: 'fond-reel.png',
  titre: 'Entrée express',
  sousTitre: 'بالمختصر المفيد',
  marque: 'TA MARQUE',
  voix: 'voix-elevenlabs.mp3',
  phrases: [
    {debut: 0, fin: 1.4, texte: 'Vous rêvez du Canada ?'},
    {debut: 1.5, fin: 5.4, texte: 'Entrée express est le système fédéral pour immigrer comme travailleur qualifié.'},
    {debut: 5.6, fin: 10.3, texte: 'Trois programmes : travailleurs qualifiés, métiers spécialisés, expérience canadienne.'},
    {debut: 10.4, fin: 14.4, texte: 'Créez votre profil, obtenez votre score, recevez une invitation.'},
  ],
};
