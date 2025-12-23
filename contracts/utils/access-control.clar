;; Access Control Utilities
;; Role-based access control for the aggregator

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u600))
(define-constant err-unauthorized (err u601))
(define-constant err-role-not-found (err u602))

;; Define roles
(define-constant role-admin "admin")
(define-constant role-operator "operator")
(define-constant role-rebalancer "rebalancer")

;; Data Maps
(define-map user-roles
  { user: principal, role: (string-ascii 20) }
  { active: bool }
)

(define-map role-permissions
  { role: (string-ascii 20), permission: (string-ascii 30) }
  { granted: bool }
)

;; Read-only functions
(define-read-only (has-role (user principal) (role (string-ascii 20)))
  (default-to
    false
    (get active (map-get? user-roles { user: user, role: role }))
  )
)

(define-read-only (has-permission (role (string-ascii 20)) (permission (string-ascii 30)))
  (default-to
    false
    (get granted (map-get? role-permissions { role: role, permission: permission }))
  )
)

(define-read-only (is-owner (user principal))
  (is-eq user contract-owner)
)

;; Public functions
(define-public (grant-role (user principal) (role (string-ascii 20)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set user-roles
      { user: user, role: role }
      { active: true }
    ))
  )
)

(define-public (revoke-role (user principal) (role (string-ascii 20)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set user-roles
      { user: user, role: role }
      { active: false }
    ))
  )
)

(define-public (grant-permission (role (string-ascii 20)) (permission (string-ascii 30)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set role-permissions
      { role: role, permission: permission }
      { granted: true }
    ))
  )
)

(define-public (revoke-permission (role (string-ascii 20)) (permission (string-ascii 30)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set role-permissions
      { role: role, permission: permission }
      { granted: false }
    ))
  )
)

;; Helper functions for common checks
(define-read-only (require-admin (user principal))
  (or (is-owner user) (has-role user role-admin))
)

(define-read-only (require-operator (user principal))
  (or (require-admin user) (has-role user role-operator))
)

(define-read-only (require-rebalancer (user principal))
  (or (require-admin user) (has-role user role-rebalancer))
)
