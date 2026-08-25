.PHONY: check check-node tree

check: check-node
	@printf 'Scaffold checks completed.\n'

check-node:
	node --check scripts/check.js
	node scripts/check.js

tree:
	find apps core modules integrations frontend native plugins wordlists reports tests docs scripts .github -maxdepth 3 -type d | sort
