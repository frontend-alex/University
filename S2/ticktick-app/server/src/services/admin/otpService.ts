import mjml from "mjml";

import { Utils } from "../../utils/utils";
import { config } from "../../config/config";
import { EmailUtils } from "../../utils/email/emailUtils";
import { createError } from "../../middleware/errorHandler";
import { UserRepository } from "../../repositories/user/userRepository";
import { OtpRepository } from "../../repositories/admin/otpRepository";

export class OtpService {
  private otpRepository = new OtpRepository();
  private userRepository = new UserRepository();

  public async sendOtp(email: string): Promise<void> {
    const otp = Utils.generateOtp();
    const otpExpiry = Date.now() + config.OTP_EXPIRATION_TIME;

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw createError("USER_NOT_FOUND");
    if (user.emailVerified) throw createError("EMAIL_ALREADY_VERIFIED");

    await this.otpRepository.updateOtp(email, otp, otpExpiry);

    const mjmlTemplate = await EmailUtils.getEmailTemplate('otpTemplate');
    const compiledHtml = mjml(mjmlTemplate.replace("{{otp}}", otp)).html;

    try {
      await EmailUtils.sendEmail(email, 'Your OTP Code', compiledHtml);
    } catch (err: any) {
      throw createError("EMAIL_SENDING_FAILED");
    }
  }

  public async validateOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.otp) throw createError("OTP_NOT_FOUND");
    if (Date.now() > user.otpExpiry!) throw createError("OTP_EXPIRED");
    if (user.otp !== otp) throw createError("INVALID_OTP");

    await this.userRepository.update({ email }, { emailVerified: true });
    await this.otpRepository.clearOtp(email);

    return true;
  }
}
