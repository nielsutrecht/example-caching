var app = angular.module('myApp', ['ngResource']);

app.service('weatherService', ['$http', '$resource', function($http, $resource) {
    var weather = {};
    var Weather = $resource('http://api.openweathermap.org/data/2.5/weather?q=:city', {}, {'get': { method:'GET', cache: true}});

    return {
        getWeatherViaResource: function(city) {
            return Weather.get({ city: city }).$promise;
        },

        getWeatherViaHttp: function(city) {
            if(!weather[city]) {
                weather[city] = $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + city).then(function(response) {
                    return response.data;
                });
            }
            return weather[city];
        }
    };
}]);

app.directive('weather', ['weatherService', function(weatherService) {
    return {
        restrict: 'E',
        templateUrl: 'partials/weather.html',

        scope: {
            method: "@",
            city: "@"
        },

        controller: function($scope) {
            var promise;
            if($scope.method === 'http') {
                promise = weatherService.getWeatherViaHttp($scope.city);
            }
            else {
                promise = weatherService.getWeatherViaResource($scope.city);
            }

            promise.then(function(weather) {
                $scope.name = weather.name;
                $scope.temp = Math.round((weather.main.temp - 272.15) * 100) / 100;
            });
        }
    };
}]);