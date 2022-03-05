declare namespace Express {
    export interface Request {
        user: {
            id: string
            email: string
        };
        logout: ()=>any
    }
    export interface Response {
        user: {
            id: string
            email: string
        };
    }
  }