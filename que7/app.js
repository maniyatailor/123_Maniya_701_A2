const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    // Enhanced bot response
    let botReply = '';
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (/hello|hi|hey/i.test(msg)) {
      botReply = 'Hello! How can I help you today?';
    } else if (/bye|goodbye/i.test(msg)) {
      botReply = 'Goodbye! Have a great day!';
    } else if (/help/i.test(msg)) {
      botReply = 'You can ask me things like: What is today? What is the date? What year is it? What time is it? Who are you? What is 2+2? Tell me a joke.';
    } else if (/your name|who are you/i.test(msg)) {
      botReply = "I'm a simple chatbot created with Socket.io!";
    } else if (/date|today/i.test(msg)) {
      botReply = `Today's date is ${now.toLocaleDateString()}.`;
    } else if (/day/i.test(msg)) {
      botReply = `Today is ${days[now.getDay()]}.`;
    } else if (/year/i.test(msg)) {
      botReply = `The current year is ${now.getFullYear()}.`;
    } else if (/time/i.test(msg)) {
      botReply = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (/how\s*are\s*you[\s\?\.!]*/i.test(msg)) {
      botReply = "I'm just a bot, but I'm doing great! How can I help you?";
    } else if (/thank/i.test(msg)) {
      botReply = "You're welcome!";
    } else if (/what is 2\s*\+\s*2|2\s*\+\s*2/i.test(msg)) {
      botReply = "2 + 2 is 4.";
    } else if (/joke|make me laugh|funny/i.test(msg)) {
      const jokes = [
        "Why did the computer show up at work late? It had a hard drive!",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "Why don't scientists trust atoms? Because they make up everything!"
      ];
      botReply = jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      botReply = "I'm a simple bot. Try saying 'hello', 'help', 'what is today', 'what year is it', 'what is 2+2', or 'tell me a joke'.";
    }
    io.emit('chat message', { user: 'You', text: msg });
    setTimeout(() => {
      io.emit('chat message', { user: 'Bot', text: botReply });
    }, 500);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3007;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
