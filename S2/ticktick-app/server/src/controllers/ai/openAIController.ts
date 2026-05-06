import { NextFunction, Request, Response } from "express";
import { OpenAIService } from "../../services/ai/openAIService";
import { IUser } from "../../models/user";

export class OpenAIController {
  private openAIService = new OpenAIService();

  public async enhanceDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { text, instruction } = req.body;
    const userId = (req.user as IUser).id

    try {
      const enhanced = await this.openAIService.enhanceDescriptionWithAI(
        userId,
        text,
        instruction
      );

      res
        .status(200)
        .json({
          description: enhanced,
          success: true,
          message: "Description enhanced successfully",
        });
    } catch (err) {
      next(err);
    }
  }
}
