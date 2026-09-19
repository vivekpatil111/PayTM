import dotenv from 'dotenv';
dotenv.config();

import { runMAS } from './agents/masWorkflow.js';

async function test() {
  try {
    const res = await runMAS("what is the probelm in form", "en", "");
    console.log("SUCCESS:", res);
  } catch (err) {
    console.error("ERROR:", err.message, err.response?.data);
  }
}

test();
