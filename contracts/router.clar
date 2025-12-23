;; sBTC DeFi Router Contract
;; Aggregates deposits, withdrawals, and swaps across multiple DeFi protocols

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-protocol (err u101))
(define-constant err-invalid-amount (err u102))
(define-constant err-transfer-failed (err u103))
(define-constant err-protocol-call-failed (err u104))

;; Data Variables
(define-data-var paused bool false)

;; Data Maps
(define-map supported-protocols
  { protocol-id: (string-ascii 20) }
  {
    enabled: bool,
    adapter-contract: principal
  }
)

(define-map user-deposits
  { user: principal, protocol-id: (string-ascii 20) }
  { amount: uint }
)

;; Read-only functions
(define-read-only (is-paused)
  (var-get paused)
)

(define-read-only (get-protocol-info (protocol-id (string-ascii 20)))
  (map-get? supported-protocols { protocol-id: protocol-id })
)

(define-read-only (get-user-deposit (user principal) (protocol-id (string-ascii 20)))
  (default-to
    { amount: u0 }
    (map-get? user-deposits { user: user, protocol-id: protocol-id })
  )
)

;; Public functions
(define-public (register-protocol
  (protocol-id (string-ascii 20))
  (adapter-contract principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set supported-protocols
      { protocol-id: protocol-id }
      {
        enabled: true,
        adapter-contract: adapter-contract
      }
    ))
  )
)

(define-public (deposit-to-protocol
  (protocol-id (string-ascii 20))
  (amount uint)
  (sbtc-token <ft-trait>))
  (let
    (
      (protocol-info (unwrap! (get-protocol-info protocol-id) err-invalid-protocol))
      (current-deposit (get amount (get-user-deposit tx-sender protocol-id)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (get enabled protocol-info) err-invalid-protocol)
    (asserts! (not (var-get paused)) err-owner-only)

    ;; Transfer sBTC from user to router
    (try! (contract-call? sbtc-token transfer amount tx-sender (as-contract tx-sender) none))

    ;; Update user deposit tracking
    (map-set user-deposits
      { user: tx-sender, protocol-id: protocol-id }
      { amount: (+ current-deposit amount) }
    )

    (ok true)
  )
)

(define-public (withdraw-from-protocol
  (protocol-id (string-ascii 20))
  (amount uint)
  (sbtc-token <ft-trait>))
  (let
    (
      (protocol-info (unwrap! (get-protocol-info protocol-id) err-invalid-protocol))
      (current-deposit (get amount (get-user-deposit tx-sender protocol-id)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= amount current-deposit) err-invalid-amount)
    (asserts! (get enabled protocol-info) err-invalid-protocol)

    ;; Update user deposit tracking
    (map-set user-deposits
      { user: tx-sender, protocol-id: protocol-id }
      { amount: (- current-deposit amount) }
    )

    ;; Transfer sBTC from router to user
    (try! (as-contract (contract-call? sbtc-token transfer amount tx-sender (as-contract tx-sender) none)))

    (ok true)
  )
)

;; Admin functions
(define-public (toggle-pause)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set paused (not (var-get paused))))
  )
)

(define-public (disable-protocol (protocol-id (string-ascii 20)))
  (let
    (
      (protocol-info (unwrap! (get-protocol-info protocol-id) err-invalid-protocol))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set supported-protocols
      { protocol-id: protocol-id }
      {
        enabled: false,
        adapter-contract: (get adapter-contract protocol-info)
      }
    ))
  )
)

;; Trait definitions
(define-trait ft-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
  )
)
