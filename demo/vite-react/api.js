const { preview } =require( "vite");

(async () => {
  const server = await preview({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337,
    },
  });
  await server.listen();

  server.printUrls();
})();
