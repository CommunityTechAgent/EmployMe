import testLangChain from '../utils/langchain-test';

async function main() {
  console.log('Starting LangChain test...');
  try {
    const result = await testLangChain();
    console.log('Test completed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main(); 