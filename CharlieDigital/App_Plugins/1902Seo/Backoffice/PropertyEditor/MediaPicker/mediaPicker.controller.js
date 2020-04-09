angular.module('umbraco').controller('mediaPicker.1902Seo.controller', function ($rootScope, $scope, $element, mediaPicker1902SeoResource, editorService, mediaHelper, userService, entityResource, commonFactory1902Seo, imageHelper, mediaResource) {
    //var maxKb = $scope.model.config.maxKb;
    var idealWidth = parseFloat( $scope.model.config.idealWidth);
    var idealHeight = parseFloat($scope.model.config.idealHeight);
    $scope.idealHeight = idealHeight;
    $scope.idealWidth = idealWidth;
    $scope.maxKb = 4000;
    $scope.maxKbDisplay = $scope.maxKb > 1000 ? Math.floor($scope.maxKb / 1000) + ' mb' : $scope.maxKb + ' kb';
    $scope.model.isExpand = true;
    $scope.warningMessage = '';
    var hintMessage = 'The maximum file size set for this image is determined by your server configuration.';
    $scope.model.rawImageSizeHint = commonFactory1902Seo.hintBuilder(hintMessage, "left").innerHTML;
    if (!$scope.model.config.startNodeId) {
        userService.getCurrentUser().then(function (userData) {
            $scope.model.config.startNodeId = userData.startMediaId;
        });
    }

    $scope.getMaxUploadKb = function () {
        mediaPicker1902SeoResource.getMaxUploadKb().then(function (response) {
            $scope.maxKb = response.data;
            $scope.maxKbDisplay = $scope.maxKb > 1000 ? Math.floor($scope.maxKb / 1000) + ' mb' : $scope.maxKb + ' kb';
   
            setupViewModel();
        }, function (error) {
            notificationsService.error("Error", "Unable to get max upload limit.");
            setupViewModel();
        });

    }

    function setupViewModel() {
        $scope.images = [];
        $scope.ids = [];

        if ($scope.model.value) {
            var ids = $scope.model.value.split(',');


            mediaResource.getByIds(ids).then(function (medias) {
                _.each(medias, function (media, i) {
                    if (media !== null) {
                        var properties = media.tabs[0].properties;
                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFile(media, true)
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.maxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.images.push(media);
                            $scope.ids.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.idealWidth || parseFloat(heightProperty.value) > $scope.idealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.idealWidth || parseFloat(heightProperty.value) < $scope.idealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }
                    }
                });
                $scope.sync();
            });


        }
    }


    $scope.remove = function (index) {
        $scope.images.splice(index, 1);
        $scope.ids.splice(index, 1);
        $scope.warningMessage = '';
        $scope.sync();
    }

    $scope.add = function () {
      
        editorService.mediaPicker({
            startNodeId: $scope.model.config.startNodeId,
            multiPicker: false,
            submit: function (data) {
                $scope.warningMessage = '';
                $scope.images = []; //reset currenly selected image
                $scope.ids = [];//reset currenly selected image
                data = [data.selection[0]];

                _.each(data, function (media, i) {
                    mediaResource.getById(media.id).then(function (mediaRes) {
                        var properties = mediaRes.tabs[0].properties;


                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFileFromEntity(media, true);
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.maxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.images.push(media);
                            $scope.ids.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.idealWidth || parseFloat(heightProperty.value) > $scope.idealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.idealWidth || parseFloat(heightProperty.value) < $scope.idealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }

                        $scope.sync();
                        editorService.close();

                    });
                  
                });

                
            
               
            },
            close: function () {
                editorService.close();
            }

          
        });
    }

    $scope.sync = function () {
        $scope.model.value = $scope.ids.join();
    };

    $scope.showAdd = function () {
            if ($scope.model.value && $scope.model.value !== "") {
                return false;
            }
        return true;
    };


    var isHideLabel = $scope.model.config.hideDefaultLabel == "1";
    if (isHideLabel) {
        if ($element.closest('.umb-el-wrap').children('.control-label').length > 0) {
            $element.closest('.umb-el-wrap').children('.control-label')[0].setAttribute('style', 'opacity:0!important');
        }

    }





    //this will be displayed inside controls/label
    var toolTip = $scope.model.config.customInnerHint;
    $scope.model.tooltip = toolTip;
    $scope.model.rawHintHtml = "";
    if (toolTip != undefined && toolTip != "") {
        $scope.model.rawHintHtml = commonFactory1902Seo.hintBuilder(toolTip, "right").innerHTML; // will be displayed on textbox
    }

    var group = $scope.model.config.group || '';
    $rootScope.$on('collapsibleClick', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.model.isExpand = !$scope.model.isExpand;
            $scope.model.hideLabel = !$scope.model.isExpand;
            if ($element.closest('.umb-property').length > 0) {
                $element.closest('.umb-property')[0].setAttribute('style', $scope.model.isExpand ? '' : 'display:none')
            }
        }
    });

    $rootScope.$on('setIsExpand', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.model.isExpand = p.isExpand;
            if ($element.closest('.umb-property').length > 0) {
                $element.closest('.umb-property')[0].setAttribute('style', $scope.model.isExpand ? '' : 'display:none')
             }
        }
    });


    $rootScope.$on('clearGroup', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.images = []; 
            $scope.ids = [];
            $scope.sync();
        }
    });


    $scope.getMaxUploadKb();
});