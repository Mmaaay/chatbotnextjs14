import OpenAI from "openai/index.mjs";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

export default openai;
