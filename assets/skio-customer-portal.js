(async () => {
  // Select the node that will be observed for mutations
  const targetNode = document;

  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    if (window.location.pathname.includes("/login")) {
      const alternativeLogin = document.querySelector(
        'a[href="/account/login?return_url=/a/account/shopify-login"]'
      );
      if (alternativeLogin) {
        alternativeLogin.innerText =
          "Having trouble getting your login code? Click here to contact customer support";
        alternativeLogin.href = "mailto:info@purdyandfigg.com";
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
