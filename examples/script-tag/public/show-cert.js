/**
 * Пример извлечения информации о сертификате
 * */
;(function () {
  'use strict';

  var $certificate = document.getElementById('certificate'),
    $certificateDetails = document.getElementById('certificateDetails'),
    $certificateInfo = document.getElementById('certificateInfo'),
    $certificatesError = document.getElementById('certificateInfoError');

  $certificateDetails.style.display = 'none';

  $certificateDetails.addEventListener('toggle', function () {
    if ($certificateDetails.open) {
      var thumbprint = $certificate.value;

      $certificateInfo.textContent = 'Запрашивается...';

      window.cryptoPro.getCertificate(thumbprint).then(function (certificate) {
        Promise.all([
          certificate.isValid(),
          certificate.getCadesProp('Version'),
          certificate.exportBase64(),
          certificate.getAlgorithm(),
          certificate.getExtendedKeyUsage(),
          certificate.getOwnerInfo(),
          certificate.getIssuerInfo(),
          certificate.getDecodedExtendedKeyUsage(),
          certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.1'),
          certificate.hasExtendedKeyUsage(['1.3.6.1.5.5.7.3.2', '1.3.6.1.4.1.311.10.3.12']),
          certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.2'),
          certificate.hasExtendedKeyUsage(['1.3.6.1.5.5.7.3.3', '1.3.6.1.4.1.311.10.3.12']),
        ]).then(function (results) {
          $certificateInfo.textContent = JSON.stringify({
            name: certificate.name,
            issuerName: certificate.issuerName,
            subjectName: certificate.subjectName,
            thumbprint: certificate.thumbprint,
            validFrom: certificate.validFrom,
            validTo: certificate.validTo,
            isValid: results[0],
            version: results[1],
            base64: results[2],
            algorithm: results[3],
            extendedKeyUsage: results[4],
            ownerInfo: results[5],
            issuerInfo: results[6],
            decodedExtendedKeyUsage: results[7],
            '1.3.6.1.4.1.311.80.1': results[8],
            "['1.3.6.1.5.5.7.3.2', '1.3.6.1.4.1.311.10.3.12']": results[9],
            '1.3.6.1.4.1.311.80.2': results[10],
            "'1.3.6.1.5.5.7.3.3', '1.3.6.1.4.1.311.10.3.12'": results[11],
          }, null, '  ');
        }, handleError);
      }, handleError);

      return;
    }

    $certificateInfo.textContent = '';
  });

  function handleError(error) {
    $certificatesError.textContent = '\n' + error.message;
  }
})();
