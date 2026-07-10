# Pinned to the same Playwright version this repo resolves in pnpm-lock.yaml
# (@playwright/test@1.61.1) so screenshots taken in here match the ones CI produces on
# ubuntu-latest — see CLAUDE.md's test-visual section and the incident that motivated this:
# baselines regenerated on a Mac don't match Linux-rendered screenshots byte-for-byte.
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# docker-in-docker CLI (the actual daemon comes from the docker-in-docker devcontainer feature)
# so `act` can launch the runner containers it needs.
RUN apt-get update && apt-get install -y --no-install-recommends \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# act: runs this repo's GitHub Actions workflows locally in Docker, using the same
# runs-on: ubuntu-latest jobs defined in .github/workflows/*.yml — installed via the
# project's official install script, pinned to a specific release for reproducibility.
RUN curl -fsSL https://raw.githubusercontent.com/nektos/act/master/install.sh \
    | bash -s -- v0.2.79 -b /usr/local/bin

# Pin pnpm to the exact version this repo's package.json "packageManager" field specifies —
# corepack alone won't activate it until a project directory is entered, and we want it
# available immediately for ad-hoc shell use too.
RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

WORKDIR /workspace
