'use strict';

angular.module('myAppAngularMinApp')
  .service('ChannelService', ['$http', '$localStorage', '$location', '$q', 'API_BASE',
    function($http, $localStorage, $location, $q, API_BASE) {
      return {
        createNewChannel: createNewChannel,
        deleteChannel: deleteChannel,
        unsubscribeFromChannel: unsubscribeFromChannel,
        deleteUserFromChannel: deleteUserFromChannel,
        addUserToChannel: addUserToChannel,
        editChannel: editChannel,
        searchDirectChannel: searchDirectChannel,
        createDirectChannel: createDirectChannel,
        getChannels: getChannels
      };





      /* si ya existe el canal sacamos mensaje de error de name */
      function getChannels (groupid) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        $http({
          method: 'get',
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels',
          //url: API_BASE + '/api/v1/channels',
          headers: { 'x-access-token': $localStorage.token, 'Content-Type': 'application/x-www-form-urlencoded' }
          //data: 'channel='+JSON.stringify(channel)+'&&userid='+userid
          //params: {channel: JSON.stringify(channel)}
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




      function createNewChannel (groupid,data) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels',
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


      function editChannel (groupid,channelid,data2,data3, num) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        console.log("entro en edit channel");

        var dataVar = "";

        if( num == 1){
          dataVar = 'githubChannelPass='+data2+'&&githubChannelUsername='+data3;
        }
        else {
          dataVar = 'channelName='+data2;

        }

        $http({
          method: 'put',
          headers: {'x-access-token': $localStorage.token, 'Content-Type': 'application/x-www-form-urlencoded'},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid +'/channels/'+channelid,
          data: dataVar

        }).success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });

        return promise;
      }










      function deleteChannel (groupid,channelid, pass) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        $http({
          method: 'delete',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid
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



/************************************************************/
      function unsubscribeFromChannel (groupid,channelid) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        $http({
          method: 'delete',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/unsuscribe/'
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




      function unsuscribeFromGroup (group) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        $http({
          method: 'delete',
          headers: {'x-access-token': $localStorage.token, 'Content-Type': 'application/x-www-form-urlencoded'},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+group.id+'/unsuscribe'
        }).then(
          function(response) {
            defered.resolve(response);
          },
          function(error){
            defered.reject(error);
          }
        );
        return promise;
      };




/******************************************/
      function deleteUserFromChannel (groupid,channelid,data) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        var userid1 = data;
        $http({
          method: 'delete',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/users/'+userid1,
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

      function addUserToChannel (groupid,channelid,userAdd) {
        var defered = $q.defer();
        var promise = defered.promise;
        var userid = $localStorage.id;
        var userid1 = userAdd;
        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels/'+channelid+'/users/'+userid1,
          data: ''
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

      function searchDirectChannel(userid, member, directChannels) {

        var directChannel = null;
        var userid1, userid2;
        var channel;
        for (var i=0; i < directChannels.length; i++) {
          channel = directChannels[i];
          if (channel.users.length == 2) {
            userid1 = channel.users[0];
            userid2 = channel.users[1];

            if ((userid1 == userid && userid2 == member.id) ||
              (userid1 == member.id && userid2 == userid)) {
              directChannel = channel;
              break;
            }
          }
        }

        return directChannel;
      }

      function createDirectChannel(userid, username, user2, groupid) {
        var defered = $q.defer();
        var promise = defered.promise;

        var data = {
          'channelName': username + '-'+ user2.username,
          'channelType': 'DIRECT',
          'secondUserid' : user2.id
        };

        $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/users/'+userid+'/chat/groups/'+groupid+'/channels',
          data: data
        }).then(
          function(response) {
            defered.resolve(response.data);
          },
          function(error){
            defered.reject(error);
          }
        );
        return promise;
      };




    }
  ]);
