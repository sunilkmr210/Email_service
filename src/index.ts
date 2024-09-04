import express, { Request, Response } from 'express';
import { EmailService } from './services/EmailService';
import { logs } from './utils/Logger';
import { Logger } from './utils/Logger';

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.post('/api/mail', (req: Request, res: Response) => {

    const email: string = req.body.email;
    const subject: string = req.body.subject;
    const content: string = req.body.content;


    emailService.sendEmail(email, subject, content)
        .then(result => {
            res.status(200).send(logs);
            console.log('Email sent:', result);
        })
        .catch(error => {
            res.status(400).send(error);
            console.log('Failed to send email:', error);
        });


});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});