/**
 * Stripe products configuration for AE Music Lab
 * Beats are dynamically priced based on database records
 */

export interface BeatProduct {
  name: string;
  description: string;
  priceInCents: number;
}

/**
 * Create a Stripe product configuration for a beat
 */
export function createBeatProduct(beat: {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  genre: string;
  bpm: number;
}): BeatProduct {
  return {
    name: beat.title,
    description: `${beat.description || ""} | Genre: ${beat.genre} | BPM: ${beat.bpm}`.trim(),
    priceInCents: beat.price,
  };
}
