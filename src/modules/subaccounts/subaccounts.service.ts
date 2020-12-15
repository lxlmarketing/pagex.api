import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CreateSubaccountDto } from './dtos/create-subaccount.dto';
import { UpdateSubaccountDto } from './dtos/update-subaccount.dto';

@Injectable()
export class SubaccountsService {
  constructor(private readonly httpService: HttpService) { }

  async getSubaccounts(page: number): Promise<AxiosResponse> {
    const response = await this.httpService.get(`subaccounts?page=${page}`).toPromise()
    return response.data
  }
  
  async getSubaccountById(id: number): Promise<any> {
    try {
      const response = await this.httpService.get(`subaccounts/${id}`).toPromise()
      return response.data
    } catch (error) {
      if(error.response.status == 404) {
        throw new NotFoundException(`Sub account with id ${id} does not exist`)
      }
    }
  }

  async createSubaccount(createSubaccountDto: CreateSubaccountDto): Promise<any> {
    try {
      const response = await this.httpService.post('subaccounts', createSubaccountDto).toPromise()
      return response.data
    } catch (error) {
      return error.response.data
    }
  }

  async deleteSubaccount(id: number): Promise<any> {
    try {
      const response = await this.httpService.delete(`subaccounts/${id}`).toPromise()
      return response.data
    } catch (error) {
      return error.response.data
    }
  }

  async updateSubaccount(id: number, updateSubaccountDto: UpdateSubaccountDto): Promise<any> {
    try {
      const response = await this.httpService.post(`subaccounts/${id}`, updateSubaccountDto).toPromise()
      return response.data
    } catch (error) {
      return error.response.data
    }
  }
}
