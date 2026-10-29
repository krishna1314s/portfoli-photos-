# Krishna, photography

A scroll-driven photography portfolio where the page moves from morning to night.

## Run it
1. Open this folder in VS Code (File > Open Folder).
2. Install the recommended **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also double-click `index.html`. No build step.

## Page structure
1. **Behind the camera**: opens on the mirror selfie. Scrolling zooms into the phone camera, and the lens opens into the first photo
2. **Index**: short statement and a contents list linking to each chapter
3. **Chapters** (Morning, Midday, Golden hour, Night): sticky title on the left, photos on the right
4. **Footer**

## Files
- `index.html`: page structure
- `css/style.css`: colours, type and layout
- `js/data.js`: name, intro text, photos and chapters (edit this to change content)
- `js/main.js`: builds the page, scroll effects and the full-screen viewer
- `images/`: photo files

## Edit the text
In `js/data.js`: `about` (opening text), `lead` (line shown after the lens opens), `introTitle` and `intro`.

If you swap the selfie, update `LENS` at the top of `js/main.js` (where the phone camera sits, as a fraction of the image).

## Add photos
1. Copy the image into `images/` (about 1500px on the long edge).
2. In `js/data.js`, add an entry under `imgs` with `src`, `w`, `h` and `alt`.
3. Add its key to a chapter's `photos` list.

## Change the day colours
In `js/main.js`, edit the `T` object: background, text colour and sun colour per chapter.
