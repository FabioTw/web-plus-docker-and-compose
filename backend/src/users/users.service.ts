import * as bcrypt from 'bcrypt';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorCodes } from '../types/error-codes';
import { FindUsersDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findById(
    id: number,
    {
      withPassword = false,
      withEmail = false,
    }: { withPassword?: boolean; withEmail?: boolean } = {},
  ): Promise<User> {
    if (withPassword || withEmail) {
      return this.findUserAddUnselectedFields(id, 'id', {
        withEmail,
        withPassword,
      });
    } else {
      return this.userRepository.findOneBy({ id });
    }
  }

  async findByQuery({ query }: FindUsersDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    const result = users.map(
      async (user) =>
        await this.findUserAddUnselectedFields(user.username, 'username', {
          withEmail: true,
          withPassword: false,
        }),
    );
    return await Promise.all(result);
  }

  removeById(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }

  updateById(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async updateWithPassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    return await this.userRepository.update(id, {
      ...updateUserDto,
      password: passwordHash,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.create({
        ...createUserDto,
        password: passwordHash,
      });
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      if (error.code === ErrorCodes.DUPLICATE_KEY) {
        throw new ConflictException(error.detail);
      }
      throw new InternalServerErrorException(error?.message);
    }
  }

  async findByUsername(
    username: string,
    {
      withPassword = false,
      withEmail = false,
    }: { withPassword?: boolean; withEmail?: boolean } = {},
  ): Promise<User> {
    if (withPassword || withEmail) {
      return this.findUserAddUnselectedFields(username, 'username', {
        withEmail,
        withPassword,
      });
    } else {
      return this.userRepository.findOneBy({ username });
    }
  }

  findByIdWithEmail(ids: number[]): User[] {
    const usersWithEmail: User[] = [];
    ids.map(
      async (id) =>
        await usersWithEmail.push(
          await this.findUserAddUnselectedFields(id, 'id', {
            withEmail: true,
            withPassword: false,
          }),
        ),
    );
    return usersWithEmail;
  }

  private findUserAddUnselectedFields(
    value: string | number,
    columnName: 'username' | 'id',
    options: { withPassword: boolean; withEmail: boolean },
  ): Promise<User> {
    let queryBuilder = this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where(`user.${columnName} = :${columnName}`, { [columnName]: value });

    if (options.withPassword) {
      queryBuilder = queryBuilder.addSelect('user.password');
    }
    if (options.withEmail) {
      queryBuilder = queryBuilder.addSelect('user.email');
    }
    return queryBuilder.getOne();
  }
}
