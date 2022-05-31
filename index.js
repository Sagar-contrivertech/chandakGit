const express = require('express')
const cors = require('cors')

const { google } = require('googleapis')

const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

//authentications
const authentication = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const sheets = google.sheets({
        version: 'v4',
        auth: client
    });
    return { sheets }
}

const id = "13y0G3qCfkZ7zSM_c1djeBRQrZzZB_9qx_zz35Ke3aEU"// spreadsheet i
// writing data toaspreadsheet
app.post('/', async (req, res) => {
    try {
        // destructure'newName'and'newValue'from req.body
        const { Name, Number, Email } = req.body;
        const { sheets } = await authentication();
        // writing data toaspreadsheet
        const writeReq = await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [Name, Number, Email],
                ]
            }
        })
        if (writeReq.status === 200) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "keval.hdpi@gmail.com",
                    pass: "keval@1234"
                }
            });
        
            const mailOptions = {
                from: req.body.Email,
                to: 'keval.hdpi@gmail.com',
                subject: ` New lead from ${req.body.Name} `,
                text: `You have recievied new Lead from Website
                Name : ${req.body.Name}
                Number: ${req.body.Number}
                Email: ${req.body.Email}
                
                Leads has also been update to sheet
        
                https://docs.google.com/spreadsheets/d/13y0G3qCfkZ7zSM_c1djeBRQrZzZB_9qx_zz35Ke3aEU/edit?usp=sharing
        
                `
            }
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    res.status(400).send(error)
                } else {
                    console.log('Email sent ' + info.response)
                    res.status(200).send('succes')
                }
            })
            return res.status(200).json({ msg: 'Spreadsheet updated successfully!' })
        }
        return res.json({ msg: 'Something went wrong while updating the spreadsheet.' })
    } catch (e) {
        console.log('ERROR UPDATING THE SPREADSHEET', e);
        res.status(500).send();
    }
})


app.post('/mail', async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "keval.hdpi@gmail.com",
            pass: "keval@1234"
        }
    });

    const mailOptions = {
        from: req.body.Email,
        to: 'keval.hdpi@gmail.com',
        subject: ` New lead from ${req.body.Name} `,
        text: `You have recievied new Lead from Website
        Name : ${req.body.Name}
        Number: ${req.body.Number}
        Email: ${req.body.Email}
        
        Leads has also been update to sheet

        https://docs.google.com/spreadsheets/d/13y0G3qCfkZ7zSM_c1djeBRQrZzZB_9qx_zz35Ke3aEU/edit?usp=sharing

        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            res.status(400).send(error)
        } else {
            console.log('Email sent ' + info.response)
            res.status(200).send('succes')
        }
    })
})


app.listen(3000, () => console.log('server is running in 3000'))