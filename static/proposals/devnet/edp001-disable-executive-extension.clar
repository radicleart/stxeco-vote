;; Title: BDP000 Bootstrap
;; Author: Marvin Janssen
;; Synopsis:
;; Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.
;; Description:
;; Mints the initial supply of governance tokens and enables the the following 
;; extensions: "BDE000 Governance Token", "BDE001 Proposal Voting",
;; "BDE002 Proposal Submission", "BDE003 Emergency Proposals",
;; "BDE004 Emergency Execute".

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .bitcoin-dao set-extensions
			(list
				{extension: .bde000-governance-token, enabled: false}
				{extension: .bde003-emergency-proposals, enabled: false}
				{extension: .bde004-emergency-execute, enabled: false}
				{extension: .bde006-treasury, enabled: true}
			)
		))

		(ok true)
	)
)