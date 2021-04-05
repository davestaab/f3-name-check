import fetch from 'node-fetch';
import {APIGatewayEvent, APIGatewayProxyResult} from 'aws-lambda'


export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
  try {
    const {queryStringParameters} = event;
    const search = queryStringParameters?.search ?? undefined;

    if (search === undefined || search === '') return ok([])
    const response = await fetch(`https://f3knoxville.com/wp-json/wp/v2/tags?search=${search}`, {
      headers: {Accept: 'application/json'},
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return {statusCode: response.status, body: response.statusText}
    }
    const data = await response.json()
    return ok(data);
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({msg: error.message}),
    }
  }
}


function ok(data: any) {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
