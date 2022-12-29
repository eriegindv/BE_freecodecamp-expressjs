import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "~/models";

const handleNewUser = async (req: Request, res: Response) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // encrypt the password
    const hasedPwd = await bcrypt.hash(pwd, 10);

    // store the new user
    await User.create({
      username: user,
      password: hasedPwd,
    });

    res.status(201).json({ success: `New user ${user} created` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { handleNewUser };
