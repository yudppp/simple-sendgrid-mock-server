# simple-sendgrid-mock-server

[DockerHub](https://hub.docker.com/r/yudppp/simple-sendgrid-mock-server)

Simple SendGrid Mock Server is SendGrid Mock Server on Docker.
Mail is not actually sent. Instead, you can see the mails sent to you like a mailer.
And SendGrid v3 API Support.

## Usage

### Using the Docker image

Starting on the command-line:

```
docker run -p 3030:3030 -env SENDGRID_API_KEY=YOUR_API_KEY -env SESSION_COOKIE_SECRET=YOUR_SECRET  -t yudppp/simple-sendgrid-mock-server
```

The port `3030` is for HTTP.

## Input

SendGrid Web API v3 mock,

### go example

```go
import 	"github.com/sendgrid/sendgrid-go"

func SendMail() error {
	request := sendgrid.GetRequest(mockAPIKey, "/v3/mail/send", mockedHost)
  ...
}

```

## Output

### Like Mailer

#### login page

![Login Page](https://github.com/yudppp/simple-sendgrid-mock-server/raw/master/media/login.png)

Please input your `YOUR_API_KEY`.

#### Viewer

![Mailer Page](https://github.com/yudppp/simple-sendgrid-mock-server/raw/master/media/mailer.png)

### API

Responced Stored All Message.

```
> curl http://localhost:3030/json?token=YOUR_API_KEY
[
  {
    "personalizations": [
      {
        "to": [
          {
            "email": "example@example.com"
          }
        ]
      }
    ],
    "from": {
      "email": "example@example.com"
    },
    "subject": "Hello, World!",
    "sent_at": 1630322977319,
    "content": [
      {
        "type": "text/plain",
        "value": "Heya!"
      }
    ]
  },
  {
    "personalizations": [
      {
        "to": [
          {
            "email": "example@example.com"
          }
        ]
      }
    ],
    "from": {
      "email": "example@example.com"
    },
    "subject": "Hello, World!",
    "sent_at": 1630322914938,
    "content": [
      {
        "type": "text/plain",
        "value": "Heya!"
      }
    ]
  }
]
```
