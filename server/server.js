const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: [/localhost/, /github\.dev/, /feira-de-jogos\.dev\.br/],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

let salasProntas = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("select-player", (room, player) => {
    console.log(`Selected player ${player} in room ${room}`);
    socket.to(room).emit("player-selected", player);
  });

  socket.on("start-game", (room, player) => {
    console.log(`Game started in room ${room} by player ${player}`);
    socket.to(room).emit("start-game", player);
  });

  socket.on("change-scene", (room, scene) => {
    console.log(`Changing scene to ${scene} in room ${room}`);
    socket.to(room).emit("change-scene", scene);
  });

 socket.on("player-ready-scene2", (room) => {
  console.log(`[Server] Jogador ${socket.id} enviou READY para a sala: ${room}`);

   if (!room) return;
   
   socket.join(room);

  // Se a sala não existir no objeto, cria um novo conjunto de IDs
  if (!salasProntas[room]) {
    salasProntas[room] = new Set();
  }

  // Adiciona o ID do socket atual na lista da sala
  salasProntas[room].add(socket.id);

  console.log(`[Server] Sala ${room} tem ${salasProntas[room].size} jogador(es) pronto(s).`);

  // Quando houver 2 conexões distintas prontas na mesma sala
  if (salasProntas[room].size === 2) {
    console.log(`[Server] ==> Sala ${room} COMPLETA! Enviando 'start-match' para os dois.`);
    io.to(room).emit("start-match");
    
    // Limpa a lista da sala para permitir que eles reiniciem se quiserem
    salasProntas[room].clear(); 
  }
});

  socket.on("scene0", (room, state) => {
    if (room) {
      socket.to(room).emit("scene0", state);
    } else {
      socket.broadcast.emit("scene0", state);
    }
  });

  socket.on("scene1", (room, state) => {
    if (room) {
      socket.to(room).emit("scene1", state);
    } else {
      socket.broadcast.emit("scene1", state);
    }
  });

  // Escuta quando a scene1 avisa que um alien deve nascer
    socket.on('alien-spawnado-scene1', (dadosAlien) => {
        socket.broadcast.emit('criar-alien-scene0', dadosAlien);
    });
  
  // 2. Quando um alien morre, o servidor avisa a outra tela para apagá-lo
    socket.on('destruir-alien', (idAlien) => {
        socket.broadcast.emit('destruir-alien', idAlien);
    });

    // 3. Repassa os dados de posição, velocidade e animação a cada frame
    socket.on('atualizar-movimento-aliens', (pacoteAliens) => {
        socket.broadcast.emit('atualizar-movimento-aliens', pacoteAliens);
    });

  socket.on("GameOver", (room, state) => {
    if (room) {
      socket.to(room).emit("GameOver", state);
    } else {
      socket.broadcast.emit("GameOver");
    }
    });

 socket.on("move-ship", (data) => {
  socket.to(data.room).emit("ship-moved", data);
});

socket.on("shoot", (room) => {
  socket.to(room).emit("ship-shot");
});

// Sincronização de Inimigos e Asteroides (NOVOS)
socket.on("spawn-asteroid", (data) => {
  socket.to(data.room).emit("spawn-asteroid", data);
});

socket.on("spawn-enemy", (data) => {
  socket.to(data.room).emit("spawn-enemy", data);
});

socket.on("enemy-shoot", (data) => { 
  socket.broadcast.emit("enemy-shoot", data); 
});

socket.on("boss-attack", (data) => {
  socket.to(data.room).emit("boss-attack", data);
});

  socket.on("sync-player-health", (data) => {
  socket.to(data.room).emit("sync-player-health", data);
});

socket.on("sync-enemy-health", (data) => {
  socket.to(data.room).emit("sync-enemy-health", data);
});
  
  socket.on("scene2", (room, state) => {
    if (room) {
      socket.to(room).emit("scene2", state);
    } else {
      socket.broadcast.emit("scene2", state);
    }
  });

  socket.on("offer", (room, description) => {
    socket.to(room).emit("offer", description);
  });

  socket.on("candidate", (room, candidate) => {
    socket.to(room).emit("candidate", candidate);
  });

  socket.on("answer", (room, description) => {
    socket.to(room).emit("answer", description);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3000);
