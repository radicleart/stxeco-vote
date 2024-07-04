import { getConfig } from "$stores/store_helpers";
import { getStacksNetwork } from "@mijoco/stx_helpers/dist/index";
import { showContractCall } from "@stacks/connect";
import { PostConditionMode, contractPrincipalCV } from "@stacks/transactions";

export async function concludeVote(votingContract:string, proposalContract:string) {
    const deployer = getConfig().VITE_DOA_DEPLOYER;
    const proposalCV = contractPrincipalCV(proposalContract.split('.')[0], proposalContract.split('.')[1])
    await showContractCall({
        network: getStacksNetwork(getConfig().VITE_NETWORK),
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: votingContract.split('.')[1],
        functionName: 'conclude',
        functionArgs: [proposalCV],
        onFinish: data => {
            console.log('finished contract call!', data);
            return data.txId
        },
        onCancel: () => {
            console.log('popup closed!');
        }
    });
}
  
  
