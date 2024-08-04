const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config(); // 環境変数を読み込む

const app = express();

app.use(express.json());
app.use(bodyParser.json());

// CORSを有効にする
app.use(cors({
  origin: 'http://localhost:3000'  // フロントエンドのURL
}));

let settings = {
  title_prompt: '', // デフォルトを空文字列に設定
  content_prompt: '', // デフォルトを空文字列に設定
  api_endpoint: '' // デフォルトを空文字列に設定
};

// 設定を取得するエンドポイント
app.get('/settings', (req, res) => {
  res.json(settings);
});

// 設定を保存するエンドポイント
app.post('/settings', (req, res) => {
  const { title_prompt, content_prompt, api_endpoint } = req.body;
  settings.title_prompt = title_prompt || ''; // 空白の場合は空文字列に設定
  settings.content_prompt = content_prompt || ''; // 空白の場合は空文字列に設定
  settings.api_endpoint = api_endpoint || ''; // 空白の場合は空文字列に設定
  res.json({ message: 'Settings updated successfully' });
});

app.get('/generate-articles', async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.DIFY_API_KEY;
  const apiEndpoint = settings.api_endpoint; // 設定からAPIエンドポイントを取得

  console.log(`Received request to generate articles with query: ${query}`);

  try {
    const keywords = query.split(',').map(keyword => keyword.trim());
    const requests = keywords.map(keyword => 
      axios.post(apiEndpoint, {
        inputs: { 
          title_prompt: settings.title_prompt,
          content_prompt: settings.content_prompt
        },
        query: keyword,
        response_mode: "streaming",
        user: "akamichi"
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      })
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responses = await Promise.all(requests);

    responses.forEach((response, index) => {
      let buffer = '';
      let finalAnswer = '';
      let finalTitle = '';
      let titleConfirmed = false; // TITLEが取得されたかどうかを管理するフラグ

      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.replace(/^data: /, '');
            try {
              const data = JSON.parse(jsonString);
              console.log('Received data:', data); // 追加: 受信したデータをログに出力
              const currentKeyword = keywords[index]; // indexを使用して現在のキーワードを取得

              if (data.event === 'node_finished') {
                if (!titleConfirmed && data.data.title === 'TITLE') {
                  finalTitle = data.data.outputs.text; // TITLEが取得できた場合
                  titleConfirmed = true; // TITLEが取得されたことを記録
                } else if (!titleConfirmed) {
                  finalTitle = `${currentKeyword} - ${index + 1}`; // 現在のキーワードとインデックス番号+1を設定
                }
              }

              if (data.event === 'workflow_finished') {
                finalAnswer = data.data.outputs.answer;
                res.write(`data: ${JSON.stringify({ title: finalTitle, answer: finalAnswer })}\n\n`);
                finalTitle = '';
                finalAnswer = '';
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      });

      response.data.on('end', () => {
        res.write('event: end\n\n');
      });
    });

    // すべてのレスポンスが終了した後に呼び出す
    res.on('close', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error while generating articles:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});