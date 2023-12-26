export default () => ({
    host: process.env.NESTJS_HOST,
    port: parseInt(process.env.NESTJS_PORT, 10) || 3000,
});
