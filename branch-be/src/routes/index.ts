import {Application , Request, Response }  from "express";
import HttpStatus from "http-status-codes";

export const register = ( app: Application ): void => {
  app.get("/", (_: Request, res: Response) => {
    res.redirect("http://mybranchapp.com/");
  });

  app.get("/health", (_: Request, res: Response) => {
    return res.status(HttpStatus.OK).json({ message: "healthy"});
  });
};
