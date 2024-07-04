;; Title: BDP000 transformer-1
;; Author: Mike Cohen
;; Synopsis:
;; Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.
;; Description:
;; Bootstraps bitcoin-dao for stacks ecosystem voting. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens. Boot proposal that sets the governance token, DAO parameters, and extensions, and
;; mints the initial governance tokens.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .bitcoin-dao set-extensions
			(list
				{extension: .bde001-proposal-voting, enabled: true}
				{extension: .bde002-proposal-submission, enabled: false}
				{extension: .bde003-core-proposals, enabled: true}
				{extension: .bde004-core-execute, enabled: true}
				{extension: .bde007-snapshot-proposal-voting, enabled: false}
				{extension: .bde008-flexible-funded-submission, enabled: false}
			)
		))
				;; Set emergency team members.
		(try! (contract-call? .bde003-core-proposals set-core-team-member 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM true))
		(try! (contract-call? .bde003-core-proposals set-core-team-member 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 true))

		;; Set executive team members.
		(try! (contract-call? .bde004-core-execute set-executive-team-member 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM true))
		(try! (contract-call? .bde004-core-execute set-executive-team-member 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 true))
		(try! (contract-call? .bde004-core-execute set-signals-required u1)) ;; signal from 1 out of 42 team members required.

		(print "Bitcoin DAO has been reconfigured.")
		(ok true)
	)
)
