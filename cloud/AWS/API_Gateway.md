# AWS API Gateway: Complete Guide

## What is Amazon API Gateway?

Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. It acts as a "front door" for applications to access data, business logic, or functionality from your backend services. Key features include:

- RESTful and WebSocket API support
- Serverless integration with AWS Lambda
- Direct integration with AWS services
- Request/response data transformations
- Authorization and access control
- API keys and usage plans
- API versioning
- Custom domain names
- Request throttling and quotas
- Caching capability
- SDK generation
- OpenAPI (Swagger) import/export
- Regional, edge-optimized, and private deployments

## API Gateway Core Concepts

### 1. API Types

1. **REST APIs**
   - Traditional request-response model
   - HTTP-based
   - Stateless interactions
   - Resource-oriented architecture
   - Support for OpenAPI specification

2. **HTTP APIs**
   - Simplified, lower-latency alternative to REST APIs
   - Optimized for serverless workloads
   - Reduced feature set but lower cost
   - 60% lower cost than REST APIs
   - Faster performance

3. **WebSocket APIs**
   - Real-time, two-way communication
   - Persistent connections
   - Ideal for chat applications, live dashboards
   - Client and server can send messages at any time
   - Route messages based on content

### 2. API Components

1. **Resources**
   - Logical entities that applications can access
   - Organized hierarchically
   - Identified by URI paths (e.g., /users, /users/{id})
   - Can contain child resources
   - Mapped to backend services

2. **Methods**
   - HTTP verbs associated with resources
   - GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
   - Each method has a method request and method response
   - Configurable authorization
   - Method settings for throttling and caching

3. **Integrations**
   - Connection between API Gateway and backend
   - Types:
     - Lambda function
     - HTTP endpoint
     - AWS service action
     - Mock response
     - VPC link connection
   - Request/response mapping templates

4. **Stages**
   - Named reference to a deployment
   - Represents different environments (dev, test, prod)
   - Each stage has its own URL
   - Stage variables for environment-specific settings
   - Deployment history tracking

5. **Deployments**
   - Snapshot of API configuration
   - Created manually or automatically
   - Used to release to stages
   - Enables rollback to previous configuration
   - Can be promoted between stages

6. **Authorizers**
   - Control access to API methods
   - Types:
     - IAM authorizers
     - Lambda authorizers (custom)
     - Cognito user pool authorizers
   - Authorization caching for performance

### 3. Endpoint Types

1. **Edge-Optimized**
   - Routed through CloudFront edge locations
   - Improved latency for globally distributed clients
   - API Gateway still runs in one region
   - Best for global public APIs

2. **Regional**
   - Deployed to specific region
   - Can use with your own CloudFront distribution
   - Better for clients in same region
   - More control over distribution architecture

3. **Private**
   - Accessible only from your VPC
   - Uses interface VPC endpoint (AWS PrivateLink)
   - Not accessible from public internet
   - Secure APIs for internal services

## Setting Up and Configuring API Gateway

### 1. Create a REST API

1. **Using AWS Management Console**
   - Navigate to API Gateway console
   - Click "Create API"
   - Select "REST API" (not private)
   - Choose "New API"
   - Enter API name and description
   - Select endpoint type (Edge-optimized, Regional, or Private)
   - Click "Create API"

2. **Using AWS CLI**
   ```bash
   aws apigateway create-rest-api \
     --name "MyAPI" \
     --description "My first API" \
     --endpoint-configuration "types=REGIONAL"
   ```

3. **Using AWS SDK (JavaScript Example)**
   ```javascript
   const AWS = require('aws-sdk');
   const apigateway = new AWS.APIGateway({ region: 'us-east-1' });
   
   const params = {
     name: 'MyAPI',
     description: 'My first API',
     endpointConfiguration: {
       types: ['REGIONAL']
     }
   };
   
   apigateway.createRestApi(params, (err, data) => {
     if (err) console.error(err);
     else console.log('API created:', data);
   });
   ```

### 2. Create Resources and Methods

1. **Create Resource**
   - Select API from list
   - Click "Resources"
   - Select parent resource (e.g., root /)
   - Click "Create Resource"
   - Enter resource name and path
   - Click "Create Resource"

