import { z } from "zod";

// Input validation schemas for API endpoints
export const onboardingSchema = z.object({
  firstName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Invalid characters in name"),
  lastName: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Invalid characters in name"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{4}$/, "Invalid phone format"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, "Invalid city name"),
  country: z.string().length(2).regex(/^[A-Z]{2}$/, "Invalid country code"),
  preferredRole: z.enum(["consumer", "merchant", "agent"]),
  acceptedTerms: z.boolean().refine(val => val === true, "Must accept terms"),
  acceptedPrivacy: z.boolean().refine(val => val === true, "Must accept privacy policy")
});

export const transactionSchema = z.object({
  type: z.enum(["send", "receive", "topup", "withdraw", "payment"]),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  description: z.string().max(200).optional(),
  recipientId: z.string().optional(),
  walletId: z.number().int().positive().optional()
});

export const kycDocumentSchema = z.object({
  documentType: z.enum(["passport", "national_id", "drivers_license", "voter_card"]),
  documentNumber: z.string().min(5).max(20).regex(/^[A-Za-z0-9]+$/, "Invalid document number"),
  phoneNumber: z.string().regex(/^\+\d{1,3}\s?\d{3}\s?\d{3}\s?\d{4}$/, "Invalid phone format"),
  verificationCode: z.string().regex(/^\d{6}$/, "Invalid verification code").optional()
});

export const walletOperationSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  walletType: z.enum(["primary", "savings", "crypto", "investment"]).optional(),
  currency: z.string().length(3).regex(/^[A-Z]{3}$/, "Invalid currency code").optional()
});

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.replace(/[<>'"&]/g, '').trim();
}

export function sanitizeAmount(amount: string): string {
  return parseFloat(amount).toFixed(2);
}

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({ message: "Internal validation error" });
    }
  };
}