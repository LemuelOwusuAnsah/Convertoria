(function() {
    const CATEGORIES = {
        length: {
            label: "📐 Length",
            units: {
                meters: { label: "Meters", toBase: 1 },
                kilometers: { label: "Kilometers", toBase: 1000 },
                miles: { label: "Miles", toBase: 1609.344 },
                feet: { label: "Feet", toBase: 0.3048 },
                inches: { label: "Inches", toBase: 0.0254 },
                yards: { label: "Yards", toBase: 0.9144 },
                centimeters: { label: "Centimeters", toBase: 0.01 },
                millimeters: { label: "Millimeters", toBase: 0.001 }
            }
        },
        weight: {
            label: "⚖️ Weight",
            units: {
                kilograms: { label: "Kilograms", toBase: 1 },
                grams: { label: "Grams", toBase: 0.001 },
                pounds: { label: "Pounds", toBase: 0.453592 },
                ounces: { label: "Ounces", toBase: 0.0283495 },
                tons: { label: "Tons", toBase: 1000 },
                milligrams: { label: "Milligrams", toBase: 0.000001 }
            }
        },
        temperature: {
            label: "🌡️ Temperature",
            units: {
                celsius: { label: "Celsius", toBase: 1 },
                fahrenheit: { label: "Fahrenheit", toBase: 1 },
                kelvin: { label: "Kelvin", toBase: 1 }
            },
            isSpecial: true
        },
        area: {
            label: "📏 Area",
            units: {
                square_meters: { label: "Square Meters", toBase: 1 },
                square_feet: { label: "Square Feet", toBase: 0.092903 },
                square_yards: { label: "Square Yards", toBase: 0.836127 },
                acres: { label: "Acres", toBase: 4046.86 },
                hectares: { label: "Hectares", toBase: 10000 },
                square_kilometers: { label: "Square Kilometers", toBase: 1000000 }
            }
        },
        volume: {
            label: "🧊 Volume",
            units: {
                liters: { label: "Liters", toBase: 1 },
                milliliters: { label: "Milliliters", toBase: 0.001 },
                gallons: { label: "Gallons (US)", toBase: 3.78541 },
                quarts: { label: "Quarts (US)", toBase: 0.946353 },
                pints: { label: "Pints (US)", toBase: 0.473176 },
                cups: { label: "Cups", toBase: 0.236588 },
                fluid_ounces: { label: "Fluid Ounces", toBase: 0.0295735 }
            }
        },
        speed: {
            label: "🚀 Speed",
            units: {
                kmh: { label: "KM/H", toBase: 1 },
                mph: { label: "MPH", toBase: 1.60934 },
                knots: { label: "Knots", toBase: 1.852 },
                ms: { label: "M/S", toBase: 3.6 },
                fts: { label: "FT/S", toBase: 1.09728 }
            }
        },
        time: {
            label: "⏱️ Time",
            units: {
                seconds: { label: "Seconds", toBase: 1 },
                minutes: { label: "Minutes", toBase: 60 },
                hours: { label: "Hours", toBase: 3600 },
                days: { label: "Days", toBase: 86400 },
                weeks: { label: "Weeks", toBase: 604800 },
                years: { label: "Years", toBase: 31536000 }
            }
        },
        data: {
            label: "💾 Data",
            units: {
                bytes: { label: "Bytes", toBase: 1 },
                kilobytes: { label: "Kilobytes", toBase: 1024 },
                megabytes: { label: "Megabytes", toBase: 1048576 },
                gigabytes: { label: "Gigabytes", toBase: 1073741824 },
                terabytes: { label: "Terabytes", toBase: 1099511627776 }
            }
        }
    };

    const DOM = {
        categorySelect: document.getElementById('categorySelect'),
        fromValue: document.getElementById('fromValue'),
        toValue: document.getElementById('toValue'),
        fromUnit: document.getElementById('fromUnit'),
        toUnit: document.getElementById('toUnit'),
        swapBtn: document.getElementById('swapBtn'),
        copyBtn: document.getElementById('copyBtn'),
        clearBtn: document.getElementById('clearBtn'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        historyList: document.getElementById('historyList'),
        historyCount: document.getElementById('historyCount'),
        quickBtns: document.querySelectorAll('.quick-btn'),
        themeToggle: document.getElementById('themeToggle')
    };

    let history = [];
    let currentCategory = 'length';
    let isConverting = false;

    const STORAGE_KEY = 'convertoria_history';

    function loadHistory() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                history = JSON.parse(saved);
                renderHistory();
            }
        } catch (e) {}
    }

    function saveHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {}
    }

    function renderHistory() {
        DOM.historyList.innerHTML = '';
        if (history.length === 0) {
            DOM.historyList.innerHTML = '<div class="empty-history">No conversions yet</div>';
            DOM.historyCount.textContent = '0 entries';
            return;
        }

        DOM.historyCount.textContent = history.length + ' entries';

        history.slice().reverse().forEach(function(item, index) {
            const div = document.createElement('div');
            div.className = 'history-item';

            const valueSpan = document.createElement('span');
            valueSpan.className = 'h-value';
            valueSpan.textContent = item.fromValue + ' ' + item.fromUnit + ' =';

            const conversionSpan = document.createElement('span');
            conversionSpan.className = 'h-conversion';
            conversionSpan.textContent = item.toValue + ' ' + item.toUnit;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'h-delete';
            deleteBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
            deleteBtn.setAttribute('aria-label', 'Delete entry');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const realIndex = history.length - 1 - index;
                history.splice(realIndex, 1);
                saveHistory();
                renderHistory();
            });

            div.appendChild(valueSpan);
            div.appendChild(conversionSpan);
            div.appendChild(deleteBtn);
            DOM.historyList.appendChild(div);
        });
    }

    function addToHistory(fromVal, fromUnit, toVal, toUnit) {
        history.push({
            fromValue: fromVal,
            fromUnit: fromUnit,
            toValue: toVal,
            toUnit: toUnit
        });
        if (history.length > 50) {
            history.shift();
        }
        saveHistory();
        renderHistory();
    }

    function populateCategories() {
        DOM.categorySelect.innerHTML = '';
        Object.keys(CATEGORIES).forEach(function(key) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = CATEGORIES[key].label;
            if (key === currentCategory) opt.selected = true;
            DOM.categorySelect.appendChild(opt);
        });
    }

    function populateUnits(categoryKey) {
        const category = CATEGORIES[categoryKey];
        const units = category.units;

        DOM.fromUnit.innerHTML = '';
        DOM.toUnit.innerHTML = '';

        Object.keys(units).forEach(function(key) {
            const opt1 = document.createElement('option');
            opt1.value = key;
            opt1.textContent = units[key].label;
            DOM.fromUnit.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = key;
            opt2.textContent = units[key].label;
            DOM.toUnit.appendChild(opt2);
        });

        const keys = Object.keys(units);
        if (keys.length > 0) {
            DOM.fromUnit.value = keys[0];
            DOM.toUnit.value = keys.length > 1 ? keys[1] : keys[0];
        }
    }

    function getUnitLabel(categoryKey, unitKey) {
        return CATEGORIES[categoryKey].units[unitKey]?.label || unitKey;
    }

    function convertTemperature(value, fromUnit, toUnit) {
        let celsius;
        if (fromUnit === 'celsius') celsius = value;
        else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5 / 9;
        else if (fromUnit === 'kelvin') celsius = value - 273.15;

        if (toUnit === 'celsius') return celsius;
        if (toUnit === 'fahrenheit') return celsius * 9 / 5 + 32;
        if (toUnit === 'kelvin') return celsius + 273.15;
        return celsius;
    }

    function convertValue(value, fromUnit, toUnit, categoryKey) {
        if (isNaN(value) || value === '') return '';

        const category = CATEGORIES[categoryKey];
        if (category.isSpecial) {
            const result = convertTemperature(parseFloat(value), fromUnit, toUnit);
            return parseFloat(result.toFixed(10));
        }

        const fromUnitData = category.units[fromUnit];
        const toUnitData = category.units[toUnit];
        if (!fromUnitData || !toUnitData) return '';

        const inBase = parseFloat(value) * fromUnitData.toBase;
        const result = inBase / toUnitData.toBase;
        return parseFloat(result.toFixed(10));
    }

    function performConversion() {
        if (isConverting) return;
        isConverting = true;

        const val = DOM.fromValue.value;
        const fromUnit = DOM.fromUnit.value;
        const toUnit = DOM.toUnit.value;
        const category = DOM.categorySelect.value;

        const result = convertValue(val, fromUnit, toUnit, category);
        DOM.toValue.value = result !== '' ? result : '';

        isConverting = false;
    }

    function swapUnits() {
        const fromUnit = DOM.fromUnit.value;
        const toUnit = DOM.toUnit.value;
        DOM.fromUnit.value = toUnit;
        DOM.toUnit.value = fromUnit;
        performConversion();
    }

    function clearAll() {
        DOM.fromValue.value = '1';
        DOM.toValue.value = '';
        performConversion();
    }

    function clearHistory() {
        history = [];
        saveHistory();
        renderHistory();
    }

    function copyResult() {
        const result = DOM.toValue.value;
        if (!result) return;

        const fromVal = DOM.fromValue.value;
        const fromUnit = getUnitLabel(DOM.categorySelect.value, DOM.fromUnit.value);
        const toUnit = getUnitLabel(DOM.categorySelect.value, DOM.toUnit.value);
        const text = fromVal + ' ' + fromUnit + ' = ' + result + ' ' + toUnit;

        navigator.clipboard.writeText(text).then(function() {
            const original = DOM.copyBtn.innerHTML;
            DOM.copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
            setTimeout(function() {
                DOM.copyBtn.innerHTML = original;
            }, 2000);
        }).catch(function() {
            alert('Could not copy. Please select and copy manually.');
        });
    }

    function setQuickValue(val) {
        DOM.fromValue.value = val;
        performConversion();
    }

    function handleCategoryChange() {
        const category = DOM.categorySelect.value;
        currentCategory = category;
        populateUnits(category);
        performConversion();
    }

    function handleFromValueChange() {
        performConversion();
    }

    function handleUnitChange() {
        performConversion();
    }

    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-bs-theme');
        const icon = DOM.themeToggle.querySelector('i');
        if (current === 'dark') {
            html.setAttribute('data-bs-theme', 'light');
            icon.className = 'bi bi-sun-fill';
        } else {
            html.setAttribute('data-bs-theme', 'dark');
            icon.className = 'bi bi-moon-fill';
        }
    }

    function init() {
        populateCategories();
        populateUnits(currentCategory);
        loadHistory();

        DOM.fromValue.value = '1';
        performConversion();

        DOM.categorySelect.addEventListener('change', handleCategoryChange);
        DOM.fromValue.addEventListener('input', handleFromValueChange);
        DOM.fromUnit.addEventListener('change', handleUnitChange);
        DOM.toUnit.addEventListener('change', handleUnitChange);
        DOM.swapBtn.addEventListener('click', swapUnits);
        DOM.copyBtn.addEventListener('click', copyResult);
        DOM.clearBtn.addEventListener('click', clearAll);
        DOM.clearHistoryBtn.addEventListener('click', clearHistory);
        DOM.themeToggle.addEventListener('click', toggleTheme);

        DOM.quickBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                setQuickValue(this.dataset.value);
            });
        });

        DOM.fromValue.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performConversion();
                addToHistory(
                    DOM.fromValue.value,
                    getUnitLabel(DOM.categorySelect.value, DOM.fromUnit.value),
                    DOM.toValue.value,
                    getUnitLabel(DOM.categorySelect.value, DOM.toUnit.value)
                );
            }
        });

        // Auto-add to history when conversion is performed (debounced)
        let historyTimeout;
        const originalPerform = performConversion;
        performConversion = function() {
            originalPerform();
            clearTimeout(historyTimeout);
            historyTimeout = setTimeout(function() {
                const val = DOM.fromValue.value;
                const result = DOM.toValue.value;
                if (val && result && !isNaN(val) && !isNaN(result)) {
                    addToHistory(
                        val,
                        getUnitLabel(DOM.categorySelect.value, DOM.fromUnit.value),
                        result,
                        getUnitLabel(DOM.categorySelect.value, DOM.toUnit.value)
                    );
                }
            }, 800);
        };

        // Re-bind events with new performConversion
        DOM.fromValue.removeEventListener('input', handleFromValueChange);
        DOM.fromValue.addEventListener('input', function() {
            performConversion();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();