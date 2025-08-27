const { Resend } = require('resend');
const path = require('path');
const fs = require('fs').promises;

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarEmail = async (para, assunto, mensagem, anexo = null, mensagemHtml = null) => {
  const remetente = 'MindTask <noreply@kaique.dev.br>';

  const mailOptions = {
    from: remetente,
    to: para,
    subject: assunto,
    text: mensagem,
    attachments: [],
  };

  if (mensagemHtml) {
    mailOptions.html = mensagemHtml;
  }

  if (anexo) {
    try {
      const anexoPath = typeof anexo === 'string' ? anexo : anexo.path;
      const anexoFilename = typeof anexo === 'string' ? path.basename(anexo) : anexo.filename;

      const fileContent = await fs.readFile(anexoPath);

      mailOptions.attachments.push({
        filename: anexoFilename,
        content: fileContent,
      });

    } catch (error) {
      console.error("❌ Erro ao ler o arquivo de anexo:", error);
      throw new Error("Não foi possível processar o anexo para o e-mail.");
    }
  }

  try {
    const { data, error } = await resend.emails.send(mailOptions);

    if (error) {
      console.error("❌ Erro retornado pelo Resend:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email enviado com sucesso!", data.id);

  } catch (error) {
    console.error("❌ Falha geral no envio do e-mail:", error);
    throw error;
  }
};

module.exports = { enviarEmail };