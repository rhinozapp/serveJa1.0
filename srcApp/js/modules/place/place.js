angular.module('place', [])
    .controller('placeController', placeController);

function placeController($stateParams, $scope, $filter, $state, placeService, externalLink){
    var place = this;
    place.vars = {};

    place.functions = {
        core : function () {
            place.functions.defineVars().then(function () {
                place.functions.getCategory.getCategory();
                place.functions.defineMenu();
                place.functions.getMenu.getMenu();

                }, function () {
                $state.go('user.mainList');
            });
        },

        defineVars : function () {
            return new Promise(function (success, fail) {
                place.vars.showHowToArrive = false;
                if($stateParams.place.pubData){
                    place.vars.dataPub = $stateParams.place.pubData;
                    place.vars.userLat = $stateParams.place.userLocal.lat;
                    place.vars.userLong = $stateParams.place.userLocal.long;
                    place.vars.listByCategory = [];
                    place.vars.listPromotion = [];
                    success();
                }else{
                    fail();
                }
            });
        },

        externalLink : function (url, target, location) {
            externalLink.open({
                url : url,
                target : target,
                location : location
            });
        },

        defineMenu : function () {
            switch (true) {
                case moment().weekday() === 0:
                    place.vars.menuDefined = place.vars.dataPub.sunday.sundayMenu;
                    break;

                case moment().weekday() === 1:
                    place.vars.menuDefined = place.vars.dataPub.monday.mondayMenu;
                    break;

                case moment().weekday() === 2:
                    place.vars.menuDefined = place.vars.dataPub.tuesday.tuesdayMenu;
                    break;

                case moment().weekday() === 3:
                    place.vars.menuDefined = place.vars.dataPub.wednesday.wednesdayMenu;
                    break;

                case moment().weekday() === 4:
                    place.vars.menuDefined = place.vars.dataPub.thursday.thursdayMenu;
                    break;

                case moment().weekday() === 5:
                    place.vars.menuDefined = place.vars.dataPub.friday.fridayMenu;
                    break;

                default:
                    place.vars.menuDefined = place.vars.dataPub.saturday.saturdayMenu;
            }
        },

        getMenu : {
            getMenu : function () {
                placeService.getMenu.save(place.vars, place.functions.getMenu.success);
            },

            success : function (data) {
                place.vars.menu = data.data;

                if(place.vars.menu){
                    //region List products by category
                    place.vars.listCategory.forEach(function (valueCat, keyCat) {

                        place.vars.listByCategory.push({
                            categoryName : valueCat.categoryName,
                            products: []
                        });

                        place.vars.menu.productsID.forEach(function (valueProd, keyProd) {
                            if(valueCat._id === valueProd.categoryID){
                                place.vars.listByCategory[keyCat].products.push({
                                    productID: valueProd._id,
                                    productName: valueProd.productName,
                                    value : valueProd.value,
                                    promotionValue : valueProd.promotionValue,
                                    imgPath : valueProd.imgPath
                                });
                            }
                        });
                    });
                    place.vars.listByCategoryFilter = place.vars.listByCategory;
                    //endregion

                    //region List products by promotion
                    place.vars.menu.productsID.forEach(function (value) {
                       if(value.promotionValue && value.promotionValue > 0){
                           place.vars.listPromotion.push({
                               productID: value._id,
                               productName: value.productName,
                               value : value.value,
                               promotionValue : value.promotionValue,
                               imgPath : value.imgPath
                           })
                       }
                    });
                    //endregion
                }
            }
        },

        getCategory : {
            getCategory : function () {
                placeService.getCategory.save({id : place.vars.dataPub.userID}, place.functions.getCategory.successGetCategory);
            },

            successGetCategory : function (data) {
                place.vars.listCategory = data.data;
            }
        },
    };

    place.functions.core();
}