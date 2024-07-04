;; Title: BDP Test Voting
;; Author: Mike Cohen
;; Synopsis:
;; Quick test of submission and voting extensions.
;; Description:
;; Enables testing of the core extensions.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .bitcoin-dao set-extension .bde007-snapshot-proposal-voting true))
		(try! (contract-call? .bitcoin-dao set-extension .bde008-flexible-funded-submission true))
		(ok true)
	)
)
