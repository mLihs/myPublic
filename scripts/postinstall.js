const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GIT_TOKEN = process.env.GIT_TOKEN; // PAT aus Umgebungsvariable
const GIT_USER = "mlihs"; // Dein GitHub-Username
const PRIVATE_REPO = `https://${GIT_USER}:${GIT_TOKEN}@github.com/mlihs/myprivate.git`; // Private Repo URL
const CLONE_DIR = path.join(__dirname, "../private-assets");
const TARGET_DIR = path.join(__dirname, "../assets");

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`🧹 Gelöscht: ${folderPath}`);
    }
}

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.lstatSync(srcPath);

        if (stat.isDirectory()) {
            copyRecursiveSync(srcPath, destPath);
        } else if (stat.isSymbolicLink()) {
            console.warn(`⚠ Symbolischer Link ignoriert: ${srcPath}`);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

if (GIT_TOKEN) {
    console.log("🔒 GitHub/GitLab Token gefunden! Lade geschützte Markenelemente...");

    // 🛑 Lösche vorheriges `private-assets` Verzeichnis, falls vorhanden
    deleteFolderRecursive(CLONE_DIR);

    try {
        execSync(`git clone --depth 1 ${PRIVATE_REPO} ${CLONE_DIR}`, { stdio: "inherit" });
        console.log("✅ Geschützte Markenelemente erfolgreich geladen!");

        // 🛑 Entferne den Token aus der Umgebung, damit er nicht mehr verfügbar ist
        delete process.env.GIT_TOKEN;

        copyRecursiveSync(path.join(CLONE_DIR, "assets"), TARGET_DIR);
        console.log("✅ Branding erfolgreich installiert!");

        // 🛑 Lösche das geklonte Repo nach dem Kopieren
        deleteFolderRecursive(CLONE_DIR);
    } catch (error) {
        console.error("❌ Fehler beim Klonen des privaten Repos:", error.message);
    }
} else {
    console.log("⚠ Kein GitHub/GitLab Token angegeben. Standardversion bleibt erhalten.");
}
