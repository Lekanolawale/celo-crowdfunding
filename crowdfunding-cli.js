const Web3 = require("web3");

const Crowdfunding = require("./build/contracts/Crowdfunding.json");
const readlineSync = require("readline-sync");
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");

async function createProject(contract) {
  const targetAmount = readlineSync.question("Enter the target amount: ");
  const deadline = readlineSync.question(
    "Enter the deadline (UNIX timestamp): "
  );
  const privateKey = "YOUR_PRIVATE_KEY"; // replace with the private key of your celo account
  const celoAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(celoAccount);
  await contract.methods
    .createProject(targetAmount, deadline)
    .send({
      from: celoAccount.address,
      gas: 3000000,
      gasPrice: "10000000000",
    })
    .then((result) => {
      console.log(
        `Project created with ID ${result.events.ProjectCreated.returnValues.projectId}`
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

async function fundProject(contract) {
  const projectId = readlineSync.question("Enter the project ID: ");
  const amount = readlineSync.question("Enter the amount to fund: ");
  const privateKey = "YOUR_PRIVATE_KEY"; // replace with the private key of your celo account
  const celoAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(celoAccount);
  await contract.methods
    .fundProject(projectId)
    .send({
      from: celoAccount.address,
      value: web3.utils.toWei(amount, "ether"),
      gas: 3000000,
      gasPrice: "10000000000",
    })
    .then((result) => {
      console.log(`Funded project ${projectId} with amount ${amount}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function main() {
  const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Change to you your contract address

  // Create an instance of the contract
  const contract = new web3.eth.Contract(Crowdfunding.abi, contractAddress);

  const action = readlineSync.question(
    "Enter action (createProject/fundProject): "
  );
  switch (action) {
    case "createProject":
      await createProject(contract);
      break;
    case "fundProject":
      await fundProject(contract);
      break;
    default:
      console.log("Invalid action");
  }
}

main();
