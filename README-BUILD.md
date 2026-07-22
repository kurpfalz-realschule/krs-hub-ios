# KRS Hub iOS — Build-Runbook (macOS)

Nativer Capacitor-Wrapper um die Live-PWA. Dieses Runbook läuft **auf Norberts Mac**
(Xcode nötig). Reihenfolge strikt einhalten. Architektur-Begründung: siehe
`../ARCHITEKTUR-IOS-NATIVE-2026-07-22.md`.

> **Sicherheitsgrenze:** Zertifikate, Provisioning-Profile, `.p12`/`.p8`-Keys,
> `.ipa` gehören **nie** ins Git-Repo (per `.gitignore` gesperrt). Passwörter/PINs
> tippt nur Norbert selbst.

---

## Schritt 0 — Voraussetzungen prüfen (Blocker zuerst)

- [ ] **Xcode** aktuell? Apple verlangt für Uploads regelmäßig eine Mindest-Xcode-/SDK-Version
      (zuletzt Xcode 26). Im App Store aktualisieren, falls nötig.
- [ ] **Apple Developer Program** aktiv (99 €/Jahr)?
- [ ] **Apple School Manager (ASM)** vorhanden und Custom-App-Schiene nutzbar? →
      **vorab mit Nils/Schulträger klären** (das ist der wahrscheinlichste Blocker).
- [ ] Node ≥ 20 installiert (`node -v`).

## Schritt 1 — Projekt initialisieren

```bash
cd "/Users/nk/Downloads/Codex playground/teams 2.0 update macbook pro/krs-hub-ios" && npm install && npx cap add ios --skip-appid-validation && npm run assets
```

Das erzeugt den Ordner `ios/` (Xcode-Projekt) und generiert App-Icons + Splash aus
`resources/`. `www/` ist bereits vorhanden (Offline-Fallback).

> **`--skip-appid-validation` ist Absicht, kein Workaround-Risiko:** Die App-ID
> `de.realschule-schriesheim.krshub` enthält einen Bindestrich (aus der echten
> Schul-Domain). Apple erlaubt Bindestriche in iOS-Bundle-IDs, Capacitors
> Validierung prüft aber zusätzlich nach den strengeren Android/Java-Regeln
> (keine Bindestriche) — irrelevant hier, da dieses Projekt bewusst **iOS-only**
> ist. Xcode validiert die Bundle-ID in Schritt 2 ohnehin ein zweites Mal.

## Schritt 2 — Xcode-Projekt-Einstellungen

```bash
npx cap open ios
```

In Xcode (Target „App" → Signing & Capabilities / General):
- [ ] **Bundle Identifier** = `de.realschule-schriesheim.krshub`
- [ ] **Team** = Apple-Developer-Team der Schule wählen (Automatic Signing)
- [ ] **Minimum Deployments** = iOS 15.0
- [ ] **Display Name** = `KRS Hub`
- [ ] Icons/Splash sichtbar (aus Schritt 1)

## Schritt 3 — Auf echtem iPad testen (VOR Verteilung — Live-Gang-Protokoll)

iPad per Kabel, in Xcode als Ziel wählen, ▶︎ Run. Checkliste:
- [ ] App startet, Splash in Slate, dann **Live-Hub** sichtbar
- [ ] Login funktioniert, Connect-Chat senden/empfangen
- [ ] **Externer Link** (Untis/Nextcloud/Outlook) öffnet im Safari-Sheet und lässt
      sich schließen — **setzt Hub-Shim N4 voraus** (siehe Sonnet-Sprint)
- [ ] App in Hintergrund + zurück: Session bleibt
- [ ] Flugmodus beim Start → freundliche Offline-Seite statt weißem Bildschirm
- [ ] `git push` im Hub-Repo → nach Reload neue Version in der App sichtbar

## Schritt 4 — Archive & Upload als Custom App (ASM)

- [ ] Xcode → Product → **Archive**
- [ ] Distribute App → **Custom** (Apple School Manager), Upload
- [ ] In ASM die App der Organisation freigeben (Review 1–2 Tage abwarten)

## Schritt 5 — Jamf-Zuweisung

- [ ] In Jamf die Custom App der **Lehrer-iPad-Gruppe** zuweisen (wie bisher der Web-Clip)
- [ ] Nach erfolgreichem nativen Roll-out: **alten Jamf-Web-Clip zurückziehen**, damit
      nur ein Icon existiert (sonst zwei „KRS Hub" auf dem Homescreen)

## Wiederkehrende Pflicht (Kalender-Erinnerung!)

- [ ] **Distribution-Zertifikat + Provisioning-Profil laufen jährlich ab** → rechtzeitig
      erneuern, sonst startet die App nicht mehr. Erinnerung ~1 Monat vorher setzen.
