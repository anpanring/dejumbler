import { setupWorker } from 'msw/browser';
import { handlers } from './handlers'; // Define your mock request handlers here

export const worker = setupWorker(...handlers);