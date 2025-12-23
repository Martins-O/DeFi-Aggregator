import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can create vaults",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'vault-manager',
        'create-vault',
        [types.ascii("max-yield")],
        wallet1.address
      )
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(0); // First vault ID
  },
});

Clarinet.test({
  name: "Ensure that vault info can be retrieved",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'vault-manager',
        'create-vault',
        [types.ascii("conservative")],
        wallet1.address
      )
    ]);

    // Get vault info
    let vaultInfo = chain.callReadOnlyFn(
      'vault-manager',
      'get-vault-info',
      [types.uint(0)],
      wallet1.address
    );

    const vaultData = vaultInfo.result.expectSome().expectTuple();
    assertEquals(vaultData['strategy'], types.ascii("conservative"));
    assertEquals(vaultData['active'], types.bool(true));
  },
});

Clarinet.test({
  name: "Ensure that multiple vaults can be created",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall(
        'vault-manager',
        'create-vault',
        [types.ascii("aggressive")],
        wallet1.address
      ),
      Tx.contractCall(
        'vault-manager',
        'create-vault',
        [types.ascii("balanced")],
        wallet2.address
      )
    ]);

    assertEquals(block.receipts.length, 2);
    block.receipts[0].result.expectOk().expectUint(0);
    block.receipts[1].result.expectOk().expectUint(1);
  },
});
