import Airtable from 'airtable';

const personalAccessToken = process.env.AIRTABLE_PAT;
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

if (!personalAccessToken || !baseId) {
  throw new Error('Missing Airtable environment variables');
}

// Configure Airtable with Personal Access Token
Airtable.configure({
  apiKey: personalAccessToken
});

export const base = Airtable.base(baseId); 