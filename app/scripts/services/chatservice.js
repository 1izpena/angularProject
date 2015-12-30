'use strict';

angular.module('myAppAngularMinApp')
  .service('ChatService', ['$http', '$localStorage', '$location', '$q', 'API_BASE',
    function($http, $localStorage, $location, $q, API_BASE) {

      return {
        uploadFileS3: uploadFileS3,
        postMessage: postMessage
      };

      function uploadFileS3 (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        // getSignedUrl para subir fichero a AWS S3
        $http.post(API_BASE + 'api/v1/file/getSignedUrl', {filename: data.filename} )
          .then( function(response){
            // Put del fichero en AWS S3
            $http.put(response.data.url, data.filename)
              .then(function(response){
                defered.resolve(response);
              },
              function (err) {
                defered.reject(err);
              });
          },
          function (err) {
            defered.reject(err);
          });

        return promise;
      }

      function postMessage (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        var userid=data.userid;
        var channelid=data.channelid;

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + 'api/v1/users/'+userid+'/chat/channels/'+channelid+'/messages',
          data: data
        }).then(
          function(response) {
            defered.resolve(response);
          },
          function(error){
            defered.reject(error);
          }
        );

        return promise;
      }
  }]);

