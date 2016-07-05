/**
 * Created by izaskun on 6/04/16.
 */


'use strict';

angular.module('myAppAngularMinApp')
  .service('GithubService', ['$http', '$localStorage', '$location', '$q', 'API_BASE',
    function($http, $localStorage, $location, $q, API_BASE) {

      return {

        getAuth: getAuth,
        createwebhooks: createwebhooks,
        getGithubAccounts: getGithubAccounts,
        parseGithubEvents: parseGithubEvents


      };




/*
* /:userid/github/accounts
* */

      function getGithubAccounts () {
        var defered = $q.defer();
        var promise = defered.promise;

        var userid = $localStorage.id;

        $http({
          method: 'get',
          url: API_BASE + '/api/v1/users/'+userid+'/github/accounts',
          headers: { 'x-access-token': $localStorage.token }

        }).then( function(result){
            defered.resolve(result);
          },
          function (err) {
            defered.reject(err);
          });
        return promise;
      }






      /****** new ***************/
      function getAuth (username, pass, flag) {
        var defered = $q.defer();
        var promise = defered.promise;

        /* aqui no habría que pasarle el userid, sino la cuenta
         * que haya elegido ??????*/
        var userid = $localStorage.id;
        var rebuildAuth = false;

        /* pass puede ir vacio */

        if(flag){
          if(flag.status == true &&
            (flag.username !== undefined && flag.username !== null && flag.username !== '')){
            rebuildAuth = true;

          }

        }

        console.log("esto vale githubservice");
        console.log("flag");
        console.log(flag);
        console.log("username");
        console.log(username);

        console.log("pass");
        console.log(pass);

        console.log("rebuildAuth");
        console.log(rebuildAuth);


        $http({
          method: 'post',
          url: API_BASE + '/api/v1/users/'+userid+'/github/auth',
          headers: { 'x-access-token': $localStorage.token, 'Content-Type': 'application/x-www-form-urlencoded' },
          data: 'username='+username+'&&pass='+pass+'&&rebuildAuth='+rebuildAuth
        }).then( function(result){
            defered.resolve(result);
          },
          function (err) {
            defered.reject(err);
          });
        return promise;
      }





      function createwebhooks (accountUsername, arrRepos, githubchannel, groupid) {

        /* comprobar que no son vacios */

        var defered = $q.defer();
        var promise = defered.promise;


        var userid = $localStorage.id;

        console.log("en el servicio esto se manda como arrrepos");
        console.log(arrRepos);

        /* hay que pasar el nombre y el tipo del canal y el id del grupo */
        $http({
          method: 'post',
          url: API_BASE + '/api/v1/users/'+userid+'/github/createHooks',
          dataType:'application/json',
          headers: { 'x-access-token': $localStorage.token, 'Content-Type': 'application/x-www-form-urlencoded' },
          data: 'repositories='+JSON.stringify(arrRepos)+'&&account='+accountUsername+
                '&&githubchannel='+JSON.stringify(githubchannel)+'&&groupid='+groupid
        }).then( function(result){
            defered.resolve(result);
          },
          function (err) {
            defered.reject(err);
          });
        return promise;
      };



      function getRepositoryFieldsForPush(githubMessageJSON) {

        var repositoryParse = '';

        if(githubMessageJSON.repository !== null && githubMessageJSON.repository !== undefined ){
          if(githubMessageJSON.repository.name !== null && githubMessageJSON.repository.name !== undefined){


            if(githubMessageJSON.ref !== null && githubMessageJSON.ref !== undefined){
              /* tenemos que hacer split */

              var ref = (githubMessageJSON.ref).split("/");
              if(ref.length > 0){
                repositoryParse = "<p> [" + githubMessageJSON.repository.name + ": " + ref[ref.length-1] +" ]</p> ";
              }
              else{
                repositoryParse = "<p> [" + githubMessageJSON.repository.name + ": " + githubMessageJSON.ref +" ]</p> ";
              }
            }
            else{
              repositoryParse = "<p> [" + githubMessageJSON.repository.name + " ]</p> ";

            }

          }

        }

        return repositoryParse;

      };




      function getRepositoryFields(githubMessageJSON) {

        var repositoryParse = '';

        if(githubMessageJSON.repository !== null && githubMessageJSON.repository !== undefined ){
          if(githubMessageJSON.repository.name !== null && githubMessageJSON.repository.name !== undefined){


            if(githubMessageJSON.repository.default_branch !== null && githubMessageJSON.repository.default_branch !== undefined){
              /* tenemos que hacer split ??*/

              var ref = (githubMessageJSON.repository.default_branch).split("/");
              if(ref.length > 0){
                repositoryParse = "<p> [" + githubMessageJSON.repository.name + ": " + ref[ref.length-1] +" ]</p> ";
              }
              else{
                repositoryParse = "<p> [" + githubMessageJSON.repository.name + ": " + githubMessageJSON.repository.default_branch +" ]</p> ";
              }
            }

            else{
              repositoryParse = "<p> [" + githubMessageJSON.repository.name + " ]</p> ";

            }

          }

        }

        return repositoryParse;

      };



      function getCommitCommentHeaderFields(githubMessageJSON) {

        var commitComments = '';

        /* parseamos el comment con commit_id y lo asociamos a 1 url: html_url */
        if(githubMessageJSON.comment !== null && githubMessageJSON.comment !== undefined){

          if( githubMessageJSON.comment.commit_id !== null && githubMessageJSON.comment.commit_id !== undefined){
            if(githubMessageJSON.comment.html_url == null || githubMessageJSON.comment.html_url == undefined){
              commitComments = "<p> Comment created on commit " + (githubMessageJSON.comment.commit_id).substring(0, 7) + "</p>";

            }
            else{
              commitComments = "<p> Comment created on commit <a href='"+ githubMessageJSON.comment.html_url +"'>"
                + (githubMessageJSON.comment.commit_id).substring(0, 7) +"</a> </p>";


            }
          }

        }

        return commitComments;



      };



      function getCommentBodyFields(githubMessageJSON) {

        var commitCommentsBody = '';

        commitCommentsBody = commitCommentsBody + "<div class='metadatalinks'>";


        /* parseamos el sender y luego el comment */

        if(githubMessageJSON.sender !== null && githubMessageJSON.sender !== undefined){

          if(githubMessageJSON.sender.login !== null && githubMessageJSON.sender.login !== undefined){
            if(githubMessageJSON.sender.html_url !== null && githubMessageJSON.sender.html_url !== undefined){

              commitCommentsBody = commitCommentsBody + "<p> Comment by <a href='"+ githubMessageJSON.sender.html_url +"'>"
                + githubMessageJSON.sender.login +"</a> </p>";


            }
            else{
              commitCommentsBody = commitCommentsBody + "<p> Comment by "+ githubMessageJSON.sender.login +" </p>";
            }

          }

        }

        if(githubMessageJSON.comment !== null && githubMessageJSON.comment !== undefined){

          if(githubMessageJSON.comment.body !== null && githubMessageJSON.comment.body !== undefined){
            commitCommentsBody = commitCommentsBody + "<p> "+ githubMessageJSON.comment.body +" </p>";


          }

        }

        commitCommentsBody = commitCommentsBody + "</div>";
        return commitCommentsBody;



      };





      function getCommitsBodyFields(githubMessageJSON) {
        var obj = {};
        var commitsParse2 = '';
        var numParticipans = 0;

        commitsParse2 = commitsParse2 + "<div class='metadatalinks'>";

        for( var i = 0; i < githubMessageJSON.commits.length; i++){
          if( githubMessageJSON.commits[i].id == null || githubMessageJSON.commits[i].id == undefined){
            commitsParse2 = commitsParse2 +"<p> ";

          }
          else {

            if(githubMessageJSON.commits[i].url == null || githubMessageJSON.commits[i].url == undefined){
              commitsParse2 = commitsParse2 +"<p><strong> " + (githubMessageJSON.commits[i].id).substring(0, 7)+"</strong>";

            }
            else {
              commitsParse2 = commitsParse2 +"<p> <strong><a href='"+ githubMessageJSON.commits[i].url +"'>"
                + (githubMessageJSON.commits[i].id).substring(0, 7)+"</a></strong>";

            }

          }


          if(githubMessageJSON.commits[i].message !== null && githubMessageJSON.commits[i].message !== undefined){
            commitsParse2 = commitsParse2 +": "+ githubMessageJSON.commits[i].message;


          }
          if(githubMessageJSON.commits[i].author !== null && githubMessageJSON.commits[i].author !== undefined){
            commitsParse2 = commitsParse2 +" - " + githubMessageJSON.commits[i].author ;

          }
          commitsParse2 = commitsParse2 +" </p> ";



          if(githubMessageJSON.commits[i].author !== githubMessageJSON.sender.login){
            numParticipans ++;

          }


        }/* end for commits*/
        commitsParse2 = commitsParse2 + "</div>";

        obj.commitsParse2 = commitsParse2;
        obj.numParticipans = numParticipans;



        return obj;



      };

      function getCommitsAuthorFields(numParticipans, githubMessageJSON) {

        var commitsParse = '';
        var numParticipans = 0;
        var literalCommit = '';




        if(numParticipans > 0){

          if(githubMessageJSON.sender.html_url == null || githubMessageJSON.sender.html_url == undefined){
            commitsParse = "<p> " + githubMessageJSON.commits.length + " new commit by "
              + githubMessageJSON.sender.login +" and others:</p> ";

          }
          else {
            commitsParse = "<p> " + githubMessageJSON.commits.length + " new commit by <a href='"+ githubMessageJSON.sender.html_url +"'>"
              + githubMessageJSON.sender.login +"</a> and others:</p> ";

          }

        }

        else {
          if(githubMessageJSON.commits.length > 1){
            literalCommit = "commits";

          }
          else{
            literalCommit = "commit";

          }

          if(githubMessageJSON.sender.html_url == null || githubMessageJSON.sender.html_url == undefined){
            commitsParse = "<p> " + githubMessageJSON.commits.length + " new "+ literalCommit +" by "
              + githubMessageJSON.sender.login +":</p> ";

          }
          else{
            commitsParse = "<p> " + githubMessageJSON.commits.length + " new "+ literalCommit +" by <a href='"+ githubMessageJSON.sender.html_url +"'>"
              + githubMessageJSON.sender.login +"</a>:</p> ";

          }

        }
        return commitsParse;

      };



      function getCommitsFields(githubMessageJSON) {


        var commitsParse = '';
        var commitsParse2 = '';
        var numParticipans = 0;

        var commitsParse2Temp = {};



        if(githubMessageJSON.commits !== null && githubMessageJSON.commits !== undefined){
          if(githubMessageJSON.commits.length > 0){
            if(githubMessageJSON.sender !== null && githubMessageJSON.sender !== undefined){
              if(githubMessageJSON.sender.login !== null && githubMessageJSON.sender.login !== undefined){

                /* son varios commits, hay que mirar si el author del commit coincide con el sender */

                commitsParse2Temp = getCommitsBodyFields(githubMessageJSON);
                commitsParse2 = commitsParse2Temp.commitsParse2;
                numParticipans = commitsParse2Temp.numParticipans;

                /* en numParticipans si hay mas gente que ha intervenido */
                /* en commitsParse2 la parte del body */

                commitsParse = getCommitsAuthorFields(numParticipans, githubMessageJSON);


              }

            }
            else{
              commitsParse = "<p> " + githubMessageJSON.commits.length + " new commits:</p> ";

            }


          }/* end if commits.lenght>0*/
        }

        return commitsParse + commitsParse2;

      };




      function getIssueHeaderFields(githubMessageJSON) {

        var issueHeader = '';
        var sender = '';
        var assignee = '';

        /* example:
         [dessi15/RestAPI]--> Issue assigned by 1izpena (to 1izpena)
         #2 Test
         **(title (puede ser vacio), number, state??,
         * milestone (puede ser vacio):: number y title
         * assignee (puede ser vacio):: login y html_url
         * body (puede ser vacio))*/

        /* miramos la action */

        if(githubMessageJSON.action !== null && githubMessageJSON.action !== undefined){
          if(githubMessageJSON.sender !== null && githubMessageJSON.sender !== undefined){
            if(githubMessageJSON.sender.login !== null && githubMessageJSON.sender.login !== undefined){
              if(githubMessageJSON.sender.html_url !== null && githubMessageJSON.sender.html_url !== undefined){
                sender = " by <a href='"+ githubMessageJSON.sender.html_url +"'>" + githubMessageJSON.sender.login + "</a>";


              }
              else{
                sender = " by "+ githubMessageJSON.sender.login ;


              }

            }


          }
          if(githubMessageJSON.action == "assigned"){
            if(githubMessageJSON.issue !== null && githubMessageJSON.issue !== undefined){
              if(githubMessageJSON.issue.assignee !== null && githubMessageJSON.issue.assignee !== undefined){
                if(githubMessageJSON.issue.assignee.login !== null && githubMessageJSON.issue.assignee.login !== undefined){
                  if(githubMessageJSON.issue.assignee.html_url !== null && githubMessageJSON.issue.assignee.html_url !== undefined){

                    assignee = " (to <a href='"+ githubMessageJSON.issue.assignee.html_url +"'>"
                      + githubMessageJSON.issue.assignee.login + "</a>)";

                  }
                  else {
                    assignee = " (to " + githubMessageJSON.issue.assignee.login + ")";

                  }
                }

              }
            }

          }

          issueHeader = "<p> Issue " + githubMessageJSON.action + sender + assignee + "</p>";


        }

        return issueHeader;


      };



      function getIssueBodyFields(githubMessageJSON) {

        /* example:
         [dessi15/RestAPI]--> Issue assigned by 1izpena (to 1izpena)
         #2 Test
         **issue :: (title (puede ser vacio), number, html_url, state??
         * milestone (puede ser vacio):: number y title
         * body (puede ser vacio))*/


        var issueBody = '';
        var issueFieldsWrapper = '';
        var issueNumField = '';
        var issueTitleField = '';
        var issueContentField = '';
        var issueMilestoneField = '';



        if(githubMessageJSON.issue !== null && githubMessageJSON.issue !== undefined){
          issueBody = issueBody + "<div class='metadatalinks'>";


          if(githubMessageJSON.issue.number !== null && githubMessageJSON.issue.number !== undefined){
            issueNumField = "# "+ githubMessageJSON.issue.number + " ";


          }
          if(githubMessageJSON.issue.title !== null && githubMessageJSON.issue.title !== undefined) {
            issueTitleField = "<strong>" + githubMessageJSON.issue.title + "</strong>";
          }

          if(githubMessageJSON.issue.html_url !== null && githubMessageJSON.issue.html_url !== undefined){
            issueFieldsWrapper = "<p><a href='"+ githubMessageJSON.issue.html_url +"'>"+
              issueNumField + issueTitleField + "</a></p>";

          }
          else {
            issueFieldsWrapper = "<p>"+ issueNumField + issueTitleField + "</p>";

          }

          if(githubMessageJSON.issue.body !== null && githubMessageJSON.issue.body !== undefined){
            issueContentField = "<p>"+ githubMessageJSON.issue.body + "</p>";

          }

          /* milestone:: number, title */
          if(githubMessageJSON.issue.milestone !== null && githubMessageJSON.issue.milestone !== undefined){
            if(githubMessageJSON.issue.milestone.number !== null && githubMessageJSON.issue.milestone.number !== undefined &&
              githubMessageJSON.issue.milestone.title !== null && githubMessageJSON.issue.milestone.title !== undefined ){
              issueMilestoneField = "<p> <strong> Milestone #"+
                githubMessageJSON.issue.milestone.number +" "+
                githubMessageJSON.issue.milestone.title + "</strong></p>";


            }



          }

          issueBody = issueBody + issueFieldsWrapper + issueContentField + issueMilestoneField + "</div>" ;

        }/* end if issue exists */


        return issueBody;


      };



      function getIssueHeaderCommentFields(githubMessageJSON) {

        var issueHeaderComment = '';
        var issueTitle = '';
        var issueNum = '';

        if(githubMessageJSON.issue !== null && githubMessageJSON.issue !== undefined){
          if(githubMessageJSON.issue.number !== null && githubMessageJSON.issue.number !== undefined){
            issueNum = "# " + githubMessageJSON.issue.number;

          }
          if(githubMessageJSON.issue.title !== null && githubMessageJSON.issue.title !== undefined){
            issueTitle = githubMessageJSON.issue.title;

          }

        }

        if(githubMessageJSON.comment !== null && githubMessageJSON.comment !== undefined){
          if(githubMessageJSON.comment.html_url !== null && githubMessageJSON.comment.html_url !== undefined){
            issueHeaderComment = "<p> Comment created on issue <a href='"+ githubMessageJSON.comment.html_url +"'>"
              + issueNum + " " + issueTitle + "</a></p>";

          }
          /* no hay url*/
          else {
            issueHeaderComment = "<p> Comment created on issue " + issueNum + " " + issueTitle + "</p>";

          }
        }
        /* no hay url */
        else {
          issueHeaderComment = "<p> Comment created on issue " + issueNum + " " + issueTitle + "</p>";

        }

        return issueHeaderComment;


      };






      function parseCommits(githubMessageJSON) {

          var messageText = '';
          var repositoryParse = '';
          var commitsParse = '';

            /*
             * [RestAPI:master] 2 new commits by Laiene:
             05e227c: Arreglos varios emitir notificaciones a conectados y no conectados - Laiene
             9f1c815: Merge branch 'master' of https://github.com/dessi15/RestAPI - Laiene
             * */

          /* para repository y branch */
          repositoryParse = getRepositoryFieldsForPush(githubMessageJSON);


          /* para array de commits */
          commitsParse = getCommitsFields(githubMessageJSON);

         /* messageText pueden ser ''*/

          messageText = repositoryParse + commitsParse;
          return messageText;



      };



      function parseCommitComment(githubMessageJSON) {
        /* obj.comment
        * obj.repository
        * obj.sender */

        var messageText = '';
        var repositoryParse = '';
        var commitCommentHeaderParse = '';
        var commitCommentBodyParse = '';

        //var senderParse = '';

        repositoryParse = getRepositoryFields(githubMessageJSON);
        commitCommentHeaderParse = getCommitCommentHeaderFields(githubMessageJSON);
        commitCommentBodyParse = getCommentBodyFields(githubMessageJSON);



        messageText = repositoryParse + commitCommentHeaderParse + commitCommentBodyParse;
        return messageText;



      };

      function parseIssues(githubMessageJSON) {
        /*  action(assigned, unassigned, opened, closed, reopened)   repository=    sender=    issue */

        /* example:
        [dessi15/RestAPI] Issue assigned by 1izpena (to 1izpena)
          #2 Test
          **(title (puede ser vacio), number, state??,
          * milestone (puede ser vacio):: number y title
          * assignee (puede ser vacio):: login y html_url
          * body (puede ser vacio))
         */


        var messageText = '';
        var repositoryParse = '';
        var issueHeaderParse = '';
        var issueBodyParse = '';



        repositoryParse = getRepositoryFields(githubMessageJSON);
        issueHeaderParse = getIssueHeaderFields(githubMessageJSON);
        issueBodyParse = getIssueBodyFields(githubMessageJSON);



        messageText = repositoryParse + issueHeaderParse + issueBodyParse;
        return messageText;


      };



      function parseIssueComment(githubMessageJSON) {

        /* example:
         [dessi15/RestAPI] Comment created on issue #2 Test
         **(title (puede ser vacio), number, state??,
         * milestone (puede ser vacio):: number y title
         * assignee (puede ser vacio):: login y html_url
         * body (puede ser vacio))
         *
         *  Comment by 1izpena (strong)
         *  body

         */


        var messageText = '';
        var repositoryParse = '';
        var issueHeaderCommentParse = '';
        var issueBodyCommentParse = '';



        /* esto es igual */
        repositoryParse = getRepositoryFields(githubMessageJSON);
        issueHeaderCommentParse = getIssueHeaderCommentFields(githubMessageJSON);
        issueBodyCommentParse = getCommentBodyFields(githubMessageJSON);



        messageText = repositoryParse + issueHeaderCommentParse + issueBodyCommentParse;
        return messageText;




      };






      function parseGithubEvents(githubMessageJSON) {


        /*console.log("en el servicio esto vale githubMessageJSON");
        console.log(githubMessageJSON);*/
        /* miramos en tipo de evento y en funcion de cual sea devolvemos 1 cosa u otra */

        var messageEventType = githubMessageJSON.event;
        var messageText = '';



        if(messageEventType == "push"){

          /* llamamos al parseo de eventos push */
          messageText = parseCommits(githubMessageJSON);


        }
        else if(messageEventType == "commit_comment"){
          messageText = parseCommitComment(githubMessageJSON);

        }
        else if(messageEventType == "issues"){
          messageText = parseIssues(githubMessageJSON);

        }
        else if(messageEventType == "issue_comment"){
          messageText = parseIssueComment(githubMessageJSON);

        }


        return messageText;




      };



    }]);

