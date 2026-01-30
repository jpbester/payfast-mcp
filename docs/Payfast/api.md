### Get System Status Response Example

Source: https://developers.payfast.co.za/api/index

An example JSON response from the Payfast system status endpoint. It shows the page information, including its name and last updated time, along with the current status indicator and description.

```json
{
"page":{
"id":"hbt40cyvzkpg",
"name":"Payfast",
"url":"https://status.payfast.io",
"time_zone":"Africa/Johannesburg",
"updated_at":"2022-01-20T16:05:42.931+02:00"
},
"status":{
"indicator":"none",
"description":"All Systems Operational"
}
}
```

--------------------------------

### Get Refund Details by ID (API Example)

Source: https://developers.payfast.co.za/api/index

This snippet shows an example GET request to retrieve refund details using a specific refund ID. It demonstrates the structure of the API endpoint and the expected response format, including transaction details and available balance.

```http
GET https://api.payfast.co.za/refunds/dc0521d3-55fe-269b-fa00-b647310d760f
```

--------------------------------

### Tokenization Response Example

Source: https://developers.payfast.co.za/api/index

Example JSON response for a tokenization operation, indicating the status of the tokenized entity.

```json
{
"code":200,
"status":"success",
"data":{
"response":{
"status":1,
"status_reason":"",
"status_text":"ACTIVE"
}
}
}
```

--------------------------------

### Payfast API JSON Request Example

Source: https://developers.payfast.co.za/api/index

An example of a JSON formatted request body for the Payfast API. This demonstrates how to send key-value pairs.

```json
{"frequency" : 3,"cycles" : 12}
```

--------------------------------

### Example Transaction History Request

Source: https://developers.payfast.co.za/api/index

An example of how to request transaction history for a specific date range using the PayFast API.

```HTTP
https://api.payfast.co.za/transactions/history?from=2017-01-01&to=2017-02-01
```

--------------------------------

### Pause Subscription Response Example

Source: https://developers.payfast.co.za/api/index

Example JSON response indicating the successful pausing of a subscription.

```json
{
"code":200,
"status":"success",
"data":{
"response":true
}
}
```

--------------------------------

### Example Incident Response (JSON)

Source: https://developers.payfast.co.za/api/index

An example of the JSON response structure when retrieving incident data. This includes details about the incident, its status, impact, and associated updates.

```json
{
"page":{
"id":"hbt40cyvzkpg",
"name":"Payfast",
"url":"https://status.payfast.io",
"time_zone":"Africa/Johannesburg",
"updated_at":"2022-01-20T16:05:42.931+02:00"
},
"incidents":[
{
"id":"l0wfwnhd33vx",
"name":"3DSecure outage is causing some credit card transactions to fail",
"status":"resolved",
"created_at":"2022-01-20T14:27:26.256+02:00",
"updated_at":"2022-01-20T16:05:42.928+02:00",
"monitoring_at":null,
"resolved_at":"2022-01-20T16:05:42.914+02:00",
"impact":"major",
"shortlink":"https://stspg.io/fk57rhptdwgr",
"started_at":"2022-01-20T14:27:26.249+02:00",
"page_id":"hbt40cyvzkpg",
"incident_updates":[
{
"id":"hxfsx5gyz48n",
"status":"resolved",
"body":"This incident has been resolved.",
"incident_id":"l0wfwnhd33vx",
"created_at":"2022-01-20T16:05:42.914+02:00",
"updated_at":"2022-01-20T16:05:42.914+02:00",
"display_at":"2022-01-20T16:05:42.914+02:00",
"affected_components":[
{
"code":"phplv458l8tp",
"name":"Credit & Cheque Cards - Payments :: Credit & Cheque Cards",
"old_status":"partial_outage",
"new_status":"operational"
}
],
"deliver_notifications":true,
"custom_tweet":null,
"tweet_id":null
},
{
"id":"ffqdtmmpp4sv",
"status":"identified",
"body":"Some credit card transactions are being declined due to failing 3Dsecure upstream. All other payment methods remain available and processing successfully.",
"incident_id":"l0wfwnhd33vx",
"created_at":"2022-01-20T14:27:26.370+02:00",
"updated_at":"2022-01-20T14:27:26.370+02:00",
"display_at":"2022-01-20T14:27:26.370+02:00",
"affected_components":[
{
"code":"phplv458l8tp",
"name":"Credit & Cheque Cards - Payments :: Credit & Cheque Cards",
"old_status":"operational",
"new_status":"partial_outage"
}
],
"deliver_notifications":true,
"custom_tweet":null,
"tweet_id":null
}
],
"components":[
{
"id":"phplv458l8tp",
"name":"Payments :: Credit & Cheque Cards",
"status":"operational",
"created_at":"2018-01-31T22:32:21.831+02:00",
"updated_at":"2022-01-20T16:05:42.880+02:00",
"position":1,
"description":"Our Credit & Cheque Card payment service",
"showcase":false,
"start_date":null,
"group_id":"by3ldtj5f0m0",
"page_id":"hbt40cyvzkpg",
"group":false,
"only_show_if_degraded":false
}
]
}
],
"...":"↓"
}
```

--------------------------------

### Example Transaction History Response (CSV)

Source: https://developers.payfast.co.za/api/index

Example of a CSV formatted response for transaction history, detailing various transaction attributes.

```CSV
"Date","Type","Sign","Party","Name","Description","Currency","Funding Type","Gross","Fee","Net","Balance","M Payment ID","PF Payment ID","custom str1","custom int1","custom str2","custom int2","custom str3","custom str4","custom str5","custom int3","custom int4","custom int5"
"2020-02-27 13:29:55",FUNDS_RECEIVED,CREDIT,"Test User 01",test,,ZAR,CC,500.00,-24.73,475.27,"22,574.02",,994209,,,,,,,,,, 
"2020-02-27 13:30:13",FUNDS_RECEIVED,CREDIT,"Test User 01",test,,ZAR,CC,100.00,-6.79,93.21,"22,667.23",,994210,,,,,,,,,, 
"2020-03-02 14:31:30",FUNDS_RECEIVED,CREDIT,"Test User 01","item name",,ZAR,CC,121.00,-7.73,113.27,"22,780.50",pay_now_11611660,995893,,,,,,,,,, 
"2020-04-14 11:15:20",FUNDS_RECEIVED,CREDIT,"Test User 01","item name",,ZAR,CC,50.00,-4.54,45.46,"22,825.96",pay_now_11611660,1019891,,,,,,,,,,
```

--------------------------------

### Recurring Subscription Response Example

Source: https://developers.payfast.co.za/api/index

Example JSON response for a recurring subscription query, showing details like amount, cycles, frequency, run date, and status.

```json
{
"code":200,
"status":"success",
"data":{
"response":{
"amount":1628,
"cycles":14,
"cycles_complete":9,
"frequency":3,
"run_date":"2020-07-04T00:00:00+02:00",
"status":1,
"status_reason":"",
"status_text":"ACTIVE",
"token":"a3b3ae55-ab8b-b388-df23-4e6882b86ce0"
}
}
}
```

--------------------------------

### Create EFT Refund Request Example

Source: https://developers.payfast.co.za/api/index

An example JSON payload for creating a refund via EFT (Electronic Funds Transfer). This includes the amount, reason, buyer notification preference, and specific bank details required for the payout.

```json
{
    "amount": "1000",
    "notify_buyer": true,
    "notify_merchant": false,
    "reason": "Product out of stock",
    "bank_account_holder": "Mr Smith",
    "bank_name": "FNB",
    "bank_branch_code": "111111",
    "bank_account_number": "100000000000",
    "bank_account_type": "current"
}
```

--------------------------------

### Create Credit Card Refund Request Example

Source: https://developers.payfast.co.za/api/index

An example JSON payload for creating a refund to the original payment source (e.g., Credit Card). This requires the amount, reason, and buyer notification preference, but not bank-specific details.

```json
{
    "amount": "1000",
    "notify_buyer": true,
    "notify_merchant": false,
    "reason": "Product out of stock"
}
```

--------------------------------

### Get Status Page Summary (API Endpoint)

