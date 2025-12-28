import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Vault Manager: Create vault with max-yield strategy",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-001";
        const strategy = "max-yield";

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Vault Manager: Create vault with balanced strategy",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-002";
        const strategy = "balanced";

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Vault Manager: Create vault with conservative strategy",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-003";
        const strategy = "conservative";

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Vault Manager: Reject invalid strategy",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-004";
        const strategy = "invalid-strategy";

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectErr().expectUint(102);
    },
});

Clarinet.test({
    name: "Vault Manager: Prevent duplicate vault IDs",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-005";
        const strategy = "balanced";

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [
                    types.ascii(vaultId),
                    types.ascii(strategy)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr().expectUint(101);
    },
});

Clarinet.test({
    name: "Vault Manager: Deposit to vault",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-006";
        const strategy = "max-yield";
        const amount = 5000000;

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
            )
        ]);

        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
    },
});

Clarinet.test({
    name: "Vault Manager: Withdraw from vault",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        const vaultId = "vault-007";
        const depositAmount = 10000000;
        const withdrawAmount = 5000000;

        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-manager',
                'create-vault',
                [types.ascii(vaultId), types.ascii("balanced")],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'deposit-to-vault',
                [types.ascii(vaultId), types.uint(depositAmount)],
                wallet1.address
            ),
            Tx.contractCall(
                'vault-manager',
                'withdraw-from-vault',
                [types.ascii(vaultId), types.uint(withdrawAmount)],
                wallet1.address
            )
        ]);

        block.receipts[2].result.expectOk();
    },
});
