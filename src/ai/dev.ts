// This file is the entrypoint for local development using the Genkit CLI.
//
// You can run `genkit start` to run this file in development mode.
//
// This file is NOT meant to be used in production.

import { config } from 'dotenv';
config();

import '@/ai/flows/translate-content.ts';
