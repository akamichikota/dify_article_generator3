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

// デフォルト値を定義
const DEFAULT_TITLE_PROMPT = `
Q&A式の記事を書きたいので、タイトルには「？」を含めてください。
人間の悩みに注目してタイトルを考えてください。
タイトルはよくある質問や疑問を反映させるものにし、読者の興味を引くようなキャッチーな言葉やフレーズを使ってください。
`;

const DEFAULT_CONTENT_PROMPT = `
- 最初の数行で読者の興味を引き、続きを読みたくなるようにしてください。
- 必ず日本の情報を参照してください。日本語以外をベースに書かれた情報は参照しないでください。なぜなら、記事を自然な日本語にするためです。
- 文章量は必ず2000文字以上にしてください。
`;

const DEFAULT_API_ENDPOINT = 'https://api.dify.ai/v1/chat-messages';
const DEFAULT_API_KEY = process.env.DIFY_API_KEY || 'default_api_key_null';

let settings = {
  title_prompt: '', // デフォルトを空文字列に設定
  content_prompt: '', // デフォルトを空文字列に設定
  api_endpoint: '', // デフォルトを空文字列に設定
  api_key: '', // デフォルトを空文字列に設定
  variable1: '', // デフォルトを空文字列に設定
  variable2: '', // デフォルトを空文字列に設定
  variable3: '', // デフォルトを空文字列に設定
  variable4: '', // デフォルトを空文字列に設定
  variable5: '' // デフォルトを空文字列に設定
};

// 設定を取得するエンドポイント
app.get('/settings', (req, res) => {
  res.json(settings);
});

// 設定を保存するエンドポイント
app.post('/settings', (req, res) => {
  const { title_prompt, content_prompt, api_endpoint, api_key, variable1, variable2, variable3, variable4, variable5 } = req.body;
  console.log('受信した設定:', { title_prompt, content_prompt, api_endpoint, api_key, variable1, variable2, variable3, variable4, variable5 }); // 追加: 受信した設定をログに出力
  settings.title_prompt = title_prompt || ''; // 空白の場合は空文字列に設定
  settings.content_prompt = content_prompt || ''; // 空白の場合は空文字列に設定
  settings.api_endpoint = api_endpoint || ''; // 空白の場合は空文字列に設定
  settings.api_key = api_key || ''; // 空白の場合は空文字列に設定
  settings.variable1 = variable1 || ''; // 空白の場合は空文字列に設定
  settings.variable2 = variable2 || ''; // 空白の場合は空文字列に設定
  settings.variable3 = variable3 || ''; // 空白の場合は空文字列に設定
  settings.variable4 = variable4 || ''; // 空白の場合は空文字列に設定
  settings.variable5 = variable5 || ''; // 空白の場合は空文字列に設定
  res.json({ message: '設定が正常に更新されました' });
});

app.get('/generate-articles', async (req, res) => {
  const { query, format } = req.query;
  const apiKey = settings.api_key || DEFAULT_API_KEY; // デフォルト値を設定
  const apiEndpoint = settings.api_endpoint || DEFAULT_API_ENDPOINT; // デフォルト値を設定
  const titlePrompt = settings.title_prompt || DEFAULT_TITLE_PROMPT; // デフォルト値を設定
  const contentPrompt = settings.content_prompt || DEFAULT_CONTENT_PROMPT; // デフォルト値を設定
  const variable1 = settings.variable1 || '';
  const variable2 = settings.variable2 || '';
  const variable3 = settings.variable3 || '';
  const variable4 = settings.variable4 || '';
  const variable5 = settings.variable5 || '';

  console.log(`記事生成リクエストを受信しました: ${query}`);
  console.log('使用する設定:', { apiKey, apiEndpoint, titlePrompt, contentPrompt, format, variable1, variable2, variable3, variable4, variable5 });

  try {
    const keywords = query.split(',').map(keyword => keyword.trim());
    const requests = keywords.map(keyword =>
      axios.post(apiEndpoint, {
        inputs: {
          title_prompt: titlePrompt,
          content_prompt: contentPrompt,
          format: format,
          variable1: variable1,
          variable2: variable2,
          variable3: variable3,
          variable4: variable4,
          variable5: variable5
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
              console.log('受信したデータ:', data); // 追加: 受信したデータをログに出力
              const currentKeyword = keywords[index]; // indexを使って現在のキーワードを取得

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
              console.error('JSON解析エラー:', e);
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

    // 記事生成後にデフォルト値を使用した場合のみ設定をリセット
    if (settings.api_endpoint === DEFAULT_API_ENDPOINT) settings.api_endpoint = '';
    if (settings.title_prompt === DEFAULT_TITLE_PROMPT) settings.title_prompt = '';
    if (settings.content_prompt === DEFAULT_CONTENT_PROMPT) settings.content_prompt = '';
    if (settings.api_key === DEFAULT_API_KEY) settings.api_key = '';

  } catch (error) {
    console.error('記事生成中のエラー:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で稼働中です`);
});