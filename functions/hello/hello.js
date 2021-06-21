
require("dotenv").config()

const handler = async (event) => {
  try {
    // const subject = event.queryStringParameters.name || 'World'

    const name = "Ubaid Ali"
    const client = process.env.FAUNADB_CLIENT
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${name}`, client }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
