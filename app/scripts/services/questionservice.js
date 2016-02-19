'use strict';

angular.module('myAppAngularMinApp')
  .service('QuestionService', ['$http', '$localStorage', '$location', '$q', 'API_BASE',
    function($http, $localStorage, $location, $q ,API_BASE){
    function createQuestion(data)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      var nowDate = new Date().getTime();
      $http({
          method: 'post',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/',
          data:{
            "title" : data.title,
            "body"  : data.body,
            "created": nowDate,
            "answercount" : 0,
            "votes" : 0,
            "views" : 0,
            "tags":  data.tags
          }
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

    function getQuestion(questionId)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      $http({
          method: 'get',
          url: API_BASE + '/api/v1/forum/question/'+ questionId,
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

    function commentQuestion(questionId, data)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      var nowDate = new Date().getTime();
      $http({
          method: 'put',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/'+ questionId+ "/comment",
          data: {
            'comment': data,
            'questionid': questionId,
            'created': nowDate,
          }
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

    function upVote(questionId)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      $http({
          method: 'put',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/'+ questionId+ "/upvote",
          data:{
            "questionid": questionId,
            "vote": 1
          }
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

    function downVote(questionId)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      $http({
          method: 'put',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/'+ questionId+ "/downvote",
          data:{
            "questionid": questionId,
            "vote": -1
          }
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

     function deleteQuestion(questionId,answers)
    {
      var defered = $q.defer();
      var promise = defered.promise;
      $http({
          method: 'delete',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/'+ questionId+ "/delete",
          data:{
            answers: answers
          }
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

    function editQuestion(questionId,data)
    {

      var defered = $q.defer();
      var promise = defered.promise;
      var nowDate = new Date().getTime();
      $http({
          method: 'PUT',
          headers: {'x-access-token': $localStorage.token},
          url: API_BASE + '/api/v1/forum/question/'+ questionId+ "/edit",
          data:{
            modified:nowDate,
            body:data.body,
            title: data.title
          }
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
    return{
      createQuestion: createQuestion,
      getQuestion: getQuestion,
      commentQuestion: commentQuestion,
      upVote: upVote,
      downVote: downVote,
      deleteQuestion: deleteQuestion,
      editQuestion:   editQuestion
    };
}]);