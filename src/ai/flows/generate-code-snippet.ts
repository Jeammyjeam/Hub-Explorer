'use server';

/**
 * @fileOverview Generates Python or JavaScript code snippets for using a selected model or dataset.
 *
 * - generateCodeSnippet - A function that handles the code snippet generation process.
 * - GenerateCodeSnippetInput - The input type for the generateCodeSnippet function.
 * - GenerateCodeSnippetOutput - The return type for the generateCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeSnippetInputSchema = z.object({
  resourceId: z.string().describe('The ID of the Hugging Face resource (model or dataset).'),
  resourceType: z.enum(['model', 'dataset']).describe('The type of the Hugging Face resource.'),
  language: z.enum(['python', 'javascript']).describe('The desired language for the code snippet.'),
});
export type GenerateCodeSnippetInput = z.infer<typeof GenerateCodeSnippetInputSchema>;

const GenerateCodeSnippetOutputSchema = z.object({
  codeSnippet: z.string().describe('The generated code snippet.'),
});
export type GenerateCodeSnippetOutput = z.infer<typeof GenerateCodeSnippetOutputSchema>;

export async function generateCodeSnippet(input: GenerateCodeSnippetInput): Promise<GenerateCodeSnippetOutput> {
  return generateCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeSnippetPrompt',
  input: {schema: GenerateCodeSnippetInputSchema},
  output: {schema: GenerateCodeSnippetOutputSchema},
  prompt: `You are an AI code generator that helps generate code snippets for using Hugging Face models or datasets.

  You will generate a code snippet in the specified language ({{{language}}}) for the given Hugging Face resource ({{{resourceId}}}) of type ({{{resourceType}}}).

  The code snippet should be concise and easy to understand, demonstrating how to load and use the resource for inference or data loading.

  Here are some example code snippets:

  - Python model:
    ```python
    from transformers import pipeline

    pipe = pipeline(model="{{{resourceId}}}")
    result = pipe("Hello world!")
    print(result)
    ```

  - JavaScript model:
    ```javascript
    import { pipeline } from '@xenova/transformers';

    const pipe = await pipeline('feature-extraction', '{{{resourceId}}}');
    const output = await pipe('Hello world!');
    console.log(output);
    ```

  - Python dataset:
    ```python
    from datasets import load_dataset

    dataset = load_dataset("{{{resourceId}}}")
    print(dataset['train'][0])
    ```

  - JavaScript dataset:
    ```javascript
    import { loadDataset } from '@huggingface/hub

    const dataset = await loadDataset('{{{resourceId}}}')
    console.log(dataset.train[0])
    ```

  Make sure that the code snippet is correct, executable and uses the correct libraries.

  Resource ID: {{{resourceId}}}
  Resource Type: {{{resourceType}}}
  Language: {{{language}}}
  `,
});

const generateCodeSnippetFlow = ai.defineFlow(
  {
    name: 'generateCodeSnippetFlow',
    inputSchema: GenerateCodeSnippetInputSchema,
    outputSchema: GenerateCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
