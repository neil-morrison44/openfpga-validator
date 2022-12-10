# openfpga-validator

Script which validates OpenFPGA core zips

## Usage

To run, do:

```bash
npx openfpga-validator check <path_to_zip>
```

(you'll need node installed but after that it'll be a 1 line thing)

It'll return the errors, warnings, & recommendations

Can check for more options with

```bash
npx openfpga-validator check --help
```

## Adding checks

If you want to add a check then:

- Raise an issue (with examples of fail / pass criterion) & I'll get to it eventually

Or, if you want to do it yourself

- if it doesn't fit into one of the files which already exist in the `src/checks` folder then create a new one
- export a function of the type `CheckFn`
- decide on the level:
  - If it would break on the Pocket itself, or goes against a `must` in the Analogue Docs, then it's an `error`
  - If it would probably break an updater, or cause a user to have to do extra work, but doesn't go against anything in the Analogue Docs it's a `warning`
  - If it's just nice to have - or it's a convention followed by other cores - then it's a `Recommendation`
- If you can specify the part of the Analogue Docs which talk about the issue then include the URL in the message
- add an `await` for it to the main `index.ts`
- I'll be adding automated tests soon so you might need to add example `.zip` files that pass / fail (don't worry about this yet though)
- Raise a PR, I'll merge, bump the version, and do a release
