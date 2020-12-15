import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getById(id: string): Promise<User> {
    await this.checkUserExist(id);
    return this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    await this.checkUserExist(id);

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne(id);
  }

  async delete(id: string): Promise<any> {
    const user = await this.getById(id);
    await this.userRepository.delete(user);
  }

  async checkUserExist(id: string): Promise<any> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
