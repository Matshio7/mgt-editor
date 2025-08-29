const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tailwind = require('tailwindcss');
const mix = require('laravel-mix');

// global settings
mix
	.disableNotifications()
	.setPublicPath('dist');

// render js file
mix.js('src/main.js', 'dist/assets/js').vue();

// render css
mix.sass('src/style.scss', 'dist/assets/css', {}, [ tailwind ]);

// move statics
if (fs.existsSync('src/static')) {
	mix.copyDirectory('src/static', 'dist');
}

// prepare index.html
mix.override((config) => {
	config.plugins.push(
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: 'body',
		}),
	);
});

// generate a version filename
if (mix.inProduction()) {
	mix.version();
}

// do stuff if watching mode
mix.before((mixHelpers) => {
	if (mixHelpers.isWatching()) {
		return;
	}

	mix.after(() => {
		// Check if files exist before processing
		if (fs.existsSync('./dist/mix-manifest.json') && fs.existsSync('./dist/index.html')) {
			let manifest = JSON.parse(
				fs.readFileSync('./dist/mix-manifest.json').toString(),
			);
			let html = fs.readFileSync('./dist/index.html').toString();
			for (let path of Object.keys(manifest)) {
				// Ensure relative paths for GitHub Pages
				let assetPath = manifest[path];
				if (assetPath.startsWith('/')) {
					assetPath = '.' + assetPath;
				}
				// Fix double slashes
				assetPath = assetPath.replace(/\/\//g, '/');
				html = html.replace(path, assetPath);
			}

			fs.unlinkSync('./dist/mix-manifest.json');
			fs.writeFileSync('./dist/index.html', html);
		}
	});
});