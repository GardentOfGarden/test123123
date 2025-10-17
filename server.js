import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await fetch('https://api.anthropic.com/v1/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.ANTHROPIC_API_KEY
            },
            body: JSON.stringify({
                model: "claude-v1",
                prompt: message,
                max_tokens_to_sample: 200
            })
        });
const data = await response.json();

// Проверяем, где именно находится текст ответа
const replyText = data.completion || data.completion?.[0]?.text || data?.completion?.text || "Нет ответа";
res.json({ reply: replyText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Ошибка сервера" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
