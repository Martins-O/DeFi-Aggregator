import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Math Utils: Calculate percentage",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const amount = 10000;
        const percentage = 1500; // 15%

        let block = chain.mineBlock([
            Tx.contractCall(
                'math',
                'calculate-percentage',
                [types.uint(amount), types.uint(percentage)],
                deployer.address
            )
        ]);

        const result = block.receipts[0].result.expectOk().expectUint(1500);
        assertEquals(result, 1500);
    },
});

Clarinet.test({
    name: "Math Utils: Calculate weighted average",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'math',
                'weighted-average',
                [
                    types.uint(1000),
                    types.uint(2000),
                    types.uint(5000),
                    types.uint(5000)
                ],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Math Utils: Safe multiplication",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'math',
                'safe-multiply',
                [types.uint(1000), types.uint(500)],
                deployer.address
            )
        ]);

        const result = block.receipts[0].result.expectOk().expectUint(500000);
        assertEquals(result, 500000);
    },
});

Clarinet.test({
    name: "Math Utils: Safe division",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'math',
                'safe-divide',
                [types.uint(10000), types.uint(100)],
                deployer.address
            )
        ]);

        const result = block.receipts[0].result.expectOk().expectUint(100);
        assertEquals(result, 100);
    },
});

Clarinet.test({
    name: "Math Utils: Prevent division by zero",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall(
                'math',
                'safe-divide',
                [types.uint(10000), types.uint(0)],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectErr();
    },
});
