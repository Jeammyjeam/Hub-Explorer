import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    // The OpenAI provider was removed due to installation issues.
    // openAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // }),
  ],
  model: 'googleai/gemini-pro', // Default to Google AI
});
