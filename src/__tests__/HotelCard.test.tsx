import '@testing-library/jest-dom';
import { hotelSchema } from '@/schemas/hotel.schema';

describe('hotelSchema', () => {
  it('validates correct hotel data', () => {
    const result = hotelSchema.safeParse({
      id: 1,
      nom: 'Hôtel Le Palace',
      categorie: '5',
      adresse: 'Tunis',
      email: 'contact@hotel.tn',
      photos: ['https://example.com/photo.jpg'],
      prix_unitaire: 350,
    });
    expect(result.success).toBe(true);
  });

  it('validates hotel with null photos', () => {
    const result = hotelSchema.safeParse({
      id: 1,
      nom: 'Hôtel Test',
      categorie: '3',
      adresse: 'Sfax',
      email: null,
      photos: null,
      prix_unitaire: null,
    });
    expect(result.success).toBe(true);
  });
});
