# simple-sendgrid-mock-server

[DockerHub](https://hub.docker.com/r/yudppp/simple-sendgrid-mock-server)

## How to use

Please set your application to this host.

### go example

```go
import 	"github.com/sendgrid/sendgrid-go"

func SendMail() error {
	request := sendgrid.GetRequest(mockAPIKey, "/v3/mail/send", mockedHost)
  ...
}

```
