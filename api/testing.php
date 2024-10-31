<?php
error_reporting(E_ALL); // Report all errors and warnings
ini_set('display_errors', '1'); // Display errors in the browser
ini_set('display_startup_errors', '1'); // Display startup errors
include('functions.php');

$htm = '{
    "ReferenceNumber": "NYIXUZ",
    "AirlineBookingReferences": [
        {
            "FlightCode": "ET",
            "ConfirmationNumber": "SPJMFJ"
        },
        {
            "FlightCode": "ET",
            "ConfirmationNumber": "SPJMFJ"
        }
    ],
    "NonGdsReferences": null,
    "IsSuccessful": true,
    "InsurancePurchased": false,
    "Error": null,
    "Warning": null,
    "InsurancePolicyDetails": null,
    "BlueRibbonPurchaseResponse": null,
    "TravelFusionBookingConfirmedPrice": null,
    "TravelFusionBookingConfirmedCurrency": null,
    "TravelFusionNeedConfirmation": false,
    "TicketingTimeLimit": "2024-10-19T00:04:42.6474655",
    "CreditCardVerificationNeeded": false,
    "CreditCardVerificationUrl": null,
    "NDCTickets": null,
    "BookingDetails": {
        "Warning": null,
        "ReservationStatus": "",
        "InsuranceInfo": null,
        "Air": {
            "AirItinerary": {
                "DirectionInd": "OneWay",
                "OriginDestinationOptions": [
                    {
                        "SectorSequence": 1,
                        "FlightSegments": [
                            {
                                "RouteNumber": "ET900",
                                "MarketingAirlineName": "Ethiopian Airlines",
                                "OperatingAirlineName": "Ethiopian Airlines",
                                "Duration": "05:40:00",
                                "DepartureCountryCode": "NG",
                                "ArrivalCountryCode": "ET",
                                "Aircraft": "Boeing 777-300ER",
                                "BookingClass": "H",
                                "ArrivalAirportName": "Addis Ababa-Bole Intl, Ethiopia",
                                "DepartureAirportName": "Lagos-Murtala Muhammed Intl, Nigeria",
                                "BaggageFeeUrl": "https:\/\/bags.amadeus.com\/Display.aspx?a=ET",
                                "FreeBaggages": [
                                    {
                                        "FreeQuantity": 3,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    },
                                    {
                                        "FreeQuantity": 3,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    },
                                    {
                                        "FreeQuantity": 1,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    }
                                ],
                                "Cabin": "Economy",
                                "AirlineLogo": "content\/airline-logos\/ET.png",
                                "DepartureTerminal": null,
                                "ArrivalTerminal": null,
                                "DepartureCityName": null,
                                "ArrivalCityName": null,
                                "SeatsLeft": null,
                                "FlightNumber": "900",
                                "MarketingAirlineCode": "ET",
                                "OperatingAirlineCode": "ET",
                                "DepartureDate": "2024-10-26T13:20:00",
                                "ArrivalDate": "2024-10-26T21:00:00",
                                "DepartureAirport": "LOS",
                                "ArrivalAirport": "ADD",
                                "NativeId": null
                            },
                            {
                                "RouteNumber": "ET700",
                                "MarketingAirlineName": "Ethiopian Airlines",
                                "OperatingAirlineName": "Ethiopian Airlines",
                                "Duration": "08:30:00",
                                "DepartureCountryCode": "ET",
                                "ArrivalCountryCode": "GB",
                                "Aircraft": "Airbus A350",
                                "BookingClass": "H",
                                "ArrivalAirportName": "London-Heathrow, United Kingdom",
                                "DepartureAirportName": "Addis Ababa-Bole Intl, Ethiopia",
                                "BaggageFeeUrl": "https:\/\/bags.amadeus.com\/Display.aspx?a=ET",
                                "FreeBaggages": [
                                    {
                                        "FreeQuantity": 3,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    },
                                    {
                                        "FreeQuantity": 3,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    },
                                    {
                                        "FreeQuantity": 1,
                                        "BagAllowanceType": "Piece",
                                        "BagAllowanceUnit": "K"
                                    }
                                ],
                                "Cabin": "Economy",
                                "AirlineLogo": "content\/airline-logos\/ET.png",
                                "DepartureTerminal": null,
                                "ArrivalTerminal": null,
                                "DepartureCityName": null,
                                "ArrivalCityName": null,
                                "SeatsLeft": null,
                                "FlightNumber": "700",
                                "MarketingAirlineCode": "ET",
                                "OperatingAirlineCode": "ET",
                                "DepartureDate": "2024-10-27T01:05:00",
                                "ArrivalDate": "2024-10-27T06:35:00",
                                "DepartureAirport": "ADD",
                                "ArrivalAirport": "LHR",
                                "NativeId": null
                            }
                        ],
                        "Cabin": "Economy",
                        "JourneyTotalDuration": "18:15:00"
                    }
                ],
                "TicketTimeLimit": "2024-10-26T23:59:00"
            },
            "AirItineraryPricingInfo": {
                "TotalPrice": 2085847,
                "BasePrice": 1013970,
                "Tax": 1071877,
                "Markup": 0,
                "ServiceFee": 0,
                "ItinerarySurchargePrice": 0,
                "Discount": 0,
                "PromotionalDiscount": 0,
                "CurrencyCode": "NGN",
                "PTC_FareBreakdowns": [
                    {
                        "PTCIdentifier": null,
                        "Baggages": [
                            {
                                "SequenceNumber": 1,
                                "FlightNumber": "900",
                                "FreeQuantity": 3,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "ADT",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            },
                            {
                                "SequenceNumber": 2,
                                "FlightNumber": "700",
                                "FreeQuantity": 3,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "ADT",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            }
                        ],
                        "FlightExtrasInfo": null,
                        "BasePriceFromItinerary": 531512,
                        "BasePrice": 541512,
                        "Markup": 0,
                        "Discount": 0,
                        "Tax": 522020,
                        "Surcharge": 0,
                        "DiscountAmountFromContract": 0,
                        "PromotionalDiscount": 0,
                        "TotalDiscount": 0,
                        "TotalPrice": 1063532,
                        "PassengerCount": 1,
                        "PassengerType": "ADT",
                        "CodeContext": null,
                        "MarkupBreakdown": [
                            {
                                "MarkupAmount": 10000,
                                "MarkupName": "ETHIOPIA FRO NIGERIA",
                                "MarkupDisplayName": null,
                                "Display": false,
                                "Id": 17011
                            }
                        ],
                        "DiscountBreakdown": [],
                        "PromotionalDiscountBreakdown": [],
                        "ContractManagerDiscountBreakdown": null,
                        "AllDiscountBreakdowns": [],
                        "FareBasisCodes": [
                            "HLWOWNG",
                            "HLWOWNG"
                        ]
                    },
                    {
                        "PTCIdentifier": null,
                        "Baggages": [
                            {
                                "SequenceNumber": 1,
                                "FlightNumber": "900",
                                "FreeQuantity": 3,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "CHD",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            },
                            {
                                "SequenceNumber": 2,
                                "FlightNumber": "700",
                                "FreeQuantity": 3,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "CHD",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            }
                        ],
                        "FlightExtrasInfo": null,
                        "BasePriceFromItinerary": 398634,
                        "BasePrice": 408634,
                        "Markup": 0,
                        "Discount": 0,
                        "Tax": 515376,
                        "Surcharge": 0,
                        "DiscountAmountFromContract": 0,
                        "PromotionalDiscount": 0,
                        "TotalDiscount": 0,
                        "TotalPrice": 924010,
                        "PassengerCount": 1,
                        "PassengerType": "CHD",
                        "CodeContext": null,
                        "MarkupBreakdown": [
                            {
                                "MarkupAmount": 10000,
                                "MarkupName": "ETHIOPIA FRO NIGERIA",
                                "MarkupDisplayName": null,
                                "Display": false,
                                "Id": 17011
                            }
                        ],
                        "DiscountBreakdown": [],
                        "PromotionalDiscountBreakdown": [],
                        "ContractManagerDiscountBreakdown": null,
                        "AllDiscountBreakdowns": [],
                        "FareBasisCodes": [
                            "HLWOWNGCH",
                            "HLWOWNGCH"
                        ]
                    },
                    {
                        "PTCIdentifier": null,
                        "Baggages": [
                            {
                                "SequenceNumber": 1,
                                "FlightNumber": "900",
                                "FreeQuantity": 1,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "INF",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            },
                            {
                                "SequenceNumber": 2,
                                "FlightNumber": "700",
                                "FreeQuantity": 1,
                                "Id": null,
                                "PassengerId": null,
                                "Title": null,
                                "Description": null,
                                "Amount": null,
                                "PassengerCode": "INF",
                                "BagAllowanceType": "Piece",
                                "BagAllowanceUnit": "K"
                            }
                        ],
                        "FlightExtrasInfo": null,
                        "BasePriceFromItinerary": 53824,
                        "BasePrice": 63824,
                        "Markup": 0,
                        "Discount": 0,
                        "Tax": 34481,
                        "Surcharge": 0,
                        "DiscountAmountFromContract": 0,
                        "PromotionalDiscount": 0,
                        "TotalDiscount": 0,
                        "TotalPrice": 98305,
                        "PassengerCount": 1,
                        "PassengerType": "INF",
                        "CodeContext": null,
                        "MarkupBreakdown": [
                            {
                                "MarkupAmount": 10000,
                                "MarkupName": "ETHIOPIA FRO NIGERIA",
                                "MarkupDisplayName": null,
                                "Display": false,
                                "Id": 17011
                            }
                        ],
                        "DiscountBreakdown": [],
                        "PromotionalDiscountBreakdown": [],
                        "ContractManagerDiscountBreakdown": null,
                        "AllDiscountBreakdowns": [],
                        "FareBasisCodes": [
                            "HLWOWNGIN",
                            "HLWOWNGIN"
                        ]
                    }
                ],
                "PricingSource": null,
                "IsNegotiatedPrice": false,
                "FareType": "Published",
                "FareFamily": null,
                "ValidatingAirlineCode": "ET",
                "AdditionalFareInfos": [
                    {
                        "FareReference": "HLWOWNG",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "LOS",
                        "DepartureDate": "2024-10-26T13:20:00",
                        "ArrivalAirport": "ADD",
                        "Penalty": null
                    },
                    {
                        "FareReference": "HLWOWNG",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "ADD",
                        "DepartureDate": "2024-10-27T01:05:00",
                        "ArrivalAirport": "LHR",
                        "Penalty": null
                    },
                    {
                        "FareReference": "HLWOWNGCH",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "LOS",
                        "DepartureDate": "2024-10-26T13:20:00",
                        "ArrivalAirport": "ADD",
                        "Penalty": null
                    },
                    {
                        "FareReference": "HLWOWNGCH",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "ADD",
                        "DepartureDate": "2024-10-27T01:05:00",
                        "ArrivalAirport": "LHR",
                        "Penalty": null
                    },
                    {
                        "FareReference": "HLWOWNGIN",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "LOS",
                        "DepartureDate": "2024-10-26T13:20:00",
                        "ArrivalAirport": "ADD",
                        "Penalty": null
                    },
                    {
                        "FareReference": "HLWOWNGIN",
                        "ValidatingAirlineCode": "",
                        "FareFamily": null,
                        "Cabin": "",
                        "DepartureAirport": "ADD",
                        "DepartureDate": "2024-10-27T01:05:00",
                        "ArrivalAirport": "LHR",
                        "Penalty": null
                    }
                ],
                "TaxBreakdown": [
                    {
                        "Code": "YQ",
                        "Price": 50460,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "YR",
                        "Price": 529450,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "NG",
                        "Price": 78195,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "QT",
                        "Price": 336400,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "TE",
                        "Price": 67280,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "L3",
                        "Price": 3364,
                        "CurrencyCode": "NGN"
                    },
                    {
                        "Code": "S2",
                        "Price": 6728,
                        "CurrencyCode": "NGN"
                    }
                ]
            },
            "Id": "737ba7cf-ae71-43e3-8680-921b6d185b57",
            "PolicyType": null,
            "DeepLinkUrl": "",
            "Provider": "Sabre",
            "OfficeId": "QH3K",
            "UseTravelFusionTFPay": false,
            "TravelFusionReferenceNumber": null
        },
        "Flights": [
            {
                "AirItinerary": {
                    "DirectionInd": "OneWay",
                    "OriginDestinationOptions": [
                        {
                            "SectorSequence": 1,
                            "FlightSegments": [
                                {
                                    "RouteNumber": "ET900",
                                    "MarketingAirlineName": "Ethiopian Airlines",
                                    "OperatingAirlineName": "Ethiopian Airlines",
                                    "Duration": "05:40:00",
                                    "DepartureCountryCode": "NG",
                                    "ArrivalCountryCode": "ET",
                                    "Aircraft": "Boeing 777-300ER",
                                    "BookingClass": "H",
                                    "ArrivalAirportName": "Addis Ababa-Bole Intl, Ethiopia",
                                    "DepartureAirportName": "Lagos-Murtala Muhammed Intl, Nigeria",
                                    "BaggageFeeUrl": "https:\/\/bags.amadeus.com\/Display.aspx?a=ET",
                                    "FreeBaggages": [
                                        {
                                            "FreeQuantity": 3,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        },
                                        {
                                            "FreeQuantity": 3,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        },
                                        {
                                            "FreeQuantity": 1,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        }
                                    ],
                                    "Cabin": "Economy",
                                    "AirlineLogo": "content\/airline-logos\/ET.png",
                                    "DepartureTerminal": null,
                                    "ArrivalTerminal": null,
                                    "DepartureCityName": null,
                                    "ArrivalCityName": null,
                                    "SeatsLeft": null,
                                    "FlightNumber": "900",
                                    "MarketingAirlineCode": "ET",
                                    "OperatingAirlineCode": "ET",
                                    "DepartureDate": "2024-10-26T13:20:00",
                                    "ArrivalDate": "2024-10-26T21:00:00",
                                    "DepartureAirport": "LOS",
                                    "ArrivalAirport": "ADD",
                                    "NativeId": null
                                },
                                {
                                    "RouteNumber": "ET700",
                                    "MarketingAirlineName": "Ethiopian Airlines",
                                    "OperatingAirlineName": "Ethiopian Airlines",
                                    "Duration": "08:30:00",
                                    "DepartureCountryCode": "ET",
                                    "ArrivalCountryCode": "GB",
                                    "Aircraft": "Airbus A350",
                                    "BookingClass": "H",
                                    "ArrivalAirportName": "London-Heathrow, United Kingdom",
                                    "DepartureAirportName": "Addis Ababa-Bole Intl, Ethiopia",
                                    "BaggageFeeUrl": "https:\/\/bags.amadeus.com\/Display.aspx?a=ET",
                                    "FreeBaggages": [
                                        {
                                            "FreeQuantity": 3,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        },
                                        {
                                            "FreeQuantity": 3,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        },
                                        {
                                            "FreeQuantity": 1,
                                            "BagAllowanceType": "Piece",
                                            "BagAllowanceUnit": "K"
                                        }
                                    ],
                                    "Cabin": "Economy",
                                    "AirlineLogo": "content\/airline-logos\/ET.png",
                                    "DepartureTerminal": null,
                                    "ArrivalTerminal": null,
                                    "DepartureCityName": null,
                                    "ArrivalCityName": null,
                                    "SeatsLeft": null,
                                    "FlightNumber": "700",
                                    "MarketingAirlineCode": "ET",
                                    "OperatingAirlineCode": "ET",
                                    "DepartureDate": "2024-10-27T01:05:00",
                                    "ArrivalDate": "2024-10-27T06:35:00",
                                    "DepartureAirport": "ADD",
                                    "ArrivalAirport": "LHR",
                                    "NativeId": null
                                }
                            ],
                            "Cabin": "Economy",
                            "JourneyTotalDuration": "18:15:00"
                        }
                    ],
                    "TicketTimeLimit": "2024-10-26T23:59:00"
                },
                "AirItineraryPricingInfo": {
                    "TotalPrice": 2085847,
                    "BasePrice": 1013970,
                    "Tax": 1071877,
                    "Markup": 0,
                    "ServiceFee": 0,
                    "ItinerarySurchargePrice": 0,
                    "Discount": 0,
                    "PromotionalDiscount": 0,
                    "CurrencyCode": "NGN",
                    "PTC_FareBreakdowns": [
                        {
                            "PTCIdentifier": null,
                            "Baggages": [
                                {
                                    "SequenceNumber": 1,
                                    "FlightNumber": "900",
                                    "FreeQuantity": 3,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "ADT",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                },
                                {
                                    "SequenceNumber": 2,
                                    "FlightNumber": "700",
                                    "FreeQuantity": 3,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "ADT",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                }
                            ],
                            "FlightExtrasInfo": null,
                            "BasePriceFromItinerary": 531512,
                            "BasePrice": 541512,
                            "Markup": 0,
                            "Discount": 0,
                            "Tax": 522020,
                            "Surcharge": 0,
                            "DiscountAmountFromContract": 0,
                            "PromotionalDiscount": 0,
                            "TotalDiscount": 0,
                            "TotalPrice": 1063532,
                            "PassengerCount": 1,
                            "PassengerType": "ADT",
                            "CodeContext": null,
                            "MarkupBreakdown": [
                                {
                                    "MarkupAmount": 10000,
                                    "MarkupName": "ETHIOPIA FRO NIGERIA",
                                    "MarkupDisplayName": null,
                                    "Display": false,
                                    "Id": 17011
                                }
                            ],
                            "DiscountBreakdown": [],
                            "PromotionalDiscountBreakdown": [],
                            "ContractManagerDiscountBreakdown": null,
                            "AllDiscountBreakdowns": [],
                            "FareBasisCodes": [
                                "HLWOWNG",
                                "HLWOWNG"
                            ]
                        },
                        {
                            "PTCIdentifier": null,
                            "Baggages": [
                                {
                                    "SequenceNumber": 1,
                                    "FlightNumber": "900",
                                    "FreeQuantity": 3,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "CHD",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                },
                                {
                                    "SequenceNumber": 2,
                                    "FlightNumber": "700",
                                    "FreeQuantity": 3,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "CHD",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                }
                            ],
                            "FlightExtrasInfo": null,
                            "BasePriceFromItinerary": 398634,
                            "BasePrice": 408634,
                            "Markup": 0,
                            "Discount": 0,
                            "Tax": 515376,
                            "Surcharge": 0,
                            "DiscountAmountFromContract": 0,
                            "PromotionalDiscount": 0,
                            "TotalDiscount": 0,
                            "TotalPrice": 924010,
                            "PassengerCount": 1,
                            "PassengerType": "CHD",
                            "CodeContext": null,
                            "MarkupBreakdown": [
                                {
                                    "MarkupAmount": 10000,
                                    "MarkupName": "ETHIOPIA FRO NIGERIA",
                                    "MarkupDisplayName": null,
                                    "Display": false,
                                    "Id": 17011
                                }
                            ],
                            "DiscountBreakdown": [],
                            "PromotionalDiscountBreakdown": [],
                            "ContractManagerDiscountBreakdown": null,
                            "AllDiscountBreakdowns": [],
                            "FareBasisCodes": [
                                "HLWOWNGCH",
                                "HLWOWNGCH"
                            ]
                        },
                        {
                            "PTCIdentifier": null,
                            "Baggages": [
                                {
                                    "SequenceNumber": 1,
                                    "FlightNumber": "900",
                                    "FreeQuantity": 1,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "INF",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                },
                                {
                                    "SequenceNumber": 2,
                                    "FlightNumber": "700",
                                    "FreeQuantity": 1,
                                    "Id": null,
                                    "PassengerId": null,
                                    "Title": null,
                                    "Description": null,
                                    "Amount": null,
                                    "PassengerCode": "INF",
                                    "BagAllowanceType": "Piece",
                                    "BagAllowanceUnit": "K"
                                }
                            ],
                            "FlightExtrasInfo": null,
                            "BasePriceFromItinerary": 53824,
                            "BasePrice": 63824,
                            "Markup": 0,
                            "Discount": 0,
                            "Tax": 34481,
                            "Surcharge": 0,
                            "DiscountAmountFromContract": 0,
                            "PromotionalDiscount": 0,
                            "TotalDiscount": 0,
                            "TotalPrice": 98305,
                            "PassengerCount": 1,
                            "PassengerType": "INF",
                            "CodeContext": null,
                            "MarkupBreakdown": [
                                {
                                    "MarkupAmount": 10000,
                                    "MarkupName": "ETHIOPIA FRO NIGERIA",
                                    "MarkupDisplayName": null,
                                    "Display": false,
                                    "Id": 17011
                                }
                            ],
                            "DiscountBreakdown": [],
                            "PromotionalDiscountBreakdown": [],
                            "ContractManagerDiscountBreakdown": null,
                            "AllDiscountBreakdowns": [],
                            "FareBasisCodes": [
                                "HLWOWNGIN",
                                "HLWOWNGIN"
                            ]
                        }
                    ],
                    "PricingSource": null,
                    "IsNegotiatedPrice": false,
                    "FareType": "Published",
                    "FareFamily": null,
                    "ValidatingAirlineCode": "ET",
                    "AdditionalFareInfos": [
                        {
                            "FareReference": "HLWOWNG",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "LOS",
                            "DepartureDate": "2024-10-26T13:20:00",
                            "ArrivalAirport": "ADD",
                            "Penalty": null
                        },
                        {
                            "FareReference": "HLWOWNG",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "ADD",
                            "DepartureDate": "2024-10-27T01:05:00",
                            "ArrivalAirport": "LHR",
                            "Penalty": null
                        },
                        {
                            "FareReference": "HLWOWNGCH",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "LOS",
                            "DepartureDate": "2024-10-26T13:20:00",
                            "ArrivalAirport": "ADD",
                            "Penalty": null
                        },
                        {
                            "FareReference": "HLWOWNGCH",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "ADD",
                            "DepartureDate": "2024-10-27T01:05:00",
                            "ArrivalAirport": "LHR",
                            "Penalty": null
                        },
                        {
                            "FareReference": "HLWOWNGIN",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "LOS",
                            "DepartureDate": "2024-10-26T13:20:00",
                            "ArrivalAirport": "ADD",
                            "Penalty": null
                        },
                        {
                            "FareReference": "HLWOWNGIN",
                            "ValidatingAirlineCode": "",
                            "FareFamily": null,
                            "Cabin": "",
                            "DepartureAirport": "ADD",
                            "DepartureDate": "2024-10-27T01:05:00",
                            "ArrivalAirport": "LHR",
                            "Penalty": null
                        }
                    ],
                    "TaxBreakdown": [
                        {
                            "Code": "YQ",
                            "Price": 50460,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "YR",
                            "Price": 529450,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "NG",
                            "Price": 78195,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "QT",
                            "Price": 336400,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "TE",
                            "Price": 67280,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "L3",
                            "Price": 3364,
                            "CurrencyCode": "NGN"
                        },
                        {
                            "Code": "S2",
                            "Price": 6728,
                            "CurrencyCode": "NGN"
                        }
                    ]
                },
                "Id": "737ba7cf-ae71-43e3-8680-921b6d185b57",
                "PolicyType": null,
                "DeepLinkUrl": "",
                "Provider": "Sabre",
                "OfficeId": "QH3K",
                "UseTravelFusionTFPay": false,
                "TravelFusionReferenceNumber": null
            }
        ],
        "Hotels": [],
        "Cars": [],
        "Travellers": [
            {
                "ContactDetailsNativeId": null,
                "Id": "737ba7cf-ae71-43e3-8680-921b6d185b57",
                "Title": "Mr",
                "TypeCode": "ADT",
                "FirstName": "Azeez",
                "MiddleName": null,
                "LastName": "Shina",
                "Email": "Hercease001@gmail.com",
                "CountryCode": "NG",
                "Phone": "08082709997",
                "PhoneCode": "234",
                "PhoneAreaCode": null,
                "DriversLicence": null,
                "NationalIdentity": null,
                "LocallyDefinedIDNumber": null,
                "MobilePhone": null,
                "MobilePhoneCode": null,
                "TicketNumber": null,
                "TicketStatus": "Unknown",
                "JetSmartPassengerData": null,
                "EmployeeUsername": null,
                "LoyalityProgram": null,
                "ReducedMobilityAssistanceInfo": null,
                "ChoosenSpeedyBoardingInfo": null,
                "CarLoyalityProgram": null,
                "HotelLoyalityProgram": null,
                "Rank": 0,
                "AgeGroup": null,
                "TrainSeasonTickets": null,
                "SelectedTrainTicketNumber": null,
                "TrainLoyaltyCard": null,
                "RoomSchedule": null,
                "MealsNSeatReq": null,
                "Gender": null,
                "PassportNumber2": null,
                "CountryOfIssuance2": null,
                "CountryOfNationality2": null,
                "ExpirationDate2": null,
                "IssueDate2": null,
                "TypeOfUSADocument": null,
                "USADocumentNumber": null,
                "USADocumentExpirationDate": null,
                "CubanDocumentNumber": null,
                "CubanDocumentExpirationDate": null,
                "CubanAddress": null,
                "Neighborhood": null,
                "CubanTelephone": null,
                "Province": null,
                "Town": null,
                "DateOfBirthString": "8\/27\/1998",
                "PassportExpDateString2": null,
                "PassportIssuingDateString2": null,
                "PassportExpDateString": null,
                "PassportIssuingDateString": null,
                "FlightsSeatMap": null,
                "PaymentInfoObject": [
                    {
                        "TravelType": "AIR",
                        "CardInfo": null,
                        "PaymentOption": "Cash",
                        "BillingNumber": null,
                        "CorporateCreditCard": null,
                        "AgencyCreditCard": false,
                        "CorporateCardCvv": null,
                        "Guarantee": null,
                        "ETFInfo": null,
                        "Address": null,
                        "TravelfusionCardChargeAmount": 0,
                        "IsVirtualCreditCardCreationFailed": false,
                        "ApprovalCode": null,
                        "CarBillingManualIssueVoucher": false
                    }
                ],
                "BaggagePiecesQty": 3,
                "ChosenCostCenterId": null,
                "ChosenCostCenter": null,
                "DateOfBirth": "1998-08-27T00:00:00",
                "PassportExpDate": null,
                "PassportIssuingDate": null,
                "AncillaryServiceIds": null,
                "ExcessBaggageWeightQuantity": null,
                "AncillaryServiceInfos": null,
                "UserRole": null,
                "EmployeeId": 0,
                "CorporateEmpId": null,
                "EmployeeJobTitle": null,
                "EmployeeCostCenter": null,
                "EmployeeRecordLocator": null,
                "AmadeusRecordLocator": null,
                "SabreRecordLocator": null,
                "TravelPortRecordLocator": null,
                "RedressNumber": null,
                "KnownTravellerId": null,
                "EmployeeIdentifier": null,
                "PassportNo": null,
                "PassportIssuingCountry": null,
                "PassportIssuingCountryCode": null,
                "CountryOfNationality": null,
                "NationalityCountryCode": null,
                "PassportIssuingCountryName": null,
                "VisaPurchased": false,
                "SpecialServiceRequestCodes": null,
                "IsGuestTraveller": false,
                "B2CPassword": null,
                "NdcBaggageInfoPerFlight": null,
                "SelectedNdcBaggagePrice": 0,
                "NdcServiceListOfferId": null,
                "ResidentDiscountCode": null,
                "ResidentDiscountAreaCode": null,
                "ResidentDiscountCityCode": null,
                "ResidentCountryCode": null,
                "SelectedPrepaidBaggage": [
                    {
                        "Id": null,
                        "Description": "3 x Checked Baggage",
                        "Quantity": "3",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 1,
                        "ApplicableSegments": null,
                        "Route": "ET900",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    },
                    {
                        "Id": null,
                        "Description": "3 x Checked Baggage",
                        "Quantity": "3",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 2,
                        "ApplicableSegments": null,
                        "Route": "ET700",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    }
                ],
                "SelectedFlightExtras": null
            },
            {
                "ContactDetailsNativeId": null,
                "Id": "737ba7cf-ae71-43e3-8680-921b6d185b57",
                "Title": null,
                "TypeCode": "CHD",
                "FirstName": "Faleti",
                "MiddleName": null,
                "LastName": "Sulaimon",
                "Email": null,
                "CountryCode": null,
                "Phone": null,
                "PhoneCode": null,
                "PhoneAreaCode": null,
                "DriversLicence": null,
                "NationalIdentity": null,
                "LocallyDefinedIDNumber": null,
                "MobilePhone": null,
                "MobilePhoneCode": null,
                "TicketNumber": null,
                "TicketStatus": "Unknown",
                "JetSmartPassengerData": null,
                "EmployeeUsername": null,
                "LoyalityProgram": null,
                "ReducedMobilityAssistanceInfo": null,
                "ChoosenSpeedyBoardingInfo": null,
                "CarLoyalityProgram": null,
                "HotelLoyalityProgram": null,
                "Rank": 0,
                "AgeGroup": null,
                "TrainSeasonTickets": null,
                "SelectedTrainTicketNumber": null,
                "TrainLoyaltyCard": null,
                "RoomSchedule": null,
                "MealsNSeatReq": null,
                "Gender": null,
                "PassportNumber2": null,
                "CountryOfIssuance2": null,
                "CountryOfNationality2": null,
                "ExpirationDate2": null,
                "IssueDate2": null,
                "TypeOfUSADocument": null,
                "USADocumentNumber": null,
                "USADocumentExpirationDate": null,
                "CubanDocumentNumber": null,
                "CubanDocumentExpirationDate": null,
                "CubanAddress": null,
                "Neighborhood": null,
                "CubanTelephone": null,
                "Province": null,
                "Town": null,
                "DateOfBirthString": "3\/1\/2002",
                "PassportExpDateString2": null,
                "PassportIssuingDateString2": null,
                "PassportExpDateString": null,
                "PassportIssuingDateString": null,
                "FlightsSeatMap": null,
                "PaymentInfoObject": null,
                "BaggagePiecesQty": 0,
                "ChosenCostCenterId": null,
                "ChosenCostCenter": null,
                "DateOfBirth": "2002-03-01T00:00:00",
                "PassportExpDate": null,
                "PassportIssuingDate": null,
                "AncillaryServiceIds": null,
                "ExcessBaggageWeightQuantity": null,
                "AncillaryServiceInfos": null,
                "UserRole": null,
                "EmployeeId": 0,
                "CorporateEmpId": null,
                "EmployeeJobTitle": null,
                "EmployeeCostCenter": null,
                "EmployeeRecordLocator": null,
                "AmadeusRecordLocator": null,
                "SabreRecordLocator": null,
                "TravelPortRecordLocator": null,
                "RedressNumber": null,
                "KnownTravellerId": null,
                "EmployeeIdentifier": null,
                "PassportNo": null,
                "PassportIssuingCountry": null,
                "PassportIssuingCountryCode": null,
                "CountryOfNationality": null,
                "NationalityCountryCode": null,
                "PassportIssuingCountryName": null,
                "VisaPurchased": false,
                "SpecialServiceRequestCodes": null,
                "IsGuestTraveller": false,
                "B2CPassword": null,
                "NdcBaggageInfoPerFlight": null,
                "SelectedNdcBaggagePrice": 0,
                "NdcServiceListOfferId": null,
                "ResidentDiscountCode": null,
                "ResidentDiscountAreaCode": null,
                "ResidentDiscountCityCode": null,
                "ResidentCountryCode": null,
                "SelectedPrepaidBaggage": [
                    {
                        "Id": null,
                        "Description": "3 x Checked Baggage",
                        "Quantity": "3",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 1,
                        "ApplicableSegments": null,
                        "Route": "ET900",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    },
                    {
                        "Id": null,
                        "Description": "3 x Checked Baggage",
                        "Quantity": "3",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 2,
                        "ApplicableSegments": null,
                        "Route": "ET700",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    }
                ],
                "SelectedFlightExtras": null
            },
            {
                "ContactDetailsNativeId": null,
                "Id": "737ba7cf-ae71-43e3-8680-921b6d185b57",
                "Title": null,
                "TypeCode": "INF",
                "FirstName": "Faleti",
                "MiddleName": null,
                "LastName": "Azeemah",
                "Email": null,
                "CountryCode": null,
                "Phone": null,
                "PhoneCode": null,
                "PhoneAreaCode": null,
                "DriversLicence": null,
                "NationalIdentity": null,
                "LocallyDefinedIDNumber": null,
                "MobilePhone": null,
                "MobilePhoneCode": null,
                "TicketNumber": null,
                "TicketStatus": "Unknown",
                "JetSmartPassengerData": null,
                "EmployeeUsername": null,
                "LoyalityProgram": null,
                "ReducedMobilityAssistanceInfo": null,
                "ChoosenSpeedyBoardingInfo": null,
                "CarLoyalityProgram": null,
                "HotelLoyalityProgram": null,
                "Rank": 0,
                "AgeGroup": null,
                "TrainSeasonTickets": null,
                "SelectedTrainTicketNumber": null,
                "TrainLoyaltyCard": null,
                "RoomSchedule": null,
                "MealsNSeatReq": null,
                "Gender": null,
                "PassportNumber2": null,
                "CountryOfIssuance2": null,
                "CountryOfNationality2": null,
                "ExpirationDate2": null,
                "IssueDate2": null,
                "TypeOfUSADocument": null,
                "USADocumentNumber": null,
                "USADocumentExpirationDate": null,
                "CubanDocumentNumber": null,
                "CubanDocumentExpirationDate": null,
                "CubanAddress": null,
                "Neighborhood": null,
                "CubanTelephone": null,
                "Province": null,
                "Town": null,
                "DateOfBirthString": "4\/12\/2023",
                "PassportExpDateString2": null,
                "PassportIssuingDateString2": null,
                "PassportExpDateString": null,
                "PassportIssuingDateString": null,
                "FlightsSeatMap": null,
                "PaymentInfoObject": null,
                "BaggagePiecesQty": 0,
                "ChosenCostCenterId": null,
                "ChosenCostCenter": null,
                "DateOfBirth": "2023-04-12T00:00:00",
                "PassportExpDate": null,
                "PassportIssuingDate": null,
                "AncillaryServiceIds": null,
                "ExcessBaggageWeightQuantity": null,
                "AncillaryServiceInfos": null,
                "UserRole": null,
                "EmployeeId": 0,
                "CorporateEmpId": null,
                "EmployeeJobTitle": null,
                "EmployeeCostCenter": null,
                "EmployeeRecordLocator": null,
                "AmadeusRecordLocator": null,
                "SabreRecordLocator": null,
                "TravelPortRecordLocator": null,
                "RedressNumber": null,
                "KnownTravellerId": null,
                "EmployeeIdentifier": null,
                "PassportNo": null,
                "PassportIssuingCountry": null,
                "PassportIssuingCountryCode": null,
                "CountryOfNationality": null,
                "NationalityCountryCode": null,
                "PassportIssuingCountryName": null,
                "VisaPurchased": false,
                "SpecialServiceRequestCodes": null,
                "IsGuestTraveller": false,
                "B2CPassword": null,
                "NdcBaggageInfoPerFlight": null,
                "SelectedNdcBaggagePrice": 0,
                "NdcServiceListOfferId": null,
                "ResidentDiscountCode": null,
                "ResidentDiscountAreaCode": null,
                "ResidentDiscountCityCode": null,
                "ResidentCountryCode": null,
                "SelectedPrepaidBaggage": [
                    {
                        "Id": null,
                        "Description": "1 x Checked Baggage",
                        "Quantity": "1",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 1,
                        "ApplicableSegments": null,
                        "Route": "ET900",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    },
                    {
                        "Id": null,
                        "Description": "1 x Checked Baggage",
                        "Quantity": "1",
                        "Amount": 0,
                        "CurrencyCode": "NGN",
                        "SegmentNumber": 2,
                        "ApplicableSegments": null,
                        "Route": "ET700",
                        "ItineraryId": "00000000-0000-0000-0000-000000000000",
                        "OtherDetails": null
                    }
                ],
                "SelectedFlightExtras": null
            }
        ],
        "NeedJustification": false,
        "PersonalCreditCards": null,
        "TravelName": null,
        "Meta": null,
        "TravelReason": null,
        "UniqueTripIdentifier": "kPPYpIvudts",
        "ThirdPartyBookingReferenceNumber": null,
        "EnableTravelGuard": false,
        "EnableBlueRibbonBags": false,
        "BookingReferenceNumber": "NYIXUZ",
        "StripeClientSecret": null,
        "IsShoppingCartEmpty": false,
        "AirlineBookingReferences": null,
        "AvailablePaymentOptions": [],
        "PaymentGateway": null,
        "TotalPrice": 2085847,
        "TermsUrl": null,
        "PaymentInfos": [
            {
                "TravelType": "AIR",
                "PaymentOption": "Cash"
            }
        ]
    }
}';