Source: https://developers.payfast.co.za/api/index

This snippet illustrates how to retrieve a summary of the status page using a GET request to the specified endpoint. The response includes overall status, component statuses, incidents, and scheduled maintenances.

```http
GET https://status.payfast.io/api/v2/summary.json
```

--------------------------------

### GET /api/v2/components.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of all components for the Payfast page, including their current status (operational, degraded_performance, partial_outage, or major_outage).

```APIDOC
## GET /api/v2/components.json

### Description
Get the components for the page. Each component is listed along with its status - one of operational, degraded_performance, partial_outage, or major_outage.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/components.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **components** (array) - A list of component objects.
  - **name** (string) - The name of the component.
  - **status** (string) - The current status of the component (operational, degraded_performance, partial_outage, or major_outage).
  - **created_at** (string) - The timestamp when the component was created.
  - **updated_at** (string) - The timestamp when the component was last updated.
  - **group_id** (string) - The ID of the group the component belongs to.
  - **description** (string) - A description of the component.
  - **showcase** (boolean) - Whether to showcase the component.
  - **start_date** (string) - The start date of the component's operation.
  - **id** (string) - The unique identifier for the component.
  - **group** (boolean) - Whether this component is a group.
  - **only_active_components** (boolean) - Whether to only show active components.

#### Response Example
```json
{
  "components": [
    {
      "id": "j4f123456789",
      "group_id": null,
      "name": "API",
      "description": "The main Payfast API.",
      "url": null,
      "locale": "en",
      "updated_at": "2022-01-20T16:05:42.931+02:00",
      "created_at": "2022-01-20T16:05:42.931+02:00",
      "position": 1,
      "showcase": true,
      "start_date": null,
      "group": false,
      "only_active_components": false,
      "slug": "api",
      "past_names": []
    }
  ]
}
```
```

--------------------------------

### Create a Refund

Source: https://developers.payfast.co.za/api/index

Creates a new refund for a given payment. Ensure you query the refund endpoint first to get necessary details.

```APIDOC
## POST /refunds/:id

### Description
Create a new refund. Before creating a new refund, make sure to call the query refund endpoint, this will provide you with all the necessary information for creating a refund. This information includes amounts available for refund, if a refund is possible, which payment method can be used for the refund and any additional parameters that are required for that refund payment method.

### Method
POST

### Endpoint
`/refunds/:id`

### Parameters
#### Path Parameters
- **id** (string) - Required - The `pf_payment_id` (Unique transaction ID on Payfast)

#### Header Parameters
- **merchant-id** (integer, 8 char) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

#### Request Body
- **amount** (integer) - Required - The amount to refund in **cents** (ZAR). Both partial and full amounts are supported.
- **reason** (string, 3-255 char) - Required - The reason for the refund.
- **notify_merchant** (boolean, 1 char) - Optional - Whether or not to notify the merchant of the refund. 1 = true, 0 = false. Default is 0.
- **notify_buyer** (boolean, 1 char) - Required - Whether or not to notify the buyer of the refund. 1 = true, 0 = false.
- **acc_holder** | **bank_account_holder** (string, 255 char) - Required - BANK_PAYOUT ONLY - The name of the account holder.
- **bank_name** (string, 255 char) - Required - BANK_PAYOUT ONLY - The name of the bank. The list is available via query refund endpoint.
- **bank_branch_code** (integer, max 6 char) - Required - BANK_PAYOUT ONLY - The bank branch code.
- **bank_account_number** (integer, max 12 char) - Required - BANK_PAYOUT ONLY - The bank account number.
- **acc_type** | **bank_account_type** (string, 5-10 char) - Required - BANK_PAYOUT ONLY - The account type: current, savings.

### Request Example
#### EFT request example
```json
{
    "amount": "1000",
    "notify_buyer": true,
    "notify_merchant": false,
    "reason": "Product out of stock",
    "bank_account_holder": "Mr Smith",
    "bank_name": "FNB",
    "bank_branch_code": "111111",
    "bank_account_number": "100000000000",
    "bank_account_type": "current"
}
```

#### CREDIT CARD request example
```json
{
    "amount": "1000",
    "notify_buyer": true,
    "notify_merchant": false,
    "reason": "Product out of stock"
}
```

### Response
#### Success Response (200)
- **code** (integer) - The response code.
- **status** (string) - The status of the response.
- **data** (object) - Contains the response data.
  - **response** (boolean) - Indicates if the operation was successful.
  - **message** (string) - A message describing the outcome.

#### Response Example
```json
{
    "code": 200,
    "status": "success",
    "data": {
        "response": true,
        "message": "Success"
    }
}
```
```

--------------------------------

### Get Components Status (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves a list of all components for the Payfast system. Each component is returned with its current operational status, which can be one of operational, degraded_performance, partial_outage, or major_outage.

```bash
curl "https://status.payfast.io/api/v2/components.json"
```

--------------------------------

### Get System Status (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves the overall system status for Payfast. This endpoint returns an indicator (none, minor, major, or critical) and a human-readable description of the system's operational status. The response includes page details and the blended component status.

```bash
curl "https://status.payfast.io/api/v2/status.json"
```

--------------------------------

### Get All Scheduled Maintenance (JavaScript Widget)

Source: https://developers.payfast.co.za/api/index

This JavaScript code snippet demonstrates how to fetch scheduled maintenance information using a widget, likely for embedding on a webpage. It makes a GET request to the Payfast API endpoint. The response is expected to be JSON.

```javascript
fetch('https://status.payfast.io/api/v2/scheduled-maintenances.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

--------------------------------

### GET /refunds/:id

Source: https://developers.payfast.co.za/api/index

Retrieves details about a specific refund using its unique identifier.

```APIDOC
## GET /refunds/:id

### Description
Retrieves details about a specific refund using its unique identifier.

### Method
GET

### Endpoint
/refunds/:id

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the refund.

### Request Example
```
https://api.payfast.co.za/refunds/dc0521d3-55fe-269b-fa00-b647310d760f
```

### Response
#### Success Response (200)
- **code** (integer) - The HTTP status code of the response.
- **status** (string) - The status of the request (e.g., "success").
- **data** (object) - Contains the refund details.
  - **response** (object) - The main response object.
    - **available_balance** (integer) - The available balance.
    - **transactions** (array) - A list of transactions.
      - **amount** (string) - The transaction amount.
      - **date** (string) - The date and time of the transaction.
      - **type** (string) - The type of transaction (e.g., "Funds Received", "Funds Received (Refund)").
  - **message** (string) - A message indicating the result of the request.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": {
      "available_balance": 6800,
      "transactions": [
        {
          "amount": 9800,
          "date": "2020-05-14 12:11:05",
          "type": "Funds Received"
        },
        {
          "amount": "-1000",
          "date": "2020-05-14 14:59:59",
          "type": "Funds Received (Refund)"
        },
        {
          "amount": "-2000",
          "date": "2020-05-15 09:59:59",
          "type": "Funds Received (Refund)"
        }
      ]
    },
    "message": "success"
  }
}
```
```

--------------------------------

### Get All Incidents (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves a list of the 50 most recent incidents, including those that are unresolved, resolved, or in postmortem. This provides a comprehensive history of events.

```shell
GET https://status.payfast.io/api/v2/incidents.json
```

--------------------------------

### Successful Adhoc Transaction Response

Source: https://developers.payfast.co.za/api/index

Example JSON response indicating a successful adhoc transaction charge.

```JSON
{
"code":200,
"status":"success",
"data":{
"response":true,
"message":"Transaction was successful(00)",
"pf_payment_id":"1324567"
}
}
```

--------------------------------

### Payfast API JSON Response Structure

Source: https://developers.payfast.co.za/api/index

An example of the standard JSON response structure returned by the Payfast API. It includes a code, status, and data field.

```json
{
"code":200,
"status":"success",
"data":{
}
}
```

--------------------------------

### GET /api/v2/status.json

Source: https://developers.payfast.co.za/api/index

Retrieves the overall status rollup for the Payfast page, including an indicator (none, minor, major, or critical) and a human-readable description of the system's status.

