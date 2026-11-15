# NEON SLIDE FAMILY delivery

The primary user-facing site is https://sunup00-hys.github.io/neon-slide-family/ . Apply future family-game UI changes to this repository and verify the GitHub Pages deployment. The bus game is bus.html; preserve wallet query parameters when linking between games.

The existing shared API at https://neon-family-cloud.sunup00.chatgpt.site/api/words stores family users, stars and game history. Keep this shared API integration. Updating only a separate chatgpt.site frontend does not complete a family-game UI request.

This repository serves standalone HTML files from the main branch. Bundle game scripts and styles into the changed HTML page, preserve unrelated pages and audio, and check embedded JavaScript syntax before publishing. The bus frontend currently contains continuous circular crowd movement and immediate input with sequential background saves. Preserve shared-star award validation and duplicate-reward protection on the server.
