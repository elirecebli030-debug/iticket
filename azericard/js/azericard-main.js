// Kart nömrəsi mask & validasiya
const cardNumberHide = document.getElementById('card-number');
const expiredMonth = document.getElementById('expired-month');
const expiredYear = document.getElementById('expired-year');
const submitButton = document.getElementById('submitBtn');
const cardnumber = document.getElementById('cardnumber');
const expirationdate = document.getElementById('expirationdate');
const securitycode = document.getElementById('securitycode');
const card_container = document.getElementById('card-container');
const card_text = document.getElementById('card-text');
const expdate_container = document.getElementById('expdate-container');
const expdate_text = document.getElementById('expdate-text');

window.addEventListener('load', function () {
    if (!cardnumber) return; // 3DS səhifəsində bu yoxdur

    var ccicon = document.getElementById('ccicon');

    var cardnumber_mask = IMask(cardnumber, {
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

    IMask(expirationdate, {
        mask: 'MM {/} YY',
        blocks: {
            YY: { mask: '00' },
            MM: { mask: IMask.MaskedRange, from: 1, to: 12 }
        }
    });

    IMask(securitycode, { mask: '000' });

    cardnumber.addEventListener('input', toggleSubmitButton);
    expirationdate.addEventListener('input', toggleSubmitButton);
    securitycode.addEventListener('input', toggleSubmitButton);

    function checkAndFocusNext(input, nextInput, length) {
        if (input.value.length >= length) nextInput.focus();
    }

    cardnumber.addEventListener('input', function () {
        if (cardnumber.value.charAt(0) === '3') checkAndFocusNext(cardnumber, expirationdate, 17);
        else checkAndFocusNext(cardnumber, expirationdate, 19);
    });

    expirationdate.addEventListener('input', function () {
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
        if (sum % 10 === 0) {
            card_container.classList.remove('error-input');
            card_text.classList.remove('error-text');
            return true;
        }
        card_container.classList.add('error-input');
        card_text.classList.add('error-text');
        return false;
    }

    function isValidExpirationDate(expirationValue) {
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (!expirationValue) {
            expdate_container.classList.add('error-input');
            expdate_text.classList.add('error-text');
            return false;
        }
        const [month, year] = expirationValue.split("/").map(v => parseInt(v.trim(), 10));
        if (year < currentYear || year > 99) {
            expdate_container.classList.add('error-input');
            expdate_text.classList.add('error-text');
            return false;
        }
        if (year === currentYear && month < currentMonth) {
            expdate_container.classList.add('error-input');
            expdate_text.classList.add('error-text');
            return false;
        }
        if (month >= 1 && month <= 12) {
            expdate_container.classList.remove('error-input');
            expdate_text.classList.remove('error-text');
            return true;
        }
        expdate_container.classList.add('error-input');
        expdate_text.classList.add('error-text');
        return false;
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