2. **Create Method**
   - Select resource
   - Click "Create Method"
   - Select HTTP method (GET, POST, etc.)
   - Configure integration type:
     - Lambda Function
     - HTTP
     - Mock
     - AWS Service
     - VPC Link
   - Configure method settings
   - Click "Save"

3. **Example: Lambda Integration**
   - Select Lambda integration
   - Choose region and function name
   - Enable/disable Lambda proxy integration
   - Configure execution role if needed
   - Click "Save"

4. **Using AWS CLI**
   ```bash
   # Get the API ID
   API_ID=$(aws apigateway get-rest-apis --query "items[?name=='MyAPI'].id" --output text)
   
   # Get the root resource ID
   ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)
   
   # Create a resource
   RESOURCE_ID=$(aws apigateway create-resource \
     --rest-api-id $API_ID \
     --parent-id $ROOT_ID \
     --path-part "users" \
     --query "id" \
     --output text)
   
   # Create a method
   aws apigateway put-method \
     --rest-api-id $API_ID \
     --resource-id $RESOURCE_ID \
     --http-method GET \
     --authorization-type NONE
   
   # Create a Lambda integration
   aws apigateway put-integration \
     --rest-api-id $API_ID \
     --resource-id $RESOURCE_ID \
     --http-method GET \
     --type AWS_PROXY \
     --integration-http-method POST \
     --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:MyFunction/invocations
   ```

### 3. Configure Request/Response Mapping

1. **Configure Method Request**
   - Define URL query string parameters
   - Define request headers
   - Configure request validator
   - Define request models for content validation

2. **Configure Integration Request**
   - Set up request mapping templates
   - Transform client payload to backend format
   - Example mapping template (application/json):
     ```json
     {
       "userId": "$input.params('user_id')",
       "name": $input.json('$.name'),
       "timestamp": "$context.requestTime"
     }
     ```

3. **Configure Integration Response**
   - Map backend status codes to method response status codes
   - Set up response mapping templates
   - Transform backend response to client format
   - Example mapping template (application/json):
     ```json
     {
       "user": $input.json('$.body'),
       "metadata": {
         "requestId": "$context.requestId",
         "timestamp": "$context.responseTime"
       }
     }
     ```

4. **Configure Method Response**
   - Define response status codes
   - Configure response headers
   - Define response models

### 4. Deploy the API

1. **Create Deployment**
   - Click "Deploy API"
   - Select deployment stage (Create new or use existing)
   - Enter stage name (e.g., "dev", "prod")
   - Add stage description
   - Click "Deploy"

2. **Using AWS CLI**
   ```bash
   # Create deployment
   aws apigateway create-deployment \
     --rest-api-id $API_ID \
     --stage-name prod \
     --stage-description "Production stage" \
     --description "Initial deployment"
   ```

3. **Get Invocation URL**
   - After deployment, note the invocation URL
   - Format: `https://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}`
   - Use this URL to invoke your API

### 5. Test the API

1. **Using API Gateway Console**
   - Select method
   - Click "Test" tab
   - Configure test request parameters and body
   - Click "Test"
   - View results

2. **Using curl**
   ```bash
   # GET request
   curl -X GET https://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}/users
   
   # POST request with data
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com"}' \
     https://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}/users
   ```

3. **Using Postman or similar tool**
   - Create new request
   - Set HTTP method and URL
   - Add headers and request body as needed
   - Send request and view response

## HTTP APIs vs REST APIs

### 1. Key Differences

| Feature | HTTP APIs | REST APIs |
|---------|-----------|-----------|
| Latency | Lower | Higher |
| Cost | Lower (~60%) | Higher |
| API keys | Not supported | Supported |
| Custom authorizers | JWT only | Lambda (token, request) |
| Request/response transformations | Not supported | Supported |
| Response caching | Not supported | Supported |
| Usage plans | Not supported | Supported |
| Request validation | Basic | Advanced |
| Private APIs | Supported | Supported |
| Canary deployments | Not supported | Supported |
| Integration types | Lambda, HTTP, private | Lambda, HTTP, AWS services, mock, private |

### 2. When to Choose HTTP APIs

- Lower latency requirements
- Cost-sensitive applications
- Simple Lambda or HTTP backend integration
- JWT authorization
- No need for complex request/response transformations
- Simpler API requirements

### 3. When to Choose REST APIs

