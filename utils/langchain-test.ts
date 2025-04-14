import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getOpenAIConfig } from '../config/openai.config';

async function testLangChain() {
  try {
    const config = getOpenAIConfig();
    
    // Initialize the OpenAI chat model
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      openAIApiKey: config.apiKey,
    });

    // Create a prompt template
    const prompt = PromptTemplate.fromTemplate(
      'Tell me a short joke about {topic}'
    );

    // Create a chain
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // Run the chain
    const result = await chain.invoke({
      topic: 'programming',
    });

    console.log('LangChain Test Result:', result);
    return result;
  } catch (error) {
    console.error('LangChain Test Error:', error);
    throw error;
  }
}

export default testLangChain; 