```APIDOC
## GET /api/v2/status.json

### Description
Get the status rollup for the whole page. This endpoint includes an indicator - one of none, minor, major, or critical, as well as a human description of the blended component status. Examples of the blended status include "All Systems Operational", "Partial System Outage", and "Major Service Outage".

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/status.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
  - **id** (string) - The unique identifier for the page.
  - **name** (string) - The name of the status page.
  - **url** (string) - The URL of the status page.
  - **time_zone** (string) - The time zone of the status page.
  - **updated_at** (string) - The timestamp when the page was last updated.
- **status** (object) - The overall status of the system.
  - **indicator** (string) - The status indicator (none, minor, major, or critical).
  - **description** (string) - A human-readable description of the system status.

#### Response Example
```json
{
  "page":{
    "id":"hbt40cyvzkpg",
    "name":"Payfast",
    "url":"https://status.payfast.io",
    "time_zone":"Africa/Johannesburg",
    "updated_at":"2022-01-20T16:05:42.931+02:00"
  },
  "status":{
    "indicator":"none",
    "description":"All Systems Operational"
  }
}
```
```

--------------------------------

### GET /api/v2/incidents.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of the 50 most recent incidents, including unresolved, resolved, and postmortem incidents.

```APIDOC
## GET /api/v2/incidents.json

### Description
Retrieves a list of the 50 most recent incidents. This includes all unresolved incidents as described above, as well as those in the Resolved and Postmortem state.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/incidents.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
- **incidents** (array) - A list of recent incident objects.

#### Response Example
```json
{
  "page": {
    "id": "hbt40cyvzkpg",
    "name": "Payfast",
    "url": "https://status.payfast.io",
    "time_zone": "Africa/Johannesburg",
    "updated_at": "2022-01-20T16:05:42.931+02:00"
  },
  "incidents": [
    {
      "id": "l0wfwnhd33vx",
      "name": "3DSecure outage is causing some credit card transactions to fail",
      "status": "resolved",
      "created_at": "2022-01-20T14:27:26.256+02:00",
      "updated_at": "2022-01-20T16:05:42.928+02:00",
      "monitoring_at": null,
      "resolved_at": "2022-01-20T16:05:42.914+02:00",
      "impact": "major",
      "shortlink": "https://stspg.io/fk57rhptdwgr",
      "started_at": "2022-01-20T14:27:26.249+02:00",
      "page_id": "hbt40cyvzkpg",
      "incident_updates": [
        {
          "id": "hxfsx5gyz48n",
          "status": "resolved",
          "body": "This incident has been resolved.",
          "incident_id": "l0wfwnhd33vx",
          "created_at": "2022-01-20T16:05:42.914+02:00",
          "updated_at": "2022-01-20T16:05:42.914+02:00",
          "display_at": "2022-01-20T16:05:42.914+02:00",
          "affected_components": [
            {
              "code": "phplv458l8tp",
              "name": "Credit & Cheque Cards - Payments :: Credit & Cheque Cards",
              "old_status": "partial_outage",
              "new_status": "operational"
            }
          ],
          "deliver_notifications": true,
          "custom_tweet": null,
          "tweet_id": null
        },
        {
          "id": "ffqdtmmpp4sv",
          "status": "identified",
          "body": "Some credit card transactions are being declined due to failing 3Dsecure upstream. All other payment methods remain available and processing successfully.",
          "incident_id": "l0wfwnhd33vx",
          "created_at": "2022-01-20T14:27:26.370+02:00",
          "updated_at": "2022-01-20T14:27:26.370+02:00",
          "display_at": "2022-01-20T14:27:26.370+02:00",
          "affected_components": [
            {
              "code": "phplv458l8tp",
              "name": "Credit & Cheque Cards - Payments :: Credit & Cheque Cards",
              "old_status": "operational",
              "new_status": "partial_outage"
            }
          ],
          "deliver_notifications": true,
          "custom_tweet": null,
          "tweet_id": null
        }
      ],
      "components": [
        {
          "id": "phplv458l8tp",
          "name": "Payments :: Credit & Cheque Cards",
          "status": "operational",
          "created_at": "2018-01-31T22:32:21.831+02:00",
          "updated_at": "2022-01-20T16:05:42.880+02:00",
          "position": 1,
          "description": "Our Credit & Cheque Card payment service",
          "showcase": false,
          "start_date": null,
          "group_id": "by3ldtj5f0m0",
          "page_id": "hbt40cyvzkpg",
          "group": false,
          "only_show_if_degraded": false
        }
      ]
    }
  ],
  "...": "↓"
}
```
```

--------------------------------

### GET /api/v2/scheduled-maintenances.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of the 50 most recent scheduled maintenances, including those in progress and completed states.

```APIDOC
## GET /api/v2/scheduled-maintenances.json

### Description
Get a list of the 50 most recent scheduled maintenances. This includes scheduled maintenances as described in the above two endpoints, as well as those in the Completed state.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/scheduled-maintenances.json

### Parameters
#### Query Parameters
* **since** (string) - Optional - Returns scheduled maintenances on or after this date.
* **until** (string) - Optional - Returns scheduled maintenances on or before this date.
* **page** (integer) - Optional - The page number of results to retrieve.
* **component** (string) - Optional - Filters results to a specific component ID.

### Request Example
```
GET https://status.payfast.io/api/v2/scheduled-maintenances.json?since=2022-01-01T00:00:00Z
```

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
  - **id** (string) - The unique identifier for the page.
  - **name** (string) - The name of the status page.
  - **url** (string) - The URL of the status page.
  - **time_zone** (string) - The time zone of the status page.
  - **updated_at** (string) - The last updated timestamp for the page.
- **scheduled_maintenances** (array) - A list of scheduled maintenance objects.
  - **id** (string) - The unique identifier for the maintenance.
  - **name** (string) - The name of the maintenance.
  - **status** (string) - The current status of the maintenance (e.g., 'completed', 'in_progress', 'scheduled').
  - **created_at** (string) - The timestamp when the maintenance was created.
  - **updated_at** (string) - The timestamp when the maintenance was last updated.
  - **monitoring_at** (string|null) - The timestamp when monitoring started.
  - **resolved_at** (string|null) - The timestamp when the maintenance was resolved.
  - **impact** (string) - The impact level of the maintenance (e.g., 'maintenance').
  - **shortlink** (string) - A short link to the maintenance details.
  - **started_at** (string) - The timestamp when the maintenance started.
  - **page_id** (string) - The ID of the page this maintenance belongs to.
  - **incident_updates** (array) - A list of updates for this maintenance.
    - **id** (string) - The unique identifier for the update.
    - **status** (string) - The status of the update.
    - **body** (string) - The content of the update.
    - **incident_id** (string) - The ID of the maintenance this update is associated with.
    - **created_at** (string) - The timestamp when the update was created.
    - **updated_at** (string) - The timestamp when the update was last updated.
    - **display_at** (string) - The timestamp when the update should be displayed.
    - **affected_components** (array|null) - A list of components affected by this update.
      - **code** (string) - The code of the affected component.
      - **name** (string) - The name of the affected component.
      - **old_status** (string) - The status of the component before the update.
      - **new_status** (string) - The status of the component after the update.
    - **deliver_notifications** (boolean) - Whether notifications were delivered for this update.
    - **custom_tweet** (string|null) - A custom tweet for this update.
    - **tweet_id** (string|null) - The ID of the tweet for this update.
  - **components** (array) - A list of components associated with this maintenance.
    - **id** (string) - The unique identifier for the component.
    - **name** (string) - The name of the component.
    - **status** (string) - The current status of the component.
    - **created_at** (string) - The timestamp when the component was created.
    - **updated_at** (string) - The timestamp when the component was last updated.
    - **position** (integer) - The display order of the component.
    - **description** (string) - A description of the component.
    - **showcase** (boolean) - Whether to showcase the component.
    - **start_date** (string|null) - The start date for the component.
    - **group_id** (string|null) - The ID of the group this component belongs to.
    - **page_id** (string) - The ID of the page this component belongs to.
    - **group** (boolean) - Whether this component is a group.
    - **only_show_if_degraded** (boolean) - Whether to only show if degraded.
  - **scheduled_for** (string) - The timestamp when the maintenance is scheduled to start.
  - **scheduled_until** (string) - The timestamp when the maintenance is scheduled to end.

#### Response Example
```json
{
  "page": {
    "id": "hbt40cyvzkpg",
    "name": "Payfast",
    "url": "https://status.payfast.io",
    "time_zone": "Africa/Johannesburg",
    "updated_at": "2022-01-20T16:05:42.931+02:00"
  },
  "scheduled_maintenances": [
    {
      "id": "r4y8bmszthj3",
      "name": "Masterpass maintenance",
      "status": "completed",
      "created_at": "2021-10-14T19:43:23.549+02:00",
      "updated_at": "2021-10-22T05:00:30.315+02:00",
      "monitoring_at": null,
      "resolved_at": "2021-10-22T05:00:30.300+02:00",
      "impact": "maintenance",
      "shortlink": "https://stspg.io/s7vcx0wjggkd",
      "started_at": "2021-10-14T19:43:23.545+02:00",
      "page_id": "hbt40cyvzkpg",
      "incident_updates": [
        {
          "id": "r9r4kvqwjzsy",
          "status": "completed",
          "body": "The scheduled maintenance has been completed.",
          "incident_id": "r4y8bmszthj3",
          "created_at": "2021-10-22T05:00:30.300+02:00",
          "updated_at": "2021-10-22T05:00:30.300+02:00",
          "display_at": "2021-10-22T05:00:30.300+02:00",
          "affected_components": [
            {
              "code": "cwrr763rwt79",
              "name": "Payments :: Masterpass",
              "old_status": "under_maintenance",
              "new_status": "operational"
            }
          ],
          "deliver_notifications": true,
          "custom_tweet": null,
          "tweet_id": null
        }
      ],
      "components": [
        {
          "id": "cwrr763rwt79",
          "name": "Payments :: Masterpass",
          "status": "operational",
          "created_at": "2018-01-31T22:37:15.779+02:00",
          "updated_at": "2021-12-21T15:54:21.975+02:00",
          "position": 5,
          "description": "Our Masterpass payment service",
          "showcase": false,
          "start_date": null,
          "group_id": null,
          "page_id": "hbt40cyvzkpg",
          "group": false,
          "only_show_if_degraded": false
        }
      ],
      "scheduled_for": "2021-10-21T22:00:00.000+02:00",
      "scheduled_until": "2021-10-22T05:00:00.000+02:00"
    }
  ]
}
```
```