- Need for API keys and usage plans
- Complex request/response validation and transformation
- Custom Lambda authorizers beyond JWT
- Integration with AWS services beyond Lambda
- Response caching requirements
- Canary deployment needs

## WebSocket APIs

### 1. Create a WebSocket API

1. **Using AWS Management Console**
   - Navigate to API Gateway console
   - Click "Create API"
   - Select "WebSocket API"
   - Enter API name
   - Configure route selection expression (e.g., `$request.body.action`)
   - Click "Create API"

2. **Using AWS CLI**
   ```bash
   aws apigatewayv2 create-api \
     --name "MyWebSocketAPI" \
     --protocol-type WEBSOCKET \
     --route-selection-expression '$request.body.action'
   ```

### 2. Configure Routes

1. **Create Default Routes**
   - Create $connect route (handles connections)
   - Create $disconnect route (handles disconnections)
   - Create $default route (handles messages that don't match other routes)

2. **Create Custom Routes**
   - Create routes based on route selection expression
   - Example: "sendmessage", "gethistory"

3. **Using AWS CLI**
   ```bash
   # Get the API ID
   API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='MyWebSocketAPI'].ApiId" --output text)
   
   # Create $connect route
   aws apigatewayv2 create-route \
     --api-id $API_ID \
     --route-key '$connect' \
     --target "integrations/$CONNECT_INTEGRATION_ID"
   
   # Create custom route
   aws apigatewayv2 create-route \
     --api-id $API_ID \
     --route-key 'sendmessage' \
     --target "integrations/$SENDMESSAGE_INTEGRATION_ID"
   ```

### 3. Integrate with Lambda

1. **Create Integration**
   - Click "Create Integration"
   - Select Lambda
   - Choose Lambda function
   - Configure integration settings
   - Click "Create"

2. **Lambda Function Example**
   ```javascript
   exports.handler = async (event) => {
     // Connection event
     if (event.requestContext.routeKey === '$connect') {
       // Handle new connection
       console.log('Client connected:', event.requestContext.connectionId);
       return { statusCode: 200 };
     }
     
     // Disconnection event
     if (event.requestContext.routeKey === '$disconnect') {
       // Handle disconnection
       console.log('Client disconnected:', event.requestContext.connectionId);
       return { statusCode: 200 };
     }
     
     // Message event
     if (event.requestContext.routeKey === 'sendmessage') {
       const body = JSON.parse(event.body);
       console.log('Message received:', body);
       
       // Echo message back using management API
       const domain = event.requestContext.domainName;
       const stage = event.requestContext.stage;
       const connectionId = event.requestContext.connectionId;
       const callbackUrl = `https://${domain}/${stage}`;
       
       const apigateway = new AWS.ApiGatewayManagementApi({ endpoint: callbackUrl });
       
       await apigateway.postToConnection({
         ConnectionId: connectionId,
         Data: JSON.stringify({
           message: body.message,
           timestamp: new Date().toISOString()
         })
       }).promise();
       
       return { statusCode: 200 };
     }
     
     // Default route
     return { statusCode: 200 };
   };
   ```

### 4. Deploy WebSocket API

1. **Create Deployment**
   - Click "Deploy API"
   - Select or create stage
   - Click "Deploy"

2. **Using AWS CLI**
   ```bash
   aws apigatewayv2 create-deployment \
     --api-id $API_ID \
     --stage-name prod
   ```

3. **Get WebSocket URL**
   - Format: `wss://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}`
   - Use this URL to connect to your WebSocket API

### 5. Test WebSocket API

1. **Using wscat Tool**
   ```bash
   # Install wscat
   npm install -g wscat
   
   # Connect to API
   wscat -c wss://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}
   
   # Send message
   {"action":"sendmessage","message":"Hello, WebSocket!"}
   ```

2. **Using JavaScript Client**
   ```javascript
   const socket = new WebSocket('wss://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}');
   
   socket.onopen = () => {
     console.log('Connected to WebSocket API');
     socket.send(JSON.stringify({
       action: 'sendmessage',
       message: 'Hello from browser client'
     }));
   };
   
   socket.onmessage = (event) => {
     console.log('Message received:', JSON.parse(event.data));
   };
   
   socket.onclose = () => {
     console.log('Disconnected from WebSocket API');
   };
   ```

## Authorization and Access Control

### 1. IAM Authorization

