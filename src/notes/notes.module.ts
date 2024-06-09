import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotesController } from './notes.controller';

@Module({
  providers: [NotesService, PrismaService],
  exports: [NotesService, PrismaService],
  controllers: [NotesController],
})
export class NotesModule {}
