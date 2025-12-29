import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Integration: Complete deposit flow",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const protocolId = "velar";
        const amount = 5000000;

        let block = chain.mineBlock([
            // Register protocol
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(`${deployer.address}.velar-adapter`)
                ],
                deployer.address
            ),
            // Deposit
            Tx.contractCall(
                'router',
                'deposit',
                [types.ascii(protocolId), types.uint(amount)],
                wallet1.address
            ),
            // Check deposit
            Tx.contractCall(
                'router',
                'get-user-deposit',
                [types.principal(wallet1.address), types.ascii(protocolId)],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectSome();
    },
});

Clarinet.test({
    name: "Integration: Vault creation and deposit flow",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "integration-vault-001";
        const strategy = "balanced";
        const amount = 10000000;

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.ascii(vaultId), types.ascii(strategy)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit-to-vault',
                [types.ascii(vaultId), types.uint(amount)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'get-vault-info',
                [types.ascii(vaultId)],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block.receipts[2].result.expectSome();
    },
});
