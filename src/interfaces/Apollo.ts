import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma';

export interface Context {
	req: Request;
	res: Response;
	prisma: Prisma;
}