--------------------------------

### Payfast Ping API Endpoint

Source: https://developers.payfast.co.za/api/index

The GET endpoint for the Ping API, used to verify if the Payfast API is responding. Requires specific header parameters.

```http
GET https://api.payfast.co.za/ping
```

--------------------------------

### Unsuccessful Adhoc Transaction Response

Source: https://developers.payfast.co.za/api/index

Example JSON response indicating an unsuccessful adhoc transaction charge due to an invalid subscription state.

```JSON
{
"code":400,
"status":"failed",
"data":{
"response":4,
"message":"The subscription is not in a valid state."
}
}
```

--------------------------------

### GET /api/v2/incidents/unresolved.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of unresolved incidents. This includes incidents in the Investigating, Identified, or Monitoring states.

```APIDOC
## GET /api/v2/incidents/unresolved.json

### Description
Retrieves a list of any unresolved incidents. This endpoint will only return incidents in the Investigating, Identified, or Monitoring state.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/incidents/unresolved.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
- **incidents** (array) - A list of unresolved incident objects.

#### Response Example
```json
{
  "page": {
    "id": "hbt40cyvzkpg",
    "name": "Payfast",
    "url": "https://status.payfast.io",
    "time_zone": "Africa/Johannesburg",
    "updated_at": "2022-01-20T16:05:42.931+02:00"
  },
  "incidents": []
}
```
```

--------------------------------

### GET /api/v2/scheduled-maintenances/upcoming.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of upcoming scheduled maintenances. This endpoint only returns maintenances in the 'Scheduled' state.

```APIDOC
## GET /api/v2/scheduled-maintenances/upcoming.json

### Description
Retrieves a list of any upcoming maintenances. This endpoint will only return scheduled maintenances still in the Scheduled state.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/scheduled-maintenances/upcoming.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
- **scheduled_maintenances** (array) - A list of upcoming scheduled maintenance objects.

#### Response Example
```json
{
  "page": {
    "id": "hbt40cyvzkpg",
    "name": "Payfast",
    "url": "https://status.payfast.io",
    "time_zone": "Africa/Johannesburg",
    "updated_at": "2022-01-20T16:05:42.931+02:00"
  },
  "scheduled_maintenances": []
}
```
```

--------------------------------

### Get Unresolved Incidents (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves a list of all incidents that are currently in the 'Investigating', 'Identified', or 'Monitoring' state. This endpoint is useful for checking ongoing issues.

```shell
GET https://status.payfast.io/api/v2/incidents/unresolved.json
```

--------------------------------

### Charge Tokenization Payment

Source: https://developers.payfast.co.za/api/index

Charges a customer's credit card immediately using a provided token. Returns a failed response if the card is out of funds. Requires token, merchant ID, version, timestamp, signature, amount, and item name. Optional parameters include item description, ITN, merchant payment ID, CVV, and setup.

```cURL
curl -v -X POST -H "merchant-id: 10000100" -H "version: v1" -H "timestamp=2016-04-01T12:00:01" -H "signature=840654b40a8b312e54650e1613696b44" https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/adhoc
```

--------------------------------

### Get Active Scheduled Maintenance (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves a list of all scheduled maintenances that are currently in the 'In Progress' or 'Verifying' state. This is useful for monitoring ongoing maintenance activities.

```shell
GET https://status.payfast.io/api/v2/scheduled-maintenances/active.json
```

--------------------------------

### GET /api/v2/scheduled-maintenances/active.json

Source: https://developers.payfast.co.za/api/index

Retrieves a list of active scheduled maintenances. This endpoint only returns maintenances in the 'In Progress' or 'Verifying' states.

```APIDOC
## GET /api/v2/scheduled-maintenances/active.json

### Description
Retrieves a list of any active maintenances. This endpoint will only return scheduled maintenances in the In Progress or Verifying state.

### Method
GET

### Endpoint
https://status.payfast.io/api/v2/scheduled-maintenances/active.json

### Parameters
#### Query Parameters
None

#### Request Body
None

### Response
#### Success Response (200)
- **page** (object) - Information about the status page.
- **scheduled_maintenances** (array) - A list of active scheduled maintenance objects.

#### Response Example
```json
{
  "page": {
    "id": "hbt40cyvzkpg",
    "name": "Payfast",
    "url": "https://status.payfast.io",
    "time_zone": "Africa/Johannesburg",
    "updated_at": "2022-01-20T16:05:42.931+02:00"
  },
  "scheduled_maintenances": []
}
```
```

--------------------------------

### Get Upcoming Scheduled Maintenance (cURL)

Source: https://developers.payfast.co.za/api/index

Retrieves a list of all scheduled maintenances that are in the 'Scheduled' state. This endpoint helps in planning for upcoming disruptions.

```shell
GET https://status.payfast.io/api/v2/scheduled-maintenances/upcoming.json
```

--------------------------------

### Get All Scheduled Maintenance (cURL)

Source: https://developers.payfast.co.za/api/index

This cURL command retrieves a list of the 50 most recent scheduled maintenance events from the Payfast API. It fetches data including completed maintenances. No specific authentication is mentioned, implying public access.

```bash
curl "https://status.payfast.io/api/v2/scheduled-maintenances.json"
```

--------------------------------

### Get Transaction History

Source: https://developers.payfast.co.za/api/index

Retrieves transaction history from the PayFast account for a specified period. The response is in CSV format. Requires merchant ID, version, and timestamp. Optional query parameters include 'from' date, 'to' date, limit, and offset.

```HTTP
GET /transactions/history?from=:date&to=:date
```

