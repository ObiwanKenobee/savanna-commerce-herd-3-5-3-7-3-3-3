import { JWTPayload } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      requestId?: string;
    }
  }
}

// This file must have at least one export to be treated as a module
export {};