$resp = json_decode($htm, true);

$response = '{
    "adult": "1",
    "adult_baggageqty_0": "3",
    "adult_confirm_email_0": "Hercease001@gmail.com",
    "adult_dob_0": "2010-03-04",
    "adult_email_0": "Hercease001@gmail.com",
    "adult_firstname_0": "Azeez",
    "adult_gender_0": "Male",
    "adult_lastname_0": "Shina",
    "adult_passport_0": "1234567890",
    "adult_phone_0": "08082709997",
    "adult_title_0": "Mr",
    "adult_typecode_0": "ADT",
    "amount": "2085847",
    "bank": "UBA",
    "child_baggageqty_0": "0",
    "child_dob_0": "2011-08-12",
    "child_firstname_0": "Faleti",
    "child_gender_0": "Male",
    "child_lastname_0": "Sulaimon",
    "child_passport_0": "0123456",
    "child_typecode_0": "CHD",
    "children": "1",
    "countadult": "1",
    "countchild": "1",
    "countinfant": "1",
    "infant": "1",
    "infant_baggageqty_0": "0",
    "infant_dob_0": "2024-10-03",
    "infant_firstname_0": "Faleti",
    "infant_gender_0": "Female",
    "infant_lastname_0": "Azeemah",
    "infant_passport_0": "234569",
    "infant_typecode_0": "INF",
    "itenary_id": "b5f34ae9-b9ff-4536-9a10-e3ab91845f37",
    "payment_method": "bank transfer",
    "request_type": "book_flight",
    "sessionid": "bf377622-3a07-4be1-b381-6639a3973627"
}';