```HTTP
GET /transactions/history/daily?date=:date
```

```HTTP
GET /transactions/history/weekly?date=:date
```

```HTTP
GET /transactions/history/monthly?date=:date
```

--------------------------------

### Signature Generation

Source: https://developers.payfast.co.za/api/index

This section details the process of generating an MD5 signature required for API requests to ensure data integrity. It outlines the steps for sorting parameters, URL encoding, and hashing.

```APIDOC
## Signature Generation

A generated MD5 signature must be passed in the header of the request and this hash is used to ensure the integrity of the data transfer.

**Signature generation steps**
1. Sort all the submitted variables (header, body, query string parameters and passphrase) in **alphabetical** order.
NOTE: When in test mode the **testing** parameter should be excluded from the signature.
2. Create a string by concatenating all the non-empty, sorted variables, with ‘&’ used as a separator.
Each value should also be urlencoded (eg. “merchant-id=10000100&passphrase=​passphrase&..&version=v1”)
3. Make sure there is no trailing '&'
4. MD5 hash your string.

__
**Variable order:** The pairs must be listed in **alphabetical order** eg. email_address=john@doe.com&​name_first=John&name_last=Doe
 _* Do not use the**custom payment signature** format, which requires pairs to be listed in the order in which they appear in the documentation!_

##### Signature generation
Select library
```php
<?php
/**
 * Generate signature for API
 * @param array $pfData (all of the header, body and query string param values to be sent to the API)
 * @param null $passPhrase
 * @return string
 */
function generateApiSignature($pfData, $passPhrase = null) {

    if ($passPhrase !== null) {
        $pfData['passphrase'] = $passPhrase;
    }

    // Sort the array by key, alphabetically
    ksort($pfData);

    //create parameter string
    $pfParamString = http_build_query($pfData);
    return md5($pfParamString);
}
```
```

--------------------------------

### Payfast Ping API Live Response

Source: https://developers.payfast.co.za/api/index

The expected response from the Payfast Ping API when called against the live environment.

```text
"Payfast API"
```

--------------------------------

### Payfast Ping API Sandbox Response

Source: https://developers.payfast.co.za/api/index

The expected response from the Payfast Ping API when called against the sandbox environment.

```text
"API V1"
```

--------------------------------

### Payfast Status API - Summary

Source: https://developers.payfast.co.za/api/index

Retrieves a summary of the status page, including overall status, component statuses, and incident information.

```APIDOC
## GET /api/v2/summary.json

### Description
Get a summary of the status page, including a status indicator, component statuses, unresolved incidents, and any upcoming or in-progress scheduled maintenances.

### Method
GET

### Endpoint
/api/v2/summary.json

### Parameters
#### Query Parameters
None

### Request Example
```
GET https://status.payfast.io/api/v2/summary.json
```

### Response
#### Success Response (200)
* The response structure for this endpoint is not detailed in the provided text. Refer to external documentation for specifics.

#### Response Example
* No example provided in the input text.
```

--------------------------------

### Request Body Formats

Source: https://developers.payfast.co.za/api/index

Payfast API supports sending data via `application/x-www-form-urlencoded` or `application/json`.

```APIDOC
### Request Body

Variables may be sent via both the headers and body of each request.

#### `application/x-www-form-urlencoded`
Essentially one big query string where all name/value pairs are separated by the '&' symbol, with an equal ('=') symbol between name and value. This is similar to submitting a traditional HTML FORM via POST.

Example:
`frequency=3&cycles=12`

#### `application/json`
Fields should be passed in as a single-level JSON representation.

##### JSON Request Example
```json
{
  "frequency": 3,
  "cycles": 12
}
```
```

--------------------------------

### Payfast Status API - Javascript Widget

Source: https://developers.payfast.co.za/api/index

Instructions for embedding the Payfast status page widget using a provided CDN script.

```APIDOC
## Javascript Widget

### Description
A wrapper for the page status API, exposing convenient actions useful for embedding your status anywhere.

### Usage
Add the CDN script below to your HTML to use the JS widget.

### Code Snippet
```html
<script type="text/javascript" src="https://cdn.statuspage.io/se-v2.js"></script>
```
```

--------------------------------

### PayFast Refund Creation Response

Source: https://developers.payfast.co.za/api/index

The typical response structure upon successfully creating a refund. It indicates the status of the operation with a code and a message.

```json
{
"code":200,
"status":"success",
"data":{
"response":true,
"message":"Success"
}
}
```

--------------------------------

### Request Timestamp Format

Source: https://developers.payfast.co.za/api/index

All API requests must include an ISO-8601 formatted timestamp in the request body.

```APIDOC
### Request Timestamp

Each request to the API must contain an ISO-8601 formatted timestamp. This field must be present in each request body along with the signature. Failure to include this field will result in an error.

The timestamp field must be formatted according to ISO-8601 standards, and be in the following format:
**YYYY-MM-DDTHH:MM[(+-)HH:MM]** (e.g. 2020-04-01T12:00:01+02:00)

The time zone offset group ((+-)HH:MM) is optional. If not included, the default will be assumed to be GMT +2.

##### Request timestamp Example
```
timestamp: 2020-02-01T12:00:01+02:00
```
```

--------------------------------

### Charge a tokenization payment

Source: https://developers.payfast.co.za/api/index

Charge a tokenization payment based on the token provided. Payfast will attempt to charge the card immediately. If the credit card is out of funds, a failed response will be returned.

```APIDOC
## POST /subscriptions/:token/adhoc

### Description
Charge a tokenization payment based on the token provided. When receiving the API call to charge a customer's credit card via a token, Payfast will attempt to charge the card immediately. If the credit card is out of funds a failed response will be returned.

### Method
POST

### Endpoint
`/subscriptions/:token/adhoc`

### Parameters
#### Path Parameters
- **token** (string) - Required - The Unique ID on Payfast that represents the subscription.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

#### Request Body
- **amount** (integer) - Required - The amount which the buyer must pay, in **cents** (ZAR), no decimals.
- **item_name** (string, 100 char) - Required - The name of the item being charged for.
- **item_description** (string, 255 char) - Optional - The description of the item being charged for.
- **itn** (boolean) - Optional - Specify whether an ITN must be sent for the tokenization payment (true by default).
- **m_payment_id** (string, 100 char) - Optional - Unique payment ID on the merchant’s system.
- **cc_cvv** (numeric) - Optional - The credit card cvv number.
- **setup** (string, JSON encoded) - Optional - Allows the setup of additional attributes like Split Payments.

### Request Example
```json
{
  "amount": 1628,
  "item_name": "Test Item",
  "item_description": "Optional description",
  "itn": true,
  "m_payment_id": "unique_merchant_payment_id",
  "cc_cvv": 123,
  "setup": "{\"split_payments\": {\"merchant_id\": \"10000100\", \"percentage\": \"50\"}}"
}
```

### Response
#### Success Response (200)
- **response** (boolean) - Indicates if the transaction was successful.
- **message** (string) - A message describing the transaction status.
- **pf_payment_id** (string) - The PayFast payment ID.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": true,
    "message": "Transaction was successful(00)",
    "pf_payment_id": "1324567"
  }
}
```

#### Error Response (400)
- **response** (integer) - An error code.
- **message** (string) - A message describing the error.

#### Error Response Example
```json
{
  "code": 400,
  "status": "failed",
  "data": {
    "response": 4,
    "message": "The subscription is not in a valid state."
  }
}
```
```

--------------------------------

### Retrieve a Refund

Source: https://developers.payfast.co.za/api/index

Obtains the available balance and transactions related to a refund for a given payment.

```APIDOC
## GET /refunds/:id

### Description
Obtain the available balance and transactions related to a refund.

### Method
GET

### Endpoint
`/refunds/:id`

### Parameters
#### Path Parameters
- **id** (string) - Required - The `pf_payment_id` (Unique transaction ID on Payfast)

