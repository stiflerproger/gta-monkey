(async function () {
  const Selectors = {
    menuBattle: "#battle-navigation",
    menuUpgrades: "#upgrades-navigation",
    menuLeaderboard: "#leaderboard-navigation",
    menuReferrals: "#referrals-navigation",
    energyPercentage: ".battle__footer-energy-percentage",
    enemySpine: ".battle__player-container",
    cyclePopup: "#CyclePopup",
  };

  const fightEndReasons = {
    noEnergy: 1,
    allEnemiesKilled: 2,
  };

  await waitForElement(".battle__player-container");

  await fight();

  async function fight() {
    await goto("battle");

    await waitForElement(Selectors.enemySpine);

    let energy = await getEnergy();

    const enemyCoords = getSelectorCoords(Selectors.enemySpine);

    while (energy > 0) {
      (await waitForElement(Selectors.enemySpine)).dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: enemyCoords.x,
          clientY: enemyCoords.y,
        }),
      );

      await sleep(randomInt(50, 250));

      energy = await getEnergy();
    }

    if (!energy) return fightEndReasons.noEnergy;

    return 0;
  }

  function getSelectorCoords(selector) {
    const coords = document.querySelector(selector).getBoundingClientRect();

    return {
      x: randomInt(
        Math.floor(coords.left + 1),
        Math.floor(coords.left + coords.width - 1),
      ),
      y: randomInt(
        Math.floor(coords.top + 1),
        Math.floor(coords.top + coords.height - 1),
      ),
    };
  }

  async function getEnergy() {
    await waitForElement(Selectors.energyPercentage);

    return parseInt(
      document.querySelector(Selectors.energyPercentage).innerText,
    );
  }

  async function goto(page) {
    if (page === "battle") {
      await waitForElementAndClick(Selectors.menuBattle);
    }
  }

  async function waitForElement(selector) {
    while (true) {
      if (document.querySelector(selector)) {
        return document.querySelector(selector);
      }

      await sleep(500);
    }
  }

  async function waitForElementAndClick(selector) {
    const el = await waitForElement(selector);
    el.click();
    await sleep(1000);
  }

  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();
