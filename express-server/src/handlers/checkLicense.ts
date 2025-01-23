import { NextFunction, Request, Response } from "express";
import db from "../db";

export default async function checkLicense(req: Request, res: Response, next: NextFunction) {
  if (req.path.includes("preview")) {
    next();
    return;
  }

  const license = req.headers.authorization;
  if (!license) {
    res.status(403).send("Forbidden: No license provided");
    return;
  }

  try {
    const licenseRecord = await db("licenses").where({ key: license }).first();
    if (!licenseRecord) {
      // const response = await axios.post("https://api.gumroad.com/v2/licenses/verify", {
      //   product_permalink: "your-product-permalink",
      //   license_key: license,
      // });
      // if (response.data.success) {
      //   db("licenses").insert(license);
      //   next();
      // } else {
      //   res.status(403).send("Forbidden: Invalid license");
      // }

      res.status(403).send("Forbidden: Invalid license");
    } else next();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
