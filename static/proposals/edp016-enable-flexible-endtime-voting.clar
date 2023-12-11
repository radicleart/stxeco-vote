;; Title: EDP016 Flexible End Time Proposals
;; Author: Mike Cohen
;; Synopsis:
;; This proposal enables the start and end of voting on proposals to be set in the funding transaction.
;; Description:
;; This proposal builds on funded proposal submission by allowing the
;; start block and proposal duration to be set by the funding transaction
;; The dao sets minimum limits on both the start and duration through the parameters
;; - minimum-proposal-start-delay
;; - minimum-proposal-duration

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .executor-dao set-extension .ede007-snapshot-proposal-voting-v5 true))
		(try! (contract-call? .executor-dao set-extension .ede008-flexible-funded-submission true))
		(ok true)
	)
)

