const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Configura las cabeceras de respuesta para indicar que el contenido es de tipo texto HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Analiza la URL de la solicitud
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/datos' && req.method === 'GET') {
        // Manejar solicitudes GET en la ruta "/datos"
        handleGetData(req, res, parsedUrl.query);
    } else if (parsedUrl.pathname === '/post-variante' && req.method === 'POST') {
        // Manejar solicitudes POST en la ruta "/post-variante"
        handlePostVariante(req, res);
    } else if (req.url === '/' && req.method === 'GET') {
        // Redirigir desde la raíz a la ruta "/datos?campo1=12&campo2=34"
        res.writeHead(302, {
            'Location': '/datos?campo1=12&campo2=34',
        });
        res.end();
    } else {
        // Otros casos no admitidos
        res.statusCode = 405;
        res.end('Método no permitido');
    }
});

// Función para manejar solicitudes GET en la ruta "/datos"
function handleGetData(req, res, queryParams) {
    const campo1 = queryParams.campo1 || 'N/A';
    const campo2 = queryParams.campo2 || 'N/A';

    // Obtiene la ruta completa de la solicitud
    const fullUrl = req.url;

    // Define el contenido HTML de respuesta para GET
    const responseHTML = `
    <html>
      <head>
        <title>Respuesta HTTP - GET</title>
      </head>
      <body>
        <h1>Request headers:</h1>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
        <h1>Método: GET</h1>
        <h1>URL: ${fullUrl}</h1>
      </body>
    </html>
  `;

    // Envía la respuesta HTML al cliente
    res.end(responseHTML);
}

// Función para manejar solicitudes POST en la ruta "/post-variante"
function handlePostVariante(req, res) {
    let postData = '';

    req.on('data', (chunk) => {
        // Recopila los datos del cuerpo de la solicitud POST
        postData += chunk;
    });

    req.on('end', () => {
        // Define el contenido HTML de respuesta para POST en la ruta "/post-variante"
        const responseHTML = `
      <html>
        <head>
          <title>Respuesta HTTP - POST</title>
        </head>
        <body>
          <h1>Request headers:</h1>
          <pre>${JSON.stringify(req.headers, null, 2)}</pre>
          <h1>Método: POST</h1>
          <h1>URL: /post-variante</h1>
          <h2>Datos enviados: ${postData}</h2>
        </body>
      </html>
    `;

        // Envía la respuesta HTML al cliente
        res.end(responseHTML);
    });
}

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

