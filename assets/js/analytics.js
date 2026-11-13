(() => {
  const code = document.currentScript.dataset.goatcounterCode;
  if (!["moini.org", "www.moini.org"].includes(window.location.hostname)) return;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(code)) return;

  const script = document.createElement("script");
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  script.async = true;
  document.head.append(script);
})();