#### Header Parameters
- **merchant-id** (integer, 8 char) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Response
#### Success Response (200)
- **token** (string) - The payment token.
- **funding_type** (string) - The payment method used in the original transaction.
- **amount_original** (integer) - The original purchase amount.
- **amount_available_for_refund** (integer) - The remaining amount if partial refunds have already been performed on the instruction.
- **status** (string) - The refund status, one of: REFUNDABLE, COMPLETED, NOT_AVAILABLE.
- **errors** (array of strings) - Optional - If status is **NOT_AVAILABLE** the errors array will contain a message to display to the end user.
- **refund_full** (object) - An object containing the parameters required for creating the full refund. Method: one of: PAYMENT_SOURCE, BANK_PAYOUT, NOT_AVAILABLE.
- **refund_partial** (object) - An object containing the parameters required for creating the partial refund. Method: one of: PAYMENT_SOURCE, BANK_PAYOUT, NOT_AVAILABLE.
- **bank_names** (array of objects) - Required - When a bank refund is possible a list of available banks will be provided, this will allow you populate the **bank_name** accurately when processing a refund via a bank payout.
  - **bank_name** (string) - The name of the bank.
  - **label** (string) - A display label for the bank.

#### Response Example
```json
{
    "token": "a3b3ae55-ab8b-b388-df23-4e6882b86ce0",
    "funding_type": "Debit Card",
    "amount_original": 1000,
    "amount_available_for_refund": 500,
    "status": "REFUNDABLE",
    "errors": [],
    "refund_full": {
        "method": "NOT_AVAILABLE"
    },
    "refund_partial": {
        "method": "BANK_PAYOUT",
        "bank_account_holder": "",
        "bank_name": "",
        "bank_branch_code": "",
        "bank_account_number": "",
        "bank_account_type": ""
    },
    "bank_names": [
        {
            "bank_name": "ABSA",
            "label": "Absa"
        },
        {
            "bank_name": "STANDARD",
            "label": "Standard Bank"
        },
        {
            "bank_name": "FNB",
            "label": "FNB"
        },
        {
            "etc": "..."
        }
    ]
}
```
```

--------------------------------

### Payfast API Base URL

Source: https://developers.payfast.co.za/api/index

The base URL for all API communications with Payfast. This is the root endpoint for all API requests.

```text
https://api.payfast.co.za
```

--------------------------------

### Generate MD5 API Signature (PHP)

Source: https://developers.payfast.co.za/api/index

Generates an MD5 signature for API requests by sorting and encoding parameters. This ensures data integrity during transfer. It takes an array of parameters and an optional passphrase, returning the MD5 hash string.

```php
<?php
/**
 * Generate signature for API
 * @param array $pfData (all of the header, body and query string param values to be sent to the API)
 * @param null $passPhrase
 * @return string
 */
function generateApiSignature($pfData, $passPhrase = null) {

    if ($passPhrase !== null) {
        $pfData['passphrase'] = $passPhrase;
    }

    // Sort the array by key, alphabetically
    ksort($pfData);

    //create parameter string
    $pfParamString = http_build_query($pfData);
    return md5($pfParamString);
}

```

--------------------------------

### Error Handling

Source: https://developers.payfast.co.za/api/index

Details on how PayFast uses HTTP response codes to indicate API request failures. Includes a list of common error codes and their meanings.

```APIDOC
# Errors 
Payfast uses conventional HTTP response codes to indicate the type of failure of an API request. 
In general: Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). 
Some 4xx errors that could be handled programmatically (e.g., a card is declined) include an error code that briefly explains the error reported.
Codes in the 5xx range indicate a Payfast networking or application error.
### Parameters 
codestringOPTIONAL
The HTTP response code
statusstringOPTIONAL
A more verbose description of the error
datahashOPTIONAL
Will contain a response of false for the action and may also contain one or more description(s) for the reason of the result
##### response 
{
"code":400,
"status":"failed",
"data":{
"response":false,
"message":"Failure"
}
}
##### ERROR CODES 
400 - Required variables not present in request| The request is missing some or all of the required fields.  
---|---  
400 - Value for signature is not in the expected format| Generated when the merchant signature provided is not an MD5 hash, or is malformed.  
400 - API version is not valid| Issued when the version header refers to a version that does not exist, or is malformed.  
400 - Signature not present in headers| The signature has not been provided.  
401 - Merchant not found| The given merchant ID was not found.  
401 - Request origin not recognised| Generated when the request does not contain a REMOTE_ADDR value.  
401 - Request origin could not be verified| Occurs when the request is made from a location not specified in the whitelist.  
401 - Merchant authorisation failed| The signature is incorrect.  
404 - Service / endpoint not found| The endpoint does not exist or the requesting merchant does not have permission to access.  
429 - Signature rate limit reached, please try again in a few minute| The rate limit was hit.  
500 - Application Error| Application Error.  
500 - Communication Failure| Networking issue with the API.  
```

--------------------------------

### Include Payfast Status Page Widget (JavaScript CDN)

Source: https://developers.payfast.co.za/api/index

This code snippet provides the JavaScript CDN link to embed the Payfast status page widget. By including this script, you can easily display status information and components on your own website.

```html
<script type="text/javascript" src="https://cdn.statuspage.io/se-v2.js"></script>
```

--------------------------------

### PayFast Refund Response Schema

Source: https://developers.payfast.co.za/api/index

Defines the structure of the response when querying refund information. It includes details like the payment token, funding type, original and available amounts, refund status, and specific parameters for full and partial refunds, as well as a list of available banks for payouts.

```json
{
"token":"a3b3ae55-ab8b-b388-df23-4e6882b86ce0",
"funding_type":"Debit Card",
"amount_original":1000,
"amount_available_for_refund":500,
"status":"REFUNDABLE",
"errors":[
],
"refund_full":{
"method":"NOT_AVAILABLE"
},
"refund_partial":{
"method":"BANK_PAYOUT",
"bank_account_holder":"",
"bank_name":"",
"bank_branch_code":"",
"bank_account_number":"",
"bank_account_type":""
},
"bank_names":[
{
"bank_name":"ABSA",
"label":"Absa"
},
{
"bank_name":"STANDARD",
"label":"Standard Bank"
},
{
"bank_name":"FNB",
"label":"FNB"
},
{
"etc":"..."
}
]
}
```

--------------------------------

### Refunds API

Source: https://developers.payfast.co.za/api/index

The Refunds API provides Merchants with the ability to process refunds to their buyers.

```APIDOC
## GET /refunds/query/:id

### Description
Get all the information you require in order to create a refund. It is highly recommended that you run this query before performing a refund in order to ensure you have all the necessary information to perform a successful refund.

### Method
GET

### Endpoint
`/refunds/query/:id`

