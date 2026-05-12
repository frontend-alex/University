import bcrypt from "bcryptjs";
import mongoose, { Document, Schema, Types } from "mongoose";
import { AuthProvider, UserRole } from "../types/Enums";

export enum SubscriptionStatus {
  Active = "active",
  Canceled = "canceled",
  Trailing = "trailing",
  PastDue = "past_due",
}

export enum SubscriptionTier {
  Free = "free",
  Pro = "pro",
  Premium = "premium",
}

interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startedAt?: Date;
  expiresAt?: Date;
  trialEndsAt?: Date;
  customerId?: string;
  subscriptionId?: string;
  isLifetime?: boolean;
}

interface AiUsage {
  date: string;
  count: number;
}

export interface IUser extends Document {
  _id: mongoose.ObjectId;
  email: string;
  username: string;
  password: string;
  imageUrl: string;
  role: UserRole;
  provider: AuthProvider;
  hasPassword: boolean;
  workspaces?: Types.ObjectId[];
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  otp?: string;
  otpExpiry?: number;
  emailVerified: boolean;
  resetToken?: string;
  resetTokenExpires?: number;
  hasCompletedOnboarding: boolean;
  isResetTokenExpired?: () => boolean;
  isOtpExpired?: () => boolean;
  subscription?: Subscription;
  aiUsage?: AiUsage;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
    password: {
      type: String,
      required: false,
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.Credentials,
    },
    workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
    otp: String,
    otpExpiry: Number,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    resetTokenExpires: Number,
    hasCompletedOnboarding: { type: Boolean, default: false },
    subscription: {
      tier: {
        type: String,
        enum: Object.values(SubscriptionTier),
        default: SubscriptionTier.Free,
      },
      status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.Active,
      },
      startedAt: Date,
      expiresAt: Date,
      trialEndsAt: Date,
      customerId: String,
      subscriptionId: String,
      isLifetime: {
        type: Boolean,
        default: false,
      },
    },
    aiUsage: {
      date: {
        type: String,
        default: () => new Date().toISOString().split("T")[0],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.subscription?.subscriptionId;
    delete ret.subscription?.customerId;
    return ret;
  },
});

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") || this.password) {
    this.password = await bcrypt.hash(this.password, 10);
    this.hasPassword = true;
  }
  next();
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isResetTokenExpired = function (): boolean {
  return !!(this.resetTokenExpires && Date.now() > this.resetTokenExpires);
};

userSchema.methods.isOtpExpired = function (): boolean {
  return !!(this.otpExpiry && Date.now() > this.otpExpiry);
};

userSchema.methods.isSubscriptionActive = function (): boolean {
  if (this.subscription?.isLifetime) return true;
  return (
    this.subscription?.status === "active" &&
    (!this.subscription?.expiresAt ||
      new Date(this.subscription.expiresAt) > new Date())
  );
};

userSchema.methods.isPremium = function (): boolean {
  return ["premium", "gold"].includes(this.subscription?.tier ?? "free");
};

const User = mongoose.model<IUser>("User", userSchema);

export { User, UserRole };
