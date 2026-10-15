import figlet from 'figlet';

const server = Bun.serve({
  port: 5000,
  routes: {
    "/": () => new Response('Bun!'),
    "/figlet": () => {
      const body = figlet.textSync('Bloodborne MOLA!');
      return new Response(body);
    }
  }
});

console.log(`Listening on ${server.url}`);