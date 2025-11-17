'use server';
/**
 * @fileOverview A dummy user verification by image AI agent.
 *
 * - verifyUserByImage - A function that handles the user verification process using an image.
 * - VerifyUserByImageInput - The input type for the verifyUserByImage function.
 * - VerifyUserByImageOutput - The return type for the verifyUserByImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyUserByImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyUserByImageInput = z.infer<typeof VerifyUserByImageInputSchema>;

const VerifyUserByImageOutputSchema = z.object({
  isFemale: z.boolean().describe('Whether or not the user is identified as female.'),
  reason: z.string().describe('The reason for the decision.'),
});
export type VerifyUserByImageOutput = z.infer<typeof VerifyUserByImageOutputSchema>;

export async function verifyUserByImage(input: VerifyUserByImageInput): Promise<VerifyUserByImageOutput> {
  return verifyUserByImageFlow(input);
}

const verifyUserByImageFlow = ai.defineFlow(
  {
    name: 'verifyUserByImageFlow',
    inputSchema: VerifyUserByImageInputSchema,
    outputSchema: VerifyUserByImageOutputSchema,
  },
  async (input) => {
    // This is a dummy flow that always returns true after a short delay.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      isFemale: true,
      reason: 'User has been successfully verified as female based on image analysis.',
    };
  }
);