### Parameters
#### Path Parameters
- **id** (string) - Required - The **pf_payment_id** (Unique transaction ID on Payfast).

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as provided by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (string) - Required - The current timestamp in ISO-8601 date and time format (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - An MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Request Example
```
https://api.payfast.co.za/refunds/query/dc0521d3-55fe-269b-fa00-b647310d760f
```

### Response
#### Success Response (200)
- The response structure for this endpoint is not explicitly defined in the provided text, but it is expected to contain information necessary for creating a refund.

#### Response Example
(Example response structure not provided in the source text.)
```

```APIDOC
## POST /refunds/:id

### Description
Process refunds to buyers. This endpoint allows merchants to initiate a refund for a specific transaction.

### Method
POST

### Endpoint
`/refunds/:id`

### Parameters
#### Path Parameters
- **id** (string) - Required - The **pf_payment_id** (Unique transaction ID on Payfast) for which the refund is being processed.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as provided by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (string) - Required - The current timestamp in ISO-8601 date and time format (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - An MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Request Example
(Specific request body details for initiating a refund are not provided in the source text.)

### Response
#### Success Response (200)
- The response structure for this endpoint is not explicitly defined in the provided text, but it is expected to confirm the refund processing status.
```

--------------------------------

### Recurring Billing - Fetch Subscription

Source: https://developers.payfast.co.za/api/index

Allows merchants to retrieve details of a specific subscription using its unique token.

```APIDOC
# Recurring Billing
The Subscription Payments API gives Merchants the ability to interact with subscriptions on their accounts.
**URLs to interact with take the following form:**  
https://api.payfast.co.za/subscriptions/​[token]/[action]  
  
**Sandbox:**  
https://api.payfast.co.za/subscriptions/​[token]/[action]?testing=true
**Related Guide:** Recurring Billing
##### Endpoints
```
GET /subscriptions/:token/fetch
PUT /subscriptions/:token/pause
PUT /subscriptions/:token/unpause
PUT /subscriptions/:token/cancel
PATCH /subscriptions/:token/update
POST /subscriptions/:token/adhoc
 
```

* * *
##  The subscription object 
This is the object representing your subscription.  
You can retrieve it to see the details of your subscription.
### Parameters 
tokenstringREQUIRED
**Path** , the Unique ID on Payfast that represents the subscription.
merchant-idinteger, 8 charREQUIRED
**Header** , the Merchant ID as given by the Payfast system.
versionstringREQUIRED
**Header** , the Payfast API version (i.e. v1).
timestampISO-8601 date and timeREQUIRED
**Header** , the current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
signaturestringREQUIRED
**Header** , MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.
##### GET /subscriptions/:token/fetch 
```
https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/fetch 
```
```

--------------------------------

### Payfast API Request Timestamp Format

Source: https://developers.payfast.co.za/api/index

The required ISO-8601 format for the timestamp field in API requests. This ensures accurate request logging and processing.

```text
timestamp: 2020-02-01T12:00:01+02:00
```

--------------------------------

### Authentication - Merchant Passphrase

Source: https://developers.payfast.co.za/api/index

Authentication is ensured through a signature generated using a merchant passphrase, which is kept secret.

```APIDOC
# Authentication

Data integrity is ensured through a signature together with a passphrase passed in the header of all requests.

### Merchant Passphrase

The passphrase is used to salt the signature. The passphrase is considered a secret between the merchant and Payfast and should never be sent or given out.

The merchant may set their own passphrase by:
1. Logging into their Payfast merchant account.
2. Clicking on "Settings", and then "Edit" under the **Security Pass Phrase** section.
3. Inputting the desired passphrase and clicking "Update".

A passphrase must be set by the merchant before any API interaction is allowed.
```

--------------------------------

### Unpause a subscription

Source: https://developers.payfast.co.za/api/index

Unpauses a previously paused subscription, resuming its normal payment schedule.

```APIDOC
## PUT /subscriptions/:token/unpause

### Description
Unpauses a previously paused subscription, resuming its normal payment schedule.

### Method
PUT

### Endpoint
`/subscriptions/:token/unpause`

### Parameters
#### Path Parameters
- **token** (string) - Required - The Unique ID on Payfast that represents the subscription.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Request Example
```
https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/unpause
```

### Response
#### Success Response (200)
- **response** (boolean) - Indicates if the unpause operation was successful.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": true
  }
}
```
```

--------------------------------

### Update a Subscription (API)

Source: https://developers.payfast.co.za/api/index

Updates one or more parameters of an existing PayFast subscription, such as cycles, frequency, run date, or amount. The request body must include at least one updatable field. Requires token, merchant ID, API version, timestamp, and signature.

```HTTP
PATCH /subscriptions/:token/update
```

--------------------------------

### Ping API

Source: https://developers.payfast.co.za/api/index

This endpoint is used to check if the Payfast API is responding to requests. It requires authentication headers.

```APIDOC
## GET /ping

### Description
Used to check if the API is responding to requests.

### Method
GET

### Endpoint
https://api.payfast.co.za/ping

### Parameters
#### Header Parameters
- **merchant-id** (integer, 8 char) - REQUIRED - The Merchant ID as given by the Payfast system.
- **version** (string) - REQUIRED - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - REQUIRED - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - REQUIRED - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Response
#### Success Response (200)
- **string** - The response will be a string indicating the API status (e.g., "Payfast API" for live, "API V1" for sandbox).

#### Response Example (Live)
"Payfast API"

#### Response Example (Sandbox)
"API V1"
```

--------------------------------

### Unpause a Subscription (API)

Source: https://developers.payfast.co.za/api/index

Resumes a previously paused PayFast subscription. This operation requires the subscription's unique token, merchant ID, API version, timestamp, and a valid signature.

```HTTP
PUT /subscriptions/:token/unpause
```

--------------------------------

### Pause a Subscription (API)

Source: https://developers.payfast.co.za/api/index

Pauses a PayFast subscription for a specified number of cycles. The subscription's end date is extended by the paused frequency periods, and the total number of payments remains the same. Requires token, merchant ID, API version, timestamp, and signature.

```HTTP
PUT /subscriptions/:token/pause
```

```cURL
curl -v -X PUT -H "merchant-id: 10000100" -H "version: v1" -H "timestamp=2016-04-01T12:00:01" -H "signature=840654b40a8b312e54650e1613696b44" https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/pause
```

--------------------------------

### Transaction history for specific dates

Source: https://developers.payfast.co.za/api/index

Obtain the transaction history for a given period. The response is a comma-separated values (CSV) of required transactions.

```APIDOC
## GET /transactions/history

### Description
Obtain the transaction history for a given period. The response is a comma-separated values (CSV) of required transactions.

### Method
GET

### Endpoint
`/transactions/history`

### Parameters
#### Header Parameters
- **merchant-id** (integer, 8 char) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

#### Query Parameters
- **from** (YYYY-MM-DD) - Optional - Start date for the time period. Defaults to current month.
- **to** (YYYY-MM-DD) - Optional - End date for the time period. Defaults to current date.
- **limit** (integer) - Optional - Limit the number of records returned (default is 1000).
- **offset** (integer) - Optional - The number of records to skip.

### Request Example
```
https://api.payfast.co.za/transactions/history?from=2017-01-01&to=2017-02-01
```

### Response
#### Success Response (200)
- The response is a comma-separated values (CSV) string containing transaction details.

#### Response Example
```csv
"Date","Type","Sign","Party","Name","Description","Currency","Funding Type","Gross","Fee","Net","Balance","M Payment ID","PF Payment ID","custom str1","custom int1","custom str2","custom int2","custom str3","custom str4","custom str5","custom int3","custom int4","custom int5"
"2020-02-27 13:29:55",FUNDS_RECEIVED,CREDIT,"Test User 01",test,,ZAR,CC,500.00,-24.73,475.27,"22,574.02",,994209,,,,,,,,,, 
"2020-02-27 13:30:13",FUNDS_RECEIVED,CREDIT,"Test User 01",test,,ZAR,CC,100.00,-6.79,93.21,"22,667.23",,994210,,,,,,,,,, 
"2020-03-02 14:31:30",FUNDS_RECEIVED,CREDIT,"Test User 01","item name",,ZAR,CC,121.00,-7.73,113.27,"22,780.50",pay_now_11611660,995893,,,,,,,,,, 
"2020-04-14 11:15:20",FUNDS_RECEIVED,CREDIT,"Test User 01","item name",,ZAR,CC,50.00,-4.54,45.46,"22,825.96",pay_now_11611660,1019891,,,,,,,,,,

```

--------------------------------

### Query a Credit Card Transaction API

Source: https://developers.payfast.co.za/api/index

Query a credit card transaction using its payment ID or token. This API allows merchants to retrieve details about specific credit card transactions.

```APIDOC
## GET /process/query/:id

### Description
Query a credit card transaction. This API gives Merchants the ability to query credit card transactions.

### Method
GET

### Endpoint
`/process/query/:id`

