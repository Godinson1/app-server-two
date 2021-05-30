import { Response } from "express";

export const handleResponse = async (
  res: Response,
  status: string,
  code: number,
  message: string
): Promise<Response> => {
  return res.status(code).json({
    status,
    message,
  });
};
