# lenix_premiums

## TODO

- [ ] globalize the storage using the lenix KVP from the web
- [ ] save last game mode played so we dont select each time
- [x] implement d/l themes
- [ ] add delay to prevent spamming server


## Installation
# add_ace resource.lenix_premiums command.stop allow
set lenix:license_key ....

- paste in workspace dir

```json
{
	"tailwindCSS.experimental.configFile": {
		"lenix_premiums/web/packages/ui/src/styles/globals.css": [
			"lenix_premiums/web/apps/web/src/**",
			"lenix_premiums/web/packages/**/src/**"
		]
	}
}
```