
const nodemailer = require('nodemailer');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');


const { EMAIL, PASSWORD } = require('../env.js')

const certificate = async (req, res) => {
  const { userEmail } = req.body;
  const imageName = 'cert.png';
  const name = req.body.name ;

  try {
    const image = await loadImage(imageName);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    ctx.font = '200px  Arial';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    ctx.strokeText(name, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('output.png', buffer);

    const { userEmail } = req.body;

    let config = {
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD
      }
    }

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: EMAIL,
      to: userEmail,
      subject: "Certificate",
      html: `Please find the image attached.<br><br>Best regards,<br>Nibida Ghimire`,
      attachments: [
        {
          filename: 'Certificate.png',
          path: "output.png"
          // content: buffer

        }
      ]
    }

    transporter.sendMail(message).then(() => {
      return res.status(201).json({
        msg: "you should receive an email"
      })
    }).catch(error => {
      return res.status(500).json({ error })
    })

  } catch (err) {
    console.error('Error generating the image:', err);
    return res.status(500).json({ message: 'Failed to generate the image.' });
  }
};

module.exports = {
  certificate
};
