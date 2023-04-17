import logo from "./logo.svg";
import "./App.css";
import { VenlyConnect } from "@venly/connect";
let wallet;

async function initVenly() {
  const venlyConnect = new VenlyConnect("4ever11", {
    environment: "staging",
  });
  return venlyConnect;
}
async function getAccount(venlyConnect) {
  return venlyConnect.authenticate().then(result =>
    result
      .authenticated(auth => {
        console.log("The user is authenticated: " + auth.subject);
        venlyConnect.api.getProfile().then(profile => {
          console.log(
            `Users email, ${profile.email}, has been successfully executed!`
          );
        });
        venlyConnect.flows.getAccount("MATIC").then(account => {
          console.log(account);
          console.log("User name:", account.auth.tokenParsed.name);
          console.log("User email:", account.auth.tokenParsed.email);
          console.log("First wallet address:", account.wallets[0].address);
          console.log(
            "First wallet balance:",
            account.wallets[0].balance.balance
          );
        });
      })
      .notAuthenticated(auth => {
        console.log("The user is not authenticated");
      })
  );
}
async function buyNFT(venlyConnect) {
  try {
    venlyConnect.api.getWallets().then(async wallets => {
      console.log(wallets);
      wallet = wallets[1].id.toString();
      let signer = venlyConnect.createSigner();
      console.log(wallet);

      let tx = await signer.executeContract({
        secretType: "MATIC",
        walletId: wallet,
        to: "0x028025587dDFCC499C49dBf08F64ba42595c11af",
        value: 0,
        functionName: "buySNFT",
        inputs: [
          {
            type: "address",
            value: "0x0B5C55Cd1a168156a18dA0b73141d74d7758BfDA",
          },
          { type: "uint256", value: "2" },
          { type: "uint256", value: "0" },
        ],
      });
      console.log(tx);
      if (
        window.confirm(
          `The transaction is approved :) \n Here is the transaction hash ${tx.result.transactionHash} \n Click on OK to see the transaction`
        )
      ) {
        window.open(
          `https://mumbai.polygonscan.com/tx/${tx.result.transactionHash}`,
          `_blank`
        );
      }

      // await alert(
      //   `The transaction is approved :) \n Here is the transaction hash ${tx.result.transactionHash}`
      // );
    });
  } catch (error) {
    console.log(`Here is the error ${error[0].message}`);
  }
}

async function main() {
  const venlyConnect = await initVenly();
  let res = await getAccount(venlyConnect);
  await buyNFT(venlyConnect);
}

function App() {
  return (
    <>
      <button onClick={main}>Connect</button>
    </>
  );
}

export default App;
