# GitHub Pages Deployment

## Automatic Deployment

This site automatically deploys to GitHub Pages when you push to the `main` branch.

## Deployment Process

1. **Push to Main**: `git push origin main`
2. **GitHub Actions**: GitHub Pages builds the site
3. **Deploy**: Site available at `https://oyi77.github.io/`

## Build Configuration

GitHub Pages uses:
- Jekyll with `github-pages` gem
- Safe mode (only safe plugins)
- Automatic build on push

## Custom Domain (Optional)

1. Add `CNAME` file with your domain
2. Configure DNS records
3. GitHub handles SSL automatically

## Environment Variables

GitHub Pages doesn't support build-time environment variables. For plugins requiring tokens:

1. Use GitHub Secrets (for Actions)
2. Or provide fallback data in plugins
3. Or fetch data client-side

## Troubleshooting

### Build Fails

- Check Jekyll version compatibility
- Verify all plugins are safe
- Check for syntax errors in plugins

### Site Not Updating

- Clear browser cache
- Check GitHub Actions logs
- Verify push to main branch

### Plugin Errors

- Ensure plugins are marked `safe true`
- Check for required gems in Gemfile
- Verify plugin syntax

