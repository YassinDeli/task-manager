import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { CountryRepository } from "../repositories/country.repository";
import { Country } from "@/types";

export class CountryService {
  private countryRepository: CountryRepository;

  constructor(countryRepository: CountryRepository) {
    this.countryRepository = countryRepository;
  }
  async getPaginatedCountries(
    queryObject: IQueryObject
  ): Promise<Paginated<Country>> {
    return this.countryRepository.findPaginated(queryObject);
  }

  async getAllCountries(queryObject: IQueryObject): Promise<Country[]> {
    return this.countryRepository.findByCondition(queryObject);
  }

  async getCountryById(id: number): Promise<Country | null> {
    return this.countryRepository.findById(id);
  }

  async createCountry(data: Partial<Country>): Promise<Country> {
    return this.countryRepository.create(data);
  }

  async updateCountry(id: number, data: Partial<Country>): Promise<Country> {
    return this.countryRepository.update(id, data);
  }

  async deleteCountry(id: number): Promise<Country> {
    return this.countryRepository.softDelete(id);
  }

  async countCountries(where: any = {}): Promise<number> {
    return this.countryRepository.count(where);
  }
}
