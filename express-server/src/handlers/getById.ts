import { Request, Response } from "express";
import { existsSync } from "fs";
import db from "../db";
import { readFile } from "fs/promises";

export default async function getById(req: Request, res: Response) {
  try {
    const mockup = await db("mockups").where({ id: req.params.id }).first();

    if (!mockup) {
      res.status(404).send("Mockup not found");
      return;
    }

    const colors = JSON.parse(mockup.colors);
    colors.forEach((color: { hex: string; src: string }) => {
      color.src = `/assets/${mockup.directory}/${color.src}`;
    });

    const metadata = {
      id: mockup.id,
      name: mockup.name,
      tags: JSON.parse(mockup.tags),
      deviceImages: colors,
      background: existsSync(`./assets/${mockup.directory}/bg.png`)
        ? `/assets/${mockup.directory}/bg.png`
        : null,
      placeholder: `/assets/${mockup.directory}/placeholder`,
      mask: await readFile(`./assets/${mockup.directory}/mask.svg`, { encoding: "utf-8" }),
      transformPath: await readFile(`./assets/${mockup.directory}/transform.svg`, {
        encoding: "utf-8",
      }),
    };

    res.json(metadata);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
