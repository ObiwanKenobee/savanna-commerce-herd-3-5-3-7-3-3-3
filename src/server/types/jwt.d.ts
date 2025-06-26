import { Secret } from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
    issuer?: string;
    audience?: string;
  }
}
