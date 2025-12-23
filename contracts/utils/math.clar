;; Math Utilities
;; Safe math operations and APY calculations

;; Constants
(define-constant err-division-by-zero (err u500))
(define-constant err-overflow (err u501))
(define-constant basis-points u10000) ;; 100.00% = 10000 basis points

;; Read-only functions

;; Calculate percentage of amount
;; percentage is in basis points (e.g., 1200 = 12%)
(define-read-only (calculate-percentage (amount uint) (percentage uint))
  (/ (* amount percentage) basis-points)
)

;; Calculate APY compound interest
;; Returns final amount after applying APY for given periods
(define-read-only (calculate-compound-interest
  (principal uint)
  (apy-bps uint)
  (periods uint))
  (if (is-eq periods u0)
    principal
    (let
      (
        (interest (calculate-percentage principal apy-bps))
        (new-principal (+ principal interest))
      )
      (calculate-compound-interest new-principal apy-bps (- periods u1))
    )
  )
)

;; Safe division with zero check
(define-read-only (safe-divide (numerator uint) (denominator uint))
  (if (is-eq denominator u0)
    err-division-by-zero
    (ok (/ numerator denominator))
  )
)

;; Calculate weighted average APY
;; Used for portfolio-level APY calculation
(define-read-only (calculate-weighted-apy
  (amount1 uint) (apy1 uint)
  (amount2 uint) (apy2 uint))
  (let
    (
      (total-amount (+ amount1 amount2))
    )
    (if (is-eq total-amount u0)
      (ok u0)
      (ok (/
        (+ (* amount1 apy1) (* amount2 apy2))
        total-amount
      ))
    )
  )
)

;; Convert annual APY to daily rate
(define-read-only (annual-to-daily-rate (annual-apy uint))
  (/ annual-apy u365)
)

;; Calculate share price for vaults
;; share-price = total-value / total-shares
(define-read-only (calculate-share-price
  (total-value uint)
  (total-shares uint))
  (if (is-eq total-shares u0)
    (ok basis-points) ;; Initial share price = 1.0
    (unwrap-panic (safe-divide (* total-value basis-points) total-shares))
  )
)
