/**
 * Created by izaskun on 25/05/16.
 */

'use strict';

angular.module('myAppAngularMinApp')
  .service('ScrumParseService', ['$http', '$localStorage', '$location', '$q', 'API_BASE',
    function($http, $localStorage, $location, $q, API_BASE) {

      return {

        parseScrumEvents: parseScrumEvents,
        parseScrumComments: parseScrumComments


      };





      function parseTask(scrumMessageJSON, $index, msg) {

        /* de momento
         action      : 'created',*/


        /* example [Project] Task created by [1izpena] (poder ver su perfil , necesito el id del usuario, y lo tengo)
         * #num Subject
         *
         *
         * en metatags
         * status
         * description
         * de moemnto no requirement
         * y userstory con link
         * */



        var messageText = '';
        var projectParse = '';
        var actionParse = '';
        var taskHeaderParse = '';
        var taskBodyParse = '';


        if(scrumMessageJSON.sender !== null &&
          scrumMessageJSON.sender !== undefined &&
          scrumMessageJSON.sender !== '' &&
          scrumMessageJSON.userstory !== null &&
          scrumMessageJSON.userstory !== undefined &&
          scrumMessageJSON.userstory !== ''){




          /* hay que mirar la accion para hacer 1 cosa u otra */
          if(scrumMessageJSON.action == 'created' || scrumMessageJSON.action == 'updated'){

            projectParse = getProjectFields();
            actionParse = getActionFields(scrumMessageJSON);
            taskHeaderParse = getHeaderFieldsTask(scrumMessageJSON, $index, msg);

            if(scrumMessageJSON.action == 'created'){

              taskBodyParse = getBodyFieldsTask (scrumMessageJSON, $index, msg);
            }

            else if(scrumMessageJSON.action == 'updated'){

              taskBodyParse = getBodyFieldsTaskUpdated (scrumMessageJSON, $index, msg);

            }


            messageText = projectParse + actionParse + taskHeaderParse + taskBodyParse;

          }
          else if(scrumMessageJSON.action == 'deleted') {


            projectParse = getProjectFields();
            actionParse = getActionFields(scrumMessageJSON);
            taskHeaderParse = getHeaderFieldsTaskDeleted(scrumMessageJSON, $index, msg);
            taskBodyParse = getBodyFieldsTaskDeleted (scrumMessageJSON, $index, msg);

            messageText = projectParse + actionParse + taskHeaderParse + taskBodyParse;
          }


        }

        return messageText;




      };





      function parseSprint(scrumMessageJSON, $index, msg) {

        /* example [Project] Userstory created by [1izpena] (poder ver su perfil , necesito el id del usuario, y lo tengo)
         * #num Subject */


        var messageText = '';
        var projectParse = '';
        var actionParse = '';
        var sprintHeaderParse = '';
        var sprintBodyParse = '';


        var dayMap = new Map();
        dayMap.set(0, "Sunday");
        dayMap.set(1, "Monday");
        dayMap.set(2, "Tuesday");
        dayMap.set(3, "Wednesday");
        dayMap.set(4, "Thursday");
        dayMap.set(5, "Friday");
        dayMap.set(6, "Saturday");



        var monthMap = new Map();
        monthMap.set(0, "January");
        monthMap.set(1, "February");
        monthMap.set(2, "March");
        monthMap.set(3, "April");
        monthMap.set(4, "May");
        monthMap.set(5, "June");
        monthMap.set(6, "July");
        monthMap.set(7, "August");
        monthMap.set(8, "September");
        monthMap.set(9, "October");
        monthMap.set(10, "November");
        monthMap.set(11, "December");


        if(scrumMessageJSON.sender !== null &&
          scrumMessageJSON.sender !== undefined &&
          scrumMessageJSON.sender !== '' &&
          scrumMessageJSON.sprint !== null &&
          scrumMessageJSON.sprint !== undefined &&
          scrumMessageJSON.sprint !== ''){




          if(scrumMessageJSON.action == 'created' || scrumMessageJSON.action == 'deleted' || scrumMessageJSON.action == 'updated'){
            projectParse = getProjectFields();
            actionParse = getActionFields(scrumMessageJSON);



            if(scrumMessageJSON.action == 'deleted' ){
              sprintHeaderParse = getHeaderFieldsForSprintDeleted(scrumMessageJSON, $index, msg);
              sprintBodyParse = getBodyFieldsForSprintDeleted (scrumMessageJSON, $index, msg);

            }
            else if(scrumMessageJSON.action == 'created' || scrumMessageJSON.action == 'updated'){
              sprintHeaderParse = getHeaderFieldsForSprint(scrumMessageJSON, $index, msg);

              if(scrumMessageJSON.action == 'created'){
                sprintBodyParse = getBodyFieldsForSprint (scrumMessageJSON, $index, msg, dayMap, monthMap);

              }
              else if(scrumMessageJSON.action == 'updated'){
                sprintBodyParse = getBodyFieldsForSprintEdit (scrumMessageJSON, $index, msg, dayMap, monthMap);
              }


            }




          }



        }
        messageText = projectParse + actionParse + sprintHeaderParse + sprintBodyParse;
        return messageText;




      };




      function parseIssue(scrumMessageJSON, $index, msg) {


        var messageText = '';
        var projectParse = '';
        var actionParse = '';
        var issueHeaderParse = '';
        var issueBodyParse = '';


        if(scrumMessageJSON.sender !== null &&
          scrumMessageJSON.sender !== undefined &&
          scrumMessageJSON.sender !== '' &&
          scrumMessageJSON.issue !== null &&
          scrumMessageJSON.issue !== undefined &&
          scrumMessageJSON.issue !== ''){





          /*hay que mirar la accion para hacer 1 cosa u otra */
          if(scrumMessageJSON.action == 'created'  || scrumMessageJSON.action == 'updated'){
            projectParse = getProjectFields();
            actionParse = getActionFields(scrumMessageJSON);
            issueHeaderParse = getHeaderFieldsForIssue(scrumMessageJSON, $index, msg);



            if(scrumMessageJSON.action == 'created'){

              issueBodyParse = getBodyFieldsIssue (scrumMessageJSON, $index, msg);
            }

            else if(scrumMessageJSON.action == 'updated'){

              issueBodyParse = getBodyFieldsIssueUpdated (scrumMessageJSON, $index, msg);

            }



          }
          else if(scrumMessageJSON.action == 'deleted'){
            projectParse = getProjectFields();
            actionParse = getActionFields(scrumMessageJSON);
            issueHeaderParse = getHeaderFieldsForIssueDeleted(scrumMessageJSON, $index, msg);

            /*messagetext.issue.numus*/

          }


        }
        messageText = projectParse + actionParse + issueHeaderParse + issueBodyParse;


        return messageText;




      };











    function parseUserstory(scrumMessageJSON, $index, msg) {

      /* example [Project] Userstory created by [1izpena] (poder ver su perfil , necesito el id del usuario, y lo tengo)
      * #num Subject */


      var messageText = '';
      var projectParse = '';
      var actionParse = '';
      var userstoryHeaderParse = '';
      var userstoryBodyParse = '';


      if(scrumMessageJSON.sender !== null &&
        scrumMessageJSON.sender !== undefined &&
        scrumMessageJSON.sender !== '' &&
        scrumMessageJSON.userstory !== null &&
        scrumMessageJSON.userstory !== undefined &&
        scrumMessageJSON.userstory !== ''){





        /*hay que mirar la accion para hacer 1 cosa u otra */
        if(scrumMessageJSON.action == 'created' ){
          projectParse = getProjectFields();
          actionParse = getActionFields(scrumMessageJSON);
          userstoryHeaderParse = getHeaderFields(scrumMessageJSON, $index, msg);
          userstoryBodyParse = getBodyFields (scrumMessageJSON, $index, msg);



          messageText = projectParse + actionParse + userstoryHeaderParse + userstoryBodyParse;

        }
        else if(scrumMessageJSON.action == 'updated' ){
          projectParse = getProjectFields();
          actionParse = getActionFields(scrumMessageJSON);
          userstoryHeaderParse = getHeaderFields(scrumMessageJSON, $index, msg);
          /* hasta aqui = */
          /* aqui pondría que ha cambiado */



          messageText = projectParse + actionParse + userstoryHeaderParse;

          if(scrumMessageJSON.field > 0 && scrumMessageJSON.field < 11){
            userstoryBodyParse = getBodyFieldsForUpdate (scrumMessageJSON, $index, msg);
            messageText += userstoryBodyParse;

          }


        }

        else if(scrumMessageJSON.action == 'deleted'){

          projectParse = getProjectFields();
          actionParse = getActionFields(scrumMessageJSON);
          userstoryHeaderParse = getHeaderFieldsForDeleted(scrumMessageJSON, $index, msg);
          userstoryBodyParse = getBodyFieldsForDeleteTasks (scrumMessageJSON, $index, msg);


          messageText = projectParse + actionParse + userstoryHeaderParse + userstoryBodyParse;


        }


      }
      /* hay que parsear si es vacio sender y es
       event
       userstory
       con field
        10 y el
      * action updated */
      else if((scrumMessageJSON.sender == null ||
        scrumMessageJSON.sender == undefined ||
        scrumMessageJSON.sender == '' ) &&
        scrumMessageJSON.userstory !== null &&
        scrumMessageJSON.userstory !== undefined &&
        scrumMessageJSON.userstory !== ''){


        if(scrumMessageJSON.action == 'updated' && scrumMessageJSON.field == 10 ){

          projectParse = getProjectFields();


          /* hay que mirar que exista la tarea */
          if(scrumMessageJSON.task !== undefined &&
            scrumMessageJSON.task !== null &&
            scrumMessageJSON.task !== '' ){
            actionParse = getActionFieldsForUsesrtoryStatus(scrumMessageJSON);

          }

          /* el de getHeaderFields nos sirve tal cual */
          userstoryHeaderParse = getHeaderFields(scrumMessageJSON, $index, msg);
           /* el body hay que cambiarlo */


          /* queremos 1 metalink con status from to nada mas */
          userstoryBodyParse = getBodyStatusFieldsForUpdate (scrumMessageJSON, $index, msg);



          messageText = projectParse + actionParse + userstoryHeaderParse + userstoryBodyParse;

        }/* si action update */



      }/* si sender es vacio y userstory no */





      return messageText;




    };



      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }



      function getProjectFields() {
        /* (1)[Project] */
        return "<p> [ScrumProject]</p> ";

      };

      function getActionFields(scrumMessageJSON) {

        /* (2) Userstory created by [1izpena] (poder ver su perfil , necesito el id del usuario, y lo tengo) */
        var actionfields = "";
        var senderlink = "";
        var action = scrumMessageJSON.action;
        var event = scrumMessageJSON.event;



        if(action == null ||
          action == undefined ||
          action == ''){
          action = "change";

        }
        if(scrumMessageJSON.sender.username !== null &&
          scrumMessageJSON.sender.username !== undefined &&
          scrumMessageJSON.sender.username !== '' ){

          if(scrumMessageJSON.sender.id !== null &&
            scrumMessageJSON.sender.id !== undefined &&
            scrumMessageJSON.sender.id !== ''){

            senderlink = "by <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.sender.id+'"'+")'>"+scrumMessageJSON.sender.username+"</a>";

          }
          else{
            senderlink = " by " +scrumMessageJSON.sender.username;
          }

        }
        actionfields = "<p>"+ capitalizeFirstLetter(event)+ " "+ action + " " + senderlink + ": </p>"

        return actionfields;

      };


      /* sabemos que la tarea existe */

      function getActionFieldsForUsesrtoryStatus(scrumMessageJSON) {

        /* (2) Userstory updated by task : [#num 12] (poder ver su perfil , necesito el id del usuario, y lo tengo) */
        var actionfields = "";
        var senderlink = "";
        var action = scrumMessageJSON.action;
        var event = scrumMessageJSON.event;

        var num = 0;



        if(action == null ||
          action == undefined ||
          action == ''){
          action = "change";

        }
        if(scrumMessageJSON.task.subject !== null &&
          scrumMessageJSON.task.subject !== undefined &&
          scrumMessageJSON.task.subject !== '' ){

          if(scrumMessageJSON.task.num !== null &&
            scrumMessageJSON.task.num !== undefined &&
            scrumMessageJSON.task.num !== ''){
            num = scrumMessageJSON.task.num;
          }




          if(scrumMessageJSON.task.id !== null &&
            scrumMessageJSON.task.id !== undefined &&
            scrumMessageJSON.task.id !== '' &&
            scrumMessageJSON.userstory.id !== null &&
            scrumMessageJSON.userstory.id !== undefined &&
            scrumMessageJSON.userstory.id !== ''){

            //senderlink = "by task: <a ng-click='viewTask(" + '"'+scrumMessageJSON.task.id+'"'+")'>#"+num+" "+scrumMessageJSON.task.subject+"</a>";

            senderlink = "by task: <a ng-click='viewTask(" + '"'+scrumMessageJSON.userstory.id +'"'+"," + '"'+scrumMessageJSON.task.id+'"'+ ")'>#"+num+" "+scrumMessageJSON.task.subject+"</a>";

          }
          else{
            senderlink = " by task: #"+num+ " " +scrumMessageJSON.task.subject;
          }

        }
        actionfields = "<p>"+ capitalizeFirstLetter(event)+ " "+ action + " " + senderlink + ": </p>"

        return actionfields;

      };




      function getHeaderFieldsForDeleted(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] sin link  */

        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.userstory.num !== null &&
          scrumMessageJSON.userstory.num !== undefined &&
          scrumMessageJSON.userstory.num !== '' ){

          num = scrumMessageJSON.userstory.num;
        }


        if(scrumMessageJSON.userstory.subject !== null &&
          scrumMessageJSON.userstory.subject !== undefined &&
          scrumMessageJSON.userstory.subject !== '' ){

          subject = scrumMessageJSON.userstory.subject;
        }




        if(scrumMessageJSON.userstory.numtasks !== undefined &&
          scrumMessageJSON.userstory.numtasks !== null &&
          scrumMessageJSON.userstory.numtasks !== '' &&
        scrumMessageJSON.userstory.numtasks.length > 0){

          header = "<p><a>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";

        }

        else{
          header = "<p><a>#" + num + " "+subject+"</a></p> ";

        }

        return header;
      }






      function getHeaderFieldsForIssue(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.issue.num !== null &&
          scrumMessageJSON.issue.num !== undefined &&
          scrumMessageJSON.issue.num !== '' ){

          num = scrumMessageJSON.issue.num;

        }


        if(scrumMessageJSON.issue.subject !== null &&
          scrumMessageJSON.issue.subject !== undefined &&
          scrumMessageJSON.issue.subject !== '' ){

          subject = scrumMessageJSON.issue.subject;

        }


        if(scrumMessageJSON.issue.id !== null &&
          scrumMessageJSON.issue.id !== undefined &&
          scrumMessageJSON.issue.id !== ''){

          header = "<p><a ng-click='viewIssue(" + '"'+scrumMessageJSON.issue.id+'"'+")'>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";

        }
        else{
          header = "<p><a>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";

        }

        return header;



      };



      function getHeaderFieldsForIssueDeleted(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.issue.num !== null &&
          scrumMessageJSON.issue.num !== undefined &&
          scrumMessageJSON.issue.num !== '' ){

          num = scrumMessageJSON.issue.num;

        }


        if(scrumMessageJSON.issue.subject !== null &&
          scrumMessageJSON.issue.subject !== undefined &&
          scrumMessageJSON.issue.subject !== '' ){

          subject = scrumMessageJSON.issue.subject;

        }
        if(scrumMessageJSON.issue.numus !== null &&
          scrumMessageJSON.issue.numus !== undefined &&
          scrumMessageJSON.issue.numus !== ''){
          header = "<div class='metadatalinks delete-issue'<p><a>#" + num + " "+subject+"</a>" +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' " +
            "role='button' tabindex='0'></i></p></div>";

          header += "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'><p>"
            + scrumMessageJSON.issue.numus +" US unlinked</p></div>";



        }
        else{
          header = "<div class='metadatalinks delete-issue'<p><a>#" + num + " "+subject+"</a></p></div>";

        }



        return header;



      };









      function getHeaderFields(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.userstory.num !== null &&
          scrumMessageJSON.userstory.num !== undefined &&
          scrumMessageJSON.userstory.num !== '' ){

          num = scrumMessageJSON.userstory.num;

        }


        if(scrumMessageJSON.userstory.subject !== null &&
          scrumMessageJSON.userstory.subject !== undefined &&
          scrumMessageJSON.userstory.subject !== '' ){

          subject = scrumMessageJSON.userstory.subject;

        }


        if(scrumMessageJSON.userstory.id !== null &&
          scrumMessageJSON.userstory.id !== undefined &&
          scrumMessageJSON.userstory.id !== ''){

          header = "<p><a ng-click='viewUserstory(" + '"'+scrumMessageJSON.userstory.id+'"'+")'>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";


        }
        else{
          header = "<p><a>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";



        }



        /* <i ng-if="msg.messageType=='URL'" ng-click="changeVisible(msg,$index)" class="fa fa-caret-square-o-down fa-lg ng-scope" role="button" tabindex="0"></i>*/

        return header;



      };

















      function getHeaderFieldsForSprint(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var name = "";


        if(scrumMessageJSON.sprint.num !== null &&
          scrumMessageJSON.sprint.num !== undefined &&
          scrumMessageJSON.sprint.num !== '' ){

          num = scrumMessageJSON.sprint.num;

        }


        if(scrumMessageJSON.sprint.name !== null &&
          scrumMessageJSON.sprint.name !== undefined &&
          scrumMessageJSON.sprint.name !== '' ){

          name = scrumMessageJSON.sprint.name;

        }


        if(scrumMessageJSON.sprint.id !== null &&
          scrumMessageJSON.sprint.id !== undefined &&
          scrumMessageJSON.sprint.id !== ''){


          /* esto hay que revisarlo */
          header = "<p><a ng-click='viewSprint(" + '"'+scrumMessageJSON.sprint.id+'"'+")'>#" + num + " "+name+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";

        }
        else{
          header = "<p><a>#" + num + " "+name+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";
        }

        return header;

      }





      function getHeaderFieldsForSprintDeleted(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var name = "";


        if(scrumMessageJSON.sprint.num !== null &&
          scrumMessageJSON.sprint.num !== undefined &&
          scrumMessageJSON.sprint.num !== '' ){

          num = scrumMessageJSON.sprint.num;

        }


        if(scrumMessageJSON.sprint.name !== null &&
          scrumMessageJSON.sprint.name !== undefined &&
          scrumMessageJSON.sprint.name !== '' ){

          name = scrumMessageJSON.sprint.name;

        }


        header = "<p><a>#" + num + " "+name+"</a> " +
          "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";


        return header;

      }















      function getHeaderFieldsTaskDeleted(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.task.num !== null &&
          scrumMessageJSON.task.num !== undefined &&
          scrumMessageJSON.task.num !== '' ){

          num = scrumMessageJSON.task.num;

        }


        if(scrumMessageJSON.task.subject !== null &&
          scrumMessageJSON.task.subject !== undefined &&
          scrumMessageJSON.task.subject !== '' ){

          subject = scrumMessageJSON.task.subject;

        }



        header = "<p><a>#" + num + " "+subject+"</a> " +
          "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";




        return header;

      }


















      /************************ end new ****************************/

      function getHeaderFieldsTask(scrumMessageJSON, $index,msg){
        /* (3) #num [Subject] con link  */


        var header = "";
        var num = 0;
        var subject = "";


        if(scrumMessageJSON.task.num !== null &&
          scrumMessageJSON.task.num !== undefined &&
          scrumMessageJSON.task.num !== '' ){

          num = scrumMessageJSON.task.num;

        }


        if(scrumMessageJSON.task.subject !== null &&
          scrumMessageJSON.task.subject !== undefined &&
          scrumMessageJSON.task.subject !== '' ){

          subject = scrumMessageJSON.task.subject;

        }


        if(scrumMessageJSON.task.id !== null &&
          scrumMessageJSON.task.id !== undefined &&
          scrumMessageJSON.task.id !== '' &&
          scrumMessageJSON.userstory.id !== null &&
          scrumMessageJSON.userstory.id !== undefined &&
          scrumMessageJSON.userstory.id !== ''){


          /*header = "<p><a ng-click='viewTask(" + '"'+scrumMessageJSON.task.id+'"'+")'>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";*/


          //senderlink = "by task: <a ng-click='viewTask(" + '"'+scrumMessageJSON.userstory.id +'"'+"," + '"'+scrumMessageJSON.task.id+'"'+ ")'>#"+num+" "+scrumMessageJSON.task.subject+"</a>";


          header = "<p><a ng-click='viewTask(" + '"'+scrumMessageJSON.userstory.id +'"'+"," + '"'+scrumMessageJSON.task.id+'"'+ ")'>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";




        }
        else{
          header = "<p><a>#" + num + " "+subject+"</a> " +
            "<i ng-click='changeVisibleDetails("+ '"' +$index+'"'+")' class='fa fa-caret-square-o-down fa-lg' role='button' tabindex='0'></i></p>";


        }

        return header;

      }

      /**************************** new *********************************************/



      function getBodyFieldsTaskForComments(scrumMessageJSON, $index, msg){

        var sendercomment ="";
        var body = "";
        var bodycomment = "";


        /* en este caso new field tiene que ser undefined */
        /*if(scrumMessageJSON.sender !== undefined &&
          scrumMessageJSON.sender !== null &&
          scrumMessageJSON.sender !== '' ){
          if(scrumMessageJSON.sender.username !== undefined &&
            scrumMessageJSON.sender.username !== null &&
            scrumMessageJSON.sender.username !== '' ){


            if(scrumMessageJSON.sender.id !== null &&
              scrumMessageJSON.sender.id !== undefined &&
              scrumMessageJSON.sender.id !== ''){

              sendercomment = "<h5>New comment by <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.sender.id+'"'+")'>"+scrumMessageJSON.sender.username+"</a></h5>";

            }
            else{
              sendercomment = "<h5>New comment by "+scrumMessageJSON.sender.username + "</h5>";
            }

            console.log("******scrumMessageJSON.attr.newfield.comment11111**********");
            console.log(scrumMessageJSON.sender.username);


          }

        }*/





        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '' ){
          if(scrumMessageJSON.attr.newfield.comment !== undefined &&
            scrumMessageJSON.attr.newfield.comment !== null &&
            scrumMessageJSON.attr.newfield.comment !== '' ){



            if(scrumMessageJSON.issue !== undefined &&
              scrumMessageJSON.issue !== null &&
              scrumMessageJSON.issue !== '' ) {

              if (scrumMessageJSON.issue.id !== undefined &&
                scrumMessageJSON.issue.id !== null &&
                scrumMessageJSON.issue.id !== '') {



                sendercomment = "<h5>New <a ng-click='viewCommentFromIssue(" + '"'+scrumMessageJSON.issue.id+'"'+")'>comment</a>:</h5>";

                bodycomment = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'><p>"+ scrumMessageJSON.attr.newfield.comment +"</p></div>";

              }
              else {

                sendercomment = "<h5>New " +
                  "<a ng-click='viewCommentFromTask(" + '"'+scrumMessageJSON.userstory.id +'"'+"," + '"'+scrumMessageJSON.task.id+'"'+ ")'>comment</a>:</h5>";

                bodycomment = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'><p>"+ scrumMessageJSON.attr.newfield.comment +"</p></div>";

              }

            }
            else{
              sendercomment = "<h5>New " +
                "<a ng-click='viewCommentFromTask(" + '"'+scrumMessageJSON.userstory.id +'"'+"," + '"'+scrumMessageJSON.task.id+'"'+ ")'>comment</a>:</h5>";

              bodycomment = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'><p>"+ scrumMessageJSON.attr.newfield.comment +"</p></div>";

            }


          }


        }

        if(scrumMessageJSON.issue !== undefined &&
          scrumMessageJSON.issue !== null &&
          scrumMessageJSON.issue !== '' ) {

          if (scrumMessageJSON.issue.id !== undefined &&
            scrumMessageJSON.issue.id !== null &&
            scrumMessageJSON.issue.id !== '') {

            if(scrumMessageJSON.attr.newfield == undefined ||
              scrumMessageJSON.attr.newfield == null ||
              scrumMessageJSON.attr.newfield == '' ||
              scrumMessageJSON.attr.newfield.comment == undefined ||
              scrumMessageJSON.attr.newfield.comment == null ||
              scrumMessageJSON.attr.newfield.comment == ''){
              sendercomment = "<h5>New <a ng-click='viewCommentFromIssue(" + '"'+scrumMessageJSON.issue.id+'"'+")'>comment</a></h5>";


              console.log("esto valesendercomment");
              console.log(sendercomment);

            }



            body = sendercomment +" "+ bodycomment;







          }
          else {
            body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ sendercomment +" "+ bodycomment +"</div>";

          }
        }
        else{
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ sendercomment +" "+ bodycomment +"</div>";

        }



        return body;





      };




      function getBodyFieldsIssueForVotes(scrumMessageJSON, $index, msg){
        var params ="";

        /* old fiel si es !== -1 el sender ha votado, sino ha desvotado */
        if(scrumMessageJSON.attr.oldfield !== -1){
          params += "<h4>Votes increased: </h4>";
        }
        else {

          params += "<h4>Votes decreased: </h4>";
        }

        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '') {

          params += "<p>Total votes: </h4>" + scrumMessageJSON.attr.newfield + "</p>";
        }

        return params;



      };














      function getBodyFieldsTaskForUnassigned(scrumMessageJSON, $index, msg){


        var fromassignedlink ="";
        var toassignedlink ="";
        var assignedtobody = "";
        var body = "";


        /* en este caso new field tiene que ser undefined */
        if(scrumMessageJSON.attr.oldfield !== undefined &&
          scrumMessageJSON.attr.oldfield !== null &&
          scrumMessageJSON.attr.oldfield !== '' ){
          if(scrumMessageJSON.attr.oldfield.username !== undefined &&
            scrumMessageJSON.attr.oldfield.username !== null &&
            scrumMessageJSON.attr.oldfield.username !== '' ){


            if(scrumMessageJSON.attr.oldfield.id !== null &&
              scrumMessageJSON.attr.oldfield.id !== undefined &&
              scrumMessageJSON.attr.oldfield.id !== ''){

              fromassignedlink = "<h5>FROM <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.attr.oldfield.id+'"'+")'>"+scrumMessageJSON.attr.oldfield.username+"</a></h5>";

            }
            else{
              fromassignedlink = "<h5>FROM "+scrumMessageJSON.attr.oldfield.username + "</h5>";
            }
            assignedtobody += fromassignedlink;

          }

        }
        /* aqui si me lo ha cambiado bien la bd, scrumMessageJSON.attr.newfield tiene que ser undefined */

        assignedtobody += "<h5>TO NONE</h5>";



        /* si issue e issue.id */
        if(scrumMessageJSON.issue !== undefined &&
          scrumMessageJSON.issue !== null &&
          scrumMessageJSON.issue !== '' ){

          if(scrumMessageJSON.issue.id !== undefined &&
            scrumMessageJSON.issue.id !== null &&
            scrumMessageJSON.issue.id !== '' ){

            body = assignedtobody;

          }
          else {
            body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ assignedtobody +"</div>";

          }

        }

        else {

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ assignedtobody +"</div>";
        }

        return body;




      };





      function getBodyFieldsTaskForUnContributors(scrumMessageJSON, $index, msg){

        var contributortobody = "";
        var body = "";



        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '' ){

          if(scrumMessageJSON.attr.newfield.username !== undefined &&
            scrumMessageJSON.attr.newfield.username !== null &&
            scrumMessageJSON.attr.newfield.username !== '' ){

            if(scrumMessageJSON.attr.newfield.id !== null &&
              scrumMessageJSON.attr.newfield.id !== undefined &&
              scrumMessageJSON.attr.newfield.id !== ''){

              contributortobody = "<h4>Remove <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.attr.newfield.id+'"'+")'>"+scrumMessageJSON.attr.newfield.username+"</a> as a contributor</h4>";

            }
            else{
              contributortobody = "<h4>Remove "+scrumMessageJSON.attr.newfield.username + "as a contributor</h4>";
            }

          }

        }


        if(contributortobody == ""){
          return "";

        }
        else{

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ contributortobody +"</div>";
          return body;

        }



      };











      function getBodyFieldsTaskForContributors(scrumMessageJSON, $index, msg){

        var contributortobody = "";
        var body = "";



        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '' ){

          if(scrumMessageJSON.attr.newfield.username !== undefined &&
            scrumMessageJSON.attr.newfield.username !== null &&
            scrumMessageJSON.attr.newfield.username !== '' ){

            if(scrumMessageJSON.attr.newfield.id !== null &&
              scrumMessageJSON.attr.newfield.id !== undefined &&
              scrumMessageJSON.attr.newfield.id !== ''){

              contributortobody = "<h4><a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.attr.newfield.id+'"'+")'>"+scrumMessageJSON.attr.newfield.username+"</a> is added as a contributor</h4>";

            }
            else{
              contributortobody = "<h4>"+scrumMessageJSON.attr.newfield.username + "is added as a contributor</h4>";
            }

          }

        }


        if(contributortobody == ""){
          return "";

        }
        else{

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ contributortobody +"</div>";
          return body;

        }



      };


      /******************** functions for update issue ***************************************************/

















      /************************* end functions update issue *********************************************/
      /******************* reutilizamos para assigned to de issues *****************************************/

      function getBodyFieldsTaskForAssignedto(scrumMessageJSON, $index, msg){


        var fromassignedlink ="";
        var toassignedlink ="";
        var assignedtobody = "";
        var body = "";



        if(scrumMessageJSON.attr.oldfield !== undefined &&
          scrumMessageJSON.attr.oldfield !== null &&
          scrumMessageJSON.attr.oldfield !== '' ){
          if(scrumMessageJSON.attr.oldfield.username !== undefined &&
            scrumMessageJSON.attr.oldfield.username !== null &&
            scrumMessageJSON.attr.oldfield.username !== '' ){


            if(scrumMessageJSON.attr.oldfield.id !== null &&
              scrumMessageJSON.attr.oldfield.id !== undefined &&
              scrumMessageJSON.attr.oldfield.id !== ''){

              fromassignedlink = "<h5>FROM <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.attr.oldfield.id+'"'+")'>"+scrumMessageJSON.attr.oldfield.username+"</a></h5>";

            }
            else{
              fromassignedlink = "<h5>FROM "+scrumMessageJSON.attr.oldfield.username + "</h5>";
            }
            assignedtobody += fromassignedlink;

          }

        }
        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '' ){

          if(scrumMessageJSON.attr.newfield.username !== undefined &&
            scrumMessageJSON.attr.newfield.username !== null &&
            scrumMessageJSON.attr.newfield.username !== '' ){

            if(scrumMessageJSON.attr.newfield.id !== null &&
              scrumMessageJSON.attr.newfield.id !== undefined &&
              scrumMessageJSON.attr.newfield.id !== ''){

              toassignedlink = "<h5>TO <a ng-click='viewUserProfile(" + '"'+scrumMessageJSON.attr.newfield.id+'"'+")'>"+scrumMessageJSON.attr.newfield.username+"</a></h5>";

            }
            else{
              toassignedlink = "<h5>TO "+scrumMessageJSON.attr.newfield.username + "</h5>";
            }
            assignedtobody += toassignedlink;

          }

        }


        if(assignedtobody == ""){
          return "";

        }
        else{
          /* si issue e issue.id */
          if(scrumMessageJSON.issue !== undefined &&
            scrumMessageJSON.issue !== null &&
            scrumMessageJSON.issue !== '' ){

            if(scrumMessageJSON.issue.id !== undefined &&
              scrumMessageJSON.issue.id !== null &&
              scrumMessageJSON.issue.id !== '' ){

              body = assignedtobody;

            }
            else {
              body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ assignedtobody +"</div>";

            }

          }

          else {

            body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ assignedtobody +"</div>";
          }

          return body;

        }



      };




      function getBodyFieldsTaskForSubject(scrumMessageJSON, $index, msg){

        var subjchanged = "";
        var body = "";

        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          subjchanged += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed </h4>";

          if(scrumMessageJSON.attr.fieldchange == 'description'){
            subjchanged += "<p>"+scrumMessageJSON.task.description +"</p>";

          }


        }


        if(subjchanged !== ""){
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ subjchanged +"</div>";


        }


        return body;

      };


















      function getBodyFieldsIssueForSubject(scrumMessageJSON, $index, msg){

        var body = "";

        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          body += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed </h4>";

          if(scrumMessageJSON.attr.fieldchange == 'description'){

            if(scrumMessageJSON.attr.newfield !== undefined &&
              scrumMessageJSON.attr.newfield !== null &&
              scrumMessageJSON.attr.newfield !== '' ){
              body += "<p>"+scrumMessageJSON.attr.newfield +"</p>";

            }
          }
        }
        return body;

      };







      function getBodyFieldsIssueForType(scrumMessageJSON, $index, msg){
        var labeled = "";

        var labelfrom = "";
        var labelto = "";
        var typeparams = "";

        var body = "";


        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          body += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed: </h4>";


        }
        if(scrumMessageJSON.attr.oldfield !== null &&
          scrumMessageJSON.attr.oldfield !== undefined &&
          scrumMessageJSON.attr.oldfield !== '' ){

          labelfrom = scrumMessageJSON.attr.oldfield;


          if(labelfrom == "Bug"){ /* warning */
            /*typeparams = "label-warning";*/
            typeparams = "circle-warning-right"

          }
          else if(labelfrom == "Question"){ /* info */
            typeparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            typeparams = "circle-success-right";
          }

          body += "<p class='scrum-msg-p-circle'>FROM <span title='"+ labelfrom +"' class ='"+ typeparams  +"'</span></p>";


        }



        if(scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== '' ){

          labelto = scrumMessageJSON.attr.newfield;


          if(labelto == "Bug"){ /* warning */
            /*typeparams = "label-warning";*/
            typeparams = "circle-warning-right"

          }
          else if(labelto == "Question"){ /* info */
            typeparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            typeparams = "circle-success-right";
          }

          body += "<p class='scrum-msg-p-circle'>TO <span title='"+ labelto +"' class ='"+ typeparams  +"'</span></p>";


        }

        return body;

      };












      function getBodyFieldsIssueForSeverity(scrumMessageJSON, $index, msg){
        var labeled = "";

        var labelfrom = "";
        var labelto = "";
        var severityparams = "";

        var body = "";


        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          body += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed: </h4>";


        }
        if(scrumMessageJSON.attr.oldfield !== null &&
          scrumMessageJSON.attr.oldfield !== undefined &&
          scrumMessageJSON.attr.oldfield !== '' ){

          labelfrom = scrumMessageJSON.attr.oldfield;



          if(labelfrom == "Wishlist"){ /* warning */
            severityparams = "circle-default-right";
          }
          else if(labelfrom == "Minor"){ /* info */
            severityparams = "circle-success-right";

          }
          else if(labelfrom == "Normal"){ /* info */
            severityparams = "circle-primary-right";

          }
          else if(labelfrom == "Important"){ /* info */
            severityparams = "circle-warning-right";

          }
          else { /* primary:: mejora */
            severityparams = "circle-blocked-right";
          }


          body += "<p class='scrum-msg-p-circle'>FROM <span title='"+ labelfrom +"' class ='"+ severityparams  +"'</span></p>";


        }



        if(scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== '' ){

          labelto = scrumMessageJSON.attr.newfield;



          if(labelto == "Wishlist"){ /* warning */
            severityparams = "circle-default-right";
          }
          else if(labelto == "Minor"){ /* info */
            severityparams = "circle-success-right";

          }
          else if(labelto == "Normal"){ /* info */
            severityparams = "circle-primary-right";

          }
          else if(labelto == "Important"){ /* info */
            severityparams = "circle-warning-right";

          }
          else { /* primary:: mejora */
            severityparams = "circle-blocked-right";
          }


          body += "<p class='scrum-msg-p-circle'>TO <span title='"+ labelto +"' class ='"+ severityparams  +"'</span></p>";


        }

        return body;

      };




      function getBodyFieldsIssueForPriority(scrumMessageJSON, $index, msg){
        var labeled = "";

        var labelfrom = "";
        var labelto = "";
        var priorityparams = "";

        var body = "";


        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          body += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed: </h4>";


        }
        if(scrumMessageJSON.attr.oldfield !== null &&
          scrumMessageJSON.attr.oldfield !== undefined &&
          scrumMessageJSON.attr.oldfield !== '' ){

          labelfrom = scrumMessageJSON.attr.oldfield;


          if(labelfrom == "Low"){ /* warning */
            priorityparams = "circle-success-right";
          }
          else if(labelfrom == "Normal"){ /* info */
            priorityparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            priorityparams = "circle-warning-right";
          }

          body += "<p class='scrum-msg-p-circle'>FROM <span title='"+ labelfrom +"' class ='"+ priorityparams  +"'</span></p>";

        }
        if(scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== '' ){

          labelto = scrumMessageJSON.attr.newfield;


          if(labelto == "Low"){ /* warning */
            priorityparams = "circle-success-right";
          }
          else if(labelto == "Normal"){ /* info */
            priorityparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            priorityparams = "circle-warning-right";
          }

          body += "<p class='scrum-msg-p-circle'>TO <span title='"+ labelto +"' class ='"+ priorityparams  +"'</span></p>";

        }





        return body;

      };















      /* reutilizamos para issues */
      function getBodyFieldsTaskForStatus(scrumMessageJSON, $index, msg){
        var statuschanged = "";
        var labeled = "";

        var labelfrom = "";
        var labelto = "";

        var body = "";


        if(scrumMessageJSON.attr.fieldchange !== undefined &&
          scrumMessageJSON.attr.fieldchange !== null &&
          scrumMessageJSON.attr.fieldchange !== '' ){

          statuschanged += "<h4>"+ capitalizeFirstLetter(scrumMessageJSON.attr.fieldchange) +" changed: </h4>";


        }
        if(scrumMessageJSON.attr.oldfield == 'New' ) {
          labelfrom = "<span class='label label-primary label-marked'>"+scrumMessageJSON.attr.oldfield+"</span>";
        }
        else if(scrumMessageJSON.attr.oldfield == 'In progress' ) {
          labelfrom = "<span class='label label-info label-marked'>"+scrumMessageJSON.attr.oldfield+"</span>";
        }
        else if(scrumMessageJSON.attr.oldfield == 'Ready for test' ) {
          labelfrom = "<span class='label label-warning label-marked'>"+scrumMessageJSON.attr.oldfield+"</span>";
        }
        else if(scrumMessageJSON.attr.oldfield == 'Closed' ) {
          labelfrom = "<span class='label label-success label-marked'>"+scrumMessageJSON.attr.oldfield+"</span>";
        }

        if(labelfrom !== "") {
          labeled += "<h5>FROM "+ labelfrom + "</h5>"


        }



        if(scrumMessageJSON.attr.newfield == 'New' ) {
          labelto = "<span class='label label-primary label-marked'>"+scrumMessageJSON.attr.newfield+"</span>";
        }
        else if(scrumMessageJSON.attr.newfield == 'In progress' ) {
          labelto = "<span class='label label-info label-marked'>"+scrumMessageJSON.attr.newfield+"</span>";
        }
        else if(scrumMessageJSON.attr.newfield == 'Ready for test' ) {
          labelto = "<span class='label label-warning label-marked'>"+scrumMessageJSON.attr.newfield+"</span>";
        }
        else if(scrumMessageJSON.attr.newfield == 'Closed' ) {
          labelto = "<span class='label label-success label-marked'>"+scrumMessageJSON.attr.newfield+"</span>";
        }

        if(labelto !== "") {
          labeled += "<h5>TO "+ labelto + "</h5>"


        }

        if(labeled == "" && statuschanged == ""){
          return "";

        }
        else{
          if(scrumMessageJSON.issue !== undefined &&
            scrumMessageJSON.issue !== null &&
            scrumMessageJSON.issue !== ''){
            if(scrumMessageJSON.issue.id !== undefined &&
              scrumMessageJSON.issue.id !== null &&
              scrumMessageJSON.issue.id !== ''){
              body = labeled;


            }
            else{
              body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ labeled +"</div>";

            }

          }
          else{
            body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ labeled +"</div>";
          }


          return body;

        }



      };








      function getBodyFieldsTaskForRequirement(scrumMessageJSON, $index, msg){

        var requirementchanged = "";
        var status = "";
        var labeled = "";

        var body = "";



        if(scrumMessageJSON.attr.newfield !== undefined &&
          scrumMessageJSON.attr.newfield !== null &&
          scrumMessageJSON.attr.newfield !== '' ){
          if(scrumMessageJSON.attr.oldfield == 'blocked'){

            labeled = "<span class='label label-warning label-marked'>Bloqued</span>";

            if(scrumMessageJSON.attr.newfield.blocked){
              /*si es true antes era false :: marked as */
              status = "marked as a";

            }
            else {
              status = "unmarked as a";

            }


          }
          else if(scrumMessageJSON.attr.oldfield == 'iocaine'){

            labeled = "<span class='label label-info label-marked'>Support</span>";

            if(scrumMessageJSON.attr.newfield.iocaine){
              status = "marked as a";

            }
            else {
              status = "unmarked as a";
            }

          }


        }/* end if attr.newfield !== undefined */



        if(status == "" && labeled == ""){
          return "";
        }

        else {

          requirementchanged +="<p><h4>Type "+status +"</h4>"+labeled+"</p>";
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ requirementchanged +"</div>";
          return body;

        }




      };







      /****************************** new  ******************************************/

      function getBodyFieldsTaskDeleted(scrumMessageJSON, $index, msg){
        /* en el mensaje tengo que campo a cambiado */

        var params = "";
        var body = "";

        var numuserstory = 0;
        var subjectuserstory = "";
        var userstory ="";
        var header = "";


        /* scrumMessageJSON.task.description */
        if(scrumMessageJSON.userstory.num !== null &&
          scrumMessageJSON.userstory.num !== undefined &&
          scrumMessageJSON.userstory.num !== '' ) {
          numuserstory = scrumMessageJSON.userstory.num;

        }

        if(scrumMessageJSON.userstory.subject !== null &&
          scrumMessageJSON.userstory.subject !== undefined &&
          scrumMessageJSON.userstory.subject !== '' ){

          subjectuserstory = scrumMessageJSON.userstory.subject;

        }

        if(scrumMessageJSON.userstory.id !== null &&
          scrumMessageJSON.userstory.id !== undefined &&
          scrumMessageJSON.userstory.id !== ''){

          header = "<p><a ng-click='viewUserstory(" + '"'+scrumMessageJSON.userstory.id+'"'+")'>#" + numuserstory + " "+subjectuserstory+"</a></p>";

        }
        else{
          header = "<p><a>#" + numuserstory + " "+subjectuserstory+"</a></p>";

        }

        params += "<h4> US: </h4>"+header;



        if(params == ''){
          return '';
        }
        else {

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }






      };














      /********************************* end new **********************************************/


      function getBodyFieldsIssueUpdated(scrumMessageJSON, $index, msg){
        /* en el mensaje tengo que campo a cambiado */

        var params = "";
        var body = "";


        var header = "";


        if(scrumMessageJSON.attr !== undefined &&
          scrumMessageJSON.attr !== null &&
          scrumMessageJSON.attr !== '' ){



          /* aqui ya separamos */
          if(scrumMessageJSON.attr.fieldchange == 'assignedto'){
            /* reutilizamos la de tasks */
            params += getBodyFieldsTaskForAssignedto(scrumMessageJSON, $index, msg);


          }
          /* reutilizamos la de tasks */
          else if(scrumMessageJSON.attr.fieldchange == 'unassignedto'){
            params += getBodyFieldsTaskForUnassigned(scrumMessageJSON, $index, msg);


          }
          else if(scrumMessageJSON.attr.fieldchange == 'voters'){
            params += getBodyFieldsIssueForVotes(scrumMessageJSON, $index, msg);



          }
          else if(scrumMessageJSON.attr.fieldchange == 'subject' || scrumMessageJSON.attr.fieldchange == 'description'){
            params += getBodyFieldsIssueForSubject(scrumMessageJSON, $index, msg);



          }
          else if(scrumMessageJSON.attr.fieldchange == 'status'){
            params += getBodyFieldsTaskForStatus(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'type'){
            params += getBodyFieldsIssueForType(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'severity'){
            params += getBodyFieldsIssueForSeverity(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'priority'){
            params += getBodyFieldsIssueForPriority(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'comments'){
            params += getBodyFieldsTaskForComments(scrumMessageJSON, $index, msg);

          }





          /*
          else if(scrumMessageJSON.attr.fieldchange == 'type'){
            params += getBodyFieldsIssueForType(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'severity'){
            params += getBodyFieldsIssueForSeverity(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'priority'){
            params += getBodyFieldsIssueForPriority(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'status'){
            params += getBodyFieldsTaskForStatus(scrumMessageJSON, $index, msg);

          }

          else if(scrumMessageJSON.attr.fieldchange == 'comments'){
            params += getBodyFieldsTaskForComments(scrumMessageJSON, $index, msg);

          }
*/





        }


        if(params == ''){
          return '';
        }
        else {

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }






      };











      /******************************* end get body fields issues for update ***************************************/
      function getBodyFieldsTaskUpdated(scrumMessageJSON, $index, msg){
        /* en el mensaje tengo que campo a cambiado */

        var params = "";
        var body = "";

        var numuserstory = 0;
        var subjectuserstory = "";
        var userstory ="";
        var header = "";


        /* scrumMessageJSON.task.description */
        if(scrumMessageJSON.userstory.num !== null &&
          scrumMessageJSON.userstory.num !== undefined &&
          scrumMessageJSON.userstory.num !== '' ) {
          numuserstory = scrumMessageJSON.userstory.num;

        }

        if(scrumMessageJSON.userstory.subject !== null &&
          scrumMessageJSON.userstory.subject !== undefined &&
          scrumMessageJSON.userstory.subject !== '' ){

          subjectuserstory = scrumMessageJSON.userstory.subject;

        }

        if(scrumMessageJSON.userstory.id !== null &&
          scrumMessageJSON.userstory.id !== undefined &&
          scrumMessageJSON.userstory.id !== ''){

          header = "<p><a ng-click='viewUserstory(" + '"'+scrumMessageJSON.userstory.id+'"'+")'>#" + numuserstory + " "+subjectuserstory+"</a></p>";

        }
        else{
          header = "<p><a>#" + numuserstory + " "+subjectuserstory+"</a></p>";

        }

        params += "<h4> US: </h4>"+header;



        /* aqui empieza el cambio dependiendo del campo que hayamos cambiado */
        if(scrumMessageJSON.attr !== undefined &&
          scrumMessageJSON.attr !== null &&
          scrumMessageJSON.attr !== '' ){


          /* var attr = {
           'fieldchange' : fieldchange,
           'newfield'    : fieldnewvalue,

           'oldfield'    : oldtaskresult.assigned

           /* oldfield aveces no es necesario  /
           }; */



          /* aqui ya separamos */
          if(scrumMessageJSON.attr.fieldchange == 'assignedto'){
            params += getBodyFieldsTaskForAssignedto(scrumMessageJSON, $index, msg);


          }
          else if(scrumMessageJSON.attr.fieldchange == 'unassignedto'){
            params += getBodyFieldsTaskForUnassigned(scrumMessageJSON, $index, msg);


          }

          else if(scrumMessageJSON.attr.fieldchange == 'subject' || scrumMessageJSON.attr.fieldchange == 'description'){
            params += getBodyFieldsTaskForSubject(scrumMessageJSON, $index, msg);


          }
          /* en este caso fieldchange es requirement
           * y old value el requieremnt a cambiar *
          else if(num == 6){
            attr.newfield = newtaskresult.requirement;
            attr.oldfield = fieldoldvalue;

          }*/
          else if(scrumMessageJSON.attr.fieldchange == 'requirement'){
            params += getBodyFieldsTaskForRequirement(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'status'){
            params += getBodyFieldsTaskForStatus(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'contributors'){
            params += getBodyFieldsTaskForContributors(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'uncontributors'){
            params += getBodyFieldsTaskForUnContributors(scrumMessageJSON, $index, msg);

          }
          else if(scrumMessageJSON.attr.fieldchange == 'comments'){
            params += getBodyFieldsTaskForComments(scrumMessageJSON, $index, msg);

          }






        }


        if(params == ''){
          return '';
        }
        else {

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }






      };





      function getBodyFieldsIssue(scrumMessageJSON, $index, msg){

        var params = "";
        var body = "";


        if(scrumMessageJSON.issue.voters !== null &&
          scrumMessageJSON.issue.voters !== undefined &&
          scrumMessageJSON.issue.voters !== '' ){
          if(scrumMessageJSON.issue.voters.length){
            params += "<p class='scrum-msg-p'><strong> Votes: </strong>"+scrumMessageJSON.userstory.voters.length+"</p>";
          }
          else{
            params += "<p class='scrum-msg-p'><strong> Votes:</strong> 0</p>";
          }
        }
        else{
          params += "<p class='scrum-msg-p'><strong> Votes:</strong> 0</p>";
        }



        if(scrumMessageJSON.issue.description !== null &&
          scrumMessageJSON.issue.description !== undefined &&
          scrumMessageJSON.issue.description !== '' ){
          params = params + "<p><strong> Description: </strong></p><p class='description-class'>"+scrumMessageJSON.issue.description+"</p>";


        }

        if(scrumMessageJSON.issue.status!== null &&
          scrumMessageJSON.issue.status !== undefined &&
          scrumMessageJSON.issue.status !== '' ){

          var status = scrumMessageJSON.issue.status;
          var statusparams = "";

          if(status == "New"){ /* warning */
            statusparams = "label-primary";
          }
          else if(status == "In progress"){ /* info */
            statusparams = "label-info";

          }
          else if(status == "Ready for test"){ /* info */
            statusparams = "label-warning";

          }
          else { /* primary:: mejora */
            statusparams = "label-success";
          }


          params += "<p class='scrum-msg-labels scrum-msg-labels-with-margin-both'> <span class='label "+ statusparams +" status'>" + status + "</span></p>";
        }




        if(scrumMessageJSON.issue.type!== null &&
          scrumMessageJSON.issue.type !== undefined &&
          scrumMessageJSON.issue.type !== '' ){

          var type = scrumMessageJSON.issue.type;
          var typeparams = "";

          if(type == "Bug"){ /* warning */
            /*typeparams = "label-warning";*/
            typeparams = "circle-warning-right"

          }
          else if(type == "Question"){ /* info */
            typeparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            typeparams = "circle-success-right";
          }

          params += "<p class='scrum-msg-p-circle'><strong>"+ type +"</strong> <span class ='"+ typeparams  +"'</span></p>";


        }

        if(scrumMessageJSON.issue.severity!== null &&
          scrumMessageJSON.issue.severity !== undefined &&
          scrumMessageJSON.issue.severity !== '' ){

          var severity = scrumMessageJSON.issue.severity;
          var severityparams = "";

          if(severity == "Wishlist"){ /* warning */
            severityparams = "circle-default-right";
          }
          else if(severity == "Minor"){ /* info */
            severityparams = "circle-success-right";

          }
          else if(severity == "Normal"){ /* info */
            severityparams = "circle-primary-right";

          }else if(severity == "Important"){ /* info */
            severityparams = "circle-warning-right";

          }
          else { /* primary:: mejora */
            severityparams = "circle-blocked-right";
          }

          params += "<p class='scrum-msg-p-circle'><strong>Severity: "+ severity +"</strong> <span class ='"+ severityparams  +"'</span></p>";


        }
        if(scrumMessageJSON.issue.priority!== null &&
          scrumMessageJSON.issue.priority !== undefined &&
          scrumMessageJSON.issue.priority !== '' ){

          var priority = scrumMessageJSON.issue.priority;
          var priorityparams = "";

          if(priority == "Low"){ /* warning */
            priorityparams = "circle-success-right";
          }
          else if(priority == "Normal"){ /* info */
            priorityparams = "circle-primary-right";

          }
          else { /* primary:: mejora */
            priorityparams = "circle-warning-right";
          }

          params += "<p class='scrum-msg-p-circle'><strong>Priority: "+ priority +"</strong> <span class ='"+ priorityparams  +"'</span></p>";

        }




        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }

      }






      function getBodyFieldsTask(scrumMessageJSON, $index, msg){


        /**
         *
         *
         *
        messagetext.userstory = {
          id          : userstoryresultchanged.id,
          num         : userstoryresultchanged.num,
          subject     : userstoryresultchanged.subject
        };
         */



        var params = "";
        var body = "";



        /* el userstory lo primero */
        if(scrumMessageJSON.userstory !== null &&
          scrumMessageJSON.userstory !== undefined &&
          scrumMessageJSON.userstory !== '' ){

          var numuserstory = 0;
          var subjectuserstory = "";
          var userstory ="";
          var header = "";


          /* scrumMessageJSON.task.description */
          if(scrumMessageJSON.userstory.num !== null &&
            scrumMessageJSON.userstory.num !== undefined &&
            scrumMessageJSON.userstory.num !== '' ) {
            numuserstory = scrumMessageJSON.userstory.num;

          }

          if(scrumMessageJSON.userstory.subject !== null &&
            scrumMessageJSON.userstory.subject !== undefined &&
            scrumMessageJSON.userstory.subject !== '' ){

            subjectuserstory = scrumMessageJSON.userstory.subject;

          }

          if(scrumMessageJSON.userstory.id !== null &&
            scrumMessageJSON.userstory.id !== undefined &&
            scrumMessageJSON.userstory.id !== ''){

            header = "<p><a ng-click='viewUserstory(" + '"'+scrumMessageJSON.userstory.id+'"'+")'>#" + numuserstory + " "+subjectuserstory+"</a></p>";


          }
          else{
            header = "<p><a>#" + numuserstory + " "+subjectuserstory+"</a></p>";



          }

          params += "<h4> US: </h4>"+header;


        } /* end hay userstory */


        var params2="";
        var sumparams = "";

        if(scrumMessageJSON.task.description !== null &&
          scrumMessageJSON.task.description !== undefined &&
          scrumMessageJSON.task.description !== '' ){
          params2 += "<h4> Description: </h4><p class='description-class'>"+scrumMessageJSON.task.description+"</p>";


        }

        /* una clase en funcion del status */
        var status = "<span class='label label-primary status' >New</span>";

        if(scrumMessageJSON.task.status !== null &&
          scrumMessageJSON.task.status !== undefined &&
          scrumMessageJSON.task.status !== '' ){

          /* si el status es new primary/ in progress info ready for test warning closed verde */
          if(scrumMessageJSON.task.status == "In progress"){
            status = "<span class='label label-info status' >In progress</span>";

          }
          else if(scrumMessageJSON.task.status == "Ready for test"){
            status = "<span class='label label-warning status' >Ready for test</span>";

          }
          else if(scrumMessageJSON.task.status == "Closed"){
            status = "<span class='label label-success status' >Closed</span>";

          }
        }


        /* params2 += "<p class='scrum-msg-labels'><strong> Status: </strong>"+ status+"</p>"; */
        params2 += "<p class='scrum-msg-labels scrum-msg-labels-with-margin'>"+ status+"</p>";


        /* requirement blocked */
        if(scrumMessageJSON.task.requirement !== undefined
          && scrumMessageJSON.task.requirement !== null
          && scrumMessageJSON.task.requirement !== ''){

          if(scrumMessageJSON.task.requirement.blocked || scrumMessageJSON.task.requirement.blocked){


            var blockedtask = "";
            var iocainetask = "";
            if(scrumMessageJSON.task.requirement.blocked){

              blockedtask = "<span class='label label-warning' >Blocked</span>";
            }
            else if(scrumMessageJSON.task.requirement.iocaine){


              iocainetask = "<span class='label label-info' >Support</span>";
            }

            params2 += "<p class='scrum-msg-labels'>"+blockedtask+""+iocainetask+"</p>";

          }


        }

        sumparams += "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinksTask'>"+ params2 +"</div>";


        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params + "" + sumparams +"</div>";
          return body;

        }

      }



      /************************* end new ********************************/




      function getBodyFields(scrumMessageJSON, $index, msg){

        var params = "";
        var body = "";
        var totalPoints = 0;
        var sprint = "";



        if(scrumMessageJSON.userstory.voters !== null &&
          scrumMessageJSON.userstory.voters !== undefined &&
          scrumMessageJSON.userstory.voters !== '' ){
          if(scrumMessageJSON.userstory.voters.length){
            params += "<p class='scrum-msg-p'><strong> Votes: </strong>"+scrumMessageJSON.userstory.voters.length+"</p>";
          }
          else{
            params += "<p class='scrum-msg-p'><strong> Votes:</strong> 0</p>";
          }
        }
        else{
          params += "<p class='scrum-msg-p'><strong> Votes:</strong> 0</p>";
        }

        /*podria poner en detalle, pero que se miren la descripcion, vagos */

        if(scrumMessageJSON.userstory.totalPoints !== null &&
          scrumMessageJSON.userstory.totalPoints !== undefined &&
          scrumMessageJSON.userstory.totalPoints !== '' ){

          totalPoints = scrumMessageJSON.userstory.totalPoints;
          params += "<p><strong> Points: </strong>"+totalPoints+"</p>";

        }

        if(scrumMessageJSON.sprint !== null &&
          scrumMessageJSON.sprint !== undefined &&
          scrumMessageJSON.sprint !== '' ){

          if(scrumMessageJSON.sprint.num !== null &&
            scrumMessageJSON.sprint.num !== undefined &&
            scrumMessageJSON.sprint.num !== '' &&
            scrumMessageJSON.sprint.name !== null &&
            scrumMessageJSON.sprint.name !== undefined &&
            scrumMessageJSON.sprint.name !== '' ){



            if(scrumMessageJSON.sprint.id !== null &&
              scrumMessageJSON.sprint.id !== undefined &&
              scrumMessageJSON.sprint.id !== '' ){

              sprint = "<a ng-click='viewSprint(" + '"'+scrumMessageJSON.sprint.id+'"'+")'>#" + scrumMessageJSON.sprint.num + " "+scrumMessageJSON.sprint.name+"</a>";

            }
            else {

              sprint = "<a>#" + scrumMessageJSON.sprint.num + " "+scrumMessageJSON.sprint.name+"</a>";
            }


            params += "<p><strong> Sprint: </strong>"+sprint+"</p>";


          }




        }






        if(scrumMessageJSON.userstory.description !== null &&
          scrumMessageJSON.userstory.description !== undefined &&
          scrumMessageJSON.userstory.description !== '' ){
          params = params + "<p><strong> Description: </strong></p><p class='description-class'>"+scrumMessageJSON.userstory.description+"</p>";


        }

        /* params += "<p class='scrum-msg-labels'><strong> Status: </strong> <span class='label label-primary status' >New</span></p>";*/


        params += "<p class='scrum-msg-labels scrum-msg-labels-with-margin'> <span class='label label-primary status'>New</span></p>";




        if(scrumMessageJSON.userstory.tags !== undefined
          && scrumMessageJSON.userstory.tags !== null
          && scrumMessageJSON.userstory.tags !== ''){
          if(scrumMessageJSON.userstory.tags.length){

            /*params += "<p class='scrum-msg-labels'><strong> Tags: </strong>";*/

            params += "<p class='scrum-msg-labels scrum-msg-labels-with-margin'>";


            for( var i = 0; i< scrumMessageJSON.userstory.tags.length; i++){
              params += "<span class='label label-info tags' >"+ scrumMessageJSON.userstory.tags[i] +"</span>";
            }
            params += "</p>";
          }
        }

        /* team, client, blocked */
        if(scrumMessageJSON.userstory.requirement !== undefined
          && scrumMessageJSON.userstory.requirement !== null
          && scrumMessageJSON.userstory.requirement !== ''){

          if(scrumMessageJSON.userstory.requirement.team
            || scrumMessageJSON.userstory.requirement.client
            || scrumMessageJSON.userstory.requirement.blocked) {


            params += "<p class='scrum-msg-labels'>";


            if(scrumMessageJSON.userstory.requirement.team) {
              params += "<span class='label label-default' >Team requirement</span>";

            }
            if(scrumMessageJSON.userstory.requirement.client) {
              params += "<span class='label label-default' >Client requirement</span>";
            }
            if(scrumMessageJSON.userstory.requirement.blocked) {
              params += "<span class='label label-warning' >Blocked</span>";
            }

            params += "</p>";

          }
        }


        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }

      }



      /****************************** rerere new ****************************************/



      function getBodyFieldsForSprintDeleted(scrumMessageJSON, $index, msg){


        var params = "";
        var body = "";


        if(scrumMessageJSON.sprint.numuserstories !== null &&
          scrumMessageJSON.sprint.numuserstories !== undefined &&
          scrumMessageJSON.sprint.numuserstories !== '' ){
          params +="<p class='scrum-msg-p'><strong>"+ scrumMessageJSON.sprint.numuserstories +"</strong> US moved to BACKLOG </p>";



        }
        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }


      }




      function getBodyFieldsForSprint(scrumMessageJSON, $index, msg, dayMap, monthMap){


        /* solo start date y end date */
        var params = "";
        var body = "";




        if(scrumMessageJSON.sprint.startdate !== null &&
          scrumMessageJSON.sprint.startdate !== undefined &&
          scrumMessageJSON.sprint.startdate !== '' ){

          var fulldate = new Date(scrumMessageJSON.sprint.startdate);

          /* dia de la semana */
          var day = fulldate.getDay();
          var dayString = dayMap.get(day);
          var month = fulldate.getMonth();
          var monthString = monthMap.get(month);
          var year = fulldate.getFullYear();

          /* dia del mes */
          var date = fulldate.getDate();

          var dateformat = dayString+", "+ monthString +" " +date+ ", " + year;
          params +="<h5>Start date: </h5><h4>"+ dateformat +"</h4>";





        }
        if(scrumMessageJSON.sprint.enddate !== null &&
          scrumMessageJSON.sprint.enddate !== undefined &&
          scrumMessageJSON.sprint.enddate !== '' ){

          var fulldateEnd = new Date(scrumMessageJSON.sprint.enddate);

          /* dia de la semana */
          var dayEnd = fulldateEnd.getDay();
          var dayStringEnd = dayMap.get(dayEnd);



          var monthEnd = fulldateEnd.getMonth();
          var monthStringEnd = monthMap.get(monthEnd);
          var yearEnd = fulldateEnd.getFullYear();

          /* dia del mes */
          var dateEnd = fulldateEnd.getDate();

          var dateformatEnd = dayStringEnd+", "+ monthStringEnd +" " +dateEnd+ ", " + yearEnd;
          params +="<h5>End date: </h5><h4>"+ dateformatEnd +"</h4>";

        }


        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }

      }













      function getBodyFieldsForSprintEdit(scrumMessageJSON, $index, msg, dayMap, monthMap){


        /* solo start date y end date */
        var params = "";
        var body = "";

        var dateformatOld ="";
        var dateformatNew = "";


        var fulldateOld = "";
        var fulldateNew = "";



        var dayOld, dayStringOld, monthOld, monthStringOld, yearOld, dateOld;
        var dayNew, dayStringNew, monthNew, monthStringNew, yearNew, dateNew;


        if(scrumMessageJSON.fieldschange !== null &&
          scrumMessageJSON.fieldschange !== undefined &&
          scrumMessageJSON.fieldschange !== '' ){

          if(scrumMessageJSON.fieldschange.startdate !== null &&
            scrumMessageJSON.fieldschange.startdate !== undefined &&
            scrumMessageJSON.fieldschange.startdate !== ''){


            fulldateOld = new Date(scrumMessageJSON.sprint.startdate);
            fulldateNew = new Date(scrumMessageJSON.fieldschange.startdate);

            /* dia de la semana */
            dayOld = fulldateOld.getDay();
            dayStringOld = dayMap.get(dayOld);
            monthOld = fulldateOld.getMonth();
            monthStringOld = monthMap.get(monthOld);
            yearOld = fulldateOld.getFullYear();
            dateOld = fulldateOld.getDate();




            dayNew = fulldateNew.getDay();
            dayStringNew = dayMap.get(dayNew);
            monthNew = fulldateNew.getMonth();
            monthStringNew = monthMap.get(monthNew);
            yearNew = fulldateNew.getFullYear();
            dateNew = fulldateNew.getDate();





            dateformatOld = dayStringOld+", "+ monthStringOld +" " +dateOld+ ", " + yearOld;
            dateformatNew = dayStringNew+", "+ monthStringNew +" " +dateNew+ ", " + yearNew;

            if(dateformatOld !== dateformatNew){
              params +="<h4>Start date changed:</h4><h5>FROM "+ dateformatOld +"</h5>" +
                "<h5>TO "+ dateformatNew +"</h5>";

            }







          }

          if(scrumMessageJSON.fieldschange.enddate !== null &&
            scrumMessageJSON.fieldschange.enddate !== undefined &&
            scrumMessageJSON.fieldschange.enddate !== ''){


            fulldateOld = new Date(scrumMessageJSON.sprint.enddate);
            fulldateNew = new Date(scrumMessageJSON.fieldschange.enddate);

            dayOld = fulldateOld.getDay();
            dayStringOld = dayMap.get(dayOld);
            monthOld = fulldateOld.getMonth();
            monthStringOld = monthMap.get(monthOld);
            yearOld = fulldateOld.getFullYear();
            dateOld = fulldateOld.getDate();




            dayNew = fulldateNew.getDay();
            dayStringNew = dayMap.get(dayNew);
            monthNew = fulldateNew.getMonth();
            monthStringNew = monthMap.get(monthNew);
            yearNew = fulldateNew.getFullYear();
            dateNew = fulldateNew.getDate();



            dateformatOld = dayStringOld+", "+ monthStringOld +" " +dateOld+ ", " + yearOld;
            dateformatNew = dayStringNew+", "+ monthStringNew +" " +dateNew+ ", " + yearNew;




            if(dateformatOld !== dateformatNew){
              params +="<h4>End date changed:</h4><h5>FROM "+ dateformatOld +"</h5>" +
                      "<h5>TO "+ dateformatNew +"</h5>";

            }


          }

          if(params == ""){

            if(scrumMessageJSON.sprint.startdate !== null &&
              scrumMessageJSON.sprint.startdate !== undefined &&
              scrumMessageJSON.sprint.startdate !== '' ){

              var fulldate = new Date(scrumMessageJSON.sprint.startdate);

              /* dia de la semana */
              var day = fulldate.getDay();
              var dayString = dayMap.get(day);
              var month = fulldate.getMonth();
              var monthString = monthMap.get(month);
              var year = fulldate.getFullYear();

              /* dia del mes */
              var date = fulldate.getDate();

              var dateformat = dayString+", "+ monthString +" " +date+ ", " + year;
              params +="<h5>Start date: </h5><h4>"+ dateformat +"</h4>";



            }
            if(scrumMessageJSON.sprint.enddate !== null &&
              scrumMessageJSON.sprint.enddate !== undefined &&
              scrumMessageJSON.sprint.enddate !== '' ){

              var fulldateEnd = new Date(scrumMessageJSON.sprint.enddate);

              /* dia de la semana */
              var dayEnd = fulldateEnd.getDay();
              var dayStringEnd = dayMap.get(dayEnd);



              var monthEnd = fulldateEnd.getMonth();
              var monthStringEnd = monthMap.get(monthEnd);
              var yearEnd = fulldateEnd.getFullYear();

              /* dia del mes */
              var dateEnd = fulldateEnd.getDate();

              var dateformatEnd = dayStringEnd+", "+ monthStringEnd +" " +dateEnd+ ", " + yearEnd;
              params +="<h5>End date: </h5><h4>"+ dateformatEnd +"</h4>";

            }

          }


        }
        else{


          if(scrumMessageJSON.sprint.startdate !== null &&
            scrumMessageJSON.sprint.startdate !== undefined &&
            scrumMessageJSON.sprint.startdate !== '' ){

            var fulldate = new Date(scrumMessageJSON.sprint.startdate);

            /* dia de la semana */
            var day = fulldate.getDay();
            var dayString = dayMap.get(day);
            var month = fulldate.getMonth();
            var monthString = monthMap.get(month);
            var year = fulldate.getFullYear();

            /* dia del mes */
            var date = fulldate.getDate();

            var dateformat = dayString+", "+ monthString +" " +date+ ", " + year;
            params +="<h5>Start date: </h5><h4>"+ dateformat +"</h4>";



          }
          if(scrumMessageJSON.sprint.enddate !== null &&
            scrumMessageJSON.sprint.enddate !== undefined &&
            scrumMessageJSON.sprint.enddate !== '' ){

            var fulldateEnd = new Date(scrumMessageJSON.sprint.enddate);

            /* dia de la semana */
            var dayEnd = fulldateEnd.getDay();
            var dayStringEnd = dayMap.get(dayEnd);



            var monthEnd = fulldateEnd.getMonth();
            var monthStringEnd = monthMap.get(monthEnd);
            var yearEnd = fulldateEnd.getFullYear();

            /* dia del mes */
            var dateEnd = fulldateEnd.getDate();

            var dateformatEnd = dayStringEnd+", "+ monthStringEnd +" " +dateEnd+ ", " + yearEnd;
            params +="<h5>End date: </h5><h4>"+ dateformatEnd +"</h4>";

          }



        }

        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }

      };



















      function getBodyStatusFieldsForUpdate(scrumMessageJSON, $index, msg){

        var params = "";
        var body = "";

        var statusbody = "";
        var statusbodyfrom = "";
        var statusbodyto ="";



        if(scrumMessageJSON.codepoints !== undefined &&
          scrumMessageJSON.codepoints !== null &&
          scrumMessageJSON.codepoints !== '' ){
          if(scrumMessageJSON.codepoints.from !== undefined &&
            scrumMessageJSON.codepoints.from !== null &&
            scrumMessageJSON.codepoints.from !== '' &&
            scrumMessageJSON.codepoints.to !== undefined &&
            scrumMessageJSON.codepoints.to !== null &&
            scrumMessageJSON.codepoints.to !== '' ){


            /* dependiendo del stado 1 clase u otra */

            if(scrumMessageJSON.codepoints.from == "New"){

              statusbodyfrom = "<span class='label label-primary status' >"+scrumMessageJSON.codepoints.from+"</span>";
            }
            else if(scrumMessageJSON.codepoints.from == "In progress"){
              statusbodyfrom = "<span class='label label-info status' >"+scrumMessageJSON.codepoints.from+"</span>";

            }
            else if(scrumMessageJSON.codepoints.from == "Ready for test"){
              statusbodyfrom = "<span class='label label-warning status' >"+scrumMessageJSON.codepoints.from+"</span>";
            }
            else if(scrumMessageJSON.codepoints.from == "Closed"){
              statusbodyfrom = "<span class='label label-success status' >"+scrumMessageJSON.codepoints.from+"</span>";

            }

            if(scrumMessageJSON.codepoints.to == "New"){
              statusbodyto = "<span class='label label-primary status' >"+scrumMessageJSON.codepoints.to+"</span>";

            }
            else if(scrumMessageJSON.codepoints.to == "In progress"){
              statusbodyto = "<span class='label label-info status' >"+scrumMessageJSON.codepoints.to+"</span>";

            }
            else if(scrumMessageJSON.codepoints.to == "Ready for test"){
              statusbodyto = "<span class='label label-warning status' >"+scrumMessageJSON.codepoints.to+"</span>";

            }
            else if(scrumMessageJSON.codepoints.to == "Closed"){
              statusbodyto = "<span class='label label-success status' >"+scrumMessageJSON.codepoints.to+"</span>";

            }

            if(statusbodyfrom !== "" && statusbodyto !== ""){
              statusbody += "<h5>FROM "+statusbodyfrom+"</h5><h5> TO "+statusbodyto + "</h5>";

            }





          }



        }


        /* status change **/
        params += "<p><h4>Status change </h4>"+statusbody+"</p>";


        body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
        return body;

      }




      function getBodyFieldsForDeleteTasks(scrumMessageJSON, $index, msg){

        var body = "";
        var params = "";

        if(scrumMessageJSON.userstory !== undefined &&
          scrumMessageJSON.userstory !== null &&
          scrumMessageJSON.userstory !== '' ){
          if(scrumMessageJSON.userstory.numtasks !== undefined &&
            scrumMessageJSON.userstory.numtasks !== null &&
            scrumMessageJSON.userstory.numtasks !== '' &&
            scrumMessageJSON.userstory.numtasks.length >0){

            params += "<h4>"+ scrumMessageJSON.userstory.numtasks.length + " tasks removed </h4>";



          }
          if(scrumMessageJSON.userstory.numissues !== undefined &&
            scrumMessageJSON.userstory.numissues !== null &&
            scrumMessageJSON.userstory.numissues !== ''){

            params += "<h4>"+ scrumMessageJSON.userstory.numissues + " issue unlinked </h4>";



          }

        }






        if(params !== ''){

          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";


        }
        return body;

      };




      /*********************************************************************/
      function getBodyFieldsForUpdate(scrumMessageJSON, $index, msg){

        var params = "";
        var body = "";

        var isVoted = false;
        var totalPoints = 0;


        /* mirar que field tiene y hacerlo en base a eso */
        /*
        * field == 1){ /*voters*
        * 2 point
        * 3 attachment
        * 4 tasks
        * 5 tags
        * 6 description
        * 7 requirement

        * */

        if(scrumMessageJSON.field == 1){ /* voters */
          /* miramos si el objeto me tiene, sino esque el desvotado */
          if(scrumMessageJSON.userstory.voters !== undefined &&
            scrumMessageJSON.userstory.voters !== null &&
            scrumMessageJSON.userstory.voters !== '' &&
            scrumMessageJSON.sender !== null &&
            scrumMessageJSON.sender !== undefined &&
            scrumMessageJSON.sender !== '' ){
            if(scrumMessageJSON.userstory.voters.length >0){
              for(var i = 0; i< scrumMessageJSON.userstory.voters.length; i++){

                if(scrumMessageJSON.userstory.voters[i] == scrumMessageJSON.sender.id &&
                  scrumMessageJSON.sender.id !== undefined &&
                  scrumMessageJSON.sender.id !== null &&
                  scrumMessageJSON.sender.id !== '' ){
                  isVoted = true;
                }
              }
            }
            else{
              /* he desvotado */
              isVoted = false;
            }

            if(isVoted){
              params += "<h4>Votes increased: </h4>";

            }
            else{
              params += "<h4>Votes decreased: </h4>";

            }

            params += "<p>Total votes: </h4>"+scrumMessageJSON.userstory.voters.length +"</p>";

          }

        }/* end votes update */
        else if(scrumMessageJSON.field == 2) { /* point */


          var codepoints = "";

          /* miramos si tiene codepoints*/
          if(scrumMessageJSON.codepoints !== undefined &&
            scrumMessageJSON.codepoints !== null &&
            scrumMessageJSON.codepoints !== '' ){
            if(scrumMessageJSON.codepoints == 0){
              codepoints = "'UX' ";

            }
            else if(scrumMessageJSON.codepoints == 1){
              codepoints = "'Design' ";

            }
            else if(scrumMessageJSON.codepoints == 2){
              codepoints = "'Back' ";

            }
            else if(scrumMessageJSON.codepoints == 3){
              codepoints = "'Front' ";

            }
            else{
              codepoints = "";
            }

          }

          if(codepoints == ""){
            params += "<h4>Points changed: </h4>";

          }
          else{

            params += "<h4>"+codepoints+" points changed: </h4>";

          }


          if(scrumMessageJSON.userstory.point !== undefined &&
            scrumMessageJSON.userstory.point !== null &&
            scrumMessageJSON.userstory.point !== ''){


            if(scrumMessageJSON.userstory.point.ux !== undefined &&
              scrumMessageJSON.userstory.point.ux !== null &&
              scrumMessageJSON.userstory.point.ux !== ''){

              params += "<p>UX: "+scrumMessageJSON.userstory.point.ux +"</p>";

            }

            if(scrumMessageJSON.userstory.point.design !== undefined &&
              scrumMessageJSON.userstory.point.design !== null &&
              scrumMessageJSON.userstory.point.design !== ''){

              params += "<p>Design: "+scrumMessageJSON.userstory.point.design +" </p>";
            }
            if(scrumMessageJSON.userstory.point.front !== undefined &&
              scrumMessageJSON.userstory.point.front !== null &&
              scrumMessageJSON.userstory.point.front !== ''){
              params += "<p>Front: "+scrumMessageJSON.userstory.point.front +" </p>";


            }
            if(scrumMessageJSON.userstory.point.back !== undefined &&
              scrumMessageJSON.userstory.point.back !== null &&
              scrumMessageJSON.userstory.point.back !== ''){
              params += "<p>Back: "+scrumMessageJSON.userstory.point.back +" </p>";

            }

          }
          if(scrumMessageJSON.userstory.totalPoints !== null &&
            scrumMessageJSON.userstory.totalPoints !== undefined &&
            scrumMessageJSON.userstory.totalPoints !== '' ){

            totalPoints = scrumMessageJSON.userstory.totalPoints;
            params += "<p class='totalpoints'> Total Points: "+totalPoints+"</p>";

          }


        } /* end points */
        else if(scrumMessageJSON.field == 5) { /* tags */



          /* miramos el codigo si lo tiene
          * scrumMessageJSON.codepoints si 0 remove */

          if(scrumMessageJSON.codepoints !== undefined &&
            scrumMessageJSON.codepoints !== null &&
            scrumMessageJSON.codepoints !== '' ){

            var type = " changed";

            if(scrumMessageJSON.codepoints.code !== undefined &&
              scrumMessageJSON.codepoints.code !== null &&
              scrumMessageJSON.codepoints.code !== '' &&
              scrumMessageJSON.codepoints.text !== undefined &&
              scrumMessageJSON.codepoints.text !== null &&
              scrumMessageJSON.codepoints.text !== ''){



              var label = "";


              if(scrumMessageJSON.codepoints.code == 0){
                type = " removed:";
              }
              else {
                type = " added:";
              }

              label = "<span class='label label-info tags' >"+ scrumMessageJSON.codepoints.text +"</span>";

            }

            params += "<p class='scrum-msg-labels'>" +
              "<h4> Tag "+ type+"</h4></p><p>"+label+"</p>";


          }
          else{
            params += "<p class='scrum-msg-labels'><h4> Tags changed </h4></p>";
            if(scrumMessageJSON.userstory.tags !== undefined
              && scrumMessageJSON.userstory.tags !== null
              && scrumMessageJSON.userstory.tags !== ''){
              if(scrumMessageJSON.userstory.tags.length >0){

                for( var i = 0; i< scrumMessageJSON.userstory.tags.length; i++){
                  params += "<p><span class='label label-info tags' >"+ scrumMessageJSON.userstory.tags[i] +"</span></p>";
                }

              }
            }
          }
        }


        else if(scrumMessageJSON.field == 6) { /* description */
          params += "<h4>Description changed: </h4>";
          if(scrumMessageJSON.userstory.description !== null &&
            scrumMessageJSON.userstory.description !== undefined &&
            scrumMessageJSON.userstory.description !== '' ){

            params += "<p>"+scrumMessageJSON.userstory.description+"</p>";
          }


        }
        else if(scrumMessageJSON.field == 7) { /* requirement */

          /* segun el code se que requirement a sido
          * 0:: client
          * 1:: team
          * 2:: bloqued */


          if(scrumMessageJSON.codepoints !== undefined &&
            scrumMessageJSON.codepoints !== null &&
            scrumMessageJSON.codepoints !== '' &&
            scrumMessageJSON.userstory.requirement !== undefined &&
            scrumMessageJSON.userstory.requirement !== null &&
            scrumMessageJSON.userstory.requirement !== ''){


            var status = "";
            var labeled = "";
            if(scrumMessageJSON.codepoints == 0){
              if(scrumMessageJSON.userstory.requirement.team){
                status = "marked as a";

              }
              else{
                status = "unmarked as a";

              }
              labeled = "<span class='label label-default label-marked' >Team requirement</span>";


            }
            else if(scrumMessageJSON.codepoints == 1){
              if(scrumMessageJSON.userstory.requirement.client){
                status = "marked as a";

              }
              else{
                status = "unmarked as a";

              }
              labeled = "<span class='label label-default label-marked' >Client requirement</span>";


            }
            else if(scrumMessageJSON.codepoints == 2){
              if(scrumMessageJSON.userstory.requirement.blocked){
                status = "marked as a";

              }
              else{
                status = "unmarked as a";

              }
              labeled = "<span class='label label-warning label-marked' >Blocked</span>";


            }


            if(status == ""){
              params += "<p class='scrum-msg-labels'><h4>Type changed </h4>";

              /* team, client, blocked */
              if(scrumMessageJSON.userstory.requirement !== undefined
                && scrumMessageJSON.userstory.requirement !== null
                && scrumMessageJSON.userstory.requirement !== ''){

                if(scrumMessageJSON.userstory.requirement.team
                  || scrumMessageJSON.userstory.requirement.client
                  || scrumMessageJSON.userstory.requirement.blocked) {


                  if(scrumMessageJSON.userstory.requirement.team) {
                    params += "<span class='label label-default label-marked' >Team requirement</span>";

                  }
                  if(scrumMessageJSON.userstory.requirement.client) {
                    params += "<span class='label label-default label-marked' >Client requirement</span>";
                  }
                  if(scrumMessageJSON.userstory.requirement.blocked) {
                    params += "<span class='label label-warning label-marked' >Blocked</span>";
                  }


                }
              }
              params += "</p>";


            }
            else{
              params += "<p><h4>Type "+status +"</h4>"+labeled+"</p>";

            }




          }
          else{
            /*params += "<p class='scrum-msg-labels'><h4>Type changed </h4>";*/
            params += "<p class='scrum-msg-labels'>";

            /* team, client, blocked */
            if(scrumMessageJSON.userstory.requirement !== undefined
              && scrumMessageJSON.userstory.requirement !== null
              && scrumMessageJSON.userstory.requirement !== ''){

              if(scrumMessageJSON.userstory.requirement.team
                || scrumMessageJSON.userstory.requirement.client
                || scrumMessageJSON.userstory.requirement.blocked) {


                if(scrumMessageJSON.userstory.requirement.team) {
                  params += "<span class='label label-default label-marked' >Team requirement</span>";

                }
                if(scrumMessageJSON.userstory.requirement.client) {
                  params += "<span class='label label-default label-marked' >Client requirement</span>";
                }
                if(scrumMessageJSON.userstory.requirement.blocked) {
                  params += "<span class='label label-warning label-marked' >Blocked</span>";
                }


              }
            }
            params += "</p>";

          }





        }
        else if(scrumMessageJSON.field == 8){ /* subject */
          params += "<h4>Subject changed </h4>";

        }
        /* habra que poner datos especificos del sprint */
        else if(scrumMessageJSON.field == 9){ /* sprint */

          var fromsprintlink = "";
          var tosprintlink = "";
          var assignedtosprint = "";

          /*messagetext.userstory.sprint = {};
           messagetext.userstory.sprint.id = codepoints.old.id;
           messagetext.userstory.sprint.name = codepoints.old.name;
           messagetext.userstory.sprint.num = codepoints.old.num;

           }
           if(codepoints.new !== undefined &&
           codepoints.new !== null &&
           codepoints.new !== '' ){
           messagetext.codepoints = {};
           messagetext.codepoints.id = codepoints.new.id;
           messagetext.codepoints.name = codepoints.new.name;
           messagetext.codepoints.num = codepoints.new.num;
           */

          if(scrumMessageJSON.codepoints !== undefined &&
            scrumMessageJSON.codepoints !== null &&
            scrumMessageJSON.codepoints !== '' ){
            if(scrumMessageJSON.codepoints.num !== undefined &&
              scrumMessageJSON.codepoints.num !== null &&
              scrumMessageJSON.codepoints.num !== '' &&
              scrumMessageJSON.codepoints.name !== undefined &&
              scrumMessageJSON.codepoints.name !== null &&
              scrumMessageJSON.codepoints.name !== '' ){

              var num = scrumMessageJSON.codepoints.num;
              var name = scrumMessageJSON.codepoints.name;




              if(scrumMessageJSON.codepoints.id !== null &&
                scrumMessageJSON.codepoints.id !== undefined &&
                scrumMessageJSON.codepoints.id !== ''){

                fromsprintlink = "<h5>FROM Sprint <a ng-click='viewSprint(" + '"'+scrumMessageJSON.codepoints.id+'"'+")'>#" + num + " "+name+"</a></h5>";

              }
              else{
                fromsprintlink = "<h5>FROM Sprint #"+ num +" "+ name + "</h5>";
              }


            }

          }
          if(fromsprintlink == ''){
            fromsprintlink = "<h5>FROM BACKLOG </h5>";

          }

          assignedtosprint += fromsprintlink;

          if(scrumMessageJSON.userstory.sprint !== undefined &&
            scrumMessageJSON.userstory.sprint !== null &&
            scrumMessageJSON.userstory.sprint !== '' ){
            if(scrumMessageJSON.userstory.sprint.num !== undefined &&
              scrumMessageJSON.userstory.sprint.num !== null &&
              scrumMessageJSON.userstory.sprint.num !== '' &&
              scrumMessageJSON.userstory.sprint.name !== undefined &&
              scrumMessageJSON.userstory.sprint.name !== null &&
              scrumMessageJSON.userstory.sprint.name !== '' ){

              var num = scrumMessageJSON.userstory.sprint.num;
              var name = scrumMessageJSON.userstory.sprint.name;




              if(scrumMessageJSON.userstory.sprint.id !== null &&
                scrumMessageJSON.userstory.sprint.id !== undefined &&
                scrumMessageJSON.userstory.sprint.id !== ''){

                tosprintlink = "<h5>TO Sprint <a ng-click='viewSprint(" + '"'+scrumMessageJSON.userstory.sprint.id+'"'+")'>#" + num + " "+name+"</a></h5>";

              }
              else{
                tosprintlink = "<h5>TO Sprint #" + num + " "+name+ "</h5>";
              }


            }

          }
          if(tosprintlink == ''){
            tosprintlink = "<h5>TO BACKLOG </h5>";

          }
          assignedtosprint += tosprintlink;


          params += assignedtosprint;

        }


        if(params == ''){
          return '';
        }
        else {
          body = "<div ng-if="+ '"' +msg.visible+'"' +"class='metadatalinks'>"+ params +"</div>";
          return body;

        }

      }



      /****************************** end new ***********************************/


    function parseScrumComments(scrumCommentJSON, $index, msg) {
        var messageText = '';



        var num = "";
        var subject = "";
        var username ="";
        var params = "";


        if(scrumCommentJSON !== null &&
          scrumCommentJSON !== undefined &&
          scrumCommentJSON !== ''){
          if(scrumCommentJSON.userstory !== null &&
            scrumCommentJSON.userstory !== undefined &&
            scrumCommentJSON.userstory !== '') {


            /* queremos poner Generating the user story #15 - daleeee*/
            messageText += "Generating new related userstory";

            if (scrumCommentJSON.userstory.num !== null &&
              scrumCommentJSON.userstory.num !== undefined &&
              scrumCommentJSON.userstory.num !== '') {
              num = scrumCommentJSON.userstory.num;
            }
            if (scrumCommentJSON.userstory.subject !== null &&
              scrumCommentJSON.userstory.subject !== undefined &&
              scrumCommentJSON.userstory.subject !== '') {
              subject = scrumCommentJSON.userstory.subject;
            }



            if (scrumCommentJSON.sender !== null &&
              scrumCommentJSON.sender !== undefined &&
              scrumCommentJSON.sender !== '') {


              if (scrumCommentJSON.sender.username !== null &&
                scrumCommentJSON.sender.username !== undefined &&
                scrumCommentJSON.sender.username !== '') {
                username = scrumCommentJSON.sender.username;


                if (scrumCommentJSON.sender.id !== null &&
                  scrumCommentJSON.sender.id !== undefined &&
                  scrumCommentJSON.sender.id !== '') {

                  params = " by <a ng-click='viewUserProfile(" + '"' + scrumCommentJSON.sender.id + '"' + ")'>" + username + "</a>";


                }
                else {
                  params = " by <a ng-click=''>" + username + "</a>";
                }




              }
            }



            if (scrumCommentJSON.userstory.id !== null &&
              scrumCommentJSON.userstory.id !== undefined &&
              scrumCommentJSON.userstory.id !== '') {

              messageText += "<p><a ng-click='viewUserstory(" + '"' + scrumCommentJSON.userstory.id + '"' + ")'>#" + num + " "
                + subject + "</a>" + params +"</p>";


            }
            else {
              messageText += "<p><a ng-click=''>#" + num + " " + subject + "</a>" + params +"</p>";


            }




          }

        }

        return messageText;

    };






    function parseScrumEvents(scrumMessageJSON, $index, msg) {

      var messageText = '';



      if(scrumMessageJSON !== null &&
        scrumMessageJSON !== undefined &&
        scrumMessageJSON !== ''){

        var messageEventType = scrumMessageJSON.event;


        if(messageEventType == "userstory"){

          /* llamamos al parseo de eventos push */
          messageText = parseUserstory(scrumMessageJSON, $index, msg);


        }
        else if(messageEventType == "sprint"){
          messageText = parseSprint(scrumMessageJSON, $index, msg);


        }
        else if(messageEventType == "issue"){
          messageText = parseIssue(scrumMessageJSON, $index, msg);

        }
        else if(messageEventType == "task"){
          messageText = parseTask(scrumMessageJSON, $index, msg);


        }

      }



      return messageText;




    };















  }]);
