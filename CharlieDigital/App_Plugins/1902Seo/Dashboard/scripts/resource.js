angular.module("umbraco.services").factory("seoDashboardResource1902", function ($q, $http, umbRequestHelper) {
    var BASE_URL = "/umbraco/backoffice/Seo1902/Dashboard/";
    var self = {
        getLanguages: function (filter) {
            var url = BASE_URL + "GetAllLanguages";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getMaxUploadKb: function (filter) {
            var url = BASE_URL + "GetMaxUploadLimit";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getPageAutocompletePage: function () {
            var url = BASE_URL + "GetPageAutocompleteValues";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getDocumentTypes: function (filter) {


            var url = BASE_URL + "GetAllDocumentType?PageSize=" + filter.PageSize + "&Page=" + filter.Page + "&Search=" + filter.Search;
            var method = "GET";
            var contentType = "application/json; charset=UTF-8"
            return $http({
                method: method,
                url: url
            });
        },
        updateDocumentComposition: function (origData) {
            var data = origData;
            var url = BASE_URL + "UpdateDocumentLink";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";
            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });

        },
        getPages: function (filter) {

            var url = BASE_URL + "GetPages?PageSize=" + filter.PageSize + "&Page=" + filter.Page + "&Search=" + filter.Search + "&LanguageUniqueId=" + filter.LanguageUniqueId;
            var method = "GET";
            return $http({
                method: method,
                url: url,
            });
        },
        indexAll: function (isToIndex) {
            var data = {
                IsSetToIndex: isToIndex
            };
            var url = BASE_URL + "IndexAllPage";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });

        },
        getGlobalOpenGraphSettings: function (languageUniqueId) {
            var url = BASE_URL + "GetGlobalOpenGraphSettings?languageUniqueId=" + languageUniqueId;
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getGooglePublisherPage: function () {

            var url = BASE_URL + "GetGooglePublisherPage";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        saveGlobalOpenGraphValues: function (model) {
            var data = {
                TwitterImage: model.imageValue,
                TwitterTitle: model.twitterTitle,
                TwitterDescription: model.twitterDescription,
                OgImage: model.imageValue,
                OgTitle: model.ogTitle,
                OgDescription: model.ogDescription,
                GoogleImage: model.imageValue,
                GoogleTitle: model.googleTitle,
                GoogleDescription: model.googleDescription,
                IsSetDefaultImage: model.imageSetAsDefault,
                DefaultImage: model.imageValue,
                LanguageUniqueId: model.LanguageUniqueId,
                IsOverwriteAllByLanguage: model.overWriteAll
            };


            var url = BASE_URL + "UpdateAllGlobalSettings";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });

        },
        saveGlobalBusinessSchema: function (model) {
            var data = model;
            var url = BASE_URL + "UpdateGlobalSchema";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });


        },
        getGlobalSchemaSettings: function () {
            var url = BASE_URL + "GetGlobalBusiness";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        saveAll: function (pages, documentTypes, isIndexAllAll, goolgePlusSite, languageUniqueId) {
            var data = {

                Pages: pages,
                DocumentTypes: documentTypes,
                IsSetToIndex: isIndexAllAll,
                GooglePublisherPage: goolgePlusSite,
                LanguageUniqueId: languageUniqueId
            };
            var url = BASE_URL + "SaveAll";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });
        },
        getAllCountries: function () {
            var countries = [
                  { name: 'Afghanistan', code: 'AF' },
                  { name: 'Åland Islands', code: 'AX' },
                  { name: 'Albania', code: 'AL' },
                  { name: 'Algeria', code: 'DZ' },
                  { name: 'American Samoa', code: 'AS' },
                  { name: 'AndorrA', code: 'AD' },
                  { name: 'Angola', code: 'AO' },
                  { name: 'Anguilla', code: 'AI' },
                  { name: 'Antarctica', code: 'AQ' },
                  { name: 'Antigua and Barbuda', code: 'AG' },
                  { name: 'Argentina', code: 'AR' },
                  { name: 'Armenia', code: 'AM' },
                  { name: 'Aruba', code: 'AW' },
                  { name: 'Australia', code: 'AU' },
                  { name: 'Austria', code: 'AT' },
                  { name: 'Azerbaijan', code: 'AZ' },
                  { name: 'Bahamas', code: 'BS' },
                  { name: 'Bahrain', code: 'BH' },
                  { name: 'Bangladesh', code: 'BD' },
                  { name: 'Barbados', code: 'BB' },
                  { name: 'Belarus', code: 'BY' },
                  { name: 'Belgium', code: 'BE' },
                  { name: 'Belize', code: 'BZ' },
                  { name: 'Benin', code: 'BJ' },
                  { name: 'Bermuda', code: 'BM' },
                  { name: 'Bhutan', code: 'BT' },
                  { name: 'Bolivia', code: 'BO' },
                  { name: 'Bosnia and Herzegovina', code: 'BA' },
                  { name: 'Botswana', code: 'BW' },
                  { name: 'Bouvet Island', code: 'BV' },
                  { name: 'Brazil', code: 'BR' },
                  { name: 'British Indian Ocean Territory', code: 'IO' },
                  { name: 'Brunei Darussalam', code: 'BN' },
                  { name: 'Bulgaria', code: 'BG' },
                  { name: 'Burkina Faso', code: 'BF' },
                  { name: 'Burundi', code: 'BI' },
                  { name: 'Cambodia', code: 'KH' },
                  { name: 'Cameroon', code: 'CM' },
                  { name: 'Canada', code: 'CA' },
                  { name: 'Cape Verde', code: 'CV' },
                  { name: 'Cayman Islands', code: 'KY' },
                  { name: 'Central African Republic', code: 'CF' },
                  { name: 'Chad', code: 'TD' },
                  { name: 'Chile', code: 'CL' },
                  { name: 'China', code: 'CN' },
                  { name: 'Christmas Island', code: 'CX' },
                  { name: 'Cocos (Keeling) Islands', code: 'CC' },
                  { name: 'Colombia', code: 'CO' },
                  { name: 'Comoros', code: 'KM' },
                  { name: 'Congo', code: 'CG' },
                  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
                  { name: 'Cook Islands', code: 'CK' },
                  { name: 'Costa Rica', code: 'CR' },
                  { name: 'Cote D\'Ivoire', code: 'CI' },
                  { name: 'Croatia', code: 'HR' },
                  { name: 'Cuba', code: 'CU' },
                  { name: 'Cyprus', code: 'CY' },
                  { name: 'Czech Republic', code: 'CZ' },
                  { name: 'Denmark', code: 'DK' },
                  { name: 'Djibouti', code: 'DJ' },
                  { name: 'Dominica', code: 'DM' },
                  { name: 'Dominican Republic', code: 'DO' },
                  { name: 'Ecuador', code: 'EC' },
                  { name: 'Egypt', code: 'EG' },
                  { name: 'El Salvador', code: 'SV' },
                  { name: 'Equatorial Guinea', code: 'GQ' },
                  { name: 'Eritrea', code: 'ER' },
                  { name: 'Estonia', code: 'EE' },
                  { name: 'Ethiopia', code: 'ET' },
                  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
                  { name: 'Faroe Islands', code: 'FO' },
                  { name: 'Fiji', code: 'FJ' },
                  { name: 'Finland', code: 'FI' },
                  { name: 'France', code: 'FR' },
                  { name: 'French Guiana', code: 'GF' },
                  { name: 'French Polynesia', code: 'PF' },
                  { name: 'French Southern Territories', code: 'TF' },
                  { name: 'Gabon', code: 'GA' },
                  { name: 'Gambia', code: 'GM' },
                  { name: 'Georgia', code: 'GE' },
                  { name: 'Germany', code: 'DE' },
                  { name: 'Ghana', code: 'GH' },
                  { name: 'Gibraltar', code: 'GI' },
                  { name: 'Greece', code: 'GR' },
                  { name: 'Greenland', code: 'GL' },
                  { name: 'Grenada', code: 'GD' },
                  { name: 'Guadeloupe', code: 'GP' },
                  { name: 'Guam', code: 'GU' },
                  { name: 'Guatemala', code: 'GT' },
                  { name: 'Guernsey', code: 'GG' },
                  { name: 'Guinea', code: 'GN' },
                  { name: 'Guinea-Bissau', code: 'GW' },
                  { name: 'Guyana', code: 'GY' },
                  { name: 'Haiti', code: 'HT' },
                  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
                  { name: 'Holy See (Vatican City State)', code: 'VA' },
                  { name: 'Honduras', code: 'HN' },
                  { name: 'Hong Kong', code: 'HK' },
                  { name: 'Hungary', code: 'HU' },
                  { name: 'Iceland', code: 'IS' },
                  { name: 'India', code: 'IN' },
                  { name: 'Indonesia', code: 'ID' },
                  { name: 'Iran, Islamic Republic Of', code: 'IR' },
                  { name: 'Iraq', code: 'IQ' },
                  { name: 'Ireland', code: 'IE' },
                  { name: 'Isle of Man', code: 'IM' },
                  { name: 'Israel', code: 'IL' },
                  { name: 'Italy', code: 'IT' },
                  { name: 'Jamaica', code: 'JM' },
                  { name: 'Japan', code: 'JP' },
                  { name: 'Jersey', code: 'JE' },
                  { name: 'Jordan', code: 'JO' },
                  { name: 'Kazakhstan', code: 'KZ' },
                  { name: 'Kenya', code: 'KE' },
                  { name: 'Kiribati', code: 'KI' },
                  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
                  { name: 'Korea, Republic of', code: 'KR' },
                  { name: 'Kuwait', code: 'KW' },
                  { name: 'Kyrgyzstan', code: 'KG' },
                  { name: 'Lao People\'S Democratic Republic', code: 'LA' },
                  { name: 'Latvia', code: 'LV' },
                  { name: 'Lebanon', code: 'LB' },
                  { name: 'Lesotho', code: 'LS' },
                  { name: 'Liberia', code: 'LR' },
                  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
                  { name: 'Liechtenstein', code: 'LI' },
                  { name: 'Lithuania', code: 'LT' },
                  { name: 'Luxembourg', code: 'LU' },
                  { name: 'Macao', code: 'MO' },
                  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
                  { name: 'Madagascar', code: 'MG' },
                  { name: 'Malawi', code: 'MW' },
                  { name: 'Malaysia', code: 'MY' },
                  { name: 'Maldives', code: 'MV' },
                  { name: 'Mali', code: 'ML' },
                  { name: 'Malta', code: 'MT' },
                  { name: 'Marshall Islands', code: 'MH' },
                  { name: 'Martinique', code: 'MQ' },
                  { name: 'Mauritania', code: 'MR' },
                  { name: 'Mauritius', code: 'MU' },
                  { name: 'Mayotte', code: 'YT' },
                  { name: 'Mexico', code: 'MX' },
                  { name: 'Micronesia, Federated States of', code: 'FM' },
                  { name: 'Moldova, Republic of', code: 'MD' },
                  { name: 'Monaco', code: 'MC' },
                  { name: 'Mongolia', code: 'MN' },
                  { name: 'Montserrat', code: 'MS' },
                  { name: 'Morocco', code: 'MA' },
                  { name: 'Mozambique', code: 'MZ' },
                  { name: 'Myanmar', code: 'MM' },
                  { name: 'Namibia', code: 'NA' },
                  { name: 'Nauru', code: 'NR' },
                  { name: 'Nepal', code: 'NP' },
                  { name: 'Netherlands', code: 'NL' },
                  { name: 'Netherlands Antilles', code: 'AN' },
                  { name: 'New Caledonia', code: 'NC' },
                  { name: 'New Zealand', code: 'NZ' },
                  { name: 'Nicaragua', code: 'NI' },
                  { name: 'Niger', code: 'NE' },
                  { name: 'Nigeria', code: 'NG' },
                  { name: 'Niue', code: 'NU' },
                  { name: 'Norfolk Island', code: 'NF' },
                  { name: 'Northern Mariana Islands', code: 'MP' },
                  { name: 'Norway', code: 'NO' },
                  { name: 'Oman', code: 'OM' },
                  { name: 'Pakistan', code: 'PK' },
                  { name: 'Palau', code: 'PW' },
                  { name: 'Palestinian Territory, Occupied', code: 'PS' },
                  { name: 'Panama', code: 'PA' },
                  { name: 'Papua New Guinea', code: 'PG' },
                  { name: 'Paraguay', code: 'PY' },
                  { name: 'Peru', code: 'PE' },
                  { name: 'Philippines', code: 'PH' },
                  { name: 'Pitcairn', code: 'PN' },
                  { name: 'Poland', code: 'PL' },
                  { name: 'Portugal', code: 'PT' },
                  { name: 'Puerto Rico', code: 'PR' },
                  { name: 'Qatar', code: 'QA' },
                  { name: 'Reunion', code: 'RE' },
                  { name: 'Romania', code: 'RO' },
                  { name: 'Russian Federation', code: 'RU' },
                  { name: 'RWANDA', code: 'RW' },
                  { name: 'Saint Helena', code: 'SH' },
                  { name: 'Saint Kitts and Nevis', code: 'KN' },
                  { name: 'Saint Lucia', code: 'LC' },
                  { name: 'Saint Pierre and Miquelon', code: 'PM' },
                  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
                  { name: 'Samoa', code: 'WS' },
                  { name: 'San Marino', code: 'SM' },
                  { name: 'Sao Tome and Principe', code: 'ST' },
                  { name: 'Saudi Arabia', code: 'SA' },
                  { name: 'Senegal', code: 'SN' },
                  { name: 'Serbia and Montenegro', code: 'CS' },
                  { name: 'Seychelles', code: 'SC' },
                  { name: 'Sierra Leone', code: 'SL' },
                  { name: 'Singapore', code: 'SG' },
                  { name: 'Slovakia', code: 'SK' },
                  { name: 'Slovenia', code: 'SI' },
                  { name: 'Solomon Islands', code: 'SB' },
                  { name: 'Somalia', code: 'SO' },
                  { name: 'South Africa', code: 'ZA' },
                  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
                  { name: 'Spain', code: 'ES' },
                  { name: 'Sri Lanka', code: 'LK' },
                  { name: 'Sudan', code: 'SD' },
                  { name: 'Suriname', code: 'SR' },
                  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
                  { name: 'Swaziland', code: 'SZ' },
                  { name: 'Sweden', code: 'SE' },
                  { name: 'Switzerland', code: 'CH' },
                  { name: 'Syrian Arab Republic', code: 'SY' },
                  { name: 'Taiwan, Province of China', code: 'TW' },
                  { name: 'Tajikistan', code: 'TJ' },
                  { name: 'Tanzania, United Republic of', code: 'TZ' },
                  { name: 'Thailand', code: 'TH' },
                  { name: 'Timor-Leste', code: 'TL' },
                  { name: 'Togo', code: 'TG' },
                  { name: 'Tokelau', code: 'TK' },
                  { name: 'Tonga', code: 'TO' },
                  { name: 'Trinidad and Tobago', code: 'TT' },
                  { name: 'Tunisia', code: 'TN' },
                  { name: 'Turkey', code: 'TR' },
                  { name: 'Turkmenistan', code: 'TM' },
                  { name: 'Turks and Caicos Islands', code: 'TC' },
                  { name: 'Tuvalu', code: 'TV' },
                  { name: 'Uganda', code: 'UG' },
                  { name: 'Ukraine', code: 'UA' },
                  { name: 'United Arab Emirates', code: 'AE' },
                  { name: 'United Kingdom', code: 'GB' },
                  { name: 'United States', code: 'US' },
                  { name: 'United States Minor Outlying Islands', code: 'UM' },
                  { name: 'Uruguay', code: 'UY' },
                  { name: 'Uzbekistan', code: 'UZ' },
                  { name: 'Vanuatu', code: 'VU' },
                  { name: 'Venezuela', code: 'VE' },
                  { name: 'Viet Nam', code: 'VN' },
                  { name: 'Virgin Islands, British', code: 'VG' },
                  { name: 'Virgin Islands, U.S.', code: 'VI' },
                  { name: 'Wallis and Futuna', code: 'WF' },
                  { name: 'Western Sahara', code: 'EH' },
                  { name: 'Yemen', code: 'YE' },
                  { name: 'Zambia', code: 'ZM' },
                  { name: 'Zimbabwe', code: 'ZW' }
            ];
            return countries;
        },
        registerInstance: function (verificationData) {
            var data = {
                Email: verificationData.email,
                CountryCode: verificationData.countryCode,
                IsAcceptTermsAndCondition: verificationData.isAcceptTerms
            };
            var url = BASE_URL + "VerifyRegistration";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });
        },
        verifyRegistration: function (verificationData) {
            var data = {
                Code: verificationData.code
            }
            var url = BASE_URL + "RegisterInstance"
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                data: data,
                url: url
            });

        },
        validateIsRegistered: function () {
            var url = BASE_URL + "ValidateIsRegistered";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        regenerateCode: function () {
            var url = BASE_URL + "RegenerateCode";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });

        },
        importSeoPlus: function () {
            var url = BASE_URL + "ImportToSeoPlus";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        importProgess: function () {
            var url = BASE_URL + "SyncProgress";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        processFirstTimeScrapper: function () {
            var url = BASE_URL + "ProcessFirstTimeScrapper";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        getSchema: function (data) {
            var url = BASE_URL + "SchemaSettings";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";
            var data = {
                Type: data.Type,
                Name: data.Name,
                SchemaScript: data.SchemaScript

            };
            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url,
                data: data
            });
        },
        saveSchema: function (data) {
            var url = BASE_URL + "SaveSchema";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";
            var data = {
                Type: data.Type,
                Name: data.Name,
                SchemaScript: data.SchemaScript,
                IsAdd: data.IsAdd
            };
            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url,
                data: data
            });
        },
        getSchemaModel: function () {
            var url = BASE_URL + "GetSchemaModel";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        buildBasicSchema: function (data) {
            var url = BASE_URL + "BuildSchema";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";
            var data = data;
            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url,
                data: data
            });
        },
        getLocalBusinesses: function () {
            var url = BASE_URL + "GetLocalBusinesses";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        checkAndEnableSEO: function (forceEnable) {
            var url = BASE_URL + "CheckPageProperties";
            var data = {
                ForceEnable: forceEnable
            };
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url,
                data: data
            });
        },
        checkProgress: function () {
            var url = BASE_URL + "CheckProgress";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        checkStatus: function () {
            var url = BASE_URL + "GetLatestCheckStatus";
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getFileSummary: function (isCheck) {
            var url = BASE_URL + "GetSummaryFileInfo?isCheck=" + isCheck;
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        finishStartUp: function () {
            var url = BASE_URL + "FinishStartUp";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        },
        disableSeo: function () {
            var url = BASE_URL + "DisableEditingSeo";
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        }
    };
    return self;

});