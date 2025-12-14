// Sweet image mapping for AI-generated images
import chocolateTruffles from '@/assets/sweets/chocolate-truffles.png';
import gummyBears from '@/assets/sweets/gummy-bears.png';
import lollipop from '@/assets/sweets/lollipop.png';
import caramels from '@/assets/sweets/caramels.png';
import peppermint from '@/assets/sweets/peppermint.png';
import chocolateBar from '@/assets/sweets/chocolate-bar.png';
import sourWorms from '@/assets/sweets/sour-worms.png';
import cherryDrops from '@/assets/sweets/cherry-drops.png';

export const sweetImages: Record<string, string> = {
  'Dark Chocolate Truffles': chocolateTruffles,
  'Rainbow Gummy Bears': gummyBears,
  'Strawberry Lollipops': lollipop,
  'Salted Caramels': caramels,
  'Peppermint Drops': peppermint,
  'Milk Chocolate Bar': chocolateBar,
  'Sour Worms': sourWorms,
  'Cherry Drops': cherryDrops,
};

export const getCategoryDefaultImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    'Chocolates': chocolateTruffles,
    'Gummies': gummyBears,
    'Lollipops': lollipop,
    'Caramels': caramels,
    'Mints': peppermint,
    'Hard Candy': cherryDrops,
    'Licorice': sourWorms,
  };
  return categoryImages[category] || chocolateTruffles;
};

export const getSweetImage = (name: string, category: string, imageUrl: string | null | undefined): string => {
  // First check if we have a specific image for this sweet
  if (sweetImages[name]) {
    return sweetImages[name];
  }
  
  // If there's a custom URL, use it
  if (imageUrl) {
    return imageUrl;
  }
  
  // Fall back to category default
  return getCategoryDefaultImage(category);
};
