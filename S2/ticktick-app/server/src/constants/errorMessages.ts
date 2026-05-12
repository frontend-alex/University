export const ERROR_MESSAGES = {
  // ---------------------- AUTHENTICATION ERRORS ----------------------
  UNAUTHORIZED_ACCESS: {
    message: "User authentication required.",
    statusCode: 401,
    errorCode: "AUTH_001",
    userFriendlyMessage: "You must be logged in to access this resource.",
  },
  FORBIDDEN_ACCESS: {
    message: "You do not have permission to access this resource.",
    statusCode: 403,
    errorCode: "AUTH_002",
    userFriendlyMessage: "Access denied. You do not have admin privileges.",
  },
  INVALID_CREDENTIALS: {
    message: "Invalid email or password. Please try again.",
    statusCode: 401,
    errorCode: "AUTH_002",
    userFriendlyMessage:
      "Your email or password is incorrect. Try again or reset your password.",
  },
  INVALID_CURRENT_PASSWORD: {
    message: "Current password is incorrect.",
    statusCode: 401,
    errorCode: "AUTH_003",
    userFriendlyMessage:
      "The current password you entered is incorrect. Please try again.",
  },
  OTP_EXPIRED: {
    message: "The OTP has expired. Please request a new one.",
    statusCode: 400,
    errorCode: "AUTH_003",
    userFriendlyMessage:
      "Your OTP is no longer valid. Please request a new one.",
  },
  OTP_NOT_FOUND: {
    message: "OTP not found. Please check your inbox or request a new one.",
    statusCode: 404,
    errorCode: "AUTH_004",
    userFriendlyMessage:
      "We couldn't find your OTP. Check your inbox or request a new one.",
  },
  INVALID_OTP: {
    message: "Invalid OTP. Please try again.",
    statusCode: 400,
    errorCode: "AUTH_005",
    userFriendlyMessage: "The OTP entered is incorrect. Please try again.",
  },
  EMAIL_NOT_VERIFIED: {
    message: "Email verification required.",
    statusCode: 403,
    errorCode: "AUTH_006",
    userFriendlyMessage: "Please verify your email before proceeding.",
  },
  EMAIL_NOT_PROVIDED: {
    message: "Email is required but missing.",
    statusCode: 400,
    errorCode: "AUTH_007",
    userFriendlyMessage: "Please provide your email address to continue.",
  },
  EMAIL_ALREADY_VERIFIED: {
    message: "Email is already verified.",
    statusCode: 409,
    errorCode: "AUTH_007",
    userFriendlyMessage:
      "Your email has already been verified. You can log in now.",
  },
  PASSWORD_MISSING: {
    message: "Password is required but missing.",
    statusCode: 400,
    errorCode: "AUTH_006",
    userFriendlyMessage: "Please provide your current password to continue.",
  },
  SAME_PASSWORD: {
    message: "New password cannot be the same as the current password.",
    statusCode: 400,
    errorCode: "AUTH_004",
    userFriendlyMessage:
      "Your new password must be different from your current password.",
  },

  // ---------------------- JWT ERRORS ----------------------
  JWT_TOKEN_MISSING: {
    message: "Authorization token missing.",
    statusCode: 401,
    errorCode: "JWT_001",
    userFriendlyMessage: "Please log in to continue.",
  },
  JWT_INVALID_TOKEN: {
    message: "Invalid authentication token.",
    statusCode: 401,
    errorCode: "JWT_002",
    userFriendlyMessage: "Your session is invalid. Please log in again.",
  },
  JWT_EXPIRED_TOKEN: {
    message: "Authentication token has expired.",
    statusCode: 401,
    errorCode: "JWT_003",
    userFriendlyMessage: "Your session has expired. Please log in again.",
  },
  JWT_REFRESH_TOKEN_EXPIRED: {
    message: "Refresh token has expired.",
    statusCode: 403,
    errorCode: "JWT_015",
    userFriendlyMessage: "Your session has expired. Please log in again.",
  },
  JWT_REFRESH_TOKEN_INVALID: {
    message: "Invalid or revoked refresh token.",
    statusCode: 403,
    errorCode: "JWT_016",
    userFriendlyMessage: "Session refresh failed. Please log in again.",
  },
  JWT_MALFORMED_TOKEN: {
    message: "JWT token is malformed.",
    statusCode: 400,
    errorCode: "JWT_017",
    userFriendlyMessage:
      "There was an issue with your authentication token. Please log in again.",
  },
  JWT_TOKEN_REFRESH_FAILED: {
    message: "Failed to refresh JWT token.",
    statusCode: 401,
    errorCode: "JWT_018",
    userFriendlyMessage:
      "Your session has expired. Please log in again to continue.",
  },
  INVALID_ENCRYPTED_TOKEN: {
    message: "Invalid or corrupted encrypted token.",
    statusCode: 401,
    errorCode: "JWT_018",
    userFriendlyMessage:
      "Your session has expired or is invalid. Please log in again to continue.",
  },

  // ---------------------- USER ERRORS ----------------------
  USER_NOT_FOUND: {
    message: "User account not found. Please verify your email or register.",
    statusCode: 404,
    errorCode: "USER_001",
    userFriendlyMessage:
      "We couldn't find your account. Please check your email or sign up.",
  },
  EMAIL_EXISTS: {
    message: "This email is already registered.",
    statusCode: 409,
    errorCode: "USER_002",
    userFriendlyMessage:
      "An account with this email already exists. Please log in or use a different email.",
  },
  USERNAME_EXISTS: {
    message: "This username is already taken.",
    statusCode: 409,
    errorCode: "USER_003",
    userFriendlyMessage:
      "That username is already in use. Please choose a different one.",
  },
  USER_ALREADY_ONBOARDED: {
    message: "User has already completed onboarding.",
    statusCode: 400,
    errorCode: "ONBOARD_001",
    userFriendlyMessage:
      "You’ve already finished onboarding. Let’s get you to your dashboard!",
  },
  USER_ALREADY_IN_WORKSPACE: {
    message: "User is already a member of this workspace.",
    statusCode: 400,
    errorCode: "WORKSPACE_001",
    userFriendlyMessage: "This user is already part of your workspace.",
  },
  USER_NOT_IN_WORKSPACE: {
    message: "User is not a member of the specified workspace.",
    statusCode: 403,
    errorCode: "WORKSPACE_003",
    userFriendlyMessage:
      "You are not part of this workspace, so you can't perform this action.",
  },
  USER_HAS_UPCOMING_APPOINTMENT: {
    message:
      "You already have an upcoming appointment and cannot book another one until it has passed.",
    statusCode: 403,
    errorCode: "USER_001",
    userFriendlyMessage:
      "You have an existing appointment that hasn't passed yet. Please wait until your current appointment is completed before booking a new one.",
  },

  // ---------------------- WORKSPACE / TASK / LIST ERRORS ----------------------
  INVALID_WORKSPACE_ID: {
    message: "Invalid workspace ID provided.",
    statusCode: 400,
    errorCode: "WORKSPACE_001",
    userFriendlyMessage:
      "The workspace ID you provided is not valid. Please check and try again.",
  },
  WORKSPACE_NOT_FOUND: {
    message: "Workspace not found.",
    statusCode: 404,
    errorCode: "WORKSPACE_001",
    userFriendlyMessage:
      "We couldn't find the requested workspace. It may have been deleted or you don’t have access to it.",
  },
  WORKSPACE_ID_REQUIRED: {
    message: "Workspace ID is required to proceed.",
    statusCode: 400,
    errorCode: "WORKSPACE_002",
    userFriendlyMessage: "Please select a workspace before adding a list.",
  },
  LAST_OWNER_CANNOT_LEAVE: {
    message: "Last owner cannot leave the workspace.",
    statusCode: 400,
    errorCode: "WORKSPACE_004",
    userFriendlyMessage:
      "You are the last owner of this workspace. Please assign a new owner before leaving.",
  },
  TASK_NOT_FOUND: {
    message: "Task not found.",
    statusCode: 404,
    errorCode: "TASK_001",
    userFriendlyMessage:
      "We couldn't find the requested task. It may have been deleted or you don’t have access to it.",
  },
  LIST_CREATION_FAILED: {
    message: "Failed to create list in workspace.",
    statusCode: 500,
    errorCode: "LIST_001",
    userFriendlyMessage:
      "Something went wrong while adding your list. Please try again.",
  },
  LIST_ALREADY_EXISTS_IN_WORKSPACE: {
    message: "List already exists in the workspace.",
    statusCode: 409,
    errorCode: "LIST_003",
    userFriendlyMessage:
      "That list already exists in this workspace. Try a different name.",
  },

  // ---------------------- STRIPE / BILLING ERRORS ----------------------
  STRIPE_SIGNATURE_MISSING: {
    message: "Missing or invalid Stripe signature header.",
    statusCode: 400,
    errorCode: "STRIPE_001",
    userFriendlyMessage:
      "We couldn't verify the Stripe webhook request. Missing signature.",
  },
  STRIPE_RAW_BODY_MISSING: {
    message: "Raw body missing from Stripe webhook request.",
    statusCode: 400,
    errorCode: "STRIPE_002",
    userFriendlyMessage:
      "Invalid webhook request received. Please try again or contact support.",
  },
  STRIPE_WEBHOOK_VERIFICATION_FAILED: {
    message: "Stripe webhook signature verification failed.",
    statusCode: 400,
    errorCode: "STRIPE_003",
    userFriendlyMessage:
      "Failed to verify the Stripe webhook request. Please try again or contact support.",
  },
  STRIPE_SUBSCRIPTION_RETRIEVE_FAILED: {
    message: "Failed to retrieve Stripe subscription.",
    statusCode: 500,
    errorCode: "STRIPE_004",
    userFriendlyMessage:
      "There was an issue processing your subscription information. Please try again later.",
  },
  STRIPE_SUBSCRIPTION_ID_NOT_AVAILABLE: {
    message: "Subscription ID not available on Stripe checkout session.",
    statusCode: 400,
    errorCode: "STRIPE_005",
    userFriendlyMessage:
      "Subscription information is temporarily unavailable. Please try again shortly.",
  },
  STRIPE_EVENT_PROCESSING_ERROR: {
    message: "Error processing Stripe webhook event.",
    statusCode: 500,
    errorCode: "STRIPE_006",
    userFriendlyMessage:
      "An error occurred while handling payment information. Please try again later.",
  },
  STRIPE_UNHANDLED_EVENT: {
    message: "Unhandled Stripe event type received.",
    statusCode: 400,
    errorCode: "STRIPE_007",
    userFriendlyMessage:
      "Received an unsupported payment event. No action was taken.",
  },
  STRIPE_INVOICE_NOT_FOUND: {
    message: "Invoice not found in Stripe.",
    statusCode: 404,
    errorCode: "STRIPE_008",
    userFriendlyMessage:
      "We couldn't find the requested invoice. Please check the invoice ID and try again.",
  },
  STRIPE_INVOICE_PAYMENT_FAILED: {
    message: "Invoice payment failed.",
    statusCode: 402,
    errorCode: "STRIPE_009",
    userFriendlyMessage:
      "Payment for the invoice was unsuccessful. Please update your payment information and try again.",
  },
  STRIPE_INVOICE_ALREADY_PAID: {
    message: "Invoice has already been paid.",
    statusCode: 409,
    errorCode: "STRIPE_010",
    userFriendlyMessage:
      "This invoice is already paid and cannot be paid again.",
  },
  STRIPE_INVOICE_VOIDED: {
    message: "Invoice has been voided.",
    statusCode: 410,
    errorCode: "STRIPE_011",
    userFriendlyMessage: "This invoice was voided and is no longer valid.",
  },
  STRIPE_PAYMENT_INTENT_CREATION_FAILED: {
    message: "Failed to create Stripe payment intent.",
    statusCode: 500,
    errorCode: "STRIPE_012",
    userFriendlyMessage:
      "There was an issue initiating your payment. Please try again later.",
  },
  STRIPE_PAYMENT_METHOD_NOT_FOUND: {
    message: "Payment method not found.",
    statusCode: 404,
    errorCode: "STRIPE_013",
    userFriendlyMessage:
      "Your payment method could not be found. Please update your payment details.",
  },
  STRIPE_CUSTOMER_NOT_FOUND: {
    message: "Customer record not found in Stripe.",
    statusCode: 404,
    errorCode: "STRIPE_014",
    userFriendlyMessage:
      "We could not find your account information. Please contact support.",
  },
  STRIPE_REFUND_FAILED: {
    message: "Refund processing failed.",
    statusCode: 500,
    errorCode: "STRIPE_015",
    userFriendlyMessage:
      "Refund could not be processed at this time. Please try again later.",
  },
  STRIPE_INVOICE_EMAIL_SEND_FAILED: {
    message: "Failed to send invoice email.",
    statusCode: 500,
    errorCode: "STRIPE_016",
    userFriendlyMessage:
      "We were unable to send the invoice email. Please check your email settings and try again.",
  },
  STRIPE_DISPUTE_CREATION_FAILED: {
    message: "Failed to create dispute for payment.",
    statusCode: 500,
    errorCode: "STRIPE_017",
    userFriendlyMessage:
      "There was an issue filing your dispute. Please try again later.",
  },

  // ---------------------- GOOGLE OAUTH ERRORS ----------------------
  GOOGLE_AUTH_FAILED: {
    message: "Google authentication failed.",
    statusCode: 401,
    errorCode: "GOOGLE_001",
    userFriendlyMessage:
      "We couldn’t log you in with Google. Please try again or use email and password instead.",
  },
  GOOGLE_CALLBACK_ERROR: {
    message: "An error occurred during Google OAuth callback.",
    statusCode: 500,
    errorCode: "GOOGLE_002",
    userFriendlyMessage:
      "Something went wrong during Google sign-in. Please try again.",
  },
  GOOGLE_PROFILE_NOT_FOUND: {
    message: "Failed to retrieve profile from Google.",
    statusCode: 404,
    errorCode: "GOOGLE_003",
    userFriendlyMessage:
      "We couldn’t fetch your Google profile. Try again or use a different account.",
  },
  GOOGLE_EMAIL_NOT_PROVIDED: {
    message: "Google account did not provide an email.",
    statusCode: 400,
    errorCode: "GOOGLE_004",
    userFriendlyMessage:
      "Your Google account doesn’t have an email associated with it. Please try another account.",
  },
  GOOGLE_EMAIL_ALREADY_EXISTS: {
    message: "Email from Google already linked to another account.",
    statusCode: 409,
    errorCode: "GOOGLE_005",
    userFriendlyMessage:
      "This Google account is already linked to another user. Try logging in with email/password or use a different account.",
  },

  // ---------------------- SYSTEM / MISC ERRORS ----------------------
  SERVER_ERROR: {
    message: "An internal server error occurred.",
    statusCode: 500,
    errorCode: "SERVER_001",
    userFriendlyMessage: "Something went wrong. Please try again later.",
  },
  DB_CONNECTION_FAILED: {
    message: "Database connection failed.",
    statusCode: 500,
    errorCode: "DB_001",
    userFriendlyMessage:
      "We're experiencing database issues. Please try again later.",
  },
  DB_QUERY_FAILED: {
    message: "Database query error.",
    statusCode: 500,
    errorCode: "DB_002",
    userFriendlyMessage:
      "An error occurred while processing your request. Please try again.",
  },
  DB_FAILED_LOG: {
    message: "Database failed to log.",
    statusCode: 500,
    errorCode: "DB_003",
    userFriendlyMessage: "An error occurred.",
  },
  EMAIL_SENDING_FAILED: {
    message: "Failed to send email.",
    statusCode: 500,
    errorCode: "EMAIL_001",
    userFriendlyMessage: "Unable to send the email. Please try again later.",
  },
  TEMPLATE_READ_ERROR: {
    message: "Error reading email template.",
    statusCode: 500,
    errorCode: "EMAIL_002",
    userFriendlyMessage:
      "We encountered an issue with the email template. Please try again later.",
  },
  INVALID_ATTENDANCE_STATUS: {
    message: "Invalid attendance status.",
    statusCode: 400,
    errorCode: "APPOINTMENT_009",
    userFriendlyMessage:
      "The attendance status provided is invalid. Please check and try again.",
  },
  LIMIT_REACHED: {
    message: "User has reached the daily AI generation limit.",
    statusCode: 403,
    errorCode: "AI_001",
    userFriendlyMessage:
      "You’ve reached your daily generation limit. Please upgrade your plan or try again tomorrow.",
  },
  UPGRADE_PLAN: {
    message: "User action requires a higher subscription plan.",
    statusCode: 403,
    errorCode: "SUBSCRIPTION_UPGRADE_REQUIRED",
    userFriendlyMessage:
      "This feature requires an upgraded plan. Please upgrade your subscription to continue.",
  },

  // ---------------------- NOTIFICATION ERRORS ----------------------
  NOTIFICATION_NOT_FOUND: {
    message: "Notification not found.",
    statusCode: 404,
    errorCode: "NOTIFICATION_001",
    userFriendlyMessage:
      "We couldn't find the requested notification. It may have been deleted or you don’t have access to it.",
  },
  NOTIFICATION_ALREADY_READ: {
    message: "Notification has already been marked as read.",
    statusCode: 400,
    errorCode: "NOTIFICATION_002",
    userFriendlyMessage: "This notification has already been marked as read.",
  },
  NOTIFICATION_DELETE_FAILED: {
    message: "Failed to delete notification.",
    statusCode: 500,
    errorCode: "NOTIFICATION_003",
    userFriendlyMessage:
      "An error occurred while trying to delete the notification. Please try again later.",
  },
  NOTIFICATION_FETCH_FAILED: {
    message: "Failed to fetch notifications.",
    statusCode: 500,
    errorCode: "NOTIFICATION_004",
    userFriendlyMessage:
      "We couldn't retrieve your notifications at this time. Please try again later.",
  },
  NOTIFICATION_MARK_READ_FAILED: {
    message: "Failed to mark notification as read.",
    statusCode: 500,
    errorCode: "NOTIFICATION_005",
    userFriendlyMessage:
      "An error occurred while marking the notification as read. Please try again later.",
  },
  NOTIFICATION_CREATE_FAILED: {
    message: "Failed to create notification.",
    statusCode: 500,
    errorCode: "NOTIFICATION_006",
    userFriendlyMessage:
      "We couldn't create the notification at this time. Please try again later.",
  },
  NOTIFICATION_INVALID_TYPE: {
    message: "Invalid notification type provided.",
    statusCode: 400,
    errorCode: "NOTIFICATION_007",
    userFriendlyMessage:
      "The notification type is invalid. Please check and try again.",
  },

  INVITATION_ALREADY_SENT: {
    message: "Invitation has already been sent to this user.",
    statusCode: 400,
    errorCode: "INVITATION_001",
    userFriendlyMessage:
      "This user has already been invited to the workspace. No further action is needed.",
  },
  USERS_NOT_IN_SAME_WORKSPACE: {
    message: "Users do not share a common workspace.",
    statusCode: 403,
    errorCode: "CHAT_001",
    userFriendlyMessage:
      "You can only start conversations with users in the same workspace. Please check the workspace members.",
  },

  CONVERSATION_CREATION_FAILED: {
    message: "Failed to create conversation due to server error.",
    statusCode: 500,
    errorCode: "CHAT_002",
    userFriendlyMessage:
      "We couldn't create your conversation. Please try again later.",
  },

  CANNOT_CHAT_WITH_SELF: {
    message: "User attempted to start conversation with themselves.",
    statusCode: 400,
    errorCode: "CHAT_003",
    userFriendlyMessage:
      "You cannot start a conversation with yourself. Please select another user.",
  },
  EMPTY_MESSAGE: {
    message: "Cannot send an empty message.",
    statusCode: 400,
    errorCode: "CHAT_004",
    userFriendlyMessage: "Please type a message before sending.",
  },
};