### Parameters
#### Path Parameters
- **id** (string) - Required - The Payment or Subscription ID. This can be either the `pf_payment_id` (Payfast Payment ID) or a `token` (Unique ID for subscriptions).

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as provided by the Payfast system.
- **version** (string) - Required - The PayFast API version (e.g., `v1`).
- **timestamp** (string) - Required - The current timestamp in ISO-8601 format (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - An MD5 hash of the alphabetized submitted header and body variables, along with the passphrase. Characters must be in lowercase.

### Request Example
```
https://api.payfast.co.za/process/query/01d2e4c7-28c8-3a86-151f-eab5357da649
https://api.payfast.co.za/process/query/69
```

### Response
#### Success Response (200)
- **code** (integer) - The status code of the response.
- **status** (string) - The status of the request (e.g., `success`).
- **data** (object) - Contains the transaction details.
  - **response** (object) - Detailed response of the transaction.
    - **pf_payment_id** (integer) - The Payfast Payment ID.
    - **m_payment_id** (integer) - The Merchant's Payment ID.
    - **status** (string) - The transaction status (e.g., `COMPLETE`).
    - **amount** (integer) - The transaction amount.
    - **cc_status** (string) - The credit card transaction status code (e.g., `00`).
    - **cc_message** (string) - The credit card transaction status message (e.g., `Approved or completed successfully (00)`).
- **message** (string) - A message indicating the success of the request.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": {
      "pf_payment_id": 69,
      "m_payment_id": 232345,
      "status": "COMPLETE",
      "amount": 3600,
      "cc_status": "00",
      "cc_message": "Approved or completed successfully (00)"
    },
    "message": "Success"
  }
}
```
```

--------------------------------

### Update a subscription

Source: https://developers.payfast.co.za/api/index

Allows for multiple subscription values to be updated simultaneously. The request body must contain at least one of the optional payload variables.

```APIDOC
## PATCH /subscriptions/:token/update

### Description
Allows for multiple subscription values to be updated simultaneously. The request body must contain at least one of the optional payload variables.

### Method
PATCH

### Endpoint
`/subscriptions/:token/update`

### Parameters
#### Path Parameters
- **token** (string) - Required - The Unique ID on Payfast that represents the subscription.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

#### Request Body
- **cycles** (integer) - Optional - The number of cycles for the subscription.
- **frequency** (integer) - Optional - The frequency for the subscription:
  1 - Daily
  2 - Weekly
  3 - Monthly
  4 - Quarterly
  5 - Biannual
  6 - Annual
- **run_date** (YYYY-MM-DD) - Optional - The next run date for the subscription.
- **amount** (integer) - Optional - The amount which the buyer must pay, in **cents** (ZAR).

### Request Example
```
https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/update
```

### Response
#### Success Response (200)
- **response** (boolean) - Indicates if the update operation was successful.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": true
  }
}
```
```

--------------------------------

### Pause a subscription

Source: https://developers.payfast.co.za/api/index

Pauses a subscription. The remaining cycles are untouched, but the end date is extended by the number of paused frequency periods. This effectively creates a payment gap without altering the total number of payments.

```APIDOC
## PUT /subscriptions/:token/pause

### Description
Pauses a subscription. The remaining cycles are untouched, but the end date is extended by the number of paused frequency periods. This effectively creates a payment gap without altering the total number of payments.

### Method
PUT

### Endpoint
`/subscriptions/:token/pause`

### Parameters
#### Path Parameters
- **token** (string) - Required - The Unique ID on Payfast that represents the subscription.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

#### Request Body
- **cycles** (integer) - Optional - Number of cycles to pause the subscription for. Default is 1 if not given.

### Request Example
```
https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/pause
```
```curl
curl -v -X PUT -H "merchant-id: 10000100" -H "version: v1" -H "timestamp=2016-04-01T12:00:01" -H "signature=840654b40a8b312e54650e1613696b44" https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/pause
```

### Response
#### Success Response (200)
- **response** (boolean) - Indicates if the pause operation was successful.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": true
  }
}
```
```

--------------------------------

### Transaction History API

Source: https://developers.payfast.co.za/api/index

Obtain the transaction history for a given daily, weekly, or monthly period. The response is a comma-separated values (CSV) of the required transactions.

```APIDOC
## GET /transactions/history/:timeframe

### Description
Obtain the transaction history for a given daily, weekly, or monthly period. The response is a comma-separated values (CSV) of the required transactions.

### Method
GET

### Endpoint
`/transactions/history/:timeframe`

### Parameters
#### Path Parameters
- **timeframe** (string) - Required - The period for which to retrieve transactions (e.g., `daily`, `weekly`, `monthly`).

#### Query Parameters
- **date** (string) - Optional - The start date of the time period. Format depends on the `timeframe`: `YYYY-MM-DD` for `daily` and `weekly`, `YYYY-MM` for `monthly`. Defaults to the current date/week/month.
- **limit** (integer) - Optional - Limits the number of records returned. Defaults to 1000.
- **offset** (integer) - Optional - The number of records to skip.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as provided by the PayFast system.
- **version** (string) - Required - The PayFast API version (e.g., `v1`).
- **timestamp** (string) - Required - The current timestamp in ISO-8601 format (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Optional - An MD5 hash of the alphabetized submitted header and body variables, along with the passphrase. Characters must be in lowercase.

### Request Example
```
https://api.payfast.co.za/transactions/history/daily?date=2020-01-01
https://api.payfast.co.za/transactions/history/weekly?date=2020-01-01
https://api.payfast.co.za/transactions/history/monthly?date=2020-01
```

### Response
#### Success Response (200)
- **response** (string) - A CSV string containing the transaction history. The columns include Date, Type, Sign, Party, Name, Description, Currency, Funding Type, Gross, Fee, Net, Balance, M Payment ID, PF Payment ID, and custom fields.

#### Response Example
```json
{
  "response": "Date,Type,Sign,Party,Name,Description,Currency,\"Funding Type\",Gross,Fee,Net,Balance,\"M Payment ID\",\"PF Payment ID\",\"custom str1\",\"custom int1\",\"custom str2\",\"custom int2\",\"custom str3\",\"custom str4\",\"custom str5\",\"custom int3\",\"custom int4\",\"custom int5\" \"2020-02-27 13:29:55\",FUNDS_RECEIVED,CREDIT,\"Test User 01\",test,,ZAR,CC,500.00,-24.73,475.27,\"22,574.02\",,994209,,,,,,,,,, \"2020-02-27 13:30:13\",FUNDS_RECEIVED,CREDIT,\"Test User 01\",test,,ZAR,CC,100.00,-6.79,93.21,\"22,667.23\",,994210,,,,,,,,,, \"2020-03-02 14:31:30\",FUNDS_RECEIVED,CREDIT,\"Test User 01\",\"item name\",,ZAR,CC,121.00,-7.73,113.27,\"22,780.50\",pay_now_11611660,995893,,,,,,,,,, \"2020-04-14 11:15:20\",FUNDS_RECEIVED,CREDIT,\"Test User 01\",\"item name\",,ZAR,CC,50.00,-4.54,45.46,\"22,825.96\",pay_now_11611660,1019891,,,,,,,,,,"
}
```
```

--------------------------------

### Cancel a subscription

Source: https://developers.payfast.co.za/api/index

Cancels a subscription entirely. The customer will be notified via email upon cancellation.

```APIDOC
## PUT /subscriptions/:token/cancel

### Description
Cancels a subscription entirely. The customer will be notified via email upon cancellation.

### Method
PUT

### Endpoint
`/subscriptions/:token/cancel`

### Parameters
#### Path Parameters
- **token** (string) - Required - The Unique ID on Payfast that represents the subscription.

#### Header Parameters
- **merchant-id** (integer) - Required - The Merchant ID as given by the Payfast system.
- **version** (string) - Required - The Payfast API version (i.e. v1).
- **timestamp** (ISO-8601 date and time) - Required - The current timestamp (YYYY-MM-DDTHH:MM:SS[+HH:MM]).
- **signature** (string) - Required - MD5 hash of the alphabetised submitted header and body variables, as well as the passphrase. Characters must be in lower case.

### Request Example
```
https://api.payfast.co.za/subscriptions/dc0521d3-55fe-269b-fa00-b647310d760f/cancel
```

### Response
#### Success Response (200)
- **response** (boolean) - Indicates if the cancel operation was successful.

#### Response Example
```json
{
  "code": 200,
  "status": "success",
  "data": {
    "response": true
  }
}
```
```

--------------------------------

### Cancel a Subscription (API)

Source: https://developers.payfast.co.za/api/index

Cancels a PayFast subscription entirely. The customer will receive an email notification upon cancellation. This action requires the subscription token, merchant ID, API version, timestamp, and signature.

```HTTP
PUT /subscriptions/:token/cancel
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.