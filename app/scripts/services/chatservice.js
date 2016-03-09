'use strict';

angular.module('myAppAngularMinApp')
  .service('ChatService', ['$http', '$localStorage', '$location', '$q', 'API_BASE', 'Upload',
    function($http, $localStorage, $location, $q, API_BASE, Upload) {

      return {
        uploadFileS3: uploadFileS3,
        getDownloadUrl: getDownloadUrl,
        postMessage: postMessage,
        getMessages: getMessages,
        postAnswer: postAnswer,
        publishMessage: publishMessage,
        getMetaTags: getMetaTags
      };


      function publishMessage (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        var userid=data.userid;
        var groupid=data.groupid;
        var channelid=data.channelid;
        var messageid=data.messageid;

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/messages/'+messageid+'/publish',
          data: { tags: data.tags }
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

      function getDownloadUrl (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        // getSignedUrl para descargar fichero d AWS S3
        $http({
          method: 'post',
          url: API_BASE + '/api/v1/file/getSignedUrl',
          headers: {
            'x-access-token': $localStorage.token
            },
          data: {
            'groupid': data.groupid,
            'channelid': data.channelid,
            'userid': data.userid,
            'filename': data.filename,
            'operation': 'GET'
          }
        }).then( function(response){
            // Return URL
            defered.resolve(response);
          },
          function (err) {
            defered.reject(err);
          });

        return promise;
      }

      function uploadFileS3 (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        // getSignedUrl para subir fichero a AWS S3
        $http({
          method: 'post',
          url: API_BASE + '/api/v1/file/getSignedUrl',
          headers: {
            'x-access-token': $localStorage.token
            },
          data: {
            'groupid': data.groupid,
            'channelid': data.channelid,
            'userid': data.userid,
            'filename': data.file.name,
            'operation': 'PUT'
          }
        }).then( function(response){
            // Put del fichero en AWS S3
            //$http({
            Upload.http({
              method: 'put',
              url: response.data.url,
              headers: {
                'x-access-token': $localStorage.token,
                'Content-Type': data.file.type
              },
              data: data.file
            }).then(function(response){
                defered.resolve(response);
              },
              function (err) {
                defered.reject(err);
              },
              function (progress) {
                defered.notify(progress);
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
        var groupid=data.groupid;
        var channelid=data.channelid;


        console.log("envia el mensaje********");
        console.log(data);
        console.log("fin mensaje");

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/messages',
          data: data
        }).then(
          function(response) {
            console.log("quepasaenvia bien");
            console.log(response);
            defered.resolve(response);
          },
          function(error){
            defered.reject(error);
          }
        );

        return promise;
      }


      function getMessages (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        var userid=data.userid;
        var groupid=data.groupid;
        var channelid=data.channelid;

        $http({
          method: 'get',
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/messages',
          headers: { 'x-access-token': $localStorage.token },
        }).then( function(result){
            defered.resolve(result);
          },
          function (err) {
            defered.reject(err);
          });
        return promise;
      }


      function postAnswer (data) {
        var defered = $q.defer();
        var promise = defered.promise;

        var userid=data.userid;
        var groupid=data.groupid;
        var channelid=data.channelid;
        var messageid=data.messageid;

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/messages/'+messageid+'/answer',
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



      /****** nuevo *******/
      function getMetaTags (data) {

        var defered = $q.defer();
        var promise = defered.promise;

        /* de momento esto no lo usamos */
        /*
        var userid=data.userid;
        var groupid=data.groupid;
        var channelid=data.channelid;

        */
        console.log("getMetaTags********");
        console.log(data);
        console.log("fin de metatags");



        var request = $http({
          method: "post",
          url: API_BASE +'/api/v1/users/'+data.userid+'/get_meta',
          data: {
            data: data.url
          },
          headers: { 'Content-Type': 'application/json','x-access-token': $localStorage.token }
        }).then(
          function(response) {
            console.log("esto vale error en response de servivo");
            console.log(response);
            defered.resolve(response.data);
          },
          function(error){
            console.log("esto vale error en error de servivo");
            console.log(error);
            defered.reject(error);
          }
        );

        return promise;



        /*

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/messages',
          data: data
        })
        */
      }




  }]);

