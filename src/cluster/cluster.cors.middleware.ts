import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

@Injectable()
export class ClusterCorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    for (const [k, v] of Object.entries(corsHeaders)) res.setHeader(k, v);

    // Preflight
    if (req.method === "OPTIONS") {
      return res.status(204).send();
    }

    return next();
  }
}
