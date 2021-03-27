const fetch = require('node-fetch')

const handler = async function (event) {
  try {
    const { queryStringParameters  } = event;
    const { search } = queryStringParameters;
    if(search === undefined) return ok([])
    const response = await fetch(`https://f3knoxville.com/wp-json/wp/v2/tags?search=${search}`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()
    return ok(data);
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }

function ok(data) {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
