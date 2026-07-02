import { reservationFormSchema } from '@/schemas/reservation.schema';
import '@testing-library/jest-dom';

describe('reservationFormSchema', () => {
  it('validates correct reservation data', () => {
    const result = reservationFormSchema.safeParse({
      date_arrivee: '2027-01-10',
      date_depart: '2027-01-15',
      nombre_adultes: 2,
      nombre_enfants: 0,
      nbr_chambre: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects when depart is before arrivee', () => {
    const result = reservationFormSchema.safeParse({
      date_arrivee: '2027-01-15',
      date_depart: '2027-01-10',
      nombre_adultes: 2,
      nombre_enfants: 0,
      nbr_chambre: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero adults', () => {
    const result = reservationFormSchema.safeParse({
      date_arrivee: '2027-01-10',
      date_depart: '2027-01-15',
      nombre_adultes: 0,
      nombre_enfants: 0,
      nbr_chambre: 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero rooms', () => {
    const result = reservationFormSchema.safeParse({
      date_arrivee: '2027-01-10',
      date_depart: '2027-01-15',
      nombre_adultes: 1,
      nombre_enfants: 0,
      nbr_chambre: 0,
    });
    expect(result.success).toBe(false);
  });
});
