;; Title: BDP Test Voting
;; Author: Mike Cohen
;; Synopsis:
;; Quick test of submission and voting extensions.
;; Description:
;; Enables testing of the core extensions.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(ok true)
)
