export default () => ({
    nodemailer: {
        host: process.env.NODEMAILER_SMTP_HOST,
        port: parseInt(process.env.NODEMAILER_SMTP_PORT),
        secure: process.env.NODEMAILER_SMTP_SECURE === 'true',
        auth: {
            user: process.env.NODEMAILER_SMTP_AUTH_USER,
            pass: process.env.NODEMAILER_SMTP_AUTH_PASS,
        },
        tls: {
            ciphers: process.env.NODEMAILER_TLS_CIPHER,
        },
    },
});
