import { config } from 'dotenv';
config(); // This loads the .env file

import TranscriptAPI from 'youtube-transcript-api';
import OpenAI from 'openai';
import e from 'express';
import path from 'path';

const app = e()

import Server from 'http';
Server.createServer(app)

app.use(e.json());
app.use(e.urlencoded({ extended: true }));

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY
});

function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

app.post('/summarize', async (req,res) => {
    const id = extractYouTubeID(req.body.url);
    const languageMap = {
        en: 'English',
        id: 'Indonesian',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        pt: 'Portuguese',
        ru: 'Russian',
        ja: 'Japanese',
        ko: 'Korean',
        zh: 'Chinese',
        ar: 'Arabic',
        hi: 'Hindi',
        nl: 'Dutch',
        sv: 'Swedish',
        pl: 'Polish'
        // add more as needed
      };
    const langCode = req.body.lang || 'en';
    const lang = languageMap[langCode] || 'English';
    TranscriptAPI.getTranscript(id).then(async transcriptRes => {
        const response = await client.chat.completions.create({
            model:'meta-llama/llama-3.3-8b-instruct:free',
            messages:[
                {
                    "role": "system",
                    "content": `You are an expert content summarizer. Create comprehensive, well-structured summaries of YouTube video transcripts in ${lang}. Exclude any sponsor mention from your summary. 
    
                    Format your response in markdown with:
                    - Clear section headers (##, ###)
                    - Bullet points for key concepts
                    - Numbered lists for step-by-step information
                    - Bold text for important terms
                    - Blockquotes for notable quotes
                    - Code formatting for technical terms when relevant
                    Make the summary informative, engaging, and easy to scan. Focus on the main learning points, key takeaways, and actionable insights. Keep it concise but comprehensive.`,
                },
                {
                    "role": "user",
                    "content": `Please create a comprehensive summary of this YouTube video transcript in ${lang}:
    
                    Transcript:
                    ${transcriptRes.map(e => e.text).join(" ")}
                    Create a well-structured summary that captures the main topics, key learning points, and important insights from this video.`
                }
            ]
        });
        res.send(response.choices[0].message.content);
    }).catch(err => {
        res.status(err.status || 500).send('Failed to get transcript or summary.');
    });
})

app.get('/', async (req, res) => {
    return res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
})


app.listen(3005,() => {
    console.log('Server listening on port 3005...')
})


