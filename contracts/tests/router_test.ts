import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that router can register protocols",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'router',
        'register-protocol',
        [
          types.ascii("velar"),
          types.principal(wallet1.address)
        ],
        deployer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Ensure that only owner can register protocols",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'router',
        'register-protocol',
        [
          types.ascii("velar"),
          types.principal(wallet1.address)
        ],
        wallet1.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectErr().expectUint(100); // err-owner-only
  },
});

Clarinet.test({
  name: "Ensure that router can be paused",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'router',
        'toggle-pause',
        [],
        deployer.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);

    // Check that contract is paused
    let isPaused = chain.callReadOnlyFn(
      'router',
      'is-paused',
      [],
      deployer.address
    );
    isPaused.result.expectBool(true);
  },
});
