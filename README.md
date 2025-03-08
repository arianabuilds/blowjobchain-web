This is a [Next.js](https://nextjs.org/) project.

## Getting Started

### First time

1. Fork repo
2. Clone it down with `git clone`
3. Install dependencies with `npm install` or `yarn` or equivalent.
4. Clone `.env.local.TEMPLATE` into `.env.local`, and add relevant keys.

### Then to start the development server:

```bash
npm run dev
```

or

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 🎉

## Merging PRs from this private repo into upstream

This repo doesn't use a standard Github Fork, because I wish to keep my version `dsernst/blowjobchain-web` set to private, but the upstream `arianabuilds/blowjobchain-web` is public. Github doesn't support that.

I still push commits to this fork, and open PRs, so the changes can still all be reviewed together.

But now I need to tag @arianabuilds in the comments of a PR when its ready for review, and then she needs to manually fetch the commits and merge using git CLI, rather than GitHub interface. Here are instructions for how to do that: https://github.com/dsernst/blowjobchain-web/pull/1#issuecomment-2184831242
