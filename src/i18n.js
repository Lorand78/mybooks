import { createI18n } from "vue-i18n";

function getStartingLocale() {
  //browser nyelv vagy a letárolt kiválasztott nyelv indulaskor
  let blocale = sessionStorage.getItem("Faktori-currentLang");
  if (blocale) {
    console.log("Starting Locale stored", blocale);
    return blocale;
  } else {
    console.log("Starting Locale browser", navigator.language);
    blocale = navigator.language;
    return blocale === "sr-RS" ? blocale : blocale.split("-")[0];
  }
  // return import.meta.env.VITE_I18N_LOCALE || "hu";
}

const i18n = createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  //messages: initMessages(),
  // silentTranslationWarn: true,
  // silentFallbackWarn: true,
  fallbackWarn: false,
  missingWarn: false,
});

export default i18n;
