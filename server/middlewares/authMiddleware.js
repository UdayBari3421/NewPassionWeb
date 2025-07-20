import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth().userId;

    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.json({ message: "Unauthorized Access!", success: false }).status(400);
    }

    //
    next();
  } catch (error) {
    return res.json({ message: error.message, success: false }).status(500);
  }
};
