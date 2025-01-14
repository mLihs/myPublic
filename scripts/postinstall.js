const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.MY_PACKAGE_API_KEY;  // API-Key aus Umgebungsvariablen
const PRIVATE_REPO = "git@github.com:mlihs/myprivate.git";
const CLONE_DIR = path.join(__dirname, "../private-assets");
const TARGET_DIR = path.join(__dirname, "../assets");

if (API_KEY) {
    console.log("🔒 API-Key gefunden! Lade geschützte Markenelemente aus privatem Repository...");

    exec(`git clone --depth 1 ${PRIVATE_REPO} ${CLONE_DIR}`, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Fehler beim Klonen des privaten Repos:", error);
            return;
        }

        console.log("✅ Geschützte Markenelemente erfolgreich geladen!");

        // Geschützte Dateien in den `assets`-Ordner kopieren
        fs.readdirSync(CLONE_DIR + "/assets").forEach(file => {
            fs.copyFileSync(path.join(CLONE_DIR, "assets", file), path.join(TARGET_DIR, file));
        });

        console.log("✅ Branding erfolgreich installiert!");

        // Private Daten entfernen, um sie nicht lokal zu speichern
        exec(`rm -rf ${CLONE_DIR}`, () => {
            console.log("🧹 Private Daten gelöscht!");
        });
    });
} else {
    console.log("⚠ Kein API-Key angegeben. Standardversion bleibt erhalten.");
}