1. **Configuration**
   - Select "AWS_IAM" for authorization type
   - Client must sign requests with AWS Signature v4
   - Policies attached to IAM identity control access

2. **IAM Policy Example**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "execute-api:Invoke"
         ],
         "Resource": [
           "arn:aws:execute-api:us-east-1:123456789012:abcdef123/prod/GET/users"
         ]
       }
     ]
   }
   ```

3. **Request Signing in Client**
   ```javascript
   // Using AWS SDK
   const AWS = require('aws-sdk');
   const request = new AWS.HttpRequest(
     new AWS.Endpoint('https://{api-id}.execute-api.{region}.amazonaws.com'), 
     'us-east-1'
   );
   
   request.method = 'GET';
   request.path = '/prod/users';
   request.headers['Host'] = request.endpoint.host;
   
   const signer = new AWS.Signers.V4(request, 'execute-api');
   signer.addAuthorization(AWS.config.credentials, new Date());
   
   // Now use request.headers in your HTTP client
   ```

### 2. Lambda Authorizers

1. **Types**
   - **Token-based**: Extracts token from header
   - **Request-based**: Evaluates multiple request parameters

2. **Create Lambda Authorizer**
   - Create Lambda function for authorization
   - Configure authorizer in API Gateway
   - Specify token source or request parameters
   - Set caching TTL

3. **Token Authorizer Lambda Example**
   ```javascript
   exports.handler = async (event) => {
     // Get token from header
     const token = event.authorizationToken;
     
     // Validate token (example)
     if (token === 'valid-token') {
       return generatePolicy('user123', 'Allow', event.methodArn);
     } else {
       return generatePolicy('user123', 'Deny', event.methodArn);
     }
   };
   
   function generatePolicy(principalId, effect, resource) {
     const authResponse = {
       principalId: principalId
     };
     
     if (effect && resource) {
       const policyDocument = {
         Version: '2012-10-17',
         Statement: [
           {
             Effect: effect,
             Resource: resource,
             Action: 'execute-api:Invoke'
           }
         ]
       };
       authResponse.policyDocument = policyDocument;
     }
     
     // Optionally add context for Lambda integration
     authResponse.context = {
       userId: principalId,
       userRole: 'admin'
     };
     
     return authResponse;
   }
   ```

4. **Request Authorizer Lambda Example**
   ```javascript
   exports.handler = async (event) => {
     // Access request parameters
     const queryParams = event.queryStringParameters || {};
     const headers = event.headers || {};
     const pathParams = event.pathParameters || {};
     
     // Example: Validate based on IP address
     const sourceIp = event.requestContext.identity.sourceIp;
     const allowedIps = ['203.0.113.0', '203.0.113.1'];
     
     if (allowedIps.includes(sourceIp)) {
       return generatePolicy('user123', 'Allow', event.methodArn);
     } else {
       return generatePolicy('user123', 'Deny', event.methodArn);
     }
   };
   ```

### 3. Cognito User Pools

1. **Setup**
   - Create Cognito User Pool
   - Configure app client
   - Create authorizer in API Gateway
   - Select Cognito user pool
   - Specify token source

2. **Authentication Flow**
   - User authenticates with Cognito
   - Receives ID or access token
   - Includes token in API requests
   - API Gateway validates token

3. **Example Client Code**
   ```javascript
   // Using AWS Amplify
   import { Auth } from 'aws-amplify';
   import axios from 'axios';
   
   // Configure Amplify
   Auth.configure({
     userPoolId: 'us-east-1_abcdefghi',
     userPoolWebClientId: '1example23456789example',
     region: 'us-east-1'
   });
   
   // Sign in and call API
   async function callApi() {
     try {
       // Sign in
       const user = await Auth.signIn('username', 'password');
       
       // Get token
       const session = await Auth.currentSession();
       const idToken = session.getIdToken().getJwtToken();
       
       // Call API
       const response = await axios.get(
         'https://{api-id}.execute-api.{region}.amazonaws.com/prod/users',
         {
           headers: {
             Authorization: idToken
           }
         }
       );
       
       console.log('API response:', response.data);
     } catch (error) {
       console.error('Error:', error);
     }
   }
   ```

### 4. Resource Policies

1. **Overview**
   - JSON policy document attached to API
   - Controls who can invoke API
   - Works alongside other authorization methods
   - Required for private APIs

2. **Example Resource Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "execute-api:Invoke",
         "Resource": "arn:aws:execute-api:us-east-1:123456789012:abcdef123/*/*/*"
       },
       {
         "Effect": "Deny",
         "Principal": "*",
         "Action": "execute-api:Invoke",
         "Resource": "arn:aws:execute-api:us-east-1:123456789012:abcdef123/*/*/*",
         "Condition": {
           "NotIpAddress": {
             "aws:SourceIp": [
               "203.0.113.0/24",
               "2001:DB8::/32"
             ]
           }
         }
       }
     ]
   }
   ```

