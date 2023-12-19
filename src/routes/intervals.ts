import { Request, Response } from "express";
import {
  filterInterval,
  mapStringArrayToRangeArray,
} from "../services/intervals";

enum ErrorMessages {
  MissingIncludes = "'includes' is required in request body",
  ServerError = "Internal server error",
}

export function intervalsRoute(request: Request, response: Response) {
  const { includes, excludes = [] } = request.body;
  if (!includes) {
    return response.status(400).json({ error: ErrorMessages.MissingIncludes });
  }
  try {
    const includesRanges = mapStringArrayToRangeArray(includes);
    const excludesRanges = mapStringArrayToRangeArray(excludes);
    const result = filterInterval(includesRanges, excludesRanges);
    response.send(result.toString());
  } catch (error) {
    return response.status(500).json({ error: ErrorMessages.ServerError });
  }
}
