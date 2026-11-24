"""Normalising identifiers and formatting amounts."""
import re
from datetime import date

_ONES = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN',
         'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN']
_TENS = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY']


def digits(value: str | None) -> str:
    return re.sub(r'\D', '', value or '')


def format_cnic(value: str) -> str | None:
    """'4210112345671' or '42101-1234567-1' -> '42101-1234567-1'; None if not 13 digits."""
    d = digits(value)
    return f'{d[:5]}-{d[5:12]}-{d[12]}' if len(d) == 13 else None


def format_mobile(value: str) -> str | None:
    """'03001234567' or '0300-1234567' -> '0300-1234567'; None if not a Pakistani mobile number."""
    d = digits(value)
    if len(d) == 12 and d.startswith('92'):
        d = '0' + d[2:]
    return f'{d[:4]}-{d[4:]}' if len(d) == 11 and d.startswith('03') else None


def amount_in_words(n: int) -> str:
    """106600 -> 'ONE HUNDRED SIX THOUSAND SIX HUNDRED' (as printed on receipts)."""

    def below_thousand(x: int) -> str:
        out = ''
        if x >= 100:
            out += _ONES[x // 100] + ' HUNDRED '
            x %= 100
        if x >= 20:
            out += _TENS[x // 10] + ' ' + _ONES[x % 10] + ' '
        elif x > 0:
            out += _ONES[x] + ' '
        return out

    if n == 0:
        return 'ZERO'
    out = ''
    for size, word in ((1_000_000_000, 'BILLION'), (1_000_000, 'MILLION'), (1_000, 'THOUSAND')):
        if n >= size:
            out += below_thousand(n // size) + word + ' '
            n %= size
    out += below_thousand(n)
    return re.sub(' +', ' ', out).strip()


def month_label(d: date) -> str:
    """date(2026, 11, 1) -> 'November, 2026'."""
    return d.strftime('%B, %Y')