3. **Common Use Cases**
   - Restrict access by IP range
   - Allow access only from specific VPC endpoints
   - Cross-account access control
   - Time-based restrictions

## API Management

### 1. API Keys and Usage Plans

1. **Create API Key**
   - In API Gateway console, go to "API Keys"
   - Click "Create API key"
   - Enter name
   - Choose auto-generate or custom value
   - Click "Save"

2. **Create Usage Plan**
   - Go to "Usage Plans"
   - Click "Create"
   - Configure throttling limits (rate and burst)
   - Set quota limits (requests per day/week/month)
   - Associate with stages
   - Click "Next"
   - Associate API keys
   - Click "Create plan"

3. **Enable API Key Requirement**
   - Select method
   - Click "Method Request"
   - Set "API Key Required" to "true"
   - Click "Save"
   - Redeploy API

4. **Client Usage**
   ```bash
   curl -X GET \
     -H "x-api-key: your-api-key-value" \
     https://{api-id}.execute-api.{region}.amazonaws.com/{stage-name}/users
   ```

### 2. Monitoring and Logging

1. **CloudWatch Metrics**
   - Automatically available for all APIs
   - Key metrics:
     - Count: Total number of API calls
     - Latency: Time between request receipt and response
     - IntegrationLatency: Time between API Gateway sending request and receiving response
     - 4XXError: Client-side errors
     - 5XXError: Server-side errors

2. **CloudWatch Logs**
   - Enable execution logging for stage
   - Configure log level (ERROR, INFO)
   - View logs in CloudWatch Logs console
   - Use custom log format with context variables

3. **Access Logging**
   - Enable access logging for stage
   - Define custom log format
   - Example format:
     ```
     {
       "requestId": "$context.requestId",
       "ip": "$context.identity.sourceIp",
       "caller": "$context.identity.caller",
       "user": "$context.identity.user",
       "requestTime": "$context.requestTime",
       "httpMethod": "$context.httpMethod",
       "resourcePath": "$context.resourcePath",
       "status": "$context.status",
       "protocol": "$context.protocol",
       "responseLength": "$context.responseLength"
     }
     ```

4. **X-Ray Integration**
   - Enable X-Ray tracing for API
   - Visualize request flow
   - Identify performance bottlenecks
   - Analyze latency distributions

### 3. Throttling and Quotas

1. **Account-Level Throttling**
   - Default: 10,000 requests per second (RPS)
   - Soft limit (can be increased)
   - Applied to all APIs in account

2. **Stage-Level Throttling**
   - Set in stage settings
   - Override account-level limits
   - Apply consistent rate across all methods

3. **Method-Level Throttling**
   - Configure in method settings
   - Override stage-level limits
   - Target specific high-traffic endpoints

4. **Usage Plan Throttling**
   - Associated with API keys
   - Rate: Requests per second
   - Burst: Concurrent requests
   - Quota: Maximum requests per time period

### 4. Caching

1. **Enable Cache**
   - Configure in stage settings
   - Choose cache size (0.5GB to 237GB)
   - Set TTL (time to live)
   - Configure encryption options

2. **Method Cache Settings**
   - Enable/disable cache for specific methods
   - Override default TTL
   - Configure cache key parameters

3. **Cache Invalidation**
   - Flush entire cache
   - Invalidate individual paths
   - Example:
     ```bash
     aws apigateway flush-stage-cache \
       --rest-api-id abcdef123 \
       --stage-name prod
     ```

4. **Cost Considerations**
   - Cache charged hourly based on size
   - Evaluate cost vs. backend load reduction
   - Consider for frequently accessed, stable data

### 5. Custom Domain Names

1. **Create Certificate**
   - Request certificate in AWS Certificate Manager (ACM)
   - Validate domain ownership
   - Certificate must be in same region as API (or us-east-1 for edge-optimized)

