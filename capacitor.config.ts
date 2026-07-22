import type { CapacitorConfig } from '@capacitor/cli';

/**
 * KRS Hub — nativer iOS-Wrapper (Capacitor 8)
 *
 * KERNENTSCHEIDUNG: `server.url` zeigt auf die LIVE-PWA.
 * Dadurch bleibt der wichtigste Vorteil erhalten — `git push` = sofort live
 * fuer ALLE Nutzer. Nur die native Huelle (dieses Projekt) durchlaeuft das
 * Apple-Review; der App-INHALT wird weiter ueber das bestehende
 * Test-&-Deploy-Gate des Hub-Repos aktualisiert.
 *
 * WICHTIG: Diese Datei ist die einzige Stelle mit der Ziel-URL. Fuer eine
 * andere Schule (Whitelabel) nur appId, appName und server.url tauschen.
 */
const HUB_LIVE_URL = 'https://kurpfalz-realschule.github.io/krs-hub/';

const config: CapacitorConfig = {
  // Reverse-DNS der Schul-Domain. In Apple Developer / ABM identisch anlegen.
  // KORRIGIERT (22.07.2026): urspruengliche appId "de.realschule-schriesheim.krshub"
  // hatte einen Bindestrich (aus "realschule-schriesheim.de"). Apple erlaubt das fuer
  // iOS-Bundle-IDs, aber Capacitors "cap add ios" lehnt es nach den strengeren
  // Android/Java-Package-Regeln hart ab (kein Bindestrich) — es gibt dafuer KEIN
  // Skip-Flag auf "cap add" (nur auf "cap init", das hier nicht verwendet wird, da
  // capacitor.config.ts schon existiert). Deshalb Bindestrich entfernt statt versucht
  // zu umgehen. Diese ID ist noch nirgends in Apple Developer/ASM registriert
  // gewesen (Schritt N2 stand noch aus) — Korrektur war gefahrlos.
  appId: 'de.realschuleschriesheim.krshub',
  appName: 'KRS Hub',

  // Lokales Fallback-Buendel (Offline-/Review-Shell). Wird nur genutzt, wenn
  // server.url beim Start nicht erreichbar ist bzw. vom Apple-Reviewer offline.
  webDir: 'www',

  server: {
    // Remote-Content: die App zeigt die Live-PWA an.
    url: HUB_LIVE_URL,
    // Nur HTTPS zulassen — kein Cleartext (Sicherheit / ATS).
    cleartext: false,
    // Nur diese Origin darf im Haupt-WebView geladen werden; alle externen
    // Links (Untis, Nextcloud, Outlook) muessen ueber @capacitor/browser in
    // ein SFSafariViewController geleitet werden. Der noetige Shim laeuft IN
    // der PWA (remote Origin) und wird daher im Hub-Repo ergaenzt — siehe
    // Sonnet-Sprint Aufgabe N4 (Detektion via window.Capacitor).
    allowNavigation: ['kurpfalz-realschule.github.io']
  },

  ios: {
    // Capacitor 8: iOS-Mindestziel 15.0 (im Xcode-Projekt setzen).
    contentInset: 'always',
    // Ueberscroll-/Bounce des WebViews aus — wirkt „nativer".
    scrollEnabled: true,
    // Verhindert versehentliche Textauswahl-Long-Press-Menues auf UI-Elementen
    // (die PWA ist kein Dokument). Bei Bedarf im Test anpassen.
    limitsNavigationsToAppBoundDomains: false
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#1e293b', // Slate — identisch zum maskable-Icon-Hintergrund
      showSpinner: false,
      iosSpinnerStyle: 'small'
    }
  }
};

export default config;
