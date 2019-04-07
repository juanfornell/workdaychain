import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import companyArtifact from "../../build/contracts/Company.json";

let accounts;
let account;

const App = {
  web3: null,
  meta: null,
  company: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      const deployedCompany = companyArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );
      this.company = new web3.eth.Contract(
        companyArtifact.abi,
        deployedCompany.address,
      );

      // get accounts
      accounts = await web3.eth.getAccounts();
      account = accounts[0];

      this.refreshAddress(account);
      //this.redirect();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshAddress: async function (_adress) {
    const addressElement = document.getElementById('address');
    addressElement.innerHTML = _adress;
  },

  createNewCompany: async function() {
    const companyName = document.getElementById('companyName').value;
    const { createCompany } = this.company.methods;
    await createCompany(companyName).send({ from: account });
    this.redirect();
  },

  redirect: async function() {
    const { existsCompany } = this.company.methods;
    const checkCompany = await existsCompany().call();
    const { getCompanyAddress } = this.company.methods;
    const addressCompany = await getCompanyAddress().call();
    const { isWorker } = this.company.methods;
    const checkWorker = await isWorker(account).call();
    if(checkCompany == false) {
      document.location.href = "./register.html";
    } else {
      if(addressCompany == account) {
        document.location.href = "./index.html";
      }
      else {
        if(checkWorker == true) {
          document.location.href = "./worker.html";
        } else {
          document.location.href = "./notRegistered.html";
        }
      }
    }
    console.log(checkCompany);
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  // Refresh page if address changes
  var accountInterval = setInterval(async function() {
    let currentAccounts = await App.web3.eth.getAccounts();
    let currentAccount = currentAccounts[0];
    if (currentAccount !== account) {
      account = currentAccount;
      //window.location.reload();
      App.redirect();
    }
  }, 100);

  App.start();
});
