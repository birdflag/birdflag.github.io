# Hannah Fogarty — portfolio v5
## A beginner’s guide for macOS

This guide covers setting up your Mac, editing the website, previewing
changes, publishing to GitHub Pages, and undoing an update.

It uses:

- Finder for managing files.
- Terminal for running the local website.
- Visual Studio Code for editing.
- Homebrew for installing Ruby and Python.
- GitHub Desktop for managing and publishing changes.

The installation instructions work with both Apple Silicon and Intel Macs.
They assume the standard macOS Terminal shell, zsh.

If your local Jekyll preview already works, skip the installation steps.

---

## How the website works

You edit text files, templates, and artwork.

Jekyll turns those source files into a website. GitHub stores the source,
GitHub Actions builds it, and GitHub Pages publishes the result.

A local preview does not change the public website.

Your usual workflow will be:

**Edit → Preview → Check → Commit → Push and merge → Check the live site**

You do not need Node, npm, a database, or a website-builder subscription.

---

## Contents

1. [Set up your Mac](#1-set-up-your-mac)
2. [Create the v5 preview](#2-create-the-v5-preview)
3. [Know which files to edit](#3-know-which-files-to-edit)
4. [Edit existing text](#4-edit-existing-text)
5. [Add, reorder, or remove projects](#5-add-reorder-or-remove-projects)
6. [Add and manage images](#6-add-and-manage-images)
7. [Change colors and styling](#7-change-colors-and-styling)
8. [Add a regular page](#8-add-a-regular-page)
9. [Refresh the website on GitHub](#9-refresh-the-website-on-github)
10. [Publish later changes](#10-publish-later-changes)
11. [Test the website](#11-test-the-website)
12. [Mac troubleshooting](#12-mac-troubleshooting)
13. [Roll back a change](#13-roll-back-a-change)

---

## 1. Set up your Mac

### Install the editing apps

Download:

- [Visual Studio Code](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)

Install them in Applications and sign into GitHub Desktop.

Use Visual Studio Code for website files—not Word or Pages. The source
must remain plain text.

### Open Terminal

Open Applications → Utilities → Terminal.

Alternatively, press Command+Space, type `Terminal`, and press Return.

Commands in this guide go into Terminal. Paste a command and press Return.

Do not paste the entire website bundle into Terminal. Save the bundle in
your text editor instead.

### Install Apple’s Command Line Tools

Run:

```bash
xcode-select --install
```

If an installation window appears, complete it before continuing.

If the tools are already installed, macOS may say so. That is fine.

You do not need to install the full Xcode application just for this site.

### Install Homebrew

First check whether Homebrew is already installed:

```bash
brew --version
```

If that works, skip its installation.

Otherwise, visit:

https://brew.sh

Run the macOS installation command provided there.

Follow the installer’s **Next steps**, particularly the instructions for
adding Homebrew to your PATH. Those instructions differ between Apple
Silicon and Intel installations.

The installer may request your Mac login password. Terminal does not show
characters while you type a password.

After installation, reopen Terminal and check:

```bash
brew --version
```

### Install Ruby 3.3 and Python

If you already use a working Ruby version manager, keep that setup and
select Ruby 3.3.x through it. Do not layer another Ruby installation over
an existing setup unnecessarily.

For a fresh Homebrew-based setup:

```bash
brew install ruby@3.3 python
```

The Mac’s built-in Ruby is not the Ruby intended for this project. These
instructions do not replace or delete Apple’s Ruby.

### Tell Terminal to use the Homebrew Ruby

Run this block once:

```bash
RUBY_PREFIX="$(brew --prefix ruby@3.3)"
GEM_BIN="$("$RUBY_PREFIX/bin/ruby" -r rubygems -e 'puts Gem.bindir')"
printf '\n# Portfolio Ruby 3.3\nexport PATH="%s/bin:%s:$PATH"\n' "$RUBY_PREFIX" "$GEM_BIN" >> "$HOME/.zshrc"
source "$HOME/.zshrc"
```

This appends a PATH setting to your existing `.zshrc`; it does not replace
the file.

Using `brew --prefix` avoids hardcoding an Apple Silicon or Intel path.

Install Bundler:

```bash
gem install bundler
```

Do not use `sudo gem install` or `sudo bundle install` for this setup.

### Check everything

```bash
ruby -v
command -v ruby
bundle -v
python3 --version
```

Expected results:

- Ruby reports version 3.3.x.
- Ruby’s path points to your Homebrew installation, not `/usr/bin/ruby`.
- Bundler reports a version.
- Python reports version 3.x.

The `.ruby-version` file records the intended Ruby series. It does not
install Ruby automatically.

### Useful Mac shortcuts

| Action | Shortcut |
| --- | --- |
| Save a file | Command+S |
| Copy | Command+C |
| Paste | Command+V |
| Show hidden files in Finder | Command+Shift+Period |
| Go to a folder in Finder | Command+Shift+G |
| Search all files in VS Code | Command+Shift+F |
| Stop Jekyll in Terminal | Control+C |

Stopping the server uses **Control+C**, not Command+C.

---

## 2. Create the v5 preview

Keep the preview separate from your current website.

For a new setup, a local folder under `~/Sites` is a useful choice. Avoid
keeping the working Git repository inside iCloud Drive or another
automatically synchronized folder.

If you already unpacked v5 somewhere else, you can keep it there. Adjust
the paths below rather than creating unnecessary duplicate copies.

### Create a package folder

```bash
mkdir -p "$HOME/Sites/portfolio-v5-package"
open "$HOME/Sites/portfolio-v5-package"
```

Finder opens the new folder.

Save the supplied files there:

```text
portfolio-v5-package/
  unpack_v5.py
  portfolio-v5.bundle.txt
```

Save both as plain UTF-8 text.

The bundle must retain its `BEGIN FILE` and `END FILE` markers, but not
the surrounding Markdown code fences from the message.

In Finder → Settings → Advanced, enabling “Show all filename extensions”
helps you avoid names such as `unpack_v5.py.txt`.

### Unpack the website

```bash
cd "$HOME/Sites/portfolio-v5-package"
python3 unpack_v5.py
```

The script creates:

```text
portfolio-preview-v5/
```

It refuses to overwrite an existing folder with that name.

If you need another fresh test, rename the previous preview folder first.
Do not delete your actual website repository.

If you are reading this inside an already-created `portfolio-preview-v5`,
the unpacking step is complete.

### Copy your artwork

The source bundle does not include your binary artwork.

In Finder:

1. Locate the existing website’s `images` folder.
2. Select it and press Command+C.
3. Open `portfolio-preview-v5`.
4. Press Command+V.

Copy the folder; do not move it out of the existing website.

The result should include:

```text
portfolio-preview-v5/
  Gemfile
  _config.yml
  index.html
  images/
    Dessertbutterpouches_mockup.jpg
    dippsterz.png
    crop_headshot.JPG
  assets/
  _includes/
  _layouts/
  _pages/
  _projects/
```

Avoid creating `images/images/`.

Keep the original filenames and capitalization unchanged.

### Open the project in VS Code

Choose File → Open Folder and select `portfolio-preview-v5`.

You should see `Gemfile`, `_config.yml`, and `index.html` at the top level.

### Install the project dependencies

```bash
cd "$HOME/Sites/portfolio-v5-package/portfolio-preview-v5"
bundle install
```

This creates or updates `Gemfile.lock`. Keep that file.

### Start the local website

```bash
bundle exec jekyll serve --livereload
```

With the fresh bundle’s empty `baseurl`, open:

http://127.0.0.1:4000

Do not double-click `index.html` to preview the site. Jekyll must process
and serve it.

Leave Terminal running while you edit. Saving ordinary content changes
rebuilds the preview automatically.

That Terminal tab is occupied while Jekyll runs. Stop the server before
entering another command there, or open another Terminal tab.

### Stop the server

Press Control+C in its Terminal window.

### If another preview is running

Stop it first, or choose different HTTP and LiveReload ports:

```bash
bundle exec jekyll serve --livereload --port 4001 --livereload-port 35730
```

Then open:

http://127.0.0.1:4001

Check that you are viewing the port belonging to the correct project.

### After editing configuration

Stop and restart Jekyll after changing `_config.yml`.

Once a project `baseurl` is configured, the local address includes that
path. For example:

```text
http://127.0.0.1:4000/your-repository/
```

Use the server address printed in Terminal.

---

## 3. Know which files to edit

### Everyday content

| File or folder | Purpose |
| --- | --- |
| `index.html` | Homepage headline and introduction |
| `_pages/about.md` | Biography and portrait path |
| `_pages/contact.md` | Contact introduction and supporting text |
| `_projects/` | Project text, order, and galleries |
| `images/` | Actual artwork and portrait |
| `_config.yml` | Email, identity, location, and publishing address |
| `assets/css/main.css` | Colors, fonts, spacing, and layout |

### Shared structure and behavior

| File or folder | Purpose |
| --- | --- |
| `_includes/header.html` | Header and navigation |
| `_includes/footer.html` | Small footer |
| `_layouts/about.html` | About structure and “About me” label |
| `_layouts/project.html` | Shared project layout |
| `_layouts/page.html` | Regular page layout |
| `_includes/image-viewer.html` | Viewer controls |
| `assets/js/main.js` | Viewer and missing-image fallback |
| `.github/workflows/pages.yml` | GitHub deployment |
| `Gemfile` and `Gemfile.lock` | Ruby dependencies |

### Do not edit generated files

`_site/` contains the generated website. Jekyll recreates it.

Changes made inside `_site` will be overwritten. Edit the source instead.

Do not commit generated folders, caches, `.bundle`, or `vendor`.
The supplied `.gitignore` excludes the usual generated files and
Finder’s `.DS_Store` files.

`README.md` is documentation, not a visible website page.

---

## 4. Edit existing text

### Understand Markdown files

Most content files begin with settings between two `---` lines:

```markdown
---
title: "Example Project"
order: 8
description: "A short description."
---

The main written content goes here.

A blank line starts another paragraph.
```

This opening settings block is called front matter.

Inside it:

- Preserve key names such as `title` and `description`.
- Use spaces, not tabs, for indentation.
- Quote text containing punctuation such as colons.
- Keep numeric `order` values unquoted.
- Keep the switches `true` and `false` unquoted.

Below it, use normal Markdown:

```markdown
A regular paragraph.

**Bold text** and *italic text*.

- First item
- Second item

[Link text](https://example.com)
```

### Homepage

Edit `index.html`.

The headline is:

```html
<h1 id="intro-title">Brands that<br><em>take flight.</em></h1>
```

- `<br>` creates the line break.
- `<em>` applies the contrasting italic treatment.
- CSS supplies the orange color.

Keep those tags if you only want to change the words.

The introductory paragraph is nearby.

Homepage project cards are generated from `_projects`. Do not manually
add cards to `index.html`.

### About

Edit `_pages/about.md`.

- `title` controls the large greeting.
- `photo` identifies the portrait.
- Text after the front matter controls the biography.

The smaller “About me” label is in `_layouts/about.html`.

### Contact

Change the email address in `_config.yml`:

```yaml
email: hfogartydesign@gmail.com
```

The Contact page uses that value for its linked address.

Its introductory text is in `_pages/contact.md`:

```yaml
intro: "Have a new brand, a packaging project, or an idea you’d like to explore? I’d love to hear about it at"
intro_email: true
```

The layout appends a space, the linked email address, and a final period.

Do not also type the address or final period into `intro`.

The email remains italic and inherits the paragraph’s font size.

Restart Jekyll after changing `_config.yml`.

### Existing projects

Open the appropriate file in `_projects`.

| Setting | Appearance |
| --- | --- |
| `title` | Homepage card and project title |
| `category` | Card category description and project eyebrow |
| `description` | Usually beneath the project title; also metadata |
| `featured_image` | Homepage thumbnail |
| `featured_alt` | Thumbnail alternative text |
| `services` | Scope |
| `tools` | Design tools |
| `gallery` | Project images |
| Text after the front matter | Main project overview |

The Logos project deliberately has:

```yaml
show_description: false
overview_title: "Selected logos and spec rebrands across various industries."
```

The first setting hides the visible description under the title while
retaining its metadata.

The second replaces “About this project”.

---

## 5. Add, reorder, or remove projects

### Add a project

1. Duplicate a similar file in `_projects`.
2. Give it a unique lowercase filename, such as `new-project.md`.
3. Replace its content and image references.
4. Set a unique numeric `order`.
5. Copy the actual artwork into `images`.
6. Save and preview both the homepage and project page.

Example:

```markdown
---
title: "New Project"
order: 8
category: "Branding & packaging"
description: "A short, factual description of the project."
featured_image: /images/new-project-cover.jpg
featured_alt: "Describe the actual cover artwork"
services: [Brand identity, Package design]
tools: [Adobe Illustrator, Adobe Photoshop]
gallery:
  - src: /images/new-project-cover.jpg
    alt: "Describe the first image"
    wide: true
  - src: /images/new-project-detail.jpg
    alt: "Describe the detail image"
    caption: "An optional visible caption."
---

Describe the assignment and the work you created.
```

Use real image filenames. The example artwork is not included.

The project layout is assigned automatically.

### Project addresses

This file:

```text
_projects/new-project.md
```

normally creates:

```text
/work/new-project/
```

Changing the title does not change the address. Renaming the source file
normally does.

Avoid casually renaming published project files because external links
and bookmarks may stop working.

To retain an existing address after a filename change, set an explicit
permalink:

```yaml
permalink: /work/original-address/
```

Never give two pages the same permalink.

### Reorder projects

Change the numeric `order` values.

Use unique whole numbers. Both the homepage and Next project sequence
follow this order.

Displayed card numbers are generated automatically.

### Remove a project

Delete its Markdown file from `_projects`.

Its card and Next project entry disappear when the site rebuilds.

Before deleting artwork, search the whole workspace with
Command+Shift+F to check whether another project uses it.

The initial v5 site has seven projects. Cerise Coffee is intentionally
removed.

When replacing an older source tree, delete its old Cerise page too.

---

## 6. Add and manage images

### Use site-relative image paths

```yaml
src: /images/example.jpg
```

Do not add your GitHub repository name to image paths. The templates
handle the deployment base path.

Filename spelling, capitalization, and extension must match exactly.

Many Mac disks are case-insensitive, but GitHub’s Linux build environment
is case-sensitive. An image can therefore work locally and fail online
because of capitalization.

For new images, lowercase names with hyphens are easiest to maintain.

Changing `.jpg` to `.webp` in a filename does not convert the file.
Export the desired format from an image editor.

### Add a gallery image

Add another item under `gallery`, preserving indentation:

```yaml
  - src: /images/another-image.jpg
    alt: "Describe the artwork shown"
```

The list order controls the gallery order.

### Span both desktop columns

```yaml
  - src: /images/wide-image.jpg
    alt: "Describe the artwork"
    wide: true
```

On mobile, the gallery is already a single column.

### Add a visible caption

```yaml
  - src: /images/detail.jpg
    alt: "Close-up of the packaging typography"
    caption: "A closer view of the label typography."
```

Alternative text describes an image for people who cannot see it.
A caption is visible supporting text.

### Separate previews and originals

```yaml
  - src: /images/detail-preview.jpg
    full_src: /images/detail-original.jpg
    alt: "Close-up of the packaging typography"
```

The page loads `src`. The viewer and Original link use `full_src`.

Without `full_src`, both use `src`.

You can add actual `width` and `height` values for the preview to reserve
space before loading. Do not guess them.

### Prepare images before uploading

The website does not automatically compress artwork or generate smaller
versions.

Before adding files:

- Export appropriately sized, web-ready images.
- Preserve legibility of typography and design details.
- Avoid unnecessarily large originals.
- Consider separate previews and originals.
- Confirm you have permission to publish the work.

Do not put confidential client material in `images`. Files can be
published even when no visible page links to them.

### Understand thumbnail cropping

Homepage images fill square-cornered 4:3 frames using `object-fit: cover`.

This uses the minimum proportional scaling needed to fill the frame, but
it may crop edges when the source proportions differ.

Gallery images and Fit view preserve the full image proportions.

CSS does not remove colored backgrounds or blank borders already embedded
inside an image file. Those require editing the image itself.

### Use the viewer

- Select a gallery image to expand it.
- Use Previous/Next or left/right arrows in Fit view.
- Use 100% to explore a large image by scrolling.
- Use Original to open the image file in another tab.
- Use Escape or Close to dismiss the viewer.
- Command-click retains normal browser link behavior.

Without JavaScript, gallery links still open the image files normally.

---

## 7. Change colors and styling

Edit `assets/css/main.css`.

The intended palette is:

| Purpose | Color |
| --- | --- |
| Background | `#FFFFFF` |
| Primary text | `#202124` |
| Secondary text, for the agreed uniform charcoal treatment | `#202124` |
| Orange accent | `#C97945` |

Within the existing `:root` block, use:

```css
--paper: #FFFFFF;
--ink: #202124;
--muted: #202124;
--accent: #C97945;
```

Replace these individual entries, not the entire block. Keep the other
variables, including spacing, border, and font settings.

If the initial v5 stylesheet still has `--muted: #4B4B4B`, change that
value to `#202124` for consistently deep-charcoal text.

Editing this README does not make that CSS change automatically.

### Other appearance settings

The stylesheet has labeled sections for the header, homepage, projects,
footer, viewer, and responsive behavior.

For wording changes, edit content instead of CSS.

The site uses system sans-serif fonts and Georgia. There is no external
font service to install or configure.

Separate color locations:

- `assets/images/favicon.svg`: browser-tab icon.
- `_includes/head.html`: browser theme-color metadata.

These do not automatically inherit CSS variables.

Use the consolidated v5 stylesheet as a replacement. Do not layer an
older stylesheet or theme over it.

---

## 8. Add a regular page

For a non-project page, create `_pages/services.md`:

```markdown
---
layout: page
title: "Services"
permalink: /services/
description: "An overview of the design services available."
intro: "A short introduction to this page."
---

Write the page content here.
```

The `intro` is plain text. Use Markdown in the body.

The page exists at `/services/`, but navigation is not updated
automatically.

To add a navigation item, edit `_includes/header.html` and put a link
inside the existing `<nav>`:

```html
<a href="{{ '/services/' | relative_url }}">Services</a>
```

Keep the URL filter so the link also works on a subdirectory deployment.

Check the navigation at narrow screen widths after adding items.

---

## 9. Refresh the website on GitHub

Use the existing repository if you want to retain the existing website
address.

A normal design or content refresh does not require changing DNS or
purchasing another domain.

### Step 1: Back up the current website

Before replacing source:

- Save any uncommitted work.
- Make a backup copy or download the current repository ZIP.
- Record the existing Pages address and custom-domain setting.
- Record the publishing values from the old `_config.yml`.

Git history is also a backup, but only for committed files.

### Step 2: Open or clone the real repository

In GitHub Desktop:

- If already cloned, open the existing local repository.
- Otherwise, choose File → Clone Repository and select the current
  website repository.

Choose a local location under `~/Sites`, outside the preview folder.

For a brand-new website, create a repository on GitHub first, clone it,
then follow the source-copying steps below.

### Step 3: Get the latest source

Select `main`, fetch origin, and pull available changes.

Save or back up existing local work before switching branches.

This guide assumes `main` is the publishing branch. If yours has another
name, use that branch and update the workflow’s branch setting.

### Step 4: Create an update branch

Create a branch such as:

```text
redesign-v5
```

This lets you prepare the replacement without immediately updating the
publishing branch.

### Step 5: Copy the tested source into the repository

Copy the contents of the v5 preview into the actual repository root.

Do not copy the entire `portfolio-preview-v5` folder as a nested folder.

The repository root should contain:

```text
Gemfile
_config.yml
index.html
_projects/
.github/
```

In Finder, press Command+Shift+Period to reveal hidden files.

Include the supplied:

- `.github/workflows/pages.yml`
- `.gitignore`
- `.ruby-version`

Preserve the actual repository’s `.git` directory. It contains its history
and connection to GitHub.

Also preserve your artwork and any required `CNAME` file.

Do not copy:

- `_site`
- `.bundle`
- `vendor`
- Jekyll caches
- Another repository’s `.git` directory

Be careful with Finder’s Replace/Merge prompts. Do not replace the entire
repository folder or blindly discard unrelated files.

If `.github` already contains other useful workflows, update the Pages
workflow inside it rather than replacing all unrelated configuration.

Disable or remove an older competing Pages deployment workflow.

### Remove obsolete source

Copying new files does not delete old ones.

Explicitly remove `_projects/cerise.md` and any old standalone Cerise page.

Review other obsolete HTML or Markdown pages. Avoid keeping two source
files that generate the same address, such as both an old `index.md` and
the new `index.html`.

Confirm the intended deletions appear in GitHub Desktop’s Changes list.

### Step 6: Set the publishing address

Edit `_config.yml`.

`url` is the website’s origin, not its github.com repository address.
`baseurl` is an optional path beneath that origin.

For a project repository:

```yaml
url: "https://your-username.github.io"
baseurl: "/your-repository"
```

For a repository named `your-username.github.io`:

```yaml
url: "https://your-username.github.io"
baseurl: ""
```

For a custom domain served at its root:

```yaml
url: "https://www.example.com"
baseurl: ""
```

Replace the examples with your real settings. Usually neither value needs
a trailing slash.

Keep an existing custom domain configured in GitHub Pages settings.
Preserve its `CNAME` file if present.

The workflow gets its deployment base path from GitHub Pages.
The configured `url` supplies canonical and social-sharing origins.

### Step 7: Prepare dependencies for Mac and GitHub

Stop the separate preview server.

Open Terminal in the actual repository folder.

An easy Mac method:

1. Type `cd` followed by a space in Terminal.
2. Drag the repository folder from Finder into Terminal.
3. Press Return.

Then run:

```bash
bundle lock --add-platform x86_64-linux
bundle install
bundle exec jekyll build --trace
```

The supplied GitHub workflow builds on Ubuntu Linux. The platform command
records Linux dependency resolution in `Gemfile.lock`.

Use `x86_64-linux` even on an Apple Silicon Mac: it describes GitHub’s
runner, not your Mac.

Commit the generated or updated `Gemfile.lock`. Do not edit it by hand.

Now preview from the actual repository:

```bash
bundle exec jekyll serve --livereload
```

Use the server address printed in Terminal, including any configured
base path.

This avoids testing files in the preview folder while publishing different
files from the repository.

### Step 8: Configure GitHub Pages

On GitHub:

1. Open the repository.
2. Open Settings → Pages.
3. Under Build and deployment, select **GitHub Actions**.

Do not select “Deploy from a branch” for the supplied workflow.

Ensure GitHub Actions is enabled for the repository.

### Step 9: Commit and publish the branch

In GitHub Desktop:

1. Review the changed files.
2. Check that source, artwork, workflow, and `Gemfile.lock` are included.
3. Check that generated files and private material are excluded.
4. Enter a summary such as `Replace portfolio with v5`.
5. Commit to `redesign-v5`.
6. Publish the branch, or push it if already published.
7. Create a pull request targeting `main`.

A commit saves a local checkpoint. A push uploads commits to GitHub.

The supplied workflow does not create a staging website or automatically
test pull requests. Your local checks are important.

### Step 10: Merge and verify deployment

When ready, merge the pull request into `main`.

The workflow runs on pushes to `main`, including merges.

Open the repository’s Actions tab and find:

```text
Deploy portfolio to GitHub Pages
```

Wait for both build and deployment to succeed.

Then check the actual website. A successful build does not prove every
image path, crop, or piece of text is correct.

After merging, switch the local repository back to `main` and fetch/pull
the merged changes.

From then on, make ongoing edits in this repository copy—not the old
preview folder.

---

## 10. Publish later changes

You do not need to unpack the bundle again for ordinary edits.

### Recommended routine

1. Open the real repository.
2. Fetch and pull the latest `main`.
3. Create an update branch.
4. Start the local preview.
5. Edit and save with Command+S.
6. Check the affected pages.
7. Stop the server and run a build.
8. Commit and push.
9. Open and merge a pull request.
10. Check Actions and the live website.

Build command:

```bash
bundle exec jekyll build --trace
```

Useful commit summaries:

```text
Add new packaging project
Update About biography
Replace Dippsterz cover image
Correct Contact introduction
```

Text and image edits normally do not require `bundle install`.

Run it when setting up another computer or changing dependencies.

When intentionally updating dependencies, ensure the Linux platform remains
in the lockfile, then test and commit the updated `Gemfile.lock`.

Do not use `bundle update` as a routine website-refresh command. It changes
dependency versions.

### Small edits directly on GitHub

For a simple wording correction:

1. Open the source file on GitHub.
2. Choose Edit.
3. Make the correction.
4. Commit to a new branch.
5. Open and merge a pull request.

This does not provide a local visual preview. Prefer local editing for
layout changes or complex galleries.

Fetch and pull those remote edits before working locally again.

---

## 11. Test the website

### Content and appearance

- Backgrounds are white.
- The accent is `#C97945`.
- Text uses the intended charcoal treatment.
- “Brands that take flight” displays correctly.
- Homepage tiles have square corners and appropriate crops.
- Category descriptions, titles, and numbers remain visible.
- Homepage filters and thumbnail arrow overlays are absent.
- The promotional footer band is absent.
- About has the correct portrait and no photo caption.
- Contact has one correctly linked inline italic email.
- Project pages have the intended text and no removed gallery headings.
- Cerise Coffee is absent.
- The project list and ordering match your current content.

The initial v5 collection contains seven projects; naturally, that count
changes when you add or remove projects.

### Links and images

- No development placeholders appear.
- Homepage cards open the right projects.
- Gallery images load and expand.
- Previous, Next, Close, and 100% work.
- Next project wraps through the current collection.
- Home, About, and Contact navigation work.
- The email link opens your chosen email application.

### Mac browser checks

Check an up-to-date Safari and, if available, Chrome or Firefox.

Resize the browser to check narrower layouts. After publishing, also check
the site on a phone.

Use the keyboard:

- Tab through links and controls.
- Press Return on a gallery link.
- Press Escape to close the viewer.
- Confirm focus returns to the originating gallery link.
- Confirm normal page scrolling resumes.

If Safari skips links while tabbing, enable its “Press Tab to highlight
each item on a webpage” option in Safari Settings → Advanced.

Repeat a quick check on the published website, not only locally.

---

## 12. Mac troubleshooting

### Terminal cannot find `brew`

Finish Homebrew’s printed “Next steps” for adding it to your PATH.

Reopen Terminal and check:

```bash
brew --version
```

Do not install multiple competing Homebrew copies to solve a PATH issue.

### Ruby is still Apple’s system Ruby

Check:

```bash
ruby -v
command -v ruby
```

If the path is `/usr/bin/ruby`, the intended Homebrew Ruby is not first
in PATH.

Review the one-time Ruby setup above and reopen Terminal.

If you already use a Ruby version manager, select the project’s Ruby
through that manager instead of mixing setups.

### A version manager says `3.3` is not installed

Some managers require an exact installed patch version.

Select your installed Ruby 3.3.x release and, if needed, put that exact
version in `.ruby-version`.

This is generally not necessary for the Homebrew-only setup above.

### “Could not locate Gemfile”

Terminal is in the wrong folder.

Use `cd` followed by a space, drag the correct website folder into
Terminal, and press Return.

The folder must contain `Gemfile`.

### A native dependency fails to install

Check that:

- Ruby reports 3.3.x.
- Apple’s Command Line Tools installation finished.
- You are using the intended Ruby installation.

Read the first useful error in Terminal. Do not randomly change
dependencies or add `sudo`.

### The unpacker refuses to run

Check:

- Script and bundle are beside each other.
- Filenames have no accidental extra extension.
- The bundle has intact markers and no surrounding Markdown fences.
- File blocks are not duplicated.
- `portfolio-preview-v5` does not already exist.

### Missing images or placeholders

Check:

- Real artwork was copied.
- Paths begin with `/images/`.
- Names, capitalization, and extensions match exactly.
- There is no accidental `images/images/` folder.
- Artwork was committed and pushed.

The placeholder is a development aid, not portfolio artwork.

### Old styling or colors still appear

Check:

1. Are you serving the right folder?
2. Are you viewing the right port?
3. Did you save the file?
4. Are you viewing the local preview or public website?
5. Did the public deployment finish successfully?
6. Does `_includes/head.html` load the v5 stylesheet?

Try a fresh reload:

- Safari: Option+Command+R.
- Chrome or Firefox: Command+Shift+R.

A private/incognito window is another useful check.

Colors embedded inside artwork are not controlled by CSS.

### Configuration changes do not appear

Stop Jekyll with Control+C, then restart it.

Changes to `_config.yml` require a restart.

### Port 4000 or LiveReload is already in use

Stop the other server or run:

```bash
bundle exec jekyll serve --livereload --port 4001 --livereload-port 35730
```

Open the matching port.

### YAML or front-matter errors

Check the file named in the error.

Common causes:

- Missing closing `---`.
- Tabs instead of spaces.
- Incorrect gallery indentation.
- Colons inside unquoted text.
- Missing or mismatched quotation marks.

Compare with a working project file.

### Generated output seems stale

Stop the server, then run:

```bash
bundle exec jekyll clean
bundle exec jekyll build --trace
bundle exec jekyll serve --livereload
```

`jekyll clean` removes generated output and caches, not source content or
artwork.

### The Mac build works, but GitHub reports a platform mismatch

In the actual repository, run:

```bash
bundle lock --add-platform x86_64-linux
bundle install
bundle exec jekyll build --trace
```

Commit and push the updated `Gemfile.lock`.

Do not replace the Mac platform entry manually. Bundler manages the
platform list.

### Images or styles work locally but not publicly

Check:

- Filename capitalization.
- `url` and `baseurl`.
- GitHub Pages settings.
- Whether the actual files were committed.
- Whether internal links retain the supplied URL-filter patterns.

Do not hardcode the repository name into image paths.

### Nothing deploys after pushing

Check:

- The update reached `main`, not only a working branch.
- `.github/workflows/pages.yml` is present.
- GitHub Actions is enabled.
- Pages uses GitHub Actions as its source.
- The workflow names the correct publishing branch.

Hidden-file copying is a common source of missing workflows on a Mac.

### A deployment fails

Open Actions, select the failed run, then inspect the failed step.

Read the first useful error rather than only the final exit-status line.

Fix the source or settings and push another commit.

Do not edit `_site` as a deployment repair.

---

## 13. Roll back a change

Git history lets you restore a previous version without deleting the
repository.

### Revert a merged pull request

On GitHub, open the merged pull request and look for **Revert**.

When available, it creates another pull request reversing that change.

Review and merge the revert. The workflow publishes the restored source.

If GitHub cannot create the revert because of conflicts, do not force a
history rewrite. Restore the required files from a known-good version or
backup and commit that restoration normally.

### Restore from a backup

Restore the affected source files, preview them, commit, and publish
through the normal workflow.

Do not replace `.git` or delete the repository.

Avoid force-pushing or hard-resetting published history unless you fully
understand the consequences.

### Keep maintenance simple

- Use one clear repository folder for ongoing work.
- Keep local development outside automatically synchronized cloud folders.
- Make small, descriptive commits.
- Preview before publishing.
- Keep artwork backups.
- Never commit passwords, access tokens, or confidential client material.
- Treat dependency upgrades separately from content edits.
- Keep Ruby settings consistent when intentionally upgrading the project.

The website has no contact-form backend, analytics, database, or external
font service. Contact is handled through an email link.
