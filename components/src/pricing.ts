import { float } from '@opensearch-project/opensearch/api/types'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

interface IOpenAIPricing {
    [gpt_4: string]: number
}

const MODEL_COST_PER_1K_TOKENS: IOpenAIPricing = {
    // # GPT_4 input
    "gpt-4": 0.03,
    "gpt-4-0314": 0.03,
    "gpt-4-0613": 0.03,
    "gpt-4-32k": 0.06,
    "gpt-4-32k-0314": 0.06,
    "gpt-4-32k-0613": 0.06,
    // # GPT-4 output
    "gpt-4-completion": 0.06,
    "gpt-4-0314-completion": 0.06,
    "gpt-4-0613-completion": 0.06,
    "gpt-4-32k-completion": 0.12,
    "gpt-4-32k-0314-completion": 0.12,
    "gpt-4-32k-0613-completion": 0.12,
    // # GPT-3.5 input
    "gpt-3.5-turbo": 0.0015,
    "gpt-3.5-turbo-0301": 0.0015,
    "gpt-3.5-turbo-0613": 0.0015,
    "gpt-3.5-turbo-16k": 0.003,
    "gpt-3.5-turbo-16k-0613": 0.003,
    // # GPT-3.5 output
    "gpt-3.5-turbo-completion": 0.002,
    "gpt-3.5-turbo-0301-completion": 0.002,
    "gpt-3.5-turbo-0613-completion": 0.002,
    "gpt-3.5-turbo-16k-completion": 0.004,
    "gpt-3.5-turbo-16k-0613-completion": 0.004,
    // # Others
    "gpt-35-turbo": 0.002,  //# Azure OpenAI version of ChatGPT
    "text-ada-001": 0.0004,
    "ada": 0.0004,
    "text-babbage-001": 0.0005,
    "babbage": 0.0005,
    "text-curie-001": 0.002,
    "curie": 0.002,
    "text-davinci-003": 0.02,
    "text-davinci-002": 0.02,
    "code-davinci-002": 0.02,
    "ada-finetuned": 0.0016,
    "babbage-finetuned": 0.0024,
    "curie-finetuned": 0.012,
    "davinci-finetuned": 0.12,
}

export async function calculate_openai_cost(model_name: string, num_tokens: number){
    if(model_name in MODEL_COST_PER_1K_TOKENS == false){
        return {
            message: `Unknown model: ${model_name}. Please provide a valid OpenAI model name.`
        }
    }
    console.log(MODEL_COST_PER_1K_TOKENS[model_name])
    const total_cost = MODEL_COST_PER_1K_TOKENS[model_name] * (num_tokens / 1000);
    await emit_usage_invoice(total_cost);
    return MODEL_COST_PER_1K_TOKENS[model_name] * (num_tokens / 1000)
}

async function emit_usage_invoice(pricing: float){
    const config = {
        headers: { Authorization: `Bearer 8144aca8-4793-4f3b-a81d-e151bc04d116` }
    };
    let body = {
        "event": {
            "transaction_id": uuidv4(), 
            "external_customer_id": "kh08",
            "external_subscription_id": "6ba263ec-b5d1-4209-a074-44c276ff5362",
            "code": "call",
            "properties": {
                "token": pricing
            }
        }
    }
    const response = await axios.post("http://143.198.200.174:3000/api/v1/events", body, config)
    console.log(response)
}