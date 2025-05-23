import { Entreprise } from "./entreprise";
import { DatabaseEntity } from "./utils/database-entity";

export interface Country extends DatabaseEntity {
  id: number;
  alpha2code: string | null;
  alpha3code: string | null;
  addresses?: Address[];
}

export interface Address extends DatabaseEntity {
  id: number;
  address: string | null;
  address2: string | null;
  region: string | null;
  zipcode: string | null;
  countryId: number | null;
  country?: Country | null;
  Entreprise?: Entreprise[];
}