$adult_response = '{
    "adult": "1",
    "adult_baggageqty_0": "3",
    "adult_confirm_email_0": "Hercease001@gmail.com",
    "adult_dob_0": "2010-03-04",
    "adult_email_0": "Hercease001@gmail.com",
    "adult_firstname_0": "Azeez",
    "adult_gender_0": "Male",
    "adult_lastname_0": "Shina",
    "adult_passport_0": "1234567890",
    "adult_phone_0": "08082709997",
    "adult_title_0": "Mr",
    "adult_typecode_0": "ADT",
}';

$child_response = '{
     "child_baggageqty_0": "0",
    "child_dob_0": "2011-08-12",
    "child_firstname_0": "Faleti",
    "child_gender_0": "Male",
    "child_lastname_0": "Sulaimon",
    "child_passport_0": "0123456",
    "child_typecode_0": "CHD",
}';

$infant_response = '{
    "infant": "1",
    "infant_baggageqty_0": "0",
    "infant_dob_0": "2024-10-03",
    "infant_firstname_0": "Faleti",
    "infant_gender_0": "Female",
    "infant_lastname_0": "Azeemah",
    "infant_passport_0": "234569",
    "infant_typecode_0": "INF",
}';



// Decode the JSON string into an associative array
$request = json_decode($response, true);
//print_r($request);
/*foreach($resp['BookingDetails']['Flights'] as $item){
       //print_r($item['AirItinerary']['OriginDestinationOptions']);
};*/