2. **Create Custom Domain**
   - In API Gateway console, go to "Custom Domain Names"
   - Click "Create"
   - Enter domain name
   - Select endpoint type
   - Choose certificate
   - Click "Create"

3. **Configure Base Path Mapping**
   - In domain details, click "Configure API mappings"
   - Click "Add new mapping"
   - Select API and stage
   - Enter base path (e.g., "v1")
   - Click "Save"

4. **Update DNS**
   - Create CNAME record in your DNS provider
   - Point to API Gateway domain name
   - Wait for DNS propagation

5. **Example Domain Usage**
   ```
   https://api.example.com/v1/users
   ```

## API Gateway Integration Patterns

### 1. Lambda Proxy Integration

1. **Configuration**
   - Integration type: Lambda Function
   - Lambda Proxy Integration: Enabled
   - No mapping templates needed

2. **Request Format**
   - Lambda receives complete request details
   - Input format:
     ```json
     {
       "resource": "/users",
       "path": "/users",
       "httpMethod": "GET",
       "headers": { ... },
       "queryStringParameters": { ... },
       "pathParameters": { ... },
       "stageVariables": { ... },
       "requestContext": { ... },
       "body": "...",
       "isBase64Encoded": false
     }
     ```

3. **Response Format**
   - Lambda must return specific format
   - Example:
     ```javascript
     return {
       statusCode: 200,
       headers: {
         "Content-Type": "application/json",
         "Access-Control-Allow-Origin": "*"
       },
       body: JSON.stringify({ message: "Success" }),
       isBase64Encoded: false
     };
     ```

### 2. Lambda Non-Proxy Integration

1. **Configuration**
   - Integration type: Lambda Function
   - Lambda Proxy Integration: Disabled
   - Configure mapping templates

2. **Request Mapping**
   - Transform API Gateway request to Lambda input
   - Example template:
     ```json
     {
       "userId": "$input.params('user_id')",
       "operation": "getUser"
     }
     ```

3. **Response Mapping**
   - Transform Lambda output to API Gateway response
   - Example template:
     ```json
     #set($inputRoot = $input.path('$'))
     {
       "user": {
         "id": "$inputRoot.userId",
         "name": "$inputRoot.name",
         "email": "$inputRoot.email"
       }
     }
     ```

### 3. HTTP Integration

1. **HTTP Proxy**
   - Pass-through to HTTP endpoint
   - No transformation of request/response
   - URL path parameters and query string passed as-is

2. **HTTP Non-Proxy**
   - Customize request to backend
   - Transform response from backend
   - Similar mapping templates as Lambda non-proxy

3. **Example Configuration**
   ```bash
   aws apigateway put-integration \
     --rest-api-id abcdef123 \
     --resource-id abc123 \
     --http-method GET \
     --type HTTP \
     --integration-http-method GET \
     --uri 'http://example.com/resource'
   ```

### 4. AWS Service Integration

1. **Overview**
   - Direct integration with AWS services
   - No need for Lambda intermediary
   - Supports many AWS services (S3, DynamoDB, etc.)

2. **Example: DynamoDB Integration**
   - Integration type: AWS Service
   - AWS Service: DynamoDB
   - HTTP method: POST
   - Action: PutItem
   - Request mapping template:
     ```json
     {
       "TableName": "Users",
       "Item": {
         "id": {
           "S": "$input.path('$.id')"
         },
         "name": {
           "S": "$input.path('$.name')"
         },
         "email": {
           "S": "$input.path('$.email')"
         }
       }
     }
     ```

3. **Example: S3 Integration**
   - Integration type: AWS Service
   - AWS Service: S3
   - HTTP method: GET
   - Action: GetObject
   - Path override: /bucket-name/key-name

### 5. Mock Integration

1. **Use Cases**
   - API prototyping
   - Testing client applications
   - Service independence
   - Error responses

2. **Configuration**
   - Integration type: Mock
   - Request mapping: Define expected request
   - Response mapping: Define mock response

3. **Example Response Template**
   ```json
   {
     "users": [
       {
         "id": "user123",
         "name": "John Doe",
         "email": "john@example.com"
       },
       {
         "id": "user456",
         "name": "Jane Smith",
         "email": "jane@example.com"
       }
     ],
     "count": 2
   }
   ```

