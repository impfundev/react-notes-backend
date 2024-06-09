import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note, Prisma } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async notes(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.NoteWhereInput;
  }): Promise<Note[]> {
    const skip = params.skip ? Number(params.skip) : undefined;
    const take = params.take ? Number(params.take) : undefined;
    const where = params.where ? params.where : undefined;
    return this.prisma.note.findMany({
      skip,
      take,
      where,
    });
  }

  async createNote(data: Note): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  async updateNote(params: {
    where: Prisma.NoteWhereUniqueInput;
    data: Prisma.NoteUpdateInput;
  }): Promise<Note> {
    const { where, data } = params;
    return this.prisma.note.update({
      data,
      where,
    });
  }

  async deleteNote(where: Prisma.NoteWhereUniqueInput): Promise<Note> {
    return this.prisma.note.delete({
      where,
    });
  }
}
