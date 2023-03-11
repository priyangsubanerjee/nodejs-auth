const express = require("express");
const app = express();
const port = 3001 || process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { GraphQLClient, gql } = require("graphql-request");

const endpoint = "";

const token = "";

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: token,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/signUp", async (req, res) => {
  const { name, email, password } = req.body;

  const query = gql`
      mutation MyMutation {
        createAccount(
          data: {
            email: "${email}"
            name: "${name}"
            password: "${password}"
          }
        ) {
          id
          name
          email
        }
      }
    `;
  const data = await client.request(query);
  res.json(data);
});

app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  const query = gql`
    query MyQuery {
      accounts(where: { email: "${email}", password: "${password}" }) {
        id
        name
        email
      }
    }
  `;
  const { accounts } = await client.request(query);
  res.json(accounts[0]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
