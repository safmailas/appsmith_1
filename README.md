![](https://raw.githubusercontent.com/appsmithorg/appsmith/release/static/appsmith_logo_primary.png)

This app is built using Appsmith. Turn any datasource into an internal app in minutes. Appsmith lets you drag-and-drop components to build dashboards, write logic with JavaScript objects and connect to any API, database or GraphQL source.

![](https://raw.githubusercontent.com/appsmithorg/appsmith/release/static/images/integrations.png)

### [Github](https://github.com/appsmithorg/appsmith) • [Docs](https://docs.appsmith.com/?utm_source=github&utm_medium=social&utm_content=appsmith_docs&utm_campaign=null&utm_term=appsmith_docs) • [Community](https://community.appsmith.com/) • [Tutorials](https://github.com/appsmithorg/appsmith/tree/update/readme#tutorials) • [Youtube](https://www.youtube.com/appsmith) • [Discord](https://discord.gg/rBTTVJp)

##### You can visit the application using the below link

###### [![](https://assets.appsmith.com/git-sync/Buttons.svg) ](https://app.appsmith.com/applications/652449ce5012274cbc5158f5/pages/652449cf5012274cbc5158fe) [![](https://assets.appsmith.com/git-sync/Buttons2.svg)](https://app.appsmith.com/applications/652449ce5012274cbc5158f5/pages/652449cf5012274cbc5158fe/edit)

## Demo Mode (No Supabase Required)

This repository is configured to run in a safe demo mode by default. All Supabase credentials and URLs have been intentionally removed. The app will not perform live network calls and instead uses placeholders so it can be opened publicly for recruiters without backend dependencies.

### What changed
- All hardcoded Supabase URLs and keys were removed.
- A `demo_mode` flag is set in the global store during reset to short-circuit Supabase calls.
- Photo URLs use placeholder images.

### Enable real Supabase (optional)
If you want to connect your own Supabase project:
1. Set the following store values at initialization (e.g., in a reset routine):
   - `supabaseUrl`: your project URL (`https://YOUR-PROJECT.supabase.co`)
   - `supabaseKey`: your anon public key
   - `demo_mode`: false
2. Ensure the expected tables, buckets and policies exist (e.g., `reservations`, storage bucket `images` with `avatars/` and `posts/` folders).

With these values present, the app will automatically use live Supabase operations.
