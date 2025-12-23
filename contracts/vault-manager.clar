;; sBTC Vault Manager Contract
;; Manages auto-rebalancing vaults for optimal yield

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-vault-not-found (err u201))
(define-constant err-insufficient-balance (err u202))
(define-constant err-invalid-amount (err u203))
(define-constant err-unauthorized (err u204))

;; Data Variables
(define-data-var vault-counter uint u0)

;; Data Maps
(define-map vaults
  { vault-id: uint }
  {
    owner: principal,
    total-deposited: uint,
    strategy: (string-ascii 20),
    active: bool,
    created-at: uint
  }
)

(define-map vault-balances
  { vault-id: uint, user: principal }
  { balance: uint }
)

(define-map vault-allocations
  { vault-id: uint, protocol-id: (string-ascii 20) }
  { allocated-amount: uint }
)

;; Read-only functions
(define-read-only (get-vault-info (vault-id uint))
  (map-get? vaults { vault-id: vault-id })
)

(define-read-only (get-user-vault-balance (vault-id uint) (user principal))
  (default-to
    { balance: u0 }
    (map-get? vault-balances { vault-id: vault-id, user: user })
  )
)

(define-read-only (get-vault-allocation (vault-id uint) (protocol-id (string-ascii 20)))
  (default-to
    { allocated-amount: u0 }
    (map-get? vault-allocations { vault-id: vault-id, protocol-id: protocol-id })
  )
)

(define-read-only (get-next-vault-id)
  (var-get vault-counter)
)

;; Public functions
(define-public (create-vault (strategy (string-ascii 20)))
  (let
    (
      (vault-id (var-get vault-counter))
    )
    (map-set vaults
      { vault-id: vault-id }
      {
        owner: tx-sender,
        total-deposited: u0,
        strategy: strategy,
        active: true,
        created-at: block-height
      }
    )
    (var-set vault-counter (+ vault-id u1))
    (ok vault-id)
  )
)

(define-public (deposit-to-vault
  (vault-id uint)
  (amount uint)
  (sbtc-token <ft-trait>))
  (let
    (
      (vault-info (unwrap! (get-vault-info vault-id) err-vault-not-found))
      (current-balance (get balance (get-user-vault-balance vault-id tx-sender)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (get active vault-info) err-vault-not-found)

    ;; Transfer sBTC from user to vault
    (try! (contract-call? sbtc-token transfer amount tx-sender (as-contract tx-sender) none))

    ;; Update vault balance
    (map-set vault-balances
      { vault-id: vault-id, user: tx-sender }
      { balance: (+ current-balance amount) }
    )

    ;; Update total deposited
    (map-set vaults
      { vault-id: vault-id }
      (merge vault-info { total-deposited: (+ (get total-deposited vault-info) amount) })
    )

    (ok true)
  )
)

(define-public (withdraw-from-vault
  (vault-id uint)
  (amount uint)
  (sbtc-token <ft-trait>))
  (let
    (
      (vault-info (unwrap! (get-vault-info vault-id) err-vault-not-found))
      (current-balance (get balance (get-user-vault-balance vault-id tx-sender)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= amount current-balance) err-insufficient-balance)

    ;; Update vault balance
    (map-set vault-balances
      { vault-id: vault-id, user: tx-sender }
      { balance: (- current-balance amount) }
    )

    ;; Update total deposited
    (map-set vaults
      { vault-id: vault-id }
      (merge vault-info { total-deposited: (- (get total-deposited vault-info) amount) })
    )

    ;; Transfer sBTC from vault to user
    (try! (as-contract (contract-call? sbtc-token transfer amount tx-sender (as-contract tx-sender) none)))

    (ok true)
  )
)

(define-public (rebalance-vault
  (vault-id uint)
  (target-protocol (string-ascii 20))
  (amount uint))
  (let
    (
      (vault-info (unwrap! (get-vault-info vault-id) err-vault-not-found))
    )
    (asserts! (is-eq tx-sender (get owner vault-info)) err-unauthorized)
    (asserts! (get active vault-info) err-vault-not-found)

    ;; Update allocation tracking
    (map-set vault-allocations
      { vault-id: vault-id, protocol-id: target-protocol }
      { allocated-amount: amount }
    )

    (ok true)
  )
)

;; Trait definitions
(define-trait ft-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
  )
)
