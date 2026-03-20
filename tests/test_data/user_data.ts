// REGEX for email validation
// https://pdw.ex-parrot.com/Mail-RFC822-Address.html

export const valid_names = [
    "Ur",                                           // min 2
    'A'.repeat(100),                                // max 100
    "Test User",
    "1234", 
    "<script>alert('XSS')</script>"]

export const invalid_names = [
    '',
    'a',                                            // out of min 2
    'A'.repeat(101)                                 // out of max 100
    ]

export const valid_emails = [
    `${'g'.repeat(1)}@er.hu`,                       // min 1 symbol before@
    `${"m".repeat(64)}@mu.gu`,                      // max 64 before @
    `${"m".repeat(64)}@${"u".repeat(63)}.${"v".repeat(63)}.${"w".repeat(61)}`, // max 254 total
    'pisti.papa@mail.hu',
    'Pisti.Papa@mail-com.net']

export const invalid_emails = [
    '',
    'a@ur',     // 4 minlen 5
    `${"m".repeat(65)}@mu.gu`,                      // out of max 64 before @
    `${"m".repeat(64)}@m${"u".repeat(186)}.gu`,     // out of max 254 total
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    'あいうえお@example.com',
    'email@example.com (Joe Smith)',    // valid by REGEX
    'email@-example.com',               // valid by REGEX
    'email@example..com',
    '”(),:;<>[\]@example.com',
    'just”not”right@example.com',
    'this\ is"really"not\allowed@example.com',
    "<script>alert('XSS')</script>",
]


export const valid_phones = [
    `${"7".repeat(3)}`,                      // min 3
    `${"7".repeat(50)}`,                     // max 50
    '+79001234567',
    '+36 30 123 4567',
    '123-456-7890',
    '(123) 456-7890',
    '123.456.7890',
    '+1-123-456-7890',
    'tel: +33225445578',
    "<script>alert('125444556')</script>"
    ]

export const invalid_phones = [
    '',
    `${"7".repeat(2)}`,       // out of min 3                                              // 2 > min 3
    `${"7".repeat(51)}`,      // out of max 50
    'abc',
    '!@#$%^&*()',
    "<script>alert('XSS')</script>"
    ]
