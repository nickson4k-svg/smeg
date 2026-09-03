/**
 * SMEG Repair Cost Calculator
 * Інтерактивний калькулятор орієнтовної вартості ремонту побутової техніки SMEG
 */

const REPAIR_DATA = {
  washing: {
    name: "Пральна машина",
    basePrice: 450,
    issues: [
      { id: "drain", name: "Не зливає воду / гуде помпа", price: 650 },
      { id: "heat", name: "Не гріє воду (заміна ТЕНа)", price: 850 },
      { id: "spin", name: "Не віджимає / шумить барабан", price: 950 },
      { id: "bearing", name: "Заміна підшипників барабана", price: 1800 },
      { id: "electronics", name: "Помилка на дисплеї / модуль керування", price: 1400 },
      { id: "leak", name: "Протікає вода знизу / з манжети", price: 600 }
    ]
  },
  fridge: {
    name: "Холодильник / Морозильник",
    basePrice: 500,
    issues: [
      { id: "cold", name: "Не холодить / тече", price: 800 },
      { id: "freon", name: "Заправка фреоном R600a / усунення витоку", price: 1450 },
      { id: "sensor", name: "Заміна термостата / датчика температури", price: 750 },
      { id: "compressor", name: "Заміна інверторного компресора SMEG", price: 2600 },
      { id: "nofrost", name: "Не працює система No Frost / вентилятор", price: 950 },
      { id: "board", name: "Ремонт електронної плати інвертора", price: 1600 }
    ]
  },
  dishwasher: {
    name: "Посудомийна машина",
    basePrice: 450,
    issues: [
      { id: "wash", name: "Погано миє посуд / не крутяться розпилювачі", price: 600 },
      { id: "dw_heat", name: "Не нагріває воду (ТЕН / циркуляційний насос)", price: 1100 },
      { id: "aquastop", name: "Спрацював захист AquaStop / тече", price: 750 },
      { id: "pump", name: "Не зливає брудну воду / блокування помпи", price: 650 },
      { id: "tablets", name: "Не відкриває відсік для таблетки/порошку", price: 550 },
      { id: "dw_board", name: "Помилка програми / індикація поломки", price: 1350 }
    ]
  },
  oven: {
    name: "Духова шафа",
    basePrice: 400,
    issues: [
      { id: "oven_heat", name: "Не гріє верхній або нижній ТЕН / гриль", price: 750 },
      { id: "convection", name: "Не працює конвекційний вентилятор", price: 800 },
      { id: "door", name: "Не щільно закриваються дверцята / скло", price: 600 },
      { id: "thermo", name: "Не тримає задану температуру (термостат)", price: 700 },
      { id: "oven_board", name: "Збій електронного таймера / модуля", price: 1200 }
    ]
  },
  hob: {
    name: "Варильна / Індукційна поверхня",
    basePrice: 450,
    issues: [
      { id: "ind_not_on", name: "Не вмикається / не реагує на сенсор", price: 900 },
      { id: "zone", name: "Не працює одна або кілька конфорок", price: 850 },
      { id: "error_e", name: "Блимає помилка E / блокування поверхні", price: 1100 },
      { id: "power_board", name: "Ремонт силового блоку індукції", price: 1650 },
      { id: "glass", name: "Заміна або перепідключення склокераміки", price: 700 }
    ]
  },
  coffee: {
    name: "Кавомашина SMEG",
    basePrice: 350,
    issues: [
      { id: "coffee_water", name: "Не тече кава / помпа не качає воду", price: 650 },
      { id: "grinder", name: "Не меле зерна / блокування жорнів", price: 800 },
      { id: "boiler", name: "Кава холодна / протікає бойлер", price: 950 },
      { id: "infuser", name: "Заклинило заварювальний блок (інфузор)", price: 700 },
      { id: "service", name: "Комплексне ТО, декальцинація та заміна ущільнювачів", price: 850 }
    ]
  }
};

let currentCategory = "washing";
let selectedIssues = [];

function initCalculator() {
  const catChips = document.querySelectorAll(".calc-cat-chip");
  const issuesContainer = document.getElementById("calc-issues-container");
  const priceDisplay = document.getElementById("calc-price-value");
  const calcOrderBtn = document.getElementById("calc-order-btn");

  if (!issuesContainer) return;

  function renderIssues(catKey) {
    currentCategory = catKey;
    selectedIssues = [];
    issuesContainer.innerHTML = "";

    const catData = REPAIR_DATA[catKey];
    if (!catData) return;

    catData.issues.forEach((issue, index) => {
      const chip = document.createElement("div");
      chip.className = `calc-chip calc-issue-chip ${index === 0 ? "selected" : ""}`;
      chip.textContent = issue.name;
      chip.dataset.issueId = issue.id;

      if (index === 0) {
        selectedIssues.push(issue.id);
      }

      chip.addEventListener("click", () => {
        if (chip.classList.contains("selected")) {
          // don't deselect if it's the only one
          if (selectedIssues.length > 1) {
            chip.classList.remove("selected");
            selectedIssues = selectedIssues.filter(id => id !== issue.id);
          }
        } else {
          chip.classList.add("selected");
          selectedIssues.push(issue.id);
        }
        updatePrice();
      });

      issuesContainer.appendChild(chip);
    });

    updatePrice();
  }

  function updatePrice() {
    const catData = REPAIR_DATA[currentCategory];
    if (!catData) return;

    let total = catData.basePrice;
    selectedIssues.forEach(issueId => {
      const found = catData.issues.find(i => i.id === issueId);
      if (found) {
        total += found.price;
      }
    });

    if (priceDisplay) {
      priceDisplay.innerHTML = `від <span>${total}</span> грн`;
    }
  }

  // Category switch listeners
  catChips.forEach(chip => {
    chip.addEventListener("click", () => {
      catChips.forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      const cat = chip.dataset.category;
      renderIssues(cat);
    });
  });

  // Action button: open modal with prefilled data
  if (calcOrderBtn) {
    calcOrderBtn.addEventListener("click", () => {
      const catData = REPAIR_DATA[currentCategory];
      const issueNames = selectedIssues.map(id => {
        const item = catData.issues.find(i => i.id === id);
        return item ? item.name : "";
      }).filter(Boolean).join(", ");

      const deviceInput = document.getElementById("modal-device-type") || document.getElementById("quick-device-type");
      const descInput = document.getElementById("modal-problem-desc") || document.getElementById("quick-problem-desc");

      if (deviceInput) {
        deviceInput.value = catData.name;
      }
      if (descInput) {
        descInput.value = `Попередня оцінка (${priceDisplay ? priceDisplay.textContent.trim() : ""}): ${issueNames}`;
      }

      if (window.openQuickModal) {
        window.openQuickModal();
      }
    });
  }

  // Initial render
  renderIssues("washing");
}

document.addEventListener("DOMContentLoaded", initCalculator);
