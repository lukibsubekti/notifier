## About

**Notifier** is a free tool to send notifications or messages to a variety of channels. The message is template-based. We store the template in Notifier then send a request to Notifier with matching payload to populate the message content.

## Features

- [x] Send email through SMPT
- [x] Send email through Amazon SES using API key
- [x] Send email through Brevo using API key
- [ ] Send message to Whatsapp
- [ ] Send message to Telegram
- [ ] Send message to Slack

## Setup

1. Create templates.  
    Templates are stored in `/templates` directory. We can create a template inside subdirectories under `/templates`. It is recommended we have the template with both `html` and `txt` format as the email sender function will try to render both formats. 
    For example, we have `/templates/en/sample.hello.html` and `/templates/en/sample.hello.txt`. Then, in the HTPP request body we can select the template by setting the `template` field to `en/sample.hello`.

1. Create and configure `.env` file based on `.env.sample`.

1. Install dependencies.
    ```bash
    pnpm install
    ```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run Using Docker

1. An example of `docker-compose.yaml` configuration is available [here](docker-compose.yaml).

1. Configure your `.env` file based on `.env.sample`.

1. Bind your templates directory to `/app/templates` directory in the container.

## Send Request & The Parameters

To send an email, send a `POST` request to `http://<your_host>:<your_port>/send`. The body parameters are as follows.

- `is_sync`: boolean.  
    Default **false**. Setting mode to synchronous or asynchronous. If the client wants to receive the email sending result, it can be set to true (synchronous).
- `method`: “smtp” | “ses” | “brevo”.  
    Default “**smtp**”. 
- `to_email`: string.  
    Receiver's email address.
- `to_name`: string.  
    Receiver's name.
- `template`: string.  
    It is required if the `method` is not “brevo”.
    It is not required if the `method` is “brevo” and `brevo_template` is not empty.
- `subject`: string.  
    Subject of email.
- `payload`: object.  
    The content depends on the target template.
- `brevo_template`: string or number.  
    Template number in Brevo. It can be used if the method is “brevo”. 

For example:

```json
{
    "is_sync": true,
    "to_email": "lukibsubekti@gmail.com",
    "to_name": "Luki",
    "subject": "Registration Success",
    "payload": { "fullName": "Luki", "url": "http://google.com" },
    "method": "smtp",
    "template": "en/sample.hello"
}
```

## ToDo

- [ ] Schedule notification
- [ ] Send notification status through webhook
- [ ] Error logging

## License

Notifier is [MIT licensed](LICENSE).
