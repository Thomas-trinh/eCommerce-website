import { Request } from "express";

export interface CustomRequest extends Request {
    loggedInUser?: { id: number; username?: string };
}