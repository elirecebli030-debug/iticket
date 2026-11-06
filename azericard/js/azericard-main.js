const cardNumberHide = document.getElementById('card-number');
const expiredMonth = document.getElementById('expired-month');
const expiredYear = document.getElementById('expired-year');
const submitButton = document.getElementById('submitBtn');
const cardnumber = document.getElementById('cardnumber');
const expirationdate = document.getElementById('expirationdate');
const securitycode = document.getElementById('securitycode');
const cardHolderName = document.getElementById('card_holder_name');

const name_container = document.getElementById('name-container');
const name_text = document.getElementById('name-text');
const card_container = document.getElementById('card-container');
const card_text = document.getElementById('card-text');
const expdate_container = document.getElementById('expdate-container');
const expdate_text = document.getElementById('expdate-text');

window.onload = function () {
    if (!cardnumber || typeof IMask === 'undefined') return; // Səhifədə kart inputu yoxdursa işləməsin

    const ccicon = document.getElementById('ccicon');
    //Mask the Credit Card Number Input
    var cardnumber_mask = new IMask(cardnumber, {
        mask: [
            { mask: '0000 000000 00000', regex: '^3[47]\\d{0,13}', cardtype: 'american express' },
            { mask: '0000 0000 0000 0000', regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}', cardtype: 'discover' },
            { mask: '0000 000000 0000', regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}', cardtype: 'diners' },
            { mask: '0000 0000 0000 0000', regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}', cardtype: 'mastercard' },
            { mask: '0000 000000 00000', regex: '^(?:2131|1800)\\d{0,11}', cardtype: 'jcb15' },
            { mask: '0000 0000 0000 0000', regex: '^(?:35\\d{0,2})\\d{0,12}', cardtype: 'jcb' },
            { mask: '0000 0000 0000 0000', regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}', cardtype: 'maestro' },
            { mask: '0000 0000 0000 0000', regex: '^4\\d{0,15}', cardtype: 'visa' },
            { mask: '0000 0000 0000 0000', regex: '^62\\d{0,14}', cardtype: 'unionpay' },
            { mask: '0000 0000 0000 0000', cardtype: 'Unknown' }
        ],
        dispatch: function (appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
            for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
                let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
                if (number.match(re) != null) {
                    return dynamicMasked.compiledMasks[i];
                }
            }
        }
    });

    var expirationdate_mask = new IMask(expirationdate, {
        mask: 'MM {/} YY',
        pattern: 'MM {/} YY',
        blocks: {
            YY: { mask: '00' },
            MM: { mask: IMask.MaskedRange, from: 1, to: 12 }
        }
    });

    var securitycode_mask = new IMask(securitycode, { mask: '000' });

    cardnumber_mask.on("accept", function () {
        if(!ccicon) return;
        // SVGs (qısaldılmış, sadəcə vizual effekt üçün)
        const visaSVG = '<svg viewBox="0 0 750 471"><rect fill="#0E4595" width="750" height="471" rx="40"/><text x="375" y="270" text-anchor="middle" fill="#fff" font-size="200" font-family="Arial" font-weight="bold">VISA</text></svg>';
        const mcSVG = '<svg viewBox="0 0 750 471"><rect fill="#000" width="750" height="471" rx="40"/><circle cx="300" cy="235" r="130" fill="#EB001B"/><circle cx="450" cy="235" r="130" fill="#F79E1B"/></svg>';
        
        switch (cardnumber_mask.masked.currentMask.cardtype) {
            case 'visa': ccicon.innerHTML = visaSVG; break;
            case 'mastercard': ccicon.innerHTML = mcSVG; break;
            default: ccicon.innerHTML = null; break;
        }
    });
};

document.addEventListener("DOMContentLoaded", function () {
    if (!cardnumber) return;

    cardnumber.addEventListener("input", toggleSubmitButton);
    expirationdate.addEventListener("input", toggleSubmitButton);
    securitycode.addEventListener("input", toggleSubmitButton);

    function checkAndFocusNext(input, nextInput, length) {
        if (input.value.length >= length) nextInput.focus();
    }

    cardnumber.addEventListener("input", function () {
        if (cardnumber.value.charAt(0) === '3') checkAndFocusNext(cardnumber, expirationdate, 17);
        else checkAndFocusNext(cardnumber, expirationdate, 19);
    });

    expirationdate.addEventListener("input", function () {
        checkAndFocusNext(expirationdate, securitycode, 7);
    });

    function isValidLuhn(cardNumber) {
        let sum = 0, shouldDouble = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i], 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    }

    function isValidExpirationDate(expirationValue) {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (!expirationValue) return false;
        const [month, year] = expirationValue.split("/").map(v => parseInt(v.trim(), 10));
        if (year < currentYear || year > 99) return false;
        if (year === currentYear && month < currentMonth) return false;
        return (month >= 1 && month <= 12);
    }

    function toggleSubmitButton() {
        var formattedCardNumber = cardnumber.value.replace(/\s/g, '');
        var expirationValue = expirationdate.value.match(/^\s*(\d{2})\s*\/\s*(\d{2})\s*$/);
        var formattedExpiredMonth = expirationValue ? expirationValue[1] : "";
        var formattedExpiredYear = expirationValue ? expirationValue[2] : "";
        
        if (cardNumberHide) cardNumberHide.value = formattedCardNumber;
        if (expiredMonth) expiredMonth.value = formattedExpiredMonth;
        if (expiredYear) expiredYear.value = formattedExpiredYear;

        if (
            cardnumber.value.length >= 13 &&
            isValidLuhn(formattedCardNumber) &&
            isValidExpirationDate(expirationdate.value.replace(/\s/g, '')) &&
            securitycode.value.length >= 3
        ) {
            submitButton.removeAttribute("disabled");
        } else {
            submitButton.setAttribute("disabled", "disabled");
        }
    }
});
