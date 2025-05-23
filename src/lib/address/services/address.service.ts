import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { AddressRepository } from "../repositories/address.repository";
import { Address } from "@/types";

export class AddressService {
  private addressRepository: AddressRepository;

  constructor(addressRepository: AddressRepository) {
    this.addressRepository = addressRepository;
  }
  async getPaginatedAddresss(
    queryObject: IQueryObject
  ): Promise<Paginated<Address>> {
    return this.addressRepository.findPaginated(queryObject);
  }

  async getAllAddresss(queryObject: IQueryObject): Promise<Address[]> {
    return this.addressRepository.findByCondition(queryObject);
  }

  async getAddressById(id: number): Promise<Address | null> {
    return this.addressRepository.findById(id);
  }

  async createAddress(data: Partial<Address>): Promise<Address> {
    return this.addressRepository.create(data);
  }

  async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
    return this.addressRepository.update(id, data);
  }

  async deleteAddress(id: number): Promise<Address> {
    return this.addressRepository.softDelete(id);
  }

  async countAddresss(where: any = {}): Promise<number> {
    return this.addressRepository.count(where);
  }
}
