import { Request, Response } from "express";
import db from "../db";

export default async function getTags(req: Request, res: Response) {
  try {
    const tags = await db("mockups").distinct("t.value").fromRaw("mockups m, json_each(tags) t");
    res.json(tags.map((tag) => tag.value));
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
