import { Request, Response } from "express";
import db from "../db";

const getByTags = async (req: Request, res: Response) => {
  const { tags } = req.query;

  if (!tags || tags.length === 0) {
    try {
      const mockups = await db("mockups").select("id", "directory").limit(10);
      mockups.forEach((mockup) => {
        mockup.preview = mockup.directory + "/preview";
        delete mockup.directory;
      });
      res.json(mockups);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
    return;
  }

  const tagsArray = (tags as string).split(",");

  try {
    const mockups = await db("mockups")
      .select("m.id", "m.directory")
      .fromRaw("mockups m, json_each(tags) t")
      .whereIn("t.value", tagsArray)
      .groupBy("m.id");

    mockups.forEach((mockup) => {
      mockup.preview = mockup.directory + "/preview";
      delete mockup.directory;
    });
    res.json(mockups);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export default getByTags;
