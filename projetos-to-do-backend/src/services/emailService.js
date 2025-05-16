const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarEmail = async (para, assunto, mensagem, anexo = null, mensagemHtml = null) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: para,
        subject: assunto,
        text: mensagem,
        ...(mensagemHtml && { html: mensagemHtml })
    };

    if (anexo) {
        if (typeof anexo === 'string') {
            mailOptions.attachments = [
                {
                    filename: path.basename(anexo),
                    path: anexo
                }
            ];
        } else if (typeof anexo === 'object') {
            mailOptions.attachments = [
                {
                    filename: anexo.filename,
                    path: anexo.path
                }
            ];
        }
    }

    await transporter.sendMail(mailOptions);
};

module.exports = { enviarEmail };