## Advanced Features

### 1. Stage Variables

1. **Overview**
   - Key-value pairs associated with deployment stage
   - Environment-specific configuration
   - Referenced in integration settings

2. **Creating Stage Variables**
   - Go to stage configuration
   - Click "Stage Variables"
   - Add key-value pairs
   - Example: environment=dev, apiEndpoint=dev.example.com

3. **Using Stage Variables**
   - In URL path: `{stageVariables.environment}`
   - In mapping templates: `$stageVariables.apiEndpoint`
   - In Lambda function name: `my-function-${stageVariables.environment}`
   - In AWS service integration: `arn:aws:s3:::${stageVariables.bucket}`

4. **Example: Environment-Specific Lambda**
   ```
   Lambda function: my-function-${stageVariables.environment}
   
   Stage variable: environment=dev → my-function-dev
   Stage variable: environment=prod → my-function-prod
   ```

### 2. Request Validation

1. **Basic Validators**
   - Validate query string parameters
   - Validate header values
   - Validate request body

2. **Create Request Validator**
   - Go to API settings
   - Create model for body validation
   - Create validator
   - Apply to method request

3. **Example JSON Schema Model**
   ```json
   {
     "$schema": "http://json-schema.org/draft-04/schema#",
     "title": "UserModel",
     "type": "object",
     "properties": {
       "name": {
         "type": "string",
         "minLength": 1
       },
       "email": {
         "type": "string",
         "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
       },
       "age": {
         "type": "integer",
         "minimum": 18
       }
     },
     "required": ["name", "email"]
   }
   ```

### 3. Canary Deployments

1. **Overview**
   - Test new API versions with subset of traffic
   - Gradual rollout of changes
   - Monitoring before full deployment

2. **Configure Canary**
   - In stage settings, enable canary
   - Set percentage of traffic (e.g., 10%)
   - Deploy to canary
   - Monitor and adjust

3. **Promote Canary**
   - When confident, promote canary
   - Updates base stage with canary configuration
   - All traffic now goes to new version

4. **Example**
   ```bash
   # Create canary
   aws apigateway create-deployment \
     --rest-api-id abcdef123 \
     --stage-name prod \
     --canary-settings percentTraffic=10
   
   # Promote canary
   aws apigateway update-stage \
     --rest-api-id abcdef123 \
     --stage-name prod \
     --patch-operations op=update,path=/canary/percentTraffic,value=100
   ```

### 4. WAF Integration

1. **Setup**
   - Create WAF web ACL
   - Configure rules
   - Associate with API stage

2. **Common WAF Rules**
   - SQL injection protection
   - Cross-site scripting (XSS) protection
   - IP-based access control
   - Rate limiting
   - Geo-restriction

3. **Example Rule Configuration**
   ```
   Rule: Limit requests per IP
   Type: Rate-based rule
   Rate limit: 1,000 requests per 5-minute period
   ```

### 5. Private APIs

1. **Create VPC Endpoint**
   - Create interface VPC endpoint for API Gateway
   - Enable private DNS
   - Configure security groups

2. **Create Private API**
   - Endpoint type: Private
   - Attach resource policy to restrict access
   - Associate with VPC endpoint

