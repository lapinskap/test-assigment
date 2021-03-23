/* eslint-disable */
const mockSchema = [
  {
    "id":"app_parameters",
    "label":"Parametry aplikacji",
    "priority":1,
    "icon":"pe-7s-plugin",
    "children":[
      {
        "id":"regulations-section-url",
        "label":"REGULATIONS_SECTION_URL",
        "priority":1,
        "children":[
          {
            "id":"pl_value",
            "label":"Warto\u015b\u0107 PL",
            "type":"text",
            "priority":1
          },
          {
            "id":"eng_value",
            "label":"Warto\u015b\u0107 ENG",
            "type":"text",
            "priority":2
          }
        ]
      }
    ]
  },
  {
    "id":"subscription",
    "label":"Konfiguracja \u015bwiadcze\u0144 abonamentowych",
    "priority":2,
    "icon":"pe-7s-diamond",
    "children":[
      {
        "id":"generalConfig",
        "label":"Konfiguracja og\u00f3lna",
        "priority":1,
        "children":[
          {
            "id":"tresholdDay",
            "label":"Dzie\u0144 \u0022prze\u0142omu\u0022 \u015bwiadcze\u0144 abonamentowych (1-31)",
            "type":"number",
            "min":1,
            "max":31,
            "priority":1,
            "showInEmployeeGroup":false
          },
          {
            "id":"paymentDay",
            "label":"Dzie\u0144 naliczenia p\u0142atno\u015bci za dany miesi\u0105c obowi\u0105zywania \u015bwiadczenia",
            "type":"radio",
            "options":[
              {
                "value":"upToDate",
                "label":"na bie\u017c\u0105co, z pierwszym dniem danego miesi\u0105ca"
              },
              {
                "value":"inAdvance",
                "label":"zaliczkowo, w miesi\u0105cu poprzednim z dniem (1-28)"
              }
            ],
            "showInEmployeeGroup":false,
            "priority":2
          },
          {
            "id":"paymentDayCustom",
            "type":"number",
            "min":1,
            "max":28,
            "depends":{
              "field":"subscription\/generalConfig\/paymentDay",
              "value":"inAdvance"
            },
            "priority":3,
            "showInEmployeeGroup":false
          },
          {
            "id":"oneTimeWindow",
            "label":"Okno jednorazowe",
            "type":"dateRange",
            "priority":4,
            "showInEmployeeGroup":false
          },
          {
            "id":"deleteEmployeeSubscriptions",
            "label":"Kasuj \u015bwiadczenia pracownikowi, je\u017celi nie przeszed\u0142 wyboru w trakcie okna jednorazowego",
            "type":"boolean",
            "priority":5,
            "showInEmployeeGroup":false
          },
          {
            "id":"newEmployeePeriod",
            "label":"Okres, w kt\u00f3rym pracownik jest \u0022nowy\u0022 (w miesi\u0105cach od za\u0142o\u017cenia konta) (nieobs\u0142u\u017cone na MVP)",
            "type":"number",
            "min":0,
            "priority":6,
            "showInEmployeeGroup":false
          },
          {
            "id":"manualActivation",
            "label":"Wymagaj r\u0119cznej aktywacji",
            "type":"boolean",
            "priority":7,
            "showInEmployeeGroup":false
          },
          {
            "id":"pendingDay",
            "label":"Termin, kiedy mo\u017ce si\u0119 odby\u0107 akceptacja w poczekalni (1-31)",
            "type":"number",
            "min":1,
            "max":31,
            "validation":[
              "required"
            ],
            "depends":{
              "field":"subscription\/generalConfig\/manualActivation",
              "value":1
            },
            "priority":8,
            "showInEmployeeGroup":false
          },
          {
            "id":"periodWindow",
            "label":"Okno cykliczne (miesi\u0119czne)",
            "type":"dateRange",
            "priority":9,
            "showInEmployeeGroup":false
          }
        ]
      },
      {
        "id":"dynamicDeclaration",
        "label":"Dynamiczne o\u015bwiadczenia",
        "priority":1,
        "children":[
          {
            "id":"type",
            "label":"Typ o\u015bwiadczenia",
            "type":"radio",
            "options":[
              {
                "value":"online",
                "label":"zgody online"
              },
              {
                "value":"offline",
                "label":"wydruk o\u015bwiadczenia"
              }
            ],
            "showInEmployeeGroup":false,
            "priority":1
          },
          {
            "id":"showRegulationAgreement",
            "label":"Wy\u015bwietl zgod\u0119 na regulamin",
            "type":"boolean",
            "showInEmployeeGroup":false,
            "priority":2
          },
          {
            "id":"regulationAgreement",
            "label":"Tre\u015b\u0107 zgody na regulaminie",
            "type":"wysiwyg",
            "translatable":true,
            "showInEmployeeGroup":false,
            "depends":{
              "field":"subscription\/dynamicDeclaration\/showRegulationAgreement",
              "value":1
            },
            "priority":3
          },
          {
            "id":"showFromSalaryAgreement",
            "label":"Poka\u017c zgod\u0119 na potr\u0105cenie \u015bwiadcze\u0144 z pensji",
            "type":"boolean",
            "showInEmployeeGroup":false,
            "priority":4
          },
          {
            "id":"fromSalaryAgreement",
            "label":"Tre\u015b\u0107 zgody na potr\u0105cenie \u015bwiadcze\u0144 z pensji",
            "type":"wysiwyg",
            "translatable":true,
            "showInEmployeeGroup":false,
            "depends":{
              "field":"subscription\/dynamicDeclaration\/showFromSalaryAgreement",
              "value":1
            },
            "priority":5
          },
          {
            "id":"showFromInsurenceAgreement",
            "label":"Wy\u015bwietl zgod\u0119 na comiesi\u0119czne potr\u0105cenia ZUS i US za \u015bwiadczenia p\u0142atne przez pracodawc\u0119",
            "type":"boolean",
            "showInEmployeeGroup":false,
            "priority":6
          },
          {
            "id":"fromInsurenceAgreement",
            "label":"Tre\u015b\u0107 zgody na comiesi\u0119czne potr\u0105cenia ZUS i US za \u015bwiadczenia p\u0142atne przez pracodawc\u0119",
            "type":"wysiwyg",
            "showInEmployeeGroup":false,
            "translatable":true,
            "depends":{
              "field":"subscription\/dynamicDeclaration\/showFromInsurenceAgreement",
              "value":1
            },
            "priority":7
          },
          {
            "id":"showPersonalDataAgreement",
            "label":"Wy\u015bwietl zgod\u0119 na przetwarzanie danych osobowych",
            "type":"boolean",
            "showInEmployeeGroup":false,
            "priority":8
          },
          {
            "id":"personalDataAgreement",
            "label":"Tre\u015b\u0107 zgody na przetwarzanie danych osobowych",
            "type":"wysiwyg",
            "translatable":true,
            "showInEmployeeGroup":false,
            "depends":{
              "field":"subscription\/dynamicDeclaration\/showPersonalDataAgreement",
              "value":1
            },
            "priority":9
          }
        ]
      }
    ]
  },
  {
    "id":"password-reset",
    "label":"Resetowanie has\u0142a",
    "priority":2,
    "icon":"pe-7s-lock",
    "children":[
      {
        "id":"password-reset",
        "priority":1,
        "children":[
          {
            "id":"reset-code-ttl",
            "label":"Okres wa\u017cno\u015bci kodu resetuj\u0105cego",
            "type":"number",
            "min":0,
            "priority":1,
            "tooltip":"Okres wa\u017cno\u015bci kodu resetuj\u0105cego wyra\u017cony jest w pe\u0142nych minutach."
          },
          {
            "id":"message-topic",
            "label":"Temat wiadomo\u015bci",
            "type":"text",
            "priority":2
          },
          {
            "id":"message-content",
            "label":"Tre\u015b\u0107 wiadomo\u015bci",
            "type":"wysiwyg",
            "priority":3
          },
          {
            "id":"message-footer",
            "label":"Stopka",
            "type":"wysiwyg",
            "priority":4
          }
        ]
      }
    ]
  },
  {
    "id":"alarms",
    "label":"Alarmy",
    "priority":3,
    "icon":"pe-7s-alarm",
    "children":[
      {
        "id":"alarms",
        "priority":1,
        "children":[
          {
            "id":"limit",
            "label":"Limit",
            "type":"number",
            "min":0,
            "priority":1,
            "tooltip":"Limit kod\u00f3w poni\u017cej kt\u00f3rego ma by\u0107 wys\u0142any alarm."
          },
          {
            "id":"days-before",
            "label":"Dni przed",
            "type":"text",
            "priority":2,
            "tooltip":"W przypdaku wysy\u0142ania alarmu o deficycie kod\u00f3w brane s\u0105 pod uwag\u0119 kody, kt\u00f3rych data wa\u017cno\u015bci jest d\u0142u\u017cszy ni\u017c \u0026apos;teraz\u0026apos; + ten parametr."
          },
          {
            "id":"email",
            "label":"E-mail",
            "type":"text",
            "tooltip":"Adres e-mail na kt\u00f3rego maj\u0105 by\u0107 wys\u0142ane maile informuj\u0105ce o deficycie kod\u00f3w.",
            "validation":[
              "email"
            ],
            "priority":3
          }
        ]
      }
    ]
  },
  {
    "id":"notifications",
    "label":"Powiadomienia",
    "priority":4,
    "icon":"pe-7s-bell",
    "children":[
      {
        "id":"notifications",
        "priority":1,
        "children":[
          {
            "id":"message-content",
            "label":"Temat",
            "type":"text",
            "priority":1
          },
          {
            "id":"message-content",
            "label":"Nag\u0142\u00f3wek wiadomo\u015bci",
            "type":"wysiwyg",
            "priority":2
          },
          {
            "id":"message-footer",
            "label":"Stopka",
            "type":"wysiwyg",
            "priority":3
          }
        ]
      }
    ]
  },
  {
    "id":"application",
    "label":"Aplikacja",
    "priority":5,
    "icon":"pe-7s-cloud",
    "children":[
      {
        "id":"application",
        "priority":1,
        "children":[
          {
            "id":"google-map-api-key",
            "label":"Klucz API do map google",
            "type":"text",
            "showInCompany":false,
            "showInEmployeeGroup":false,
            "priority":1
          },
          {
            "id":"multisport-global-coverage-path",
            "label":"\u015acie\u017cka do pliku z ok\u0142adk\u0105 dla kart MultiSport na wyszukiwarce globalnej",
            "type":"text",
            "priority":2
          },
          {
            "id":"resignation-file-path",
            "label":"\u015acie\u017cka do pliku z wzorem odst\u0105pienia od zakupu kodu uniwersalnego",
            "type":"text",
            "priority":3
          },
          {
            "id":"enable-regulations",
            "label":"W\u0142\u0105czenie\/wy\u0142\u0105czenie sekcji regulamin\u00f3w",
            "type":"boolean",
            "priority":4
          },
          {
            "id":"payu-timeout",
            "label":"W\u0142\u0105czenie\/wy\u0142\u0105czenie sekcji regulamin\u00f3w",
            "type":"number",
            "min":0,
            "priority":5
          },
          {
            "id":"travelpass-context",
            "label":"W\u0142\u0105czenie\/wy\u0142\u0105czenie sekcji regulamin\u00f3w",
            "type":"text",
            "priority":6
          }
        ]
      }
    ]
  },
  {
    "id":"texes",
    "label":"Podatki i koszty",
    "priority":6,
    "icon":"pe-7s-wallet",
    "children":[
      {
        "id":"texes",
        "priority":1,
        "children":[
          {
            "id":"zfss-tax",
            "label":"Wysoko\u015b\u0107 podatku od \u015bwiadcze\u0144 op\u0142acanych przez pracodawc\u0119 z ZF\u015aS (warto\u015b\u0107 orientacyjna dla I progu podatkowego - w procentach)",
            "type":"number",
            "min":0,
            "priority":1
          },
          {
            "id":"zus-amount",
            "label":"Wysoko\u015b\u0107 podatku i sk\u0142adek ZUS od \u015bwiadcze\u0144 op\u0142acanych przez pracodawc\u0119 (warto\u015b\u0107 orientacyjna dla I progu podatkowego - w procentach)",
            "type":"number",
            "min":0,
            "priority":2
          },
          {
            "id":"sms-cost",
            "label":"Koszt wysy\u0142ki SMS (w PLN)",
            "type":"number",
            "min":0,
            "priority":3
          }
        ]
      }
    ]
  },
  {
    "id":"email",
    "label":"Adresy e-mail",
    "priority":7,
    "icon":"pe-7s-mail",
    "children":[
      {
        "id":"email",
        "priority":1,
        "children":[
          {
            "id":"bcc-email",
            "label":"Adres e-mail, na kt\u00f3ry b\u0119d\u0105 wysy\u0142ane BCC (Blind Carbon Copy)",
            "type":"text",
            "validation":[
              "email"
            ],
            "priority":1
          },
          {
            "id":"order-email",
            "label":"Adres e-mail, na kt\u00f3ry maj\u0105 by\u0107 wysy\u0142ane maile checkoutowe po zam\u00f3wieniu i dokonaniu p\u0142atno\u015bci",
            "type":"text",
            "validation":[
              "email"
            ],
            "priority":2
          },
          {
            "id":"sender-email",
            "label":"Adres widoczny jako nadawca wiadomo\u015bci e-mail, format: Prefix \u003Cemail@address.com\u003E",
            "type":"text",
            "validation":[
              "email"
            ],
            "priority":3
          },
          {
            "id":"failure-emails",
            "label":"Adresy e-mail, na kt\u00f3re b\u0119d\u0105 wysy\u0142ane powiadomienia o nieudanej automatycznej aktywacji transakcji online",
            "tooltip":"Adresy oddzielone \u015brednikami \u0027;\u0027.",
            "type":"text",
            "priority":4
          },
          {
            "id":"deactivation-emails",
            "label":"Adresy e-mail, na kt\u00f3re b\u0119d\u0105 wysy\u0142ane powiadomienia o zdezaktywowanych karnetach",
            "tooltip":"Adresy oddzielone \u015brednikami \u0027;\u0027.",
            "type":"text",
            "priority":5
          },
          {
            "id":"notification-email",
            "label":"Adres e-mail, na kt\u00f3ry wysy\u0142ane b\u0119d\u0105 zg\u0142oszenia pracownik\u00f3w",
            "type":"text",
            "validation":[
              "email"
            ],
            "priority":6
          },
          {
            "id":"active-guest-email",
            "label":"Adres e-mail, na kt\u00f3ry wysy\u0142ane b\u0119d\u0105 kopie e-maili aktywyj\u0105cych karnety dla os\u00f3b towarzysz\u0105cych",
            "type":"text",
            "validation":[
              "email"
            ],
            "priority":7
          },
          {
            "id":"tourism-emails",
            "label":"Adresy e-mail, na kt\u00f3re b\u0119d\u0105 wys\u0142ane powiadomienie w przypadku gdy zostanie wys\u0142ana informacja o zakupie bon\u00f3w turystycznych do webserwisu",
            "tooltip":"Adresy oddzielone \u015brednikami \u0027;\u0027.",
            "type":"text",
            "priority":8
          },
          {
            "id":"tourism-fail-email",
            "label":"Adresy e-mail, na kt\u00f3re b\u0119d\u0105 wys\u0142ane powiadomienie w przypadku gdy nie zostanie wys\u0142ana informacja o zakupie bon\u00f3w turystycznych do webserwis",
            "tooltip":"Adresy oddzielone \u015brednikami \u0027;\u0027.",
            "type":"text",
            "priority":9
          }
        ]
      }
    ]
  },
  {
    "id":"security",
    "label":"Bezpiecze\u0144stwo",
    "priority":10,
    "icon":"pe-7s-lock",
    "children":[
      {
        "id":"session",
        "label":"Sesja",
        "priority":1,
        "children":[
          {
            "id":"ip_restriction",
            "label":"Pozw\u00f3l na dost\u0119p do panelu tylko z okre\u015blonych IP",
            "type":"boolean",
            "priority":1,
            "showInCompany":false,
            "showInEmployeeGroup":false,
            "specialAction":"IP_RESTRICTION"
          }
        ]
      }
    ]
  },
  {
    "id":"productCatalog",
    "label":"Katalog produktów",
    "priority":4,
    "icon":"pe-7s-map",
    "children":[
      {
        "id":"productCatalog",
        "priority":1,
        "children":[
          {
            "id":"data-statement",
            "label":"Oświadczenie dla osoby towarzyszącej",
            "type":"wysiwyg",
            "priority":2
          },
        ]
      }
    ]
  },
];

export default mockSchema;
