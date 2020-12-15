import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateSubaccountDto } from './dtos/create-subaccount.dto';
import { UpdateSubaccountDto } from './dtos/update-subaccount.dto';
import { SubaccountsService } from './subaccounts.service';

@Controller('subaccounts')
export class SubaccountsController {
  constructor(private readonly subaccountsService: SubaccountsService) { }

  @Get()
  async getSubaccounts(@Query('page') page: number): Promise<any> {
    return this.subaccountsService.getSubaccounts(page);
  }

  @Get(':id')
  async getSubaccountById(@Param('id') id: number): Promise<any> {
    return this.subaccountsService.getSubaccountById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createSubaccount(@Body() createSubaccountDto: CreateSubaccountDto): Promise<any> {
    return this.subaccountsService.createSubaccount(createSubaccountDto)
  }

  @Delete(':id')
  async deleteSubaccount(@Param('id') id: number): Promise<any> {
    return this.subaccountsService.deleteSubaccount(id)
  }
  
  @Post(':id')
  @UsePipes(ValidationPipe)
  async updateSubaccount(
    @Param('id') id: number, 
    @Body() updateSubaccount: UpdateSubaccountDto
  ): Promise<any> {
    return this.subaccountsService.updateSubaccount(id, updateSubaccount)
  }
}
