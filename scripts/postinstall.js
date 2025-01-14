const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIT_TOKEN = process.env.GIT_TOKEN;  // Personal Access Token (PAT)
const GIT_USER = "mlihs";  // Dein GitHub/GitLab-Username
const PRIVATE_REPO = `https://${GIT_USER}:${GIT_TOKEN}@github.com/mein-unternehmen/my-package-private.git`;  // Private Repo URL
const CLONE_DIR = path.join(__dirname, "../private-assets");
const TARGET_DIR = path.join(__dirname, "../assets");

if (GIT_TOKEN) {
    console.log("🔒 GitHub/GitLab Token gefunden! Lade geschützte Markenelemente...");

    exec(`git clone --depth 1 ${PRIVATE_REPO} ${CLONE_DIR}`, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Fehler beim Klonen des privaten Repos:", error);
            return;
        }

        console.log("✅ Geschützte Markenelemente erfolgreich geladen!");

        // Geschützte Dateien in den `assets`-Ordner kopieren
        fs.readdirSync(path.join(CLONE_DIR, "assets")).forEach(file => {
            fs.copyFileSync(path.join(CLONE_DIR, "assets", file), path.join(TARGET_DIR, file));
        });

        console.log("✅ Branding erfolgreich installiert!");

        // Private Daten löschen
        exec(`rm -rf ${CLONE_DIR}`, () => {
            console.log("🧹 Private Daten gelöscht!");
        });
    });
} else {
    console.log("⚠ Kein Git-Token angegeben. Standardversion bleibt erhalten.");
}
