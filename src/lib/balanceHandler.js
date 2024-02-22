import { settings } from "../utilities/state.js";
import { startLoadingAnimation, stopLoadingAnimation, transactionAccordion } from "../dom/shared.js";

const initBalanceHandler = () => {

    const rpc = new Web3(settings.GANACHE_ADDRESS);

    const form = document.querySelector('#balance-form');
    const submitBtn = document.querySelector('#balance-submit-btn');
    const balanceContainer = document.querySelector('#balance-amount');
    const transactionContainer = document.querySelector('#transaction-history');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        checkBalance();
    });

    async function checkBalance() {
        startLoadingAnimation(submitBtn);

        const formData = new FormData(form);
        const account = formData.get('account');

        if (account) {

            const balance = await rpc.eth.getBalance(account);
            if (balance) {
                stopLoadingAnimation(submitBtn);
                balanceContainer.innerText = rpc.utils.fromWei(balance, 'ether');
            }


            // Get latest block
            const block = await rpc.eth.getBlock('latest');
            if (block === null) return;

            const transactions = block.transactions;
            if (transactions) {
                displayAccountHistory(transactions);
            }

        } else {
            balanceContainer.innerText = '...';
            stopLoadingAnimation(submitBtn);
        }

    }

    async function displayAccountHistory(transactions) {

        while (transactionContainer.firstChild) {
            transactionContainer.removeChild(transactionContainer.firstChild);
        }
        transactionContainer.appendChild(transactionAccordion());
        transactionContainer.appendChild(transactionAccordion());
        transactionContainer.appendChild(transactionAccordion());
        transactionContainer.appendChild(transactionAccordion());

        for (let hash of transactions) {
            console.log("Transaction hash:", hash);

            // Get transaction by its hash...
            let trx = await rpc.eth.getTransaction(hash);
            console.log(trx);
            // createTransactionList(trx);
        }
    }

}


export default initBalanceHandler;