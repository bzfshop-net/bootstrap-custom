/**

 Correctly handle PNG transparency in Win IE 5.5 & 6.
 http://homepage.ntlworld.com/bobosola. Updated 18-Jan-2006.

 Use in <HEAD> with DEFER keyword wrapped in conditional comments:
 <!--[if lt IE 7]>
 <script defer type="text/javascript" src="pngfix.js"></script>
 <![endif]-->

 */

jQuery(function () {
    /************** fix ajax call getJSON with no response in IE **************/
    jQuery.support.cors = true;

    /****** 修正 IE png,gif 图片问题 ********/

    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);

    if (!(version >= 5.5 && version < 7.0)) {
        return;
    }

    function fixImage(img) {
        var imgName = img.src.toUpperCase();
        // we need to remove paramters
        var paramIndex = imgName.indexOf('?');
        if (paramIndex > 0) {
            imgName = imgName.substring(0, paramIndex);
        }
        if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
            var imgID = (img.id) ? " id='" + img.id + "' " : "";
            var imgClass = (img.className) ? " class='" + img.className + "' " : "";
            var imgTitle = (img.title) ? " title='" + img.title + "' " : " title='" + img.alt + "' ";
            var imgStyle = "display:inline-block;" + img.style.cssText;
            if (img.align == "left") {
                imgStyle = "float:left;" + imgStyle;
            }
            if (img.align == "right") {
                imgStyle = "float:right;" + imgStyle;
            }
            if (img.parentElement.href) {
                imgStyle = "cursor:hand;" + imgStyle;
            }
            var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
            img.outerHTML = strNewHTML;
        }
    }

    /**************  fix ie6 png image problem ****************/
        // fix css background pngs
    jQuery(".pngfix").each(function () {
        // fix background problem
        var bgIMG = jQuery(this).css('background-image');
        if (bgIMG && (bgIMG.indexOf(".png") != -1 || bgIMG.indexOf(".gif") != -1)) {
            var iebg = bgIMG.split('url(')[1].split(')')[0];
            jQuery(this).css('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + iebg + "',sizingMethod='scale',enabled='true')");
        }

        //fix png transparent problem
        if ('img' == $(this)[0].tagName.toLowerCase()) {
            fixImage(this);
        }
    });


    /*********  fix bug for image resize in IE 6 ***********/
    jQuery("img").each(function () {
        var imgObject = jQuery(this);

        var imgWidth = (imgObject.css("width") > 0) ? imgObject.css("width") : ((imgObject.attr("width") > 0) ? imgObject.attr("width") : 0);
        if (imgWidth > 0) {
            imgObject.width(imgWidth);
        }

        var imgHeight = (imgObject.css("height") > 0) ? imgObject.css("height") : ((imgObject.attr("height") > 0) ? imgObject.attr("height") : 0);
        if (imgHeight > 0) {
            imgObject.height(imgHeight);
        }
    });

});
