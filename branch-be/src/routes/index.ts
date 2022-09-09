import {Application , Request, Response }  from "express";

export const register = ( app: Application ): void => {
  app.get("/", (req: Request, res: Response, next) => {
    res.redirect("http://mybranchapp.com/");
  });
}
