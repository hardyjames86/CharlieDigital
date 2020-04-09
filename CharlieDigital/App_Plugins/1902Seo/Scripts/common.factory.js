angular.module("umbraco.resources").factory("commonFactory1902Seo", function () {
    var self = {
        hintBuilder: function (content, position , url, urlText) {
           
            if ( position ==undefined || position == "") {
                position = "left"
            }

            var container = document.createElement("span");
            container.className = "c-hint-" + position;


            var icon = document.createElement("span")
            icon.className = "icon-c-hint";

            var toolTip = document.createElement("span")
            toolTip.className = "c-hint-content"
            var toolTipText = document.createTextNode(content );
            toolTip.appendChild(toolTipText);

            
         

            if (url != undefined && url != "" && urlText != undefined && urlText != "") {
                var helplink = document.createElement("a");
                helplink.setAttribute("href",url);
                helplink.setAttribute("target", "_blank");
                helplink.className = "c-a-undelined c-pointer"
                var helplinktext = document.createTextNode(urlText);
                helplink.appendChild(helplinktext)
                toolTip.appendChild(helplink);
            }


            container.appendChild(icon);
            container.appendChild(toolTip);

            container.addEventListener('mouseenter', function () {
                var doc = document.body.getBoundingClientRect();
                var docHeight = doc.height;
                var docWidth = doc.width;

                var element = this.getElementsByClassName('c-hint-content')[0].getBoundingClientRect();
                var elementHeight = element.height;
                var elementWidth = element.width;
                var hintIcon = this.getBoundingClientRect();
                


                if (docHeight < (elementHeight + hintIcon.top + 50)) {
                    this.classList.add("c-hint-top");
                } else {
                    this.classList.remove("c-hint-top");
                }



                if (this.classList.contains('c-hint-left')) {
                    if (doc.width <= (hintIcon.left + element.width)) {
                        this.classList.remove('c-hint-left');
                        this.classList.add('c-hint-right');
                        this.classList.add('c-hint-relative')
                        this.classList.add('c-hint-altered');
                    }
                } else if (this.classList.contains('c-hint-right') && (this.classList.contains('c-hint-altered'))) {
                    if (doc.width >= (hintIcon.left + element.width)) {
                        this.classList.add('c-hint-left');
                        this.classList.remove('c-hint-right');
                        this.classList.remove('c-hint-relative')
                    }
                }
            });

            return container;
        },
        ellipsis: function (input, maxLength) {
            var inputString = input;
            if (inputString != undefined && maxLength != undefined && inputString.length > maxLength) {
                inputString = inputString.substring(0, (maxLength)) + "...";
            }
            return inputString;
        }        
    };
    return self;
});