$pnr = $resp['ReferenceNumber'];
$price_details = $resp['BookingDetails']['Flights'][0]['AirItineraryPricingInfo'];
$TotalPrice = number_format($price_details['TotalPrice']);
$BasePrice = number_format($price_details['BasePrice']);
$Tax = number_format($price_details['Tax']);
$payment_type = "cas";

//echo "<pre>";
//print_r($resp['BookingDetails']['Flights'][0]['AirItineraryPricingInfo']);
//print_r($resp['BookingDetails']['Travellers'][0]['SelectedPrepaidBaggage']);

$html = "<table style='width:100%;margin:0 auto;display:block'>
    <table style='max-width:1000px;display: table; border-collapse: separate; box-sizing: border-box; text-indent: initial; border-spacing: 2px; border-color: gray;' border='0' align='center' cellpadding='0' cellspacing='0'>
		<tbody style='border-collapse: separate; text-indent: initial; border-spacing: 2px;'>
			<tr>
				<td style='padding: 5px;'>
					<table style='width:100%;display: table; border-collapse: separate; box-sizing: border-box; text-indent: initial; border-spacing: 2px; border-color: gray;' cellpadding='0' cellspacing='0'>
						<tbody>
							<tr>
								<td style='padding: 5px;'>
									<img height='85' src='https://afotravels.com/assets/imgs/logo.png' />
								</td>
								<td style='text-align:right;padding:5px'>
									<h3 style='margin-top:5px;margin-bottom:5px'>Aforliyah Travel Limited: Suite 108, Aminu Kano Crescent, Wuse 2</h3>
									<h3 style='margin-top:5px;margin-bottom:5px'>Abuja, NG</h3>
									<h3 style='margin-top:5px;margin-bottom:5px'><a href='mailto:aforliyahtravels@gmail.com' target='_blank'>aforliyahtravels@gmail.com</a></h3>
								</td>
							</tr>
						</tbody>
					</table>
					<table style='width:100%;background-color:#054688;color:white;text-align:center'>
					<tbody>
					<tr>
						<td style='padding:10px; font-size: 20px; margin: 10px 0px 0px 0px;color: white; text-align: center;'>
							<table style='margin: 0px;width:100%;color:white;' class='m_-3631454989756343638no-margins-table'>
								<tbody>
									<tr>
										<td align='left' class='m_-3631454989756343638header-font' style='padding:0px;font-size: 20px;margin: 0;'>
											<b>Your trip</b>
										</td>
										<td align='right' width='40%' style='margin: 0;'>
											<table style='margin: 0;color:white;' class='m_-3631454989756343638no-margins-table'>
												<tbody>
												<tr>
													<td align='right' class='m_-3631454989756343638middle-name' style='padding:0px; font-size: 16px;'>
														<b>Booking ref:</b>
													</td>
													<td class='m_-3631454989756343638middle-name' style='padding:0 0 0 10px; font-size: 16px;'>
														$pnr
													</td>
												</tr>
											</tbody></table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
			
		<table>
			<tbody>
				<tr>
					<td style='padding:10px'></td>
				</tr>
			</tbody>
		</table>
		
		<table class='m_-3631454989756343638segment-table' style='width:100%;padding:10px;background-color:#f3f0f0'>
			<tbody>
				<tr>
					<td style='font-size:20px'>
						Passengers
					</td>
				</tr>
			</tbody>
		</table>";
		
		$html .= "<table style='width: 970px;margin: 10px 10px 0px 10px;border-collapse: collapse;font-size: 14px;'>
			<tbody>
				<tr style='border-bottom: 1px solid rgb(243,240,240);'>
					<td style='padding: 5px;' width='25%'>
						<b>Name</b>
					</td>
					<td style='padding: 5px;' width='25%'>
						<b>Type</b>
					</td>
					<td style='padding: 5px;' width='25%'>
						<b>Date Of Birth</b>
					</td>
					<td style='padding: 5px;' width='25%'>
						<b>Passport</b>
					</td>
				</tr>";

                     /*
                     online code for fetching passengers
						if(isset($request->{'adult_firstname_0'})){	
							for ($i=0; $i < $adult_count; $i++){
								$passenger_name = ucfirst($request->{"adult_title_$i"}).' '.$request->{"adult_lastname_$i"}.' '.$request->{"adult_firstname_$i"};
								$passenger_type = $request->{"adult_typecode_$i"};
								$passenger_dob = $request->{"adult_dob_$i"};
								$passport = $request->{"adult_passport_$i"};
								
								$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
											<td style='padding: 5px;'>
												$passenger_name
											</td>
											<td style='padding: 5px;'>
												$passenger_type
											</td>
											<td style='padding: 5px;'>
												$passenger_dob
											</td>
											<td style='padding: 5px;'>
												$passport
											</td>
										</tr>";
							}
						}

						if(isset($request->{'child_firstname_0'})){	
							for ($i=0; $i < $child_count; $i++){
								$passenger_name = $request->{"child_lastname_$i"}.' '.$request->{"child_firstname_$i"};
								$passenger_type = $request->{"child_typecode_$i"};
								$passenger_dob = $request->{"child_dob_$i"};
								$passport = $request->{"child_passport_$i"};
								
								$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
											<td style='padding: 5px;'>
												$passenger_name
											</td>
											<td style='padding: 5px;'>
												$passenger_type
											</td>
											<td style='padding: 5px;'>
												$passenger_dob
											</td>
											<td style='padding: 5px;'>
												$passport
											</td>
										</tr>";
								}
							}

							if(isset($request->{'infant_firstname_0'})){	
								for ($i=0; $i < $infant_count; $i++){
									$passenger_name = $request->{"infant_lastname_$i"}.' '.$request->{"infant_firstname_$i"};
									$passenger_type = $request->{"infant_typecode_$i"};
									$passenger_dob = $request->{"infant_dob_$i"};
									$passport = $request->{"infant_passport_$i"};
									
									$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
												<td style='padding: 5px;'>
													$passenger_name
												</td>
												<td style='padding: 5px;'>
													$passenger_type
												</td>
												<td style='padding: 5px;'>
													$passenger_dob
												</td>
												<td style='padding: 5px;'>
													$passport
												</td>
											</tr>";
									}
							}
                            */
                
			foreach($resp['BookingDetails']['Travellers'] as $key => $person){
                print_r($person['TypeCode']);
				$passenger_name = ucfirst($person['Title']).' '.$person['LastName'].' '.$person['FirstName'];
				$passenger_type = $person['TypeCode'];
				$passenger_dob = $person['DateOfBirthString'];
				$passenger_ticket = $data['TicketNumber'] ?? '/';
				
				$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
							<td style='padding: 5px;'>
								$passenger_name
							</td>
							<td style='padding: 5px;'>
								$passenger_type
							</td>
							<td style='padding: 5px;'>
								$passenger_dob
							</td>
							<td style='padding: 5px;'>
								$passenger_ticket
							</td>
						</tr>";
				}
				$html .= "</tbody></table>
						<table style='width:100%'>
							<tbody>
								<tr>
									<td style='padding:10px'></td>
								</tr>
							</tbody>
						</table>";
						
					foreach($resp['BookingDetails']['Flights'] as $item){
                        foreach($item['AirItinerary']['OriginDestinationOptions'] as $k => $value){
                            
                            foreach($value['FlightSegments'] as $key => $bounds){
                               
							$image = "https://images.kiwi.com/airlines/64/".$bounds['MarketingAirlineCode'].''.'.png';
							$airline = $bounds['OperatingAirlineName'];
							$departure_date = date("l j M  Y", strtotime($bounds['DepartureDate']));
							$duration = minutesToHoursAndMinutes(timeStringToMinutes($bounds['Duration']));
							$cabin = $bounds['Cabin'];
							$equipment = $bounds['Aircraft'];
							$departure_time = date("j M  g:i a", strtotime($bounds['DepartureDate']));
							$arrival_time = date("j M  g:i a", strtotime($bounds['ArrivalDate']));
							$airport_from = $bounds['DepartureAirport'];
							$airport_to = $bounds['ArrivalAirport'];
							$airport_full_from = $bounds['DepartureAirportName'];
							$airport_full_to = $bounds['ArrivalAirportName'];
							$airport_full_name_from = $airport_from.', '.$airport_full_from;
							$airport_full_name_to = $airport_full_to.', '.$airport_full_to;
							$service = $bounds['RouteNumber'];
							$baggage = $bounds['FreeBaggages'][0]['FreeQuantity'].' x Checked Baggage';
                            //$nam = array_key_exists($key, $Travellers) ? ucfirst($Travellers[$key]['Title']).' '.$Travellers[$key]['LastName'].' '.$Travellers[$key]['FirstName'] : ucfirst($Travellers[0]['Title']).' '.$Travellers[0]['LastName'].' '.$Travellers[0]['FirstName'];
                            $arrivalTerminal = $bounds['ArrivalTerminal'];
                            $departureTerminal = $bounds['DepartureTerminal'];
		
        $html .="<div style='page-break-inside:avoid'>
            <table style='padding:0px 10px 10px 10px;width:100%'>
                <tbody>
					<tr>
						<td style='font-size:20px;padding:0px'>
							$departure_date
						</td>
					</tr>
				</tbody>
			</table>
            <table style='background-color: rgb(243,240,240); padding: 10px 15px; width:100%' class='m_-3631454989756343638segment-table'>
                <tbody>
					<tr>
						<td style='padding: 5px;' align='left'>
								<img src='$image' width='40' class='CToWUd' data-bit='iit'>
						</td>
						<td style='padding: 5px;' valign='middle' colspan='2'>
							<p style='padding: 3px 0px; margin: 0px;' class='m_-3631454989756343638middle-name'>$airline</p>
						</td>
						<td style='padding: 5px;' align='right' style='padding-right:20px' valign='middle'></td>
					</tr>
					<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
						<td style='padding: 5px;'>
							<b>Departure</b>
						</td>
						<td style='padding: 5px;'>
							$departure_time
						</td>
						<td style='padding: 5px;'>
							<b>$airport_from</b>, $airport_full_name_from
						</td>
						<td style='padding: 5px;'>
							<p style='padding: 3px 0px; margin: 0px;'>Terminal: $departureTerminal </p>
						</td>
					</tr>
					<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
						<td style='padding: 5px;'>
							<b>Arrival</b>
						</td>
						<td style='padding: 5px;'>
							$arrival_time
						</td>
						<td style='padding: 5px;'>
							<b>$airport_to</b>, $airport_full_name_to
						</td>
						<td style='padding: 5px;'>
							<p style='padding: 3px 0px; margin: 0px;'>Terminal: $arrivalTerminal </p>
						</td>
					</tr>
                    <tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
                        <td style='padding: 5px;'>
                            <b>Duration</b>
                        </td>
                        <td style='padding: 5px;' colspan='3'>
                            $duration
                        </td>
                    </tr>
					<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
						<td style='padding: 5px;'>
							<b>Class</b>
						</td>
						<td style='padding: 5px;' colspan='3'>
							$cabin
						</td>
					</tr>
                    <tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
                        <td style='padding: 5px;'>
                            <b>Equipment</b>
                        </td>
                        <td style='padding: 5px;' colspan='3'>
                            $equipment
                        </td>
                    </tr>
				</tbody>
			</table>
        </div>
		
		<table>
			<tbody>
				<tr>
					<td style='padding:10px'></td>
				</tr>
			</tbody>
		</table>
		
        <div style='page-break-inside:avoid'>
            <table class='m_-3631454989756343638segment-table' style= 'padding:10px;background-color:#f3f0f0; width:100%'>
                <tbody>
					<tr>
                        <td style='font-size:20px;padding: 5px;'>
                            Services - $service
                        </td>
                     </tr>
				</tbody>
			</table>";
 

            foreach($resp['BookingDetails']['Travellers'] as $key => $person){

                $passport = "";
                $nam =ucfirst($person['Title']).' '.$person['LastName'].' '.$person['FirstName'];

                //$baggage = $bounds['FreeBaggages'][$key]['FreeQuantity'].' x Checked Baggage';

                    $html .="<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
                        <tbody>
                            <tr>
                                <td style='padding: 5px;' width='25%'><b>Name</b></td>
                                <td style='padding: 5px;' width='30%'><b>Baggage</b></td>
                                <td style='padding: 5px;' width='15%'><b>Seat</b></td>
                                <td style='padding: 5px;' width='30%'><b>Other</b></td>
                            </tr>
                                <tr valign='center'>
                                    <td style='padding: 5px;'>$nam</td>
                                    <td style='padding: 5px;'>$baggage</td>
                                    <td style='padding: 5px;'>/</td>
                                    <td style='padding: 5px;'>/</td>
                                </tr>
                        </tbody>
                    </table>
                </div>";
            }
            
            
}
}
}

        $html.="<div style='page-break-inside:avoid'>
            <table class='m_-3631454989756343638segment-table' style= 'padding:10px;background-color:#f3f0f0; width:100%'>
                <tbody>
					<tr>
                        <td style='font-size:20px;padding: 5px;'>
                            Payment details
                        </td>
                    </tr>
				</tbody>
			</table>";

        if($payment_type == "cash"){

                $html.= "<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
                        <tbody>
                            <tr>
                                <td style='padding: 5px;' width='25%'><b>Type</b></td>
                                <td style='padding: 5px;' width='30%'><b>Bank</b></td>
                                <td style='padding: 5px;' width='15%'><b>Acct no</b></td>
                                <td style='padding: 5px;' width='30%'><b>Acct name</b></td>
                            </tr>
                                <tr valign='center'>
                                    <td style='padding: 5px;'></td>
                                    <td style='padding: 5px;'></td>
                                    <td style='padding: 5px;'>/</td>
                                    <td style='padding: 5px;'>/</td>
                                </tr>
                        </tbody>
                    </table>";

        }else{

             $html.= "<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
                        <tbody>
                            <tr>
                                <td style='padding: 5px;' width='25%'><b>Type</b></td>
                                <td style='padding: 5px;' width='30%'><b>Bank</b></td>
                                <td style='padding: 5px;' width='15%'><b>Acct no</b></td>
                                <td style='padding: 5px;' width='30%'><b>Acct name</b></td>
                            </tr>
                                <tr valign='center'>
                                    <td style='padding: 5px;'>Paystack</td>
                                    <td style='padding: 5px;'>/</td>
                                    <td style='padding: 5px;'>/</td>
                                    <td style='padding: 5px;'>/</td>
                                </tr>
                        </tbody>
                    </table>";

        }

        $html.="</div>";
		
		$html .= "<div style='page-break-inside:avoid'>
			<table style='background-color:#054688;font-size:16px;color:white;text-align:center;width:100%'>
				<tbody>
					<tr style='padding:15px 10px 0px 10px'>
						<td align='left' width='15%' style='padding-top:15px;padding-left:10px'>Base price</td>
                        <td align='left' width='15%' style='padding-top:15px'>Taxes</td>
                        <td align='left' width='15%' style='padding-top:15px'>Service Fee</td>
                        <td align='right' style='padding-top:15px;padding-right:10px'>Total Price</td>
					</tr>
					<tr>
						<td colspan='4'>
							<table>
								<tbody>
									<tr>
										<td height='1' style='border-top:1px solid white;margin:0px 5px;padding:0px'></td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<tr style='padding:0px 10px 15px 10px'>
						<td align='left' style='padding-bottom:15px;padding-left:10px'>&#8358; $BasePrice</td>
                        <td align='left' style='padding-bottom:15px'>&#8358; $Tax</td>
                        <td align='left' style='padding-bottom:15px'>&#8358; 0.00</td>
                        <td align='right' style='padding-bottom:15px;padding-right:10px'>&#8358; $TotalPrice</td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<table>
			<tbody>
				<tr>
					<td style='padding:10px'></td>
				</tr>
			</tbody>
		</table>
		
	</td>
	</tr>
	</tbody>
	</table>
	</table>";

    echo $html;
	$subject = "Itinerary for confirmed booking";
	//$result = sendmail("hercease001@gmail.com","Faleti azeez",$html,'Flight Booking Confirmation PNR:'.$resp['ReferenceNumber']);
//echo $result;

?>
