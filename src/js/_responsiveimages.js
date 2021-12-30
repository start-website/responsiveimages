window.onload = function () {
    var urlSite = document.location.origin;
    var urlController = 'http://localhost/shop/responsiveimages-createimages/';
    var images = document.querySelectorAll('[data-respimage]');
  
    if (images.length === 0) {
      images = document.getElementsByTagName("img");
    }
  
    var windowWidth = window.innerWidth;
    var reg = new RegExp('^' + urlSite);
    var imagesInfo = [];
    var set = new Set();
  
    images: for (var i = 0; i < images.length; i++) {
      var img = images[i];
      var imageSrc = img.src.replace(/\?.*?$/, '');
  
      if (reg.test(imageSrc) && /\.(png|jpe?g|gif|webp)$/.test(imageSrc)) {
        var imageControlPoints = JSON.parse(img.getAttribute('data-respimage'));
        var imageExcludeFormat = img.getAttribute('data-responsiveimages-exclude-format');
  
        if (imageExcludeFormat && typeof imageExcludeFormat === 'string') {
          imageExcludeFormat = imageExcludeFormat.split(/\s*,\s*/);
        } else {
          imageExcludeFormat = null;
        }
  
        var imageExcludeBreakpoints = img.getAttribute('data-responsiveimages-exclude-breakpoints');
  
        if (imageExcludeBreakpoints && typeof imageExcludeBreakpoints === 'string') {
          imageExcludeBreakpoints = imageExcludeBreakpoints.split(/\s*,\s*/);
        } else {
          imageExcludeBreakpoints = null;
        }
  
        var imgWidth = img.clientWidth;
        var imageVW = imgWidth / windowWidth * 100;
        imageSrc = imageSrc.replace(urlSite, '');
  
        if (imgWidth === 0) {
          console.log('[responsiveimages]: ' + imageSrc + ' - Image width is too small');
          continue images;
        }
  
        if (!imageControlPoints) {
          console.log('[responsiveimages]: ' + img + ' - Image has no control points');
          continue;
        }
  
        for (var k = 0; k < imageControlPoints.length; k++) {
          var imageControlPoint = imageControlPoints[k];
  
          if (window.screen.width === imageControlPoint && !set.has(imageSrc)) {
            set.add(imageSrc);
            imagesInfo.push({
              src: imageSrc,
              vw: imageVW,
              deviceWidth: window.screen.width,
              windowWidth: windowWidth,
              hostName: document.location.hostname,
              host: document.location.host,
              href: document.location.href,
              pathName: document.location.pathname,
              imageExcludeFormat: imageExcludeFormat,
              imageExcludeBreakpoints: imageExcludeBreakpoints
            });
          }
        }
      }
    }
  
    if (imagesInfo.length !== 0) {
      var param = JSON.stringify(imagesInfo);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', urlController);
      xhr.send(param);
  
      xhr.onerror = function () {
        console.log('Request failed');
      };
    }
  };