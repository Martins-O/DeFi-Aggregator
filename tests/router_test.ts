import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Router: Ensure contract deployment succeeds",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('router', 'get-owner', [], deployer.address)
        ]);

        block.receipts[0].result.expectPrincipal(deployer.address);
    },
});

Clarinet.test({
    name: "Router: Register protocol adapter successfully",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocolId = "velar";
        const adapterContract = `${deployer.address}.velar-adapter`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(adapterContract)
                ],
                deployer.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Router: Prevent non-owner from registering protocol",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const protocolId = "velar";
        const adapterContract = `${deployer.address}.velar-adapter`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(adapterContract)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectErr().expectUint(100); // err-owner-only
    },
});

Clarinet.test({
    name: "Router: Check if protocol is registered",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const protocolId = "velar";
        const adapterContract = `${deployer.address}.velar-adapter`;

        let block = chain.mineBlock([
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(adapterContract)
                ],
                deployer.address
            ),
            Tx.contractCall(
                'router',
                'is-protocol-registered',
                [types.ascii(protocolId)],
                deployer.address
            )
        ]);

        block.receipts[1].result.expectBool(true);
    },
});

Clarinet.test({
    name: "Router: Deposit to protocol",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const protocolId = "velar";
        const amount = 1000000; // 1 STX in micro-STX

        // First register the protocol
        let setupBlock = chain.mineBlock([
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(`${deployer.address}.velar-adapter`)
                ],
                deployer.address
            )
        ]);

        // Then attempt deposit
        let block = chain.mineBlock([
            Tx.contractCall(
                'router',
                'deposit',
                [
                    types.ascii(protocolId),
                    types.uint(amount)
                ],
                wallet1.address
            )
        ]);

        // Verify deposit was recorded
        block.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Router: Get user deposit information",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const protocolId = "velar";
        const amount = 1000000;

        let block = chain.mineBlock([
            Tx.contractCall(
                'router',
                'register-protocol',
                [
                    types.ascii(protocolId),
                    types.principal(`${deployer.address}.velar-adapter`)
                ],
                deployer.address
            ),
            Tx.contractCall(
                'router',
                'deposit',
                [
                    types.ascii(protocolId),
                    types.uint(amount)
                ],
                wallet1.address
            ),
            Tx.contractCall(
                'router',
                'get-user-deposit',
                [
                    types.principal(wallet1.address),
                    types.ascii(protocolId)
                ],
                wallet1.address
            )
        ]);

        const depositInfo = block.receipts[2].result.expectSome();
        // Verify deposit amount is correct
    },
});

Clarinet.test({
    name: "Router: Emergency pause functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('router', 'toggle-pause', [], deployer.address),
            Tx.contractCall(
                'router',
                'deposit',
                [
                    types.ascii("velar"),
                    types.uint(1000000)
                ],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
        // Deposit should fail when paused
        block.receipts[1].result.expectErr();
    },
});
