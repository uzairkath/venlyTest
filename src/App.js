import logo from "./logo.svg";
import "./App.css";
import { VenlyConnect } from "@venly/connect";

const venlyConnect = new VenlyConnect("4ever11", {
  environment: "staging",
});
let wallet;
venlyConnect.authenticate().then(result =>
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
      venlyConnect.api.getWallets().then(wallets => {
        console.log(wallets);
        wallet = wallets[1].id.toString();
        let signer = venlyConnect.createSigner();
        console.log(wallet);
        signer.executeContract({
          secretType: "MATIC",
          walletId: wallet,
          to: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          value: 0,
          functionName: "transfer",
          inputs: [
            {
              type: "address",
              value: "0x80cbb6c4342948e5be81987dce8251dbedd69138",
            },
            { type: "uint256", value: "73680000" },
          ],
        });
      });
    })
    .notAuthenticated(auth => {
      console.log("The user is not authenticated");
    })
);
function App() {
  return (
    <>
      <button>Connect</button>
    </>
  );
}

export default App;
