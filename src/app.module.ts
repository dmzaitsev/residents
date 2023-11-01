import { Module } from '@nestjs/common';
import { ResidentModule } from './residents/resident.module';

@Module({
  imports: [ResidentModule],
})
export class AppModule {}
