import { Request, Response, NextFunction } from 'express';
// import { StatusCodes } from './../..';

enum StatusCodes {
    VALIDATION_ERROR = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  switch(statusCode){
    case StatusCodes.VALIDATION_ERROR:
        res.json({
            title:"Validation Error",
            message:err.message,
            stackTrace: err.stack
        });
        break;
    case StatusCodes.UNAUTHORIZED:
        res.json({
            title:"Un authorized",
            message:err.message,
            stackTrace: err.stack
        });
        break;
    case StatusCodes.FORBIDDEN:
        res.json({
            title:"Forbidden",
            message:err.message,
            stackTrace: err.stack
        });
        break;
    case StatusCodes.NOT_FOUND:
        res.json({
            title:"not found",
            message:err.message,
            stackTrace: err.stack
        });
        break;
    case StatusCodes.SERVER_ERROR:
        res.json({
            title:"not found",
            message:err.message,
            stackTrace:err.stack
        })
    default:
        console.log("No Error, All good!")
        res.json({
          message: err.message,
          stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
  }

};