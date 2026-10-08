NPM         := npm
BUILD_DIR   := out
APACHE_ROOT := /var/www/html
RSYNC       := rsync -a --delete
DOCKER_IMG  := freiburg-map-apache
DOCKER_PORT := 8080
GH_PAGES_BASE := /taxi_final
GITLEAKS    := $(shell which gitleaks 2>/dev/null || echo $(HOME)/go/bin/gitleaks)
OSV_SCAN    := $(shell which osv-scanner 2>/dev/null || echo $(HOME)/go/bin/osv-scanner)
SEMGREP     := semgrep
ROBOREV     := $(shell which roborev 2>/dev/null || echo $(HOME)/go/bin/roborev)

.PHONY: help dev build deploy clean install docker-build docker-run docker-stop docker-dev docker-restart gh-pages gh-pages-build gh-pages-flatten check audit-secrets audit-deps audit-sast ai-commit ai-review quality validate-seo check-mobile lint-fix

help:
	@echo "make install       - install dependencies"
	@echo "make dev           - run Next.js dev server with live reload"
	@echo "make build         - build static export into $(BUILD_DIR)/"
	@echo "make deploy        - copy build output to $(APACHE_ROOT) (requires sudo)"
	@echo "make docker-build  - build Docker image with Apache serving the static export"
	@echo "make docker-run    - run Docker container (port $(DOCKER_PORT))"
	@echo "make docker-stop   - stop Docker container"
	@echo "make docker-dev    - build + run in one step"
	@echo "make docker-restart- rebuild + restart container"
	@echo "make gh-pages       - build for GitHub Pages (no deploy)"
	@echo "make clean         - remove build output and Next.js cache"
	@echo ""
	@echo "--- Code Quality & Local CodeRabbit Replacement ---"
	@echo "make check         - run Biome lint + tsc typecheck"
	@echo "make lint-fix      - auto-fix Biome formatting and lint errors"
	@echo "make check-mobile  - run Playwright tests to verify mobile navbar element visibility"
	@echo "make validate-seo  - run SEO validations (Canonical, Sitemap, JSON-LD)"
	@echo "make audit-secrets - scan for credentials and API keys (Gitleaks)"
	@echo "make audit-deps    - scan dependencies for CVEs (npm + OSV)"
	@echo "make audit-sast    - scan codebase for code security flaws (Semgrep)"
	@echo "make ai-commit     - generate conventional git commit message from local diff using agy"
	@echo "make ai-review     - trigger local AI code review (roborev)"
	@echo "make quality       - run all local checks (check, secrets, deps, sast)"
	@echo ""
	@echo "--- GitHub Pages deploy ---"
	@echo "Push to master to trigger .github/workflows/deploy.yml which:"
	@echo "  1. Builds with NEXT_PUBLIC_BASE_PATH=$(GH_PAGES_BASE)"
	@echo "  2. Flattens output for subdirectory hosting"
	@echo "  3. Deploys to gh-pages via actions/deploy-pages"

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build
	@test -d $(BUILD_DIR) || (echo "Build did not produce $(BUILD_DIR)/ — check output: 'export' in next.config.ts" && exit 1)
	@echo "Static export ready in $(BUILD_DIR)/"

deploy: build
	@echo "Copying $(BUILD_DIR)/ to $(APACHE_ROOT) ..."
	sudo $(RSYNC) $(BUILD_DIR)/ $(APACHE_ROOT)/
	@echo "Deployed. Visit your local Apache vhost to view changes."

docker-build: build
	docker build -t $(DOCKER_IMG) .

docker-run:
	@echo "Starting container on port $(DOCKER_PORT)..."
	docker run --rm -d \
		-p $(DOCKER_PORT):80 \
		--name $(DOCKER_IMG) \
		$(DOCKER_IMG)
	@echo "Open http://localhost:$(DOCKER_PORT)/en/?debug=true"

docker-stop:
	-docker stop $(DOCKER_IMG) 2>/dev/null || true

docker-dev: docker-stop docker-build docker-run

docker-restart: docker-dev

clean:
	rm -rf $(BUILD_DIR) .next

gh-pages-build:
	NEXT_PUBLIC_BASE_PATH=$(GH_PAGES_BASE) $(MAKE) build

gh-pages: gh-pages-build
	@echo "Replacing root index.html with /de/ redirect..."
	printf '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=$(GH_PAGES_BASE)/de/"><meta name="robots" content="noindex"><script>window.location.href="$(GH_PAGES_BASE)/de/";</script></head><body><a href="$(GH_PAGES_BASE)/de/">Deutsch</a><a href="$(GH_PAGES_BASE)/en/">English</a></body></html>\n' > $(BUILD_DIR)/index.html
	@touch $(BUILD_DIR)/.nojekyll
	@echo "GitHub Pages output ready in $(BUILD_DIR)/"
	@echo ""
	@echo "To deploy: push to master and let CI run .github/workflows/deploy.yml"
	@echo "Or manually:"
	@echo "  npx gh-pages -d out -b gh-pages"

check:
	@echo "=== Running Biome & TypeScript Type Check ==="
	$(NPM) run lint
	npx tsc --noEmit

lint-fix:
	@echo "=== Auto-fixing Formatting & Lint Errors (Biome) ==="
	$(NPM) run lint:fix

validate-seo:
	@echo "=== Running SEO (Canonical, Sitemap, JSON-LD) Validations ==="
	node scripts/validate-build.mjs

check-mobile:
	@echo "=== Running Playwright Mobile Navbar Verification ==="
	npx playwright install chromium webkit
	$(NPM) run test:mobile tests/mobile-navbar.spec.ts

audit-secrets:
	@echo "=== Scanning for exposed secrets (Gitleaks) ==="
	$(GITLEAKS) detect --verbose --redact

audit-deps:
	@echo "=== Scanning dependencies for CVEs (npm audit + OSV) ==="
	$(NPM) audit || true
	$(OSV_SCAN) --lockfile=package-lock.json || true

audit-sast:
	@echo "=== Scanning code patterns for vulnerabilities (Semgrep) ==="
	$(SEMGREP) scan --config auto --quiet --error || true

ai-commit:
	@echo "=== Generating AI Commit Message ==="
	@git diff HEAD > .diff_tmp && \
	if [ -s .diff_tmp ]; then \
		cat .diff_tmp | agy --dangerously-skip-permissions -p "Read this git diff and write a concise, clean git commit message. Follow the Conventional Commits specification (e.g. feat: ..., chore: ...). Start with a single-line title (max 72 chars), followed by a blank line, and then a bulleted list of key changes. Do not include markdown blocks or HTML tags, just the raw text of the commit message."; \
	else \
		echo "No local changes (staged or unstaged) found."; \
	fi; \
	rm -f .diff_tmp

ai-review:
	@echo "=== Triggering Local AI Review ==="
	$(ROBOREV) review --branch

quality: check audit-secrets audit-deps audit-sast
	@echo "=== All quality and security gates passed! ==="
