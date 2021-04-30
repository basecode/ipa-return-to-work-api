# Return To Work API

Repo contains code related to the Backend API used for the apprentice exam 2021. The Backend API is hosted
on Azure serverless functions.

Every response contains a fresh JWT that shall be used as session. In the following the documentation shows only the JWT's payload.
Example: `[jwt-header].[jwt-payload].[jwt-signature]`

## Install

```bash
npm install basecode/ipa-return-to-work-api#f0ab9ee --save
```

Add to package.json:

```json
{
  "prestart": "ipa-return-to-work-api start",
  "start": "echo 'done'"
}
```

or start manually from project root: `npx ipa-return-to-work-api start` resp. `npx ipa-return-to-work-api stop`

## login

```bash
JWT=$(curl --data '{"code":"1111111"}' \
  --header "Content-Type: application/json"  \
  --request POST http://localhost:7071/api/login \
)
echo $JWT
```

where code can be one of the follows:

```js
{
  '3827393': { id: '27372', name: 'Tatyana' },
  '9388282': { id: '27373', name: 'Tobias' },
  '4882992': { id: '27374', name: 'Dominique' },
  '7282737': { id: '27375', name: 'Lars' },
  '1111111': { id: '11111', name: 'Anonymous' }
}
```

Response:

* 200 OK – JWT
  
  ```js
  {
    "userId": "123",
    "userName": "...",
    "questionnaire_result": false,
    "seat": "...",
    "location": "Basel",
    "cafeteria_spots": ["/* see cafeteria api */"]
  }
  ```

* 403 Forbidden – "Your link is not valid anymore. Please check your E-Mail inbox for a valid link."
* 500 Internal Error – "Internal error. Please contact Adobe’s Employee Resource Center."

## questionnaire

```bash
JWT=$(curl --data '{"symptomsLast14Days": false, "selfQuarantine": false, "contactLast14Days": false, "requestedWorkplace": true}' \
  --header "Content-Type: application/json"  \
  --header "session: $JWT" \
  --request POST http://localhost:7071/api/questionnaire \
)
echo $JWT
```

Response:

* 200 OK – JWT
  
  ```js
  {
    "userId": "123",
    "userName": "...",
    "questionnaire_result": true,
    "seat": "122",
    "location": "Basel",
    "cafeteria_spots": ["/* see cafeteria api */"]
  }
  ```

* 403 Forbidden – "Your link is not valid anymore. Please check your E-Mail inbox for a valid link."
* 500 Internal Error – "Internal error. Please contact Adobe’s Employee Resource Center."

## cafeteria (get)

```bash
JWT=$(curl --header "session: $JWT" \
  --request GET http://localhost:7071/api/cafeteria \
)
echo $JWT
```

Response:

* 200 OK – JWT
  
  ```js
  {
    "userId": "123",
    "userName": "...",
    "questionnaire_result": true,
    "seat": "122",
    "location": "Basel",
    "cafeteria_spots": [
      {
        "from": 1615566300000,
        "to": 1615566600000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566600000,
        "to": 1615566900000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566900000,
        "to": 1615567200000,
        "free": false,
        "owner": "12345"
      },
      {
        "from": 1615567200000,
        "to": 1615567500000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567500000,
        "to": 1615567800000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567800000,
        "to": 1615568100000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568100000,
        "to": 1615568400000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568400000,
        "to": 1615568700000,
        "free": true,
        "owner": null
      }
    ]
  }
  ```

* 403 Forbidden – "Your link is not valid anymore. Please check your E-Mail inbox for a valid link."
* 500 Internal Error – "Internal error. Please contact Adobe’s Employee Resource Center."

## cafeteria (post)

```bash
JWT=$(curl --data '{"spot_request_from": 1615568400000}' \
  --header "Content-Type: application/json"  \
  --header "session: $JWT" \
  --request POST http://localhost:7071/api/cafeteria \
)
echo $JWT
```

Response:

* 200 OK – JWT
  
  ```js
  {
    "userId": "123",
    "userName": "...",
    "questionnaire_result": true,
    "seat": "122",
    "location": "Basel",
    "cafeteria_spots": [
      {
        "from": 1615566300000,
        "to": 1615566600000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566600000,
        "to": 1615566900000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566900000,
        "to": 1615567200000,
        "free": false,
        "owner": "12345"
      },
      {
        "from": 1615567200000,
        "to": 1615567500000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567500000,
        "to": 1615567800000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567800000,
        "to": 1615568100000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568100000,
        "to": 1615568400000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568400000,
        "to": 1615568700000,
        "free": false,
        "owner": "123"
      }
    ]
  }
  ```

* 403 Forbidden – "Your link is not valid anymore. Please check your E-Mail inbox for a valid link."
* 500 Internal Error – "Internal error. Please contact Adobe’s Employee Resource Center."

## cafeteria (delete)

```bash
JWT=$(curl --data '{"spot_request_from": 1615568400000}' \
  --header "Content-Type: application/json"  \
  --header "session: $JWT" \
  --request DELETE http://localhost:7071/api/cafeteria \
)
echo $JWT
```

Response:

* 200 OK – JWT
  
  ```js
  {
    "userId": "123",
    "userName": "...",
    "questionnaire_result": true,
    "seat": "122",
    "location": "Basel",
    "cafeteria_spots": [
      {
        "from": 1615566300000,
        "to": 1615566600000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566600000,
        "to": 1615566900000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615566900000,
        "to": 1615567200000,
        "free": false,
        "owner": "12345"
      },
      {
        "from": 1615567200000,
        "to": 1615567500000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567500000,
        "to": 1615567800000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615567800000,
        "to": 1615568100000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568100000,
        "to": 1615568400000,
        "free": true,
        "owner": null
      },
      {
        "from": 1615568400000,
        "to": 1615568700000,
        "free": true,
        "owner": null
      }
    ]
  }
  ```

* 403 Forbidden – "Your link is not valid anymore. Please check your E-Mail inbox for a valid link."
* 500 Internal Error – "Internal error. Please contact Adobe’s Employee Resource Center."
