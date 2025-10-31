import {
  Controller,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { JwtUser } from 'src/auth/jwt.strategy'
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔐 Get the current authenticated user's info
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@CurrentUser() auth: JwtUser) {
    console.log('Auth payload:', auth)
    if (!auth || !auth.userId) {
      throw new UnauthorizedException()
    }

    const user = await this.usersService.findOne(auth.userId)
    if (!user) {
      throw new Error('User not found')
    }

    // ✅ Return only fields that exist in your schema
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isInstructor: user.isInstructor,
      isAdmin: user.isAdmin,
    }
  }

  // 🔎 Fetch all users
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  // 🔎 Fetch a user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }
}
