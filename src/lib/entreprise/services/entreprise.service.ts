import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { EntrepriseRepository } from "../repositories/entreprise.repository";
import { Entreprise } from "@/types";
import { AddressService } from "@/lib/address/services/address.service";
import { EmployeeService } from "./employee.service";

export class EntrepriseService {
  private entrepriseRepository: EntrepriseRepository;
  private addressService: AddressService;
  private employeeService: EmployeeService;

  constructor(
    entrepriseRepository: EntrepriseRepository,
    addressService: AddressService,
    employeeService: EmployeeService
  ) {
    this.entrepriseRepository = entrepriseRepository;
    this.addressService = addressService;
    this.employeeService = employeeService;
  }
  async getPaginatedEntreprises(
    queryObject: IQueryObject
  ): Promise<Paginated<Entreprise>> {
    return this.entrepriseRepository.findPaginated(queryObject);
  }

  async getAllEntreprises(queryObject: IQueryObject): Promise<Entreprise[]> {
    return this.entrepriseRepository.findByCondition(queryObject);
  }

  async getEntrepriseById(id: number): Promise<Entreprise | null> {
    return this.entrepriseRepository.findById(id);
  }

  async createEntreprise(data: Partial<Entreprise>): Promise<Entreprise> {
    return this.entrepriseRepository.create(data);
  }

  async createEntrepriseWithResponsable(
    data: Partial<Entreprise>
  ): Promise<Entreprise> {
    //create address
    const address =
      data.address && (await this.addressService.createAddress(data.address));
    const employee =
      data.responsible &&
      (await this.employeeService.createResponsibleWithUser(data.responsible));

    return this.entrepriseRepository.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      addressId: address?.id,
      responsibleId: employee?.id,
    });
  }

  async updateEntreprise(
    id: number,
    data: Partial<Entreprise>
  ): Promise<Entreprise> {
    const entreprise = await this.entrepriseRepository.findById(id);
  
    if (!entreprise) throw new Error("Entreprise not found");
  
    // First, update the address if it exists in the payload
    if (data.address && entreprise.addressId) {
      await this.addressService.updateAddress(entreprise.addressId, data.address);
    }
  
    // Then update entreprise fields (excluding nested address object)
    const updatedEntreprise = await this.entrepriseRepository.update(id, {
      name: data.name,
      phone: data.phone,
      email: data.email,
      // Do not include address here
    });
  
    return updatedEntreprise;
  }
  

  async deleteEntreprise(id: number): Promise<Entreprise> {
    return this.entrepriseRepository.softDelete(id);
  }

  async countEntreprises(where: any = {}): Promise<number> {
    return this.entrepriseRepository.count(where);
  }
}
