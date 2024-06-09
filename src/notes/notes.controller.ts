import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note, Prisma } from '@prisma/client';
import { Response } from 'express';

type QueryGetNotes = {
  skip?: number;
  take?: number;
  cursor?: Prisma.NoteWhereUniqueInput;
  where?: Prisma.NoteWhereInput;
  orderBy?: Prisma.NoteOrderByWithRelationInput;
};

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getNotes(@Res() res: Response, @Query() params) {
    try {
      const notes = await this.notesService.notes(params);
      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Get notes failed, try again later.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createNote(@Body() noteDto: Note, @Res() res: Response) {
    try {
      const note = await this.notesService.createNote(noteDto);
      return res.status(200).json(note);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Create note failed, try again later.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getNoteById(@Param() params, @Res() res: Response) {
    try {
      const notes = await this.notesService.notes({
        where: { id: Number(params.id) },
      });

      if (notes.length === 0)
        return res.status(404).json({
          message: `Note with id: ${params.id} not found`,
        });

      return res.status(200).json(notes[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Get note failed, try again later.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateNote(
    @Param() params,
    @Body() noteDto: Note,
    @Res() res: Response,
  ) {
    try {
      const notes = await this.notesService.updateNote({
        where: { id: Number(params.id) },
        data: noteDto,
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Update note failed, try again later.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteNote(@Param() params, @Res() res: Response) {
    try {
      const notes = await this.notesService.deleteNote({
        id: Number(params.id),
      });
      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Delete note failed, try again later.',
      });
    }
  }
}
