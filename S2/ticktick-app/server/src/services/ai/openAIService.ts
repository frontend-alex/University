import OpenAI from "openai";
import { config } from "../../config/config";
import { UserRepository } from "../../repositories/user/userRepository";
import { createError } from "../../middleware/errorHandler";
import { AiUsageService } from "./openAIUsageService";

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export class OpenAIService {
  private userRepository = new UserRepository();
  private usageService = new AiUsageService();

  public async enhanceDescriptionWithAI(
    userId: string,
    text: string,
    instruction: string
  ): Promise<string> {
    if (!instruction?.trim()) {
      throw new Error("Instruction is required");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw createError("USER_NOT_FOUND");

    await this.usageService.checkUsage(user);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please enhance the following description based on the instruction provided.\nInstruction: ${instruction}\nDescription: ${text}`,
        },
      ],
    });

    await this.usageService.incrementUsage(user);

    return completion.choices[0]?.message?.content?.trim() || "";
  }
}
