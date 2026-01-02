import type { Request, Response, NextFunction } from "express";
import { text } from "express";

export function logsRawBodyMiddleware() {
  const parser = text({ type: "*/*" });

  return (
    req: Request & { rawBody?: string },
    res: Response,
    next: NextFunction
  ) => {
    parser(req, res, (err) => {
      if (err) return next(err);

      if (typeof (req as any).body === "string")
        req.rawBody = (req as any).body;
      else req.rawBody = "";

      next();
    });
  };
}
