## About

**Notifier** is a free tool to send notifications or messages to a variety of channels. The message is template-based. We store the template in Notifier then send a request to Notifier with matching payload to populate the message content.

## Features

- [v] Send email through SMPT
- [v] Send email through Amazon SES using API key
- [v] Send email through Brevo using API key
- [ ] Send message to Whatsapp
- [ ] Send message to Telegram
- [ ] Send message to Slack

## Setup

1. Create templates.
    Templates are stored in `/templates` directory. We can create a template inside subdirectories. It is recommended we have the template with both `html` and `txt` format as the email sender function will try to render both formats. 
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


## ToDo

- [ ] Schedule notification
- [ ] Send notification status through webhook
- [ ] Error logging

## License

Notifier is [MIT licensed](LICENSE).
