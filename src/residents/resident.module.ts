import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ResidentController } from './controllers/resident.controller';
import { SQLService } from './services/sql.service';

@Module({
  imports: [HttpModule],
  controllers: [ResidentController],
  providers: [SQLService],
})
export class ResidentModule {}
