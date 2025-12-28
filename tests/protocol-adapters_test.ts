import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Velar Adapter: Get adapter name",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('velar-adapter', 'get-name', [], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectAscii("velar");
    },
});

Clarinet.test({
    name: "Velar Adapter: Get current APY",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('velar-adapter', 'get-apy', [], deployer.address)
        ]);

        const apy = block.receipts[0].result.expectOk().expectUint(1200);
        assertEquals(apy, 1200);
    },
});

Clarinet.test({
    name: "ALEX Adapter: Get adapter name",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('alex-adapter', 'get-name', [], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectAscii("alex");
    },
});

Clarinet.test({
    name: "ALEX Adapter: Get current APY",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('alex-adapter', 'get-apy', [], deployer.address)
        ]);

        const apy = block.receipts[0].result.expectOk().expectUint(850);
        assertEquals(apy, 850);
    },
});

Clarinet.test({
    name: "Velar Adapter: Set pool contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const poolContract = `${deployer.address}.velar-pool`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'velar-adapter',
                'set-pool-contract',
                [types.principal(poolContract)],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "ALEX Adapter: Set pool contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const poolContract = `${deployer.address}.alex-pool`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'alex-adapter',
                'set-pool-contract',
                [types.principal(poolContract)],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Adapters: Prevent non-owner from setting pool",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const poolContract = `${deployer.address}.velar-pool`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'velar-adapter',
                'set-pool-contract',
                [types.principal(poolContract)],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectErr().expectUint(100);
    },
});