3. **Example Resource Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Deny",
         "Principal": "*",
         "Action": "execute-api:Invoke",
         "Resource": "execute-api:/*",
         "Condition": {
           "StringNotEquals": {
             "aws:SourceVpce": "vpce-0123456789abcdef0"
           }
         }
       },
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "execute-api:Invoke",
         "Resource": "execute-api:/*"
       }
     ]
   }
   ```

## Integration with Other AWS Services

### 1. Lambda Integration

1. **Proxy Integration**
   - Complete request/response handling
   - Minimal API Gateway configuration
   - Maximum flexibility in Lambda code

2. **Non-Proxy Integration**
   - Custom request/response mapping
   - Reduced Lambda code complexity
   - More control in API Gateway

3. **Authorization**
   - Lambda authorizers
   - Fine-grained access control
   - Custom authentication logic

### 2. DynamoDB Integration

1. **Direct Integration**
   - Bypass Lambda for simple operations
   - Integration type: AWS Service
   - Actions: GetItem, PutItem, Query, etc.

2. **Mapping Template for Query**
   ```json
   {
     "TableName": "Users",
     "KeyConditionExpression": "id = :id",
     "ExpressionAttributeValues": {
       ":id": {
         "S": "$input.params('user_id')"
       }
     }
   }
   ```

3. **Response Mapping**
   ```json
   #set($inputRoot = $input.path('$'))
   {
     "user": {
       "id": "$inputRoot.Items[0].id.S",
       "name": "$inputRoot.Items[0].name.S",
       "email": "$inputRoot.Items[0].email.S"
     }
   }
   ```

### 3. S3 Integration

1. **GET Object**
   - Integration type: AWS Service
   - HTTP method: GET
   - Action: GetObject
   - Path override: /bucket-name/{key}

2. **PUT Object**
   - Integration type: AWS Service
   - HTTP method: PUT
   - Action: PutObject
   - Path override: /bucket-name/{key}
   - Content-Type header passed through

3. **Example Request Mapping**
   ```json
   {
     "Bucket": "my-bucket",
     "Key": "$input.params('key')",
     "ContentType": "$input.params('Content-Type')"
   }
   ```

### 4. Cognito Integration

1. **User Pool Authorizer**
   - Create Cognito User Pool
   - Configure app client
   - Create authorizer in API Gateway
   - Secure APIs with JWT tokens

2. **Identity Pool Integration**
   - Temporary AWS credentials
   - IAM-based access control
   - Fine-grained permissions

3. **Example Client Flow**
   ```javascript
   // Sign in with Cognito User Pool
   const user = await Auth.signIn(username, password);
   
   // Get ID token
   const token = user.signInUserSession.idToken.jwtToken;
   
   // Use token with API
   const result = await fetch('https://api.example.com/users', {
     headers: {
       Authorization: token
     }
   });
   ```

### 5. CloudWatch Integration

1. **Metrics**
   - Automatically available
   - Create dashboards for monitoring
   - Set alarms for abnormal conditions

2. **Logs**
   - Enable execution logging
   - Enable access logging
   - Analyze with CloudWatch Logs Insights

3. **Example Logs Insights Query**
   ```
   filter @logStream = 'API-Gateway-Execution-Logs_abcdef123/prod'
   | filter @message like /error/i
   | stats count(*) as errorCount by @message
   | sort errorCount desc
   | limit 10
   ```

## Best Practices

### 1. API Design

- Use resource-oriented paths (/users, /users/{id})
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Use path parameters for resource identifiers
- Use query parameters for filtering and pagination
- Use consistent naming conventions
- Document API using API Gateway's models
- Implement versioning strategy (URI path, header, parameter)
- Return appropriate HTTP status codes
- Provide meaningful error messages

### 2. Performance

- Enable caching for frequently accessed endpoints
- Use regional endpoints for lower latency
- Use edge-optimized endpoints for global access
- Configure appropriate request/response compression
- Implement pagination for large result sets
- Use batch operations where appropriate
- Monitor and optimize integration latency
- Use Direct Lambda invocation for performance-critical paths
- Implement efficient request validation

### 3. Security

- Use HTTPS for all APIs
- Implement appropriate authorization
- Use API keys for identification (not authentication)
- Set up request throttling and quotas
- Enable AWS WAF for additional protection
- Validate input data
- Implement least privilege IAM policies
- Use resource policies for additional access control
- Regularly audit API access and usage
- Enable CloudTrail for API management operations

### 4. Monitoring and Operations

- Set up CloudWatch alarms for errors and latency
- Implement detailed logging
- Use X-Ray for tracing and debugging
- Create operational dashboards
- Implement canary deployments for safe updates
- Document deployment procedures
- Set up automated testing for APIs
- Create runbooks for common operational tasks
- Implement CI/CD pipelines for API deployment
- Use infrastructure as code for API definitions

### 5. Cost Optimization

- Choose HTTP APIs for lower cost when features permit
- Optimize caching to reduce backend calls
- Use appropriate throttling limits
- Monitor and analyze usage patterns
- Implement response compression
- Use Lambda tiered pricing effectively
- Optimize data transfer costs
- Consider regional vs. edge endpoints for cost
- Analyze and right-size resources
- Delete unused resources (APIs, stages, etc.)

This comprehensive guide covers the key aspects of Amazon API Gateway, from basic concepts to advanced features, to help you effectively create, deploy, and manage APIs in your AWS environment.