// Global Express namespace augmentation
// This extends Express.User so req.user.id is valid everywhere without a custom interface.
declare global {
  namespace Express {
    interface User {
      id: string;
      [key: string]: any;
    }
  }
}

export {};
