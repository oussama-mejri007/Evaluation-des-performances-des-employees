import { Module } from '@nestjs/common';
import { DepartementService } from './departement.service';
import { DepartementController } from './departement.controller';
import { Departement } from './entities/departement.entity'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DepartementController],
  providers: [DepartementService],
  imports: [TypeOrmModule.forFeature([Departement])]
})
export class DepartementModule {}
