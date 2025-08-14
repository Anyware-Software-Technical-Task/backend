import { Request, Response, NextFunction } from "express";
import { Announcement } from "../models/announcement.model";

export const getAllAnnouncements = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, author, role } = req.body;
    const newAnnouncement = new Announcement({ title, content, author, role });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    next(err);
  }
};

export const updateAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await Announcement.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
