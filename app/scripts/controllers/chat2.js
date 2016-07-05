'use strict';

angular.module('myAppAngularMinApp')
  .filter('prueba', function () {
    return function (item, searchTaskAssignedto) {
      if(item.assignedto == undefined || item.assignedto == ''){
        return false;
      }
      else if(item.assignedto.username == undefined || item.assignedto.username == ''){
        return false;
      }
      else if(item.assignedto.indexOf(searchTaskAssignedto) >= 0){
        return true;
      }
      else{
        return false;
      }

    };
  })
  .controller('Chat2Ctrl', ['$scope', '$window', '$uibModal','ProfileService',
    'LoginService', '$location', '$localStorage', 'ChatService', 'Socket',
    'GroupService', 'ChannelService', 'sharedProperties', '$log', '$sce', '$anchorScroll','md5',
    'searchservice', 'GithubService', '$timeout', 'spinnerService', 'INTERNAL_USER', 'ScrumService','ScrumParseService',
    'toastr',
    function ($scope, $window, $uibModal, ProfileService,
              LoginService, $location, $localStorage, ChatService, Socket,
              GroupService, ChannelService, sharedProperties, $log, $sce, $anchorScroll, md5,
              searchservice, GithubService, $timeout, spinnerService, INTERNAL_USER, ScrumService, ScrumParseService,
              toastr) {

      $scope.init = function()
      {
        // Emitimos evento de conexion a chat para recibir nuevas invitaciones a grupos
        console.log("ha entrado a crear socket newChatConnection");
        Socket.emit('newChatConnection', {'userid': $localStorage.id });
        $scope.groupsNotificationsCount=0;
        $scope.channelsNotificationsCount=0;
        $scope.directChannelsNotificationsCount=0;

        $scope.publicChannels = [];
        $scope.privateChannels = [];

        $scope.window_focus = true;


        /* para saber si esta activada la funcionalidad de
        integraction con github */



        /* mirar si cambiamos lo de githubchecked funciona */
        $scope.githubchannel = {};


        //$scope.githubchecked = false;
        $scope.githubaccounts = [];
        $scope.account = {};
        $scope.accountSelected = {};

        $scope.arrReposOk = [];
        $scope.arrReposError = [];
        $scope.flag = {};



        /* SCRUM */
        /*$scope.scrumchecked = false;*/
        $scope.group = {};
        $scope.channel = {};

        $scope.channel = {};
        $scope.channel.channelType = "PUBLIC";
        $scope.channel.channelService = 0;



        /************* scrum dashboard init ***********************/


        /* esto son cosas que no cambian:: static siempre lo primero
        * menos la carga de modales que usan cosas dinamicas */

        /* si queremos ponerle label al eje x de la grafica */
        $scope.labels = [];
        /* nombre de la grafica */
        $scope.series = ['Sprints'];
        /* de momento estatico, luego habra que ir cambiandolo e inicializandolo como los otros*/
        $scope.chartdata = [
          [50, 0]
        ];



        $scope.comboOptions = [
          {name: "All", num: 0},
          {name: "Subject", num: 1},
          {name: "Status", num: 2},
          {name: "Tags", num: 3}

        ];

        $scope.comboOptionsTasks = [
          {name: "All", num: 0},
          {name: "Subject", num: 1},
          {name: "Status", num: 2},
          {name: "Assigned to", num: 3}

        ];


        $scope.comboOptionsIssues = [
          {name: "All", num: 0},
          {name: "Subject", num: 1},
          {name: "Type", num: 2},
          {name: "Severity", num: 3},
          {name: "Priority", num: 4},
          {name: "Status", num: 5}

        ];


        /* solo xrol y username */
        $scope.comboOptionsTeam = [
          {name: "All", num: 0},
          {name: "Username", num: 1},
          {name: "Role", num: 2}
        ];


        $scope.statics = {};
        $scope.statics.points = [
          {num:0, status: false},
          {num:0.5, status: false},
          {num:1, status: false},
          {num:2, status: false},
          {num:3, status: false},
          {num:5, status: false},
          {num:8, status: false},
          {num:10, status: false},
          {num:15, status: false},
          {num:20, status: false},
          {num:40, status: false}];

        $scope.statics.requirements = ["Team Requirement", "Client Requirement", "Blocked" ];

        $scope.statics.status = ["New", "In progress", "Ready for test", "Closed"];
        $scope.statics.type = ["Bug", "Question", "Enhancement"];
        /*['Wishlist', 'Minor', 'Normal', 'Important', 'Critical']*/
        $scope.statics.severity = ["Wishlist", "Minor", "Normal", "Important", "Critical"];
        $scope.statics.priority = ["Low", "Normal", "High"];




        /* errores de modales */
        $scope.modalsError = {};
        $scope.modalsError.messageNewGroupModal = '';
        $scope.modalsError.messageNewChannelModal= '';
        $scope.modalsError.messageNewChannelNameModal = '';
        $scope.modalsError.messageNewChannelPassBadCredentialsModal = '';
        $scope.modalsError.messageNewChannelUsernameBadCredentialsModal = '';
        $scope.modalsError.messageNewChannelModalReposEmpty = '';
        $scope.modalsError.messageNewSprintRequiredNameModal = '';
        $scope.modalsError.messageNewSprintModal = '';


        $scope.modalsError.messageEditSprintRequiredNameModal = '';
        $scope.modalsError.messageEditSprintModal = '';

        $scope.modalsError.messageNewIssueModal = '';
        $scope.modalsError.messageNewIssueRequiredSubModal = '';


        $scope.modalsError.messageReloginBadCredentialsModal = '';






        /* inicializa vars de scrum */
        initVarsScrumChannel();

        /* inicializa sus variables y el error de userstory create */
        removeVarsNewUserstoryModal();


        /* inicializa sus variables y el error de task create */
        removeVarsNewRelatedTaskModal();

        removeVarsNewSprintModal();


        removeVarsEditSprintModal();






        $scope.dynamicPopover = {
          templateUrl: 'views/modals/pickerpopover.html',
        };

        $scope.dynamicPopoverDes = {
          templateUrl: 'views/modals/pickerpopoverDes.html',
        };

        $scope.dynamicPopoverBack = {
          templateUrl: 'views/modals/pickerpopoverBack.html',
        };

        $scope.dynamicPopoverFront = {
          templateUrl: 'views/modals/pickerpopoverFront.html',
        };


        $scope.dynamicPopoverEdit = {
          templateUrl: 'views/modals/pickerpopoverEdit.html',
        };

        $scope.dynamicPopoverDesEdit = {
          templateUrl: 'views/modals/pickerpopoverDesEdit.html',
        };

        $scope.dynamicPopoverBackEdit = {
          templateUrl: 'views/modals/pickerpopoverBackEdit.html',
        };

        $scope.dynamicPopoverFrontEdit = {
          templateUrl: 'views/modals/pickerpopoverFrontEdit.html',
        };



        /* fin de cosas que no cambian */

        $scope.parseFloat = parseFloat;


      }; /* end scope init */






      $('.modal').on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
      });

      /******************** funciones para taskboard **********************************/



      // Generate initial model :: in init



      $scope.itemlabels = {};
      $scope.itemlabels.labels =["NEW", "IN PROGRESS", "READY FOR TEST", "CLOSED"];
      $scope.itemlabels.series =["Tasks", "Issues"];






      $scope.models = {
        selected: null,
        lists: {"A": [], "B": []}
      };


      // generate de model
      for (var i = 1; i <= 3; ++i) {
        console.log("genero modelo");
        $scope.models.lists.A.push({label: "Item A" + i});
        $scope.models.lists.B.push({label: "Item B" + i});
      }






      $scope.onAddedItemSprint = function ($index, num) {
        console.log("estamos en added item sprint");
        console.log("con $index");
        console.log($index);
        console.log("con num");
        console.log(num);

      }


      $scope.onSelected = function (indUs, indTask, item) {

        console.log("esto vale indUs en ONSELECTED");
        console.log(indUs);
        console.log("esto vale indTask");
        console.log(indTask);

        console.log("esto vale item");
        console.log(item);

        console.log("esto vale item compuesto xmi, debe ser el mismo");
        console.log($scope.rowCollectionUserStories[indUs].tasks[indTask]);




      };



      $scope.onMoved = function (indUs, indTask, item) {

        console.log("esto vale indUs en ONMOVED");
        console.log(indUs);
        console.log("esto vale indTask");
        console.log(indTask);

        console.log("esto vale item");
        console.log(item);

        console.log("esto vale item compuesto xmi, debe ser el mismo");
        console.log($scope.rowCollectionUserStories[indUs].tasks[indTask]);



      };

      $scope.logEvent = function(message, event) {
        console.log(message, '(triggered by the following', event.type, 'event)');
        console.log(event);
      };












      $scope.FilterFunction = function (item) {
        if(item.assignedto == undefined || item.assignedto == ''){
          return false;
        }
        else if(item.assignedto.username == undefined || item.assignedto.username == ''){
          return false;
        }
        else if(item.assignedto.indexOf($scope.searchTaskAssignedto) >= 0){
          return true;
        }
        else{
          return false;
        }


      };






      /********* backlog dashboard (vars) ***************/

      /* ************** init vars, no estaticas  ******************* */
      function removeCommentText(){
        $scope.item.commentText="";
        $("#commentText").val('').trigger('textarea');

      }



      function removeNameNewSprintText(){
        $scope.sprint.name = "";
        $("#sprintName").val('').trigger('input');

      }
      function removeNameEditSprintText(){
        $scope.sprint.name = "";
        $("#sprintNameEdit").val('').trigger('input');

      }





      /* metemos search y celltable */
      function initVarsScrumChannelTasks () {

        //$scope.rowCollectionTasks = [];
        $scope.tagTask = -1;
        $scope.item.viewRelatedTasks = false;
        $scope.item.viewRelatedComments = false;


        removeCommentText();

      }



      /*************************** ISSUE ********************************************/
      function initVarsScrumChannelIssues(){

        $scope.tagIssue = -1;
        $scope.tagIssueTemp = {};
        $scope.item.viewinDetail = false;
        $scope.item.viewRelatedComments = false;
        $scope.item.viewRelatedUS = false;

        removeCommentText();


      };


      /*************************** TEAM ********************************************/

      function initVarsScrumChannelTeamPre() {
        $scope.channelScrumTeam = angular.copy($scope.channelMembers);


        if ($scope.channelScrumTeam !== undefined &&
          $scope.channelScrumTeam !== null &&
          $scope.channelScrumTeam !== '' &&
          $scope.channelScrumTeam.length > 0) {

          for (var x = 0; x < $scope.channelScrumTeam.length; x++) {

            $scope.channelScrumTeam[x].tasks = {};
            $scope.channelScrumTeam[x].chart = [[0, 0, 0, 0], [0, 0, 0, 0]];


            $scope.channelScrumTeam[x].tasks.blocked = 0;
            $scope.channelScrumTeam[x].tasks.open = 0;
            $scope.channelScrumTeam[x].issues = {};
            $scope.channelScrumTeam[x].issues.reported = 0;


            if ($scope.adminChannel !== undefined &&
              $scope.adminChannel !== null &&
              $scope.adminChannel !== '') {
              if ($scope.adminChannel.id == $scope.channelScrumTeam[x].id) {
                $scope.channelScrumTeam[x].role = "Product Owner";

              }
              else {
                $scope.channelScrumTeam[x].role = "UX";

              }

            }
          }
          /* end for inicializa vars */


        }
      };



      function removesearchteamchart (){
        $scope.searchTextTeam = '';

        $("#searchTextTeam").val('').trigger('input');


      }


      function initVarsScrumChannelTeam(){

        initVarsScrumChannelTeamUpdate();
        $scope.item.viewChart = false;
        removesearchteamchart();
        removeVarsSearchTeam();
      };





      $scope.viewChartsFromTable = function (num){
        /* vienen de la tabla */
        if (num==0){
          removeVarsSearchTeam();

          $scope.item.viewChart = true;

        }
        else {
          removesearchteamchart();
          $scope.item.viewChart = false;

        }


      };


      function initVarsScrumChannelTeamUpdate(){


        /* aqui montamos la tabla */

        /* issues reported, total points, closed issue */
        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' &&
          $scope.rowCollectionUserStories.length >0){

          for(var i = 0; i< $scope.rowCollectionUserStories.length; i++){

            /* miramos para cada US las tareas asociadas */

            if($scope.rowCollectionUserStories[i].tasks !== undefined &&
              $scope.rowCollectionUserStories[i].tasks !== null &&
              $scope.rowCollectionUserStories[i].tasks !== '' &&
              $scope.rowCollectionUserStories[i].tasks.length >0){


              for(var j = 0; j< $scope.rowCollectionUserStories[i].tasks.length; j++){
                /* miramos si esta asignado */
                /* miramos si esta closed o no y vamos sumando */

                if($scope.rowCollectionUserStories[i].tasks[j].assignedto !== undefined &&
                  $scope.rowCollectionUserStories[i].tasks[j].assignedto !== null &&
                  $scope.rowCollectionUserStories[i].tasks[j].assignedto !== ''){

                  if($scope.rowCollectionUserStories[i].tasks[j].assignedto.id !== undefined &&
                    $scope.rowCollectionUserStories[i].tasks[j].assignedto.id !== null &&
                    $scope.rowCollectionUserStories[i].tasks[j].assignedto.id !== ''){
                    /* nos recorremos elarray de members y añadimos  */



                    for(var k = 0; k< $scope.channelScrumTeam.length; k++){
                      if($scope.rowCollectionUserStories[i].tasks[j].assignedto.id == $scope.channelScrumTeam[k].id) {

                        /* miramos como esta el estado de las tareas */
                        if ($scope.rowCollectionUserStories[i].tasks[j].status == 'Closed') {

                          /*$scope.channelScrumTeam[k].tasks.closed += 1;*/
                          $scope.channelScrumTeam[k].chart[0][3]  += 1;

                        }
                        else {

                          if($scope.rowCollectionUserStories[i].tasks[j].status == 'New'){
                            $scope.channelScrumTeam[k].chart[0][0]  += 1;

                          }
                          else if($scope.rowCollectionUserStories[i].tasks[j].status == 'In progress'){
                            $scope.channelScrumTeam[k].chart[0][1]  += 1;

                          }
                          else {
                            $scope.channelScrumTeam[k].chart[0][2]  += 1;
                          }


                          $scope.channelScrumTeam[k].tasks.open += 1;

                        }

                        if ($scope.rowCollectionUserStories[i].tasks[j].requirement !== undefined &&
                          $scope.rowCollectionUserStories[i].tasks[j].requirement !== null &&
                          $scope.rowCollectionUserStories[i].tasks[j].requirement !== '') {
                          if ($scope.rowCollectionUserStories[i].tasks[j].requirement.blocked == true) {
                            $scope.channelScrumTeam[k].tasks.blocked += 1;


                          }

                        }

                      }/* si el member coincide con el asignado */

                    }/* for de miembros */
                  } /* tiene id assignedto */

                } /* assigned to no es undefined */

              }/* end for tasks */
            } /* US tiene tasks */
          }/* end for US */
        } /* rowUS tiene lenght */

        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' &&
          $scope.rowCollectionIssues.length >0){

          for(var y = 0; y< $scope.rowCollectionIssues.length; y++) {

            for (var z = 0; z < $scope.channelScrumTeam.length; z++) {

              if($scope.rowCollectionIssues[y].assignedto !== undefined &&
                $scope.rowCollectionIssues[y].assignedto !== null &&
                $scope.rowCollectionIssues[y].assignedto !== '') {

                if ($scope.rowCollectionIssues[y].assignedto.id !== undefined &&
                  $scope.rowCollectionIssues[y].assignedto.id !== null &&
                  $scope.rowCollectionIssues[y].assignedto.id !== '') {
                  /* nos recorremos elarray de members y añadimos  */

                  if ($scope.rowCollectionIssues[y].assignedto.id == $scope.channelScrumTeam[z].id) {
                    if ($scope.rowCollectionIssues[y].status == "Closed"){
                      $scope.channelScrumTeam[z].chart[1][3]  += 1;


                    }
                    else if ($scope.rowCollectionIssues[y].status == "New"){
                      $scope.channelScrumTeam[z].chart[1][0]  += 1;


                    }
                    else if ($scope.rowCollectionIssues[y].status == "In progress"){
                      $scope.channelScrumTeam[z].chart[1][1]  += 1;


                    }
                    else {
                      $scope.channelScrumTeam[z].chart[1][2]  += 1;


                    }


                  }
                }
              }/* hay assigned to */
              if($scope.rowCollectionIssues[y].createdby !== undefined &&
                $scope.rowCollectionIssues[y].createdby !== null &&
                $scope.rowCollectionIssues[y].createdby !== '') {
                if($scope.rowCollectionIssues[y].createdby.id == $scope.channelScrumTeam[z].id) {
                  $scope.channelScrumTeam[z].issues.reported += 1;

                }

              }




            }/* end for team z*/

          }/*end for issues y*/


      }/* scrum.team.lenght >0 */

        /* ahora tengo 1 array de usuarios con objectos issues y tasks */
        /* cada uno tiene que ser 1 array de 4 posiciones, desde NEW, INPROGRESS, READY, CLOSED*/
        /* x cada miembro generamos un obj con su id , si hacemos 1 array en vez de los objectos y
        * ponemos 0 new
        * 1 in progress
        * 2 ready
        * 3 closed */

     };







      /*************************** SPRINT ********************************************/
      function initVarsScrumChannelSprintsGeneralViewWithUs(){

        /* de momento tenemos tagSprint y cada rowCollection sprint con 1 var viewTableUs que hay que actualizar */
        $scope.tagSprint = {};
        resetSprintTableShow();
        $scope.item.viewTaskboard = false;
        $scope.tagUserstory = {};
        $scope.tagTask = -1;
        $scope.item.viewinDetail = false;


        /* creamos 1 array bidimensional para separar las tareas x US */


      };


      /* metemos search y celltable */
      function initVarsScrumChannelSprints () {
        initVarsScrumChannelSprintsGeneralViewWithUs();

        $scope.formats = ['EEEE, MMMM dd, yyyy'];
        $scope.format = $scope.formats[0];


        $scope.minDateEditOpt = new Date(2010, 5, 22);
        $scope.maxDateEditOpt = new Date(2020, 5, 22);

        $scope.minDateEditOptEnd = new Date(2010, 5, 22);
        $scope.maxDateEditOptEnd = new Date(2020, 5, 22);

        $scope.minDateOpt = new Date();
        $scope.maxDateOpt = new Date();

        $scope.minDateOptEnd = new Date();




        $scope.sprint = {};
        $scope.sprint.startdate = new Date();
        $scope.sprint.enddate = new Date();


        $scope.tagSprintTemp = {};
        $scope.tagSprintTemp.startdate = new Date();
        $scope.tagSprintTemp.enddate = new Date();


        $scope.dateEditOptions = {
          formatYear: 'yy',
          minDate: $scope.minDateEditOpt,
          maxDate: $scope.maxDateEditOpt,
          startingDay: 1,
          showButtonBar:false
        };



        $scope.dateEditOptionsEnd = {
          formatYear: 'yy',
          minDate: $scope.minDateEditOptEnd,
          maxDate: $scope.maxDateEditOptEnd,
          startingDay: 1,
          showButtonBar:false
        };



        $scope.dateOptions = {
          formatYear: 'yy',
          maxDate: $scope.maxDateOpt,
          minDate: $scope.minDateOpt,
          startingDay: 1,
          showButtonBar:false
        };


        $scope.dateOptionsEnd = {
          formatYear: 'yy',
          maxDate: new Date(2020, 5, 22),
          minDate: $scope.minDateOptEnd,
          startingDay: 1,
          showButtonBar:false
        };


        //$scope.dateOptionsEnd.minDate = $scope.sprint.startdate;


      };




      $scope.assignUStoRow = function (index){
        if($scope.rowCollectionUserStories[index]!== undefined &&
          $scope.rowCollectionUserStories[index]!== null &&
          $scope.rowCollectionUserStories[index]!== ''){

          $scope.tagSaveUSTemp = $scope.rowCollectionUserStories[index];
        }

      }




      $scope.viewTasksContainer = function (index){


        if($scope.rowCollectionUserStories[index]!== undefined &&
          $scope.rowCollectionUserStories[index]!== null &&
          $scope.rowCollectionUserStories[index]!== '' ) {

          if ($scope.rowCollectionUserStories[index].viewTaskContainer == undefined ||
            $scope.rowCollectionUserStories[index].viewTaskContainer == null) {
            $scope.rowCollectionUserStories[index].viewTaskContainer = false;

          }
          else if (!$scope.rowCollectionUserStories[index].viewTaskContainer) {
            $scope.rowCollectionUserStories[index].viewTaskContainer = true;

          }
          else if($scope.rowCollectionUserStories[index].viewTaskContainer){
            $scope.rowCollectionUserStories[index].viewTaskContainer = false;

          }

        }


      };




      $scope.lookforUSWithSprint = function (){
        /* recorremos elarray de US si algunotiene ese sprint */
        var enc = false;
        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' &&
          $scope.rowCollectionUserStories.length >0 ){


          for( var i = 0; i< $scope.rowCollectionUserStories.length; i++){

            if($scope.rowCollectionUserStories[i].sprint == undefined ||
              $scope.rowCollectionUserStories[i].sprint == null ||
              $scope.rowCollectionUserStories[i].sprint == '' ){


              enc = true;
            }
          }
        }

        return enc;

      };








      $scope.lookforUS = function (){
        /* recorremos elarray de US si algunotiene ese sprint */
        var enc = false;
        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' &&
          $scope.rowCollectionUserStories.length >0 &&
          $scope.tagSprint !== undefined &&
          $scope.tagSprint !== null &&
          $scope.tagSprint !== ''){



          for( var i = 0; i< $scope.rowCollectionUserStories.length; i++){
            if($scope.rowCollectionUserStories[i].sprint == $scope.tagSprint.id){
              enc = true;
            }
          }
        }
        return enc;

      }




      $scope.goBackFromDetailTask = function (){

        /* si venimos del dashboard hay que borrar tambien el tagUs */
        if($scope.item.viewTaskboard){
          $scope.tagUserstory = {};
          $scope.tagUserstoryTemp = {};
          $scope.item.viewinDetail = false;

        }
        $scope.tagTask = -1;
        $scope.item.viewRelatedTasks = true;
        $scope.item.viewRelatedComments = false;

      };


      $scope.goBackFromDetailUS = function (){
        $scope.tagUserstory = {};
        $scope.tagUserstoryTemp = {};
        $scope.item.viewinDetail = false;



      };


      $scope.goBackFromDetailIssue = function (){
        $scope.tagIssue = -1;
        $scope.tagIssueTemp = {};
        $scope.item.viewinDetail = false;
        $scope.item.viewRelatedUS = true;
        $scope.item.viewRelatedComments = false;



      };



      function initVarsScrumChannel () {
        /* variables scrum */
        $scope.item = {};
        $scope.item.itemMenuScrumClicked = 1;

        $scope.item.viewinDetail = false;


        /* si itemMenuScrumClicked no esta en timeline y llega sms */
        $scope.badge = {};
        $scope.badge.scrummenu = 0;


        /* grafica de sprint + array de tabla */
        $scope.showgraph = {};
        $scope.showgraph.show = false;
        $scope.rowCollectionUserStories = [];


        $scope.rowCollectionSprints = [];
        $scope.rowCollectionIssues = [];


        /* inicializar busquedas en tabla */
        removeVarsSearchUS();
        removeVarsSearchTask();
        removeVarsSearchSprint();
        removeVarsSearchIssue();

        removeVarsSearchTeam();

        /* inicializar que las filas de la tabla no estan seleccionadas */
        removeValTableCell();


        /* tagUserstory tagUserstorytemp = {} */
        removeVarsDetailUserstory();



        initVarsScrumChannelTasks ();

        /* dentro tiene el viewtable */
        initVarsScrumChannelSprints ();
        initVarsScrumChannelIssues();
        initVarsScrumChannelTeam();


        $scope.stad = {};
        $scope.stad.userstories = {};
        $scope.stad.tasks = {};
        $scope.stad.sprints = {};
        $scope.stad.issues = {};



      }



      /******************* end backlog dashboard *******************/


      /*$scope.item.viewinDetail = false;
       $scope.item.viewRelatedTasks = false;*/

      $scope.initVarsAndSelectOptionsScrumMenu = function (num){


        $scope.item.itemMenuScrumClicked = num;

        if(num == 1){
          $scope.badge.scrummenu = 0;
        }
        else{

          $scope.item.viewinDetail = false;

          removeVarsSearchUS();
          removeVarsSearchTask();
          removeVarsSearchSprint();
          removeVarsSearchTeam();

          removeValTableCell();
          initVarsScrumChannelTasks ();
          initVarsScrumChannelSprints();
          initVarsScrumChannelIssues();
          initVarsScrumChannelTeam();

        }

        /* backlog */
        if(num == 2){
          createStadUsTask();

        }
        /* sprints */
        else if(num == 3){
          createStadSprint();

        }
        /* issues */
        else if(num == 4){
          createStadIssue();

        }

      };





      function removeValTableCellRowUS (){

        if($scope.rowCollectionUserStories !== undefined){
          uncheckAll($scope.rowCollectionUserStories);
        }

      };



      function removeValTableCellRowIssue (){

        if($scope.rowCollectionIssues !== undefined){
          uncheckAll($scope.rowCollectionIssues);
        }

      };



      function removeValTableCellTagUS (){

        if($scope.tagUserstory !== undefined){
          if($scope.tagUserstory.tasks !== undefined){
            if($scope.tagUserstory.tasks.length > 0){
              uncheckAll($scope.tagUserstory.tasks);

            }
          }
        }
      };



      function removeValTableCellRowSprint (){

        if($scope.rowCollectionSprints !== undefined){
          uncheckAll($scope.rowCollectionSprints);

        }

      };






      /* usarlo cuando se inicia (init), cuando se cambia de vista en menu, y cuando se selecciona otro canal
      * y cuando se hace true, viewrelatedtask */
      function removeValTableCell (){

        $scope.ischeckedAllCells = false;

        removeValTableCellRowUS();
        removeValTableCellTagUS();
        removeValTableCellRowSprint();
        removeValTableCellRowIssue();


        $scope.tableCells = {};
        $scope.tableCells.selected = [];

      }


      /* variables para el menu sidebar-nav */
      $scope.activeInvitations = 0;
      $scope.activeGroups = 1;
      $scope.activeChannels = 0;
      $scope.groupindex = -1;
      $scope.activeDirects = 0;


      $scope.user = '';
      $scope.membersSettings = '';
      $scope.membersSettingschannel = '';

      $scope.members = '';
      $scope.channelMembers = '';

      $scope.tagChannel = '';
      $scope.tagGroup = '';
      $scope.tagMember = '';
      $scope.adminGroup = '';
      $scope.adminChannel = '';

      /* modal de errores para los settings del grupo */
      $scope.errorG= '';

      $scope.error1 = 0;
      $scope.message1 = '';
      //error codes in channel setting modals


      $scope.searchinputplaceholder = "Search member ...";
      /* flag para activar o no settings de canal */
      $scope.activeChannelSettings = 0;

      $scope.navsearch = 0;
      $scope.class1 = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
      /* group user settings tag */
      $scope.option = 0;
      $scope.optionchannel = 0;
      /* content of channel searchbox */
      $scope.textsearchbox = '';
      $scope.searchresults = '';
      $scope.classResalt = "textnormal";
      $scope.classResaltChannelPublic = "textnormal";
      $scope.classResaltChannelPrivate = "textnormal";
      $scope.classResaltDirect = "textnormal";


      /* ***************** end init vars ******************** */









      $window.onblur = function() {
        console.log('blur');
        $scope.window_focus = false;
      };
      $window.onfocus = function() {
        console.log('focus');
        $scope.window_focus = true;
      };

/*
    $scope.logoutLogin = function () {
        sharedProperties.setProperty('/chat2');
        console.log("estoy en chatjs");
        LoginService.logoutLogin();
    };
*/


    $scope.logout = function () {

      console.log("ha llamado disconnect de grupo");
      Socket.emit('disconnect');
      console.log("ha llamado disconnect de channel");
      Socket.emit('disconnectChannel');


      LoginService.logout();


    };



      $scope.changePercentClass = function()
        {
          if($scope.showgraph !== undefined && $scope.showgraph !== null){
            if($scope.showgraph.show){
              $scope.showgraph.show = false;

            }
            else{
              $scope.showgraph.show = true;

            }
          }

        };




      $scope.onClickpoints = function (points, evt) {
        console.log(points, evt);
      };




      /* change vars of sidebar-nav menu */
    $scope.changeVarMenu = function(varmenu)
    {


      /* var de invitaciones */
      if(varmenu == 'activeInvitations'){
        if ($scope.activeInvitations){
          $scope.activeInvitations = 0;

        }
        else {
          $scope.activeInvitations = 1;

          /* si hay 1 grupo seleccionado se mantiene */
          if( $scope.tagGroup !== ''){
            /* si hay 1 canal seleccionado se mantiene */
            if( $scope.tagChannel !== ''){
              console.log("el tipo de tagchannel");
              console.log($scope.tagChannel.type);
            }
            else{
              console.log("ha llamado disconnect de channel");
              Socket.emit('disconnectChannel');
              $scope.activeChannels = 0;
              $scope.activeDirects = 0;

            }


          }
          else {
            console.log("ha llamado disconnect de grupo");
            Socket.emit('disconnect');
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.activeGroups = 0;
            $scope.activeChannels = 0;
            $scope.activeDirects = 0;

          }

        }

      }
      /* var de grupos */
      else if(varmenu == 'activeGroups'){
        if ($scope.activeGroups){
          /* si estan desplegados los grupos pero hay 1 marcado
            se quita el marcado y aparecen todos otra vez
          */
          if ($scope.groupindex !== -1){
            console.log("ha llamado disconnect de grupo");
            Socket.emit('disconnect');
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');

            $scope.classResalt= "textnormal";
            $scope.activeGroups = 1;
            $scope.groupindex = -1;
            $scope.tagGroup = '';
            $scope.tagChannel = '';
            $scope.tagMember = '';
          }
          else {

            $scope.classResalt= "textitalic";
            $scope.activeGroups = 0;

          }

        }
        else {
          console.log("ha llamado disconnect de grupo");
          Socket.emit('disconnect');
          console.log("ha llamado disconnect de channel");
          Socket.emit('disconnectChannel');

          $scope.classResalt= "textnormal";

          $scope.groupindex = -1;
          $scope.activeGroups = 1;
          $scope.tagGroup = '';
          $scope.tagChannel = '';

          $scope.classResaltDirect = "textnormal";

          $scope.activeInvitations = 0;
          $scope.activeChannels = 0;
          $scope.activeDirects = 0;
        }

      }

      /* var de canales publicos y privados */
      else if(varmenu == 'activeChannels'){
        if ($scope.activeChannels){
          console.log("ha llamado disconnect de channel");
          Socket.emit('disconnectChannel');
          $scope.activeChannels = 0;
          $scope.tagChannel = '';



        }
        else {
          $scope.activeChannels = 1;
          $scope.activeInvitations = 0;
          $scope.activeDirects = 0;


        }

      }
       /* var de canales publicos y privados */
      else if(varmenu == 'activeGroupChannels'){

          $scope.activeChannels = 1;
          $scope.activeInvitations = 0;
          $scope.activeDirects = 0;


      }
      /* var de canales directos */
      else if(varmenu == 'activeDirects'){
        if ($scope.activeDirects){

          $scope.activeDirects = 0;
          $scope.classResaltDirect = "textnormal";

          if($scope.tagChannel.type == "DIRECT"){
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.tagChannel = '';
            $scope.tagMember = '';
          }


        } else {
          $scope.tagMember = '';

          $scope.activeDirects = 1;
          $scope.activeGroups = 1;
          $scope.activeChannels = 1;
          $scope.activeInvitations = 0;
        }
      }
    };


    $scope.changeSearchNav = function(optionsearch)
    {
      console.log("estoy en chat js");
      if(optionsearch == 1){
          $scope.navsearch = 1;
          $scope.class1 = "col-xs-7 col-sm-7 col-md-7 col-lg-8";
      }
      else {
          $scope.navsearch = 0;
          $scope.class1 = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
      }

    };


    $scope.putBlanktextsearchbox = function(textsearchbox)
    {
      $scope.textsearchbox = '';

    };



     $scope.searchtextinchannel = function (textsearchbox, channel) {

      if ( textsearchbox !== 'undefined' && textsearchbox !== '' ){
        searchservice.chatsearch(textsearchbox, $scope.tagGroup.id, $scope.tagChannel.id).then(function (res){
           if(res.error == undefined){
             var tempserachresults = res.slice();
             //$scope.searchresults = res.slice();
             for (var i = 0; i < tempserachresults.length; i++) {
               for ( var j = 0; j < $scope.channelMembers.length; j++){
                 if (tempserachresults[i].source._user == $scope.channelMembers[j].id){
                   tempserachresults[i].source._user =  $scope.channelMembers[j];

                 }
               }

             }
             $scope.searchresults = tempserachresults.slice();
           }
           else {
             $scope.searchresults = '';
           }

        },function(err){
           $scope.searchresults = '';
           console.log(err);
           $scope.errorG = err.message;
             $("#errorGroupModal").modal("show");
         });

      } else {
        $scope.searchresults = '';
      }
     };



    /* subraya las coincidencias */
    $scope.highlight = function(text, search) {
	    if (!search) {
	        return $sce.trustAsHtml(text);
	    }
	    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
	};

    $scope.goTo = function(url, from)
    {
      if (from === 'chat'){
        sharedProperties.setProperty('/chat2');
      }
      else if (from === 'foro'){
        sharedProperties.setProperty('/foro');
      }

      $location.path(url);
    };

    $scope.removeInputChannelName = function(){
      $("#channelNameTxt").val('').trigger('input');
    };



      $scope.removeInputsAccount = function(){
        $("#githubPassTxt").val('').trigger('input');
        $("#githubUserTxt").val('').trigger('input');
      };


      /*********************** modales inicializar valores ********************************************/
      /* errores */


      function removeErrorMessageNewGroupModal () {
        $scope.modalsError.messageNewGroupModal = '';

      };




      function removeErrormessageNewChannelModal () {
        /* se reutiliza la primera para integration */
        $scope.modalsError.messageNewChannelModal= '';
        $scope.modalsError.messageNewChannelNameModal = '';

      };



      function removeErrorMessageNewChannelIntegrationModal () {
        /* se reutiliza la primera para integration */
        $scope.modalsError.messageNewChannelModal= '';



        $scope.modalsError.messageNewChannelPassBadCredentialsModal = '';
        $scope.modalsError.messageNewChannelUsernameBadCredentialsModal = '';

      };

      function removeErrorMessageNewChannelReposModal () {
        /* se reutiliza la primera para integration */
        $scope.modalsError.messageNewChannelModal= '';
        $scope.modalsError.messageNewChannelModalReposEmpty = '';

      };




      function removeErrorMessageNewUserstoryModal () {
        /* se reutiliza la primera para integration */
        $scope.modalsError.messageNewUserstoryModal = '';
        $scope.modalsError.messageNewUserstoryRequiredSubModal = '';

      };



      function removeErrorMessageNewIssueModal () {
        $scope.modalsError.messageNewIssueModal = '';
        $scope.modalsError.messageNewIssueRequiredSubModal = '';

      };




      function removeErrorMessageNewRelatedTaskModal () {
        /* se reutiliza la primera para integration */
        $scope.modalsError.messageNewRelatedTaskModal = '';
        $scope.modalsError.messageNewRelatedTaskRequiredSubModal = '';

      };


      function removeErrorMessageNewSprintModal (){
        $scope.modalsError.messageNewSprintRequiredNameModal = '';
        $scope.modalsError.messageNewSprintModal = '';
      }


      function removeErrorMessageEditSprintModal(){
        $scope.modalsError.messageEditSprintRequiredNameModal = '';
        $scope.modalsError.messageEditSprintModal = '';

      }





      /******************* end message errors *****************************/


      function removeVarsNewChannelIntegrationModal () {

        removeErrorMessageNewChannelIntegrationModal();
        $scope.removeInputsAccount();
        $scope.account = {};
        $scope.accountSelected = {};
        $scope.flag = {};


      };

      function removeVarsNewChannelReposModal () {

        removeErrorMessageNewChannelReposModal();
        $scope.githubrepositories = [];
        $scope.repositorySelected = [];
      };



      function removeVarsNewChannelWebhooksModal () {

        /* el error es el mismo */
        removeErrorMessageNewChannelReposModal();
        $scope.arrReposOk = [];
        $scope.arrReposError = [];




      };

      function removeVarsNewUserstoryModal(){

        removeErrorMessageNewUserstoryModal();
        $scope.userstory = {};
        $scope.userstory.requirement = {};

        /* para iniciar */
        $scope.userstory.point = {};
        $scope.userstory.point.ux = $scope.statics.points[0].num; /* statico y vale 0 */
        $scope.userstory.point.design = $scope.statics.points[0].num;
        $scope.userstory.point.front = $scope.statics.points[0].num;
        $scope.userstory.point.back = $scope.statics.points[0].num;

      };


      function removeVarsDetailUserstory(){
        $scope.tagUserstory = {};
        $scope.tagUserstoryTemp = {};

      };






      function removeVarsNewIssueModal(){

        removeErrorMessageNewIssueModal();
        $scope.issue = {};
        $scope.issue.type = $scope.statics.type[0];
        $scope.issue.severity = $scope.statics.severity[2];
        $scope.issue.priority = $scope.statics.priority[1];
        $scope.issue.status = $scope.statics.status[0];

      };






      function removeVarsEditSprintModal(){

        removeErrorMessageEditSprintModal();
        removeNameEditSprintText();

        $scope.tagSprintTemp = {};
        $scope.tagSprintTemp.startdate = new Date();
        $scope.tagSprintTemp.enddate = new Date();


        var datetimeTemp = {};
        datetimeTemp.startdate = new Date();
        datetimeTemp.enddate = new Date();



        $scope.indsrowColSp = {};
        $scope.indsrowColSp.previous = -1;
        $scope.indsrowColSp.following = -1;

        for( var i = 0; i <$scope.rowCollectionSprints.length; i++){
          if($scope.rowCollectionSprints[i].selectedCell){


            datetimeTemp.startdate = new Date($scope.rowCollectionSprints[i].startdate);
            datetimeTemp.enddate = new Date($scope.rowCollectionSprints[i].enddate);


            $scope.tagSprintTemp.name = $scope.rowCollectionSprints[i].name;
            $scope.tagSprintTemp.id = $scope.rowCollectionSprints[i].id;

            $scope.tagSprintTemp.startdate.setYear(datetimeTemp.startdate.getFullYear());
            $scope.tagSprintTemp.startdate.setMonth(datetimeTemp.startdate.getMonth());
            $scope.tagSprintTemp.startdate.setDate(datetimeTemp.startdate.getDate());



            $scope.tagSprintTemp.enddate.setYear(datetimeTemp.enddate.getFullYear());
            $scope.tagSprintTemp.enddate.setMonth(datetimeTemp.enddate.getMonth());
            $scope.tagSprintTemp.enddate.setDate(datetimeTemp.enddate.getDate());





            if(i > 0){
              $scope.indsrowColSp.previous = i-1;
            }
            if((i+1) < $scope.rowCollectionSprints.length){
              $scope.indsrowColSp.following = i+ 1;

            }


            i= $scope.rowCollectionSprints.length;

          }
        }



        $scope.popupEdit1 = {
          opened: false
        };

        $scope.popupEdit2 = {
          opened: false
        };




      }


      /* aun no se que variables usar asique se queda vacia */
      $scope.initVarsEditSprintModal = function(){
        removeVarsEditSprintModal();


      };







      /*********************** datepicker for edit modal *********************************/

      $scope.openEdit1 = function() {
        $scope.popupEdit1.opened = true;


        var datetimeTempO1 = {};


        $scope.dateEditOptions.minDate = new Date(2010, 5, 22);
        $scope.dateEditOptions.maxDate = new Date(2020, 5, 22);



        /* para la fecha minima, el final de la anterior */
        if($scope.indsrowColSp.previous > -1){

          datetimeTempO1.enddate = new Date($scope.rowCollectionSprints[$scope.indsrowColSp.previous].enddate);


          $scope.dateEditOptions.minDate.setYear(datetimeTempO1.enddate.getFullYear());
          $scope.dateEditOptions.minDate.setMonth(datetimeTempO1.enddate.getMonth());
          $scope.dateEditOptions.minDate.setDate(datetimeTempO1.enddate.getDate() + 1);


        }

        datetimeTempO1.startdate = new Date( $scope.tagSprintTemp.enddate);

        $scope.dateEditOptions.maxDate.setYear(datetimeTempO1.startdate.getFullYear());
        $scope.dateEditOptions.maxDate.setMonth(datetimeTempO1.startdate.getMonth());
        $scope.dateEditOptions.maxDate.setDate(datetimeTempO1.startdate.getDate() - 1);

      };




      $scope.openEdit2 = function() {
        $scope.popupEdit2.opened = true;

        var datetimeTempO2 = {};


        $scope.dateEditOptions.minDate = new Date(2010, 5, 22);
        $scope.dateEditOptions.maxDate = new Date();


        datetimeTempO2.startdate = new Date($scope.tagSprintTemp.startdate);
        datetimeTempO2.enddate = new Date();




        $scope.dateEditOptionsEnd.minDate.setYear(datetimeTempO2.startdate.getFullYear());
        $scope.dateEditOptionsEnd.minDate.setMonth(datetimeTempO2.startdate.getMonth());
        $scope.dateEditOptionsEnd.minDate.setDate(datetimeTempO2.startdate.getDate()+1);

        console.log($scope.dateEditOptionsEnd.minDate);




        if($scope.indsrowColSp.following !== -1){


          datetimeTempO2.enddate = new Date($scope.rowCollectionSprints[$scope.indsrowColSp.following].startdate);

          console.log("esto vale datetimeTempO2.enddate");
          console.log(datetimeTempO2.enddate);


          $scope.dateEditOptionsEnd.maxDate.setYear(datetimeTempO2.enddate.getFullYear());
          $scope.dateEditOptionsEnd.maxDate.setMonth(datetimeTempO2.enddate.getMonth());
          $scope.dateEditOptionsEnd.maxDate.setDate(datetimeTempO2.enddate.getDate()-1);


        }
        else{
          $scope.dateEditOptionsEnd.maxDate.setYear(datetimeTempO2.enddate.getFullYear());
          $scope.dateEditOptionsEnd.maxDate.setMonth(datetimeTempO2.enddate.getMonth());
          $scope.dateEditOptionsEnd.maxDate.setDate(datetimeTempO2.enddate.getDate()+90);

        }

        console.log("esto vale $scope.dateEditOptionsEnd.maxDate");
        console.log($scope.dateEditOptionsEnd.maxDate);


      };



      /*------------------------- datepicker------------------------------------*/





      $scope.open1 = function() {
        $scope.popup1.opened = true;



        var tempdate = new Date($scope.sprint.startdate);
        var tempdateEnd = new Date($scope.sprint.enddate);

        $scope.dateOptions.minDate = new Date();

        /*
        $scope.dateOptions.minDate.setYear(tempdate.getFullYear());
        $scope.dateOptions.minDate.setMonth(tempdate.getMonth());
        $scope.dateOptions.minDate.setDate(tempdate.getDate());*/

        $scope.dateOptions.minDate.setYear(tempdate.getFullYear());
        $scope.dateOptions.minDate.setMonth(tempdate.getMonth());

        if(!$scope.sprint.pre){
          $scope.dateOptions.minDate.setDate(tempdate.getDate()-90);

        }
        else{
          $scope.dateOptions.minDate.setDate(tempdate.getDate());

        }




        $scope.dateOptions.maxDate = new Date();
        $scope.dateOptions.maxDate.setYear(tempdateEnd.getFullYear());
        $scope.dateOptions.maxDate.setMonth(tempdateEnd.getMonth());
        $scope.dateOptions.maxDate.setDate(tempdateEnd.getDate()-1);

      };



      $scope.open2 = function() {
        $scope.popup2.opened = true;

        var twoweeksafter = new Date();
        var tempdateEnd2 = new Date();

        twoweeksafter.setYear($scope.sprint.startdate.getFullYear());
        twoweeksafter.setMonth($scope.sprint.startdate.getMonth());
        twoweeksafter.setDate($scope.sprint.startdate.getDate() + 14);

        $scope.sprint.enddate = twoweeksafter;


        tempdateEnd2 = new Date($scope.sprint.startdate);

        $scope.dateOptionsEnd.minDate = new Date();
        $scope.dateOptionsEnd.minDate.setYear(tempdateEnd2.getFullYear());
        $scope.dateOptionsEnd.minDate.setMonth(tempdateEnd2.getMonth());
        $scope.dateOptionsEnd.minDate.setDate(tempdateEnd2.getDate()+1);


      };




      /****************-----------------end datepicker  ------------------******************/

      /*****************************************************************************/



      /* esto se hace, en el init, al cerrar la modal y al abrirla */




      function removeVarsNewSprintModal(){



        $scope.sprint = {};

        $scope.sprint.pre = false;
        $scope.sprint.foll = false;

        $scope.sprint.startdate = new Date();
        $scope.sprint.enddate = new Date();
        var today = new Date();

        $scope.sprint.enddate.setDate(today.getDate()+90);



        /* por si no hay sprint anteriores */
        var datetimeTempMin = new Date();

        $scope.minDateOpt = new Date();
        $scope.maxDateOpt = new Date();

        $scope.dateOptions.minDate = $scope.minDateOpt.setDate(datetimeTempMin.getDate()-90);
        $scope.dateOptions.maxDate = $scope.maxDateOpt.setDate(datetimeTempMin.getDate()+90);



        if($scope.rowCollectionSprints !== undefined &&
          $scope.rowCollectionSprints !== null &&
          $scope.rowCollectionSprints !== '' &&
          $scope.rowCollectionSprints.length >0){



          /* mirar si funciona */
          if($scope.rowCollectionSprints[$scope.rowCollectionSprints.length -1].startdate !== undefined &&
            $scope.rowCollectionSprints[$scope.rowCollectionSprints.length -1].startdate !== null &&
            $scope.rowCollectionSprints[$scope.rowCollectionSprints.length -1].startdate !== ''){

            var datetimeTemp = new Date($scope.rowCollectionSprints[$scope.rowCollectionSprints.length -1].enddate);

            $scope.sprint.pre = true;

            $scope.sprint.startdate.setYear(datetimeTemp.getFullYear());
            $scope.sprint.startdate.setMonth(datetimeTemp.getMonth());
            $scope.sprint.startdate.setDate(datetimeTemp.getDate()+1);



            $scope.dateOptions.minDate = new Date($scope.sprint.startdate);

            var twoweeksafter = new Date();

            twoweeksafter.setYear($scope.sprint.startdate.getFullYear());
            twoweeksafter.setMonth($scope.sprint.startdate.getMonth());
            twoweeksafter.setDate($scope.sprint.startdate.getDate()+14);
            $scope.sprint.enddate = twoweeksafter;


            $scope.dateOptions.maxDate = new Date($scope.sprint.enddate);

          }

        }


        $scope.popup1 = {
          opened: false
        };

        $scope.popup2 = {
          opened: false
        };



        removeErrorMessageNewSprintModal();
        removeNameNewSprintText();

      }






      function removeVarsNewRelatedTaskModal(){

        removeErrorMessageNewRelatedTaskModal();
        $scope.task = {};
        $scope.task.status = $scope.statics.status[0];


      }






      /******************* end vars init ********************************/




      /****************** SCRUM *****************************************/

      /************************* backlog dashboard *********************/
      /*************************  USERSTORY  *************************/

      /* CREATE ::  choose points */
      function choosePointLoop (point) {
        for(var i= 0; i< $scope.statics.points.length; i++){
          if($scope.statics.points[i].num !== point.num){
            $scope.statics.points[i].selected = false;
          }
          else{
            $scope.statics.points[i].selected = true;
          }
        }
      };

      $scope.choosePointRole  = function(point, code){
        if( code == 0){
          $scope.userstory.point.ux = point.num;

        }
        else if(code == 1){
          $scope.userstory.point.design = point.num;

        }
        else if(code == 2){
          $scope.userstory.point.back = point.num;

        }
        else{
          $scope.userstory.point.front = point.num;

        }

        choosePointLoop(point);
      };



      $scope.choosePointRoleEdit  = function(point, code){
        if(code == 0){
          $scope.tagUserstory.point.ux = point.num;

        }
        else if(code == 1){
          $scope.tagUserstory.point.design = point.num;
        }
        else if(code == 2){
          $scope.tagUserstory.point.back = point.num;
        }
        else{
          $scope.tagUserstory.point.front = point.num;
        }

        choosePointLoop(point);

        var field = 'point';
        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field, code )
          .then(function (res) {

            toastr.info('Userstory points changed', 'Information', {
              closeButton: true
            });


          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });





      };




      /* method to popover hide :: points */
      angular.element(document.body).bind('click', function (e) {
        var popups = document.querySelectorAll('*[popover]');
        if(popups) {
          for(var i=0; i<popups.length; i++) {
            var popup = popups[i];
            var popupElement = angular.element(popup);

            var content;
            var arrow;
            if(popupElement.next()) {

              /*content = popupElement.next()[0].querySelector('.popover-content');*/
              /*arrow = popupElement.next()[0].querySelector('.arrow');*/
            }
            /* en el if con && e.target != arrow*/
            if(popup != e.target ) {
              if(popupElement.next().hasClass('popover')) {
                popupElement.next().remove();
                popupElement.scope().tt_isOpen = false;
              }
            }
          }
        }
      });



      /* VIEW :: userstory table checkbox */
      /* lo mismo para la tabla de las tareas */
      /* lo reutilizamos */


      function checkAll (arrayCollection) {
        /* me recorro el array entero y lo pongo a true */
        for(var i = 0; i < arrayCollection.length; i++){
          arrayCollection[i].selectedCell = true;
        }

        if($scope.tableCells == undefined || $scope.tableCells == null){
          $scope.tableCells = {};

        }

        $scope.tableCells.selected  = angular.copy(arrayCollection);


      };


      function uncheckAll (arrayCollection) {
        for(var i = 0; i < arrayCollection.length; i++){
          arrayCollection[i].selectedCell = false;
        }


        $scope.tableCells = {};
        $scope.tableCells.selected = [];


      };


      /* num 0 son userstories, num 1 son tasks */
      /* esto es desde el html */
      $scope.checkAllNone = function(num) {

        if($scope.ischeckedAllCells){
          if(num == 0){
            uncheckAll($scope.rowCollectionUserStories);

          }
          else if (num == 1){
            uncheckAll($scope.tagUserstory.tasks);
          }
          else if(num == 2){
            uncheckAll($scope.rowCollectionSprints);

          }
          else{
            uncheckAll($scope.rowCollectionIssues);

          }
          $scope.ischeckedAllCells = false;

        }
        else {
          if(num == 0){
            checkAll($scope.rowCollectionUserStories);

          }
          else if (num == 1){
            checkAll($scope.tagUserstory.tasks);
          }
          else if(num == 2){
            checkAll($scope.rowCollectionSprints);

          }
          else{
            checkAll($scope.rowCollectionIssues);

          }
          $scope.ischeckedAllCells = true;
        }


      };









      /* esto es a nivel de fila, nos vale el mismo */
      $scope.changeCheckedTableCell = function(row) {

        if(row.selectedCell == undefined || row.selectedCell == false){

          row.selectedCell = true;
        }
        else{
          row.selectedCell = false;
        }


      };




      $scope.clearValuesofSearchUS = function(num) {

        if($scope.searchUS == undefined || $scope.searchUS == ''){
          $scope.searchUS = {};
        }

        if(num == 0){
          $scope.searchUS.subject = '';
          $scope.searchUS.status = '';
          $scope.searchTags = '';

        }
        else if(num == 1){
          $scope.searchUS.$ = '';
          $scope.searchUS.status = '';
          $scope.searchTags = '';

        }
        else if(num == 2){
          $scope.searchUS.$ = '';
          $scope.searchUS.subject = '';
          $scope.searchTags = '';

        }
        else if(num == 3){
          $scope.searchUS.$ = '';
          $scope.searchUS.subject = '';
          $scope.searchUS.status = '';
        }
        else{
          $scope.searchUS.$ = '';
          $scope.searchUS.subject = '';
          $scope.searchUS.status = '';
          $scope.searchTags = '';
        }

      };







      $scope.clearValuesofSearchTask = function(num) {

        if($scope.searchTask == undefined || $scope.searchTask == ''){
          $scope.searchTask = {};
        }



        if(num == 0){
          $scope.searchTask.subject = '';
          $scope.searchTask.status = '';
          $scope.searchTaskAssignedto = '';

        }
        else if(num == 1){
          $scope.searchTask.$ = '';
          $scope.searchTask.status = '';
          $scope.searchTaskAssignedto = '';

        }
        else if(num == 2){
          $scope.searchTask.$ = '';
          $scope.searchTask.subject = '';
          $scope.searchTaskAssignedto = '';

        }
        else if(num == 3){
          $scope.searchTask.$ = '';
          $scope.searchTask.subject = '';
          $scope.searchTask.status = '';


        }

        else{
          $scope.searchTask.$ = '';
          $scope.searchTask.subject = '';
          $scope.searchTask.status = '';
          $scope.searchTaskAssignedto = '';

        }

      };




      $scope.clearValuesofSearchIssue = function(num) {

        if($scope.searchIssue == undefined || $scope.searchIssue == ''){
          $scope.searchIssue = {};
        }

        if(num == 0){
          $scope.searchIssue.subject = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.priority = '';
          $scope.searchIssue.status = '';

        }
        else if(num == 1){
          $scope.searchIssue.$ = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.priority = '';
          $scope.searchIssue.status = '';

        }
        else if(num == 2){
          $scope.searchIssue.$ = '';
          $scope.searchIssue.subject = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.priority = '';
          $scope.searchIssue.status = '';

        }
        else if(num == 3){
          $scope.searchIssue.$ = '';
          $scope.searchIssue.subject = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.priority = '';
          $scope.searchIssue.status = '';

        }
        else if(num == 4){
          $scope.searchIssue.$ = '';
          $scope.searchIssue.subject = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.status = '';

        }
        else if(num == 5){
          $scope.searchIssue.$ = '';
          $scope.searchIssue.subject = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.priority = '';
        }

        else{
          $scope.searchIssue.$ = '';
          $scope.searchIssue.subject = '';
          $scope.searchIssue.type = '';
          $scope.searchIssue.severity = '';
          $scope.searchIssue.priority = '';
          $scope.searchIssue.status = '';

        }

      };




      /* por rol y username */


      $scope.clearValuesofSearchTeam = function(num) {

        if($scope.searchTeam == undefined || $scope.searchTeam == ''){
          $scope.searchTeam = {};
        }

        if(num == 0){
          $scope.searchTeam.username = '';
          $scope.searchTeam.rol = '';

        }
        else if(num == 1){
          $scope.searchTeam.$ = '';
          $scope.searchTeam.role = '';

        }
        else if(num == 2){
          $scope.searchTeam.$ = '';
          $scope.searchTeam.username = '';

        }

        else{
          $scope.searchTeam.$ = '';
          $scope.searchTeam.role = '';
          $scope.searchTeam.username = '';

        }

      };








      $scope.clearValuesofSearchSprint = function() {

        if($scope.searchSprint == undefined || $scope.searchSprint == ''){
          $scope.searchSprint = {};
        }

        $scope.searchSprint = '';


      };





      function removeVarsSearchUS(){

        $(".searchUS").val('').trigger('input');
        $(".searchTags").val('').trigger('input');

        $scope.comboOptionsSelected = {name: "All", num: 0};

        /* para que borre all of fields */
        $scope.clearValuesofSearchUS(4);

        $scope.sortType     = 'num';
        $scope.sortReverse = false;
        $scope.searchUs = '';


      }


      function removeVarsSearchTask(){

        $(".searchTask").val('').trigger('input');
        $scope.comboOptionsSelectedTask = {name: "All", num: 0};
        $scope.sortType     = 'num';
        $scope.sortReverse = false;
        //$scope.ischeckedAllCellsTask = false;
        $scope.searchTask = '';

        /* para que borre all of fields */
        $scope.clearValuesofSearchTask(4);


      }


      function removeVarsSearchSprint(){

        $(".searchSprint").val('').trigger('input');
        $scope.sortType     = 'num';
        $scope.sortReverse = false;
        //$scope.ischeckedAllCellsTask = false;
        $scope.searchSprint = '';

        /* para que borre all of fields */
        $scope.clearValuesofSearchSprint();


      }


      function removeVarsSearchIssue(){

        $(".searchIssue").val('').trigger('input');
        $scope.comboOptionsSelectedIssue = {name: "All", num: 0};
        $scope.sortType     = 'num';
        $scope.sortReverse = false;
        $scope.searchIssue = '';

        /* para que borre all of fields */
        $scope.clearValuesofSearchIssue(6);


      }



      function removeVarsSearchTeam(){

        $(".searchTeam").val('').trigger('input');
        $scope.comboOptionsSelectedTeam = {name: "All", num: 0};
        $scope.sortType     = 'username';
        $scope.sortReverse = false;
        $scope.searchTeam = '';

        /* para que borre all of fields */
        $scope.clearValuesofSearchTeam(3);


      }





      /* variable nueva como la de item */

      function resetSprintTableShow(){
        for( var i = 0; i< $scope.rowCollectionSprints.length; i++){

          $scope.rowCollectionSprints[i].viewTableUs = true;




        }

      }



      $scope.viewSprintDetailTaskFromDash = function(rowUS, index) {


        /* nuestra baza para volver */
        console.log("esto vale rowus");
        console.log(rowUS);


        /* inicializamos variables de tabla */



        $scope.tagUserstory = rowUS;
        $scope.tagTask = index;
        $scope.item.viewinDetail = true;







      };
















      /* esto es para poner la tabla de US */
      $scope.viewSprintTableUS = function(row) {


        console.log("esto vale row");
        console.log(row);


        /* inicializamos el valor del combo de busqueda y el input del mismo */
        removeVarsSearchSprint();


        /* inicializamos variables de tabla */
        $scope.ischeckedAllCells = false;
        removeValTableCellRowSprint();
        $scope.tableCells = {};
        $scope.tableCells.selected = [];


        $scope.tagSprint = row;


        for( var i = 0; i< $scope.rowCollectionSprints.length; i++){
          if($scope.rowCollectionSprints[i].id !== $scope.tagSprint.id){
            $scope.rowCollectionSprints[i].viewTableUs = false;

          }


        }





      };

      $scope.viewSprintTasksboard = function() {
        $scope.item.viewTaskboard = true;

        /* inicializamos el valor del combo de busqueda y el input del mismo */
        removeVarsSearchSprint();






        /* inicializamos variables de tabla */
        $scope.ischeckedAllCells = false;
        removeValTableCellRowSprint();
        $scope.tableCells = {};
        $scope.tableCells.selected = [];

        console.log("esto vale $scope.rowCollectionUserStories");
        console.log($scope.rowCollectionUserStories);

        console.log("solo mostramos cuando se cumple rowUS.sprint == tagSprint.id");

        console.log("esto vale tagSprint.id");
        console.log(" vamos a mirar si alguna tiene sprint y si coinciden rowUS.sprint == tagSprint.id");




      };


      $scope.viewDetailsIssue = function (row, index){

        /* aqui unimos los US */

        removeVarsSearchIssue();
        $scope.ischeckedAllCells = false;
        removeValTableCellRowIssue();
        $scope.tableCells = {};
        $scope.tableCells.selected = [];




        $scope.tagIssueTemp = angular.copy(row);
        $scope.tagIssueTemp.disableVote = false;

        /* hay que mirar si ha votado o no y dejarle o no
         * para esto hay 1 array con voters */
        if(row.voters !== undefined &&
          row.voters !== null &&
          row.voters !== ''){

          if(row.voters.length){
            for(var i = 0; i< row.voters.length; i++){
              if(row.voters[i] == $localStorage.id){
                /* si esta no puede votar */
                $scope.tagIssueTemp.disableVote = true;


              }
            }
          }
        }

        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '') {


          if ($scope.rowCollectionIssues[index].id !== row.id) {

            index = i;
            i = $scope.rowCollectionIssues.length;
          }
        }





        $scope.tagIssue = index;


        $scope.item.viewRelatedComments = false;
        $scope.item.viewRelatedUS = false;
        $scope.item.viewinDetail = true;






      };




      /* viewdetails of userstory */

      /* variable nueva como la de item */
      $scope.viewDetailsUserstory = function(row) {

        removeVarsSearchUS();



        $scope.ischeckedAllCells = false;
        removeValTableCellRowUS();
        $scope.tableCells = {};
        $scope.tableCells.selected = [];


        $scope.tagUserstory = row;
        $scope.tagUserstoryTemp = angular.copy(row);
        $scope.tagUserstoryTemp.disableVote = false;

        /* hay que mirar si ha votado o no y dejarle o no
         * para esto hay 1 array con voters */
        if($scope.tagUserstory.voters !== undefined &&
          $scope.tagUserstory.voters !== null &&
          $scope.tagUserstory.voters !== ''){
          if($scope.tagUserstory.voters.length){
            for(var i = 0; i< $scope.tagUserstory.voters.length; i++){
              if($scope.tagUserstory.voters[i] == $localStorage.id){
                /* si esta no puede votar */
                $scope.tagUserstoryTemp.disableVote = true;


              }
            }
          }
        }

        $scope.item.viewRelatedTasks = false;
        $scope.item.viewRelatedComments = false;
        $scope.item.viewinDetail = true;

      };




      $scope.viewDetailsTask = function(row, $index) {

        console.log("esto vale row");
        console.log(row);


        /* inicializamos el valor del combo de busqueda y el input del mismo */
        removeVarsSearchUS();


        $scope.ischeckedAllCells = false;
        removeValTableCellTagUS();
        $scope.tableCells = {};
        $scope.tableCells.selected = [];

        removeVarsSearchTask();


        /* podemos mirar si coinciden en ids y sino hacemos busqueda */
        if($scope.tagUserstory !== undefined &&
          $scope.tagUserstory !== null &&
          $scope.tagUserstory !== ''){
          if($scope.tagUserstory.tasks !== undefined &&
            $scope.tagUserstory.tasks !== null &&
            $scope.tagUserstory.tasks !== ''){

            if($scope.tagUserstory.tasks[$index].id !== row.id){
              for(var i = 0; i< $scope.tagUserstory.tasks.length; i++){
                /* nos recorremos los task buscando su index */
                if($scope.tagUserstory.tasks[i].id == row.id){
                  $index = i;
                  i = $scope.tagUserstory.tasks.length;
                }
              }
            }
          }
        }



        $scope.tagTask = $index;
        $scope.item.viewinDetail = true;

      };





      function enableMembersWithoutContributors (arr, index){


        var membersSettingschannelTemp = [];

        if(index !== undefined && index !== null && index !== ''){


          for(var i = 0; i< $scope.membersSettingschannel.length; i++){
            var enc = false;


            if(index == -1){
              index = angular.copy($scope.tagIssue);
            }


            /* sera undefined, vamos al else */

            /* si el index vale -1, entonces hay tagTask, sino tiramos del index */
            if(arr[index].assignedto !== undefined &&
              arr[index].assignedto !== null &&
              arr[index].assignedto !== ''){


              /* ese miembro no esta en assigned to, ni el task tiene contributors */
              if($scope.membersSettingschannel[i].id !== arr[index].assignedto.id ){
                membersSettingschannelTemp.push($scope.membersSettingschannel[i]);

              }


            } /* si assigned es vacio lo metemos entero */
            else {
              membersSettingschannelTemp = angular.copy($scope.membersSettingschannel);

            }/* else assigned es vacio */


          }/* end for */
        }/* index es undefined */



        return membersSettingschannelTemp;
      };



      /* tengo que pasar el array con la pos o pasar el $scope.tagUs */
      function enableMembers(us, index){

        var membersSettingschannelTemp = [];

        if(index !== undefined && index !== null && index !== ''){


          for(var i = 0; i< $scope.membersSettingschannel.length; i++){
            var enc = false;


            if(index == -1){
              index = angular.copy($scope.tagTask);
            }


            /* sera undefined, vamos al else */

            /* si el index vale -1, entonces hay tagTask, sino tiramos del index */
            if(us.tasks[index].assignedto !== undefined &&
              us.tasks[index].assignedto !== null &&
              us.tasks[index].assignedto !== ''){


              /* ese miembro no esta en assigned to, ni el task tiene contributors */
              if($scope.membersSettingschannel[i].id !== us.tasks[index].assignedto.id &&
                (us.tasks[index].contributors == undefined ||
                us.tasks[index].contributors == null ||
                us.tasks[index].contributors == '' ||
                us.tasks[index].contributors.length == 0)){

                membersSettingschannelTemp.push($scope.membersSettingschannel[i]);

              }

              /* o tiene contributors o el id de ambos coincide */
              else{

                /* si los ids son !== no lo ha encontrado en los miembros y tiene contributors que hay que quitar */
                if($scope.membersSettingschannel[i].id !== us.tasks[index].assignedto.id){
                  enc = false;

                  /* nos recorremos sus contributors y enc=true si ha encontrado el miembro que es contributor  */
                  for(var j = 0; j< us.tasks[index].contributors.length; j++){
                    if($scope.membersSettingschannel[i].id == us.tasks[index].contributors[j].id){

                      enc = true;
                      j= us.tasks[index].contributors.length;
                    }

                  }/*si ha recorrido los contributors y ese miembro no esta lo mete en el array*/
                  if(!enc){
                    membersSettingschannelTemp.push($scope.membersSettingschannel[i]);
                  }
                }

                /* si el id coincide no lo metemos */



              }

            } /* si assigned es vacio lo metemos */
            else {
              /* no xq si el assigned es vacio puede que contributors no */
              if((us.tasks[index].contributors !== undefined &&
                us.tasks[index].contributors !== null &&
                us.tasks[index].contributors !== '' &&
                us.tasks[index].contributors.length > 0)){


                enc = false;
                for(var j = 0; j< us.tasks[index].contributors.length; j++){


                  if($scope.membersSettingschannel[i].id == us.tasks[index].contributors[j].id){
                    enc = true;
                    j= us.tasks[index].contributors.length;

                  }

                }
                if(!enc){
                  membersSettingschannelTemp.push($scope.membersSettingschannel[i]);
                }
              }
              else{
                /*copiamos el array de members */
                membersSettingschannelTemp = angular.copy($scope.membersSettingschannel);
              }


            }/* else assigned es vacio */


          }/* end for */
        }/* index es undefined */



        return membersSettingschannelTemp;

      };





      /* en este caso no hay contributors, asi que mas facil */
      $scope.changeIssueAssignedtoFromList = function (rowissue, index) {


        var membersSettingschannelTemp = enableMembersWithoutContributors($scope.rowCollectionIssues, index);

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoIssueModal.html',
          controller: 'assignedtoIssueModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                issueid: rowissue.id,
                oldvalue : rowissue.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Issue assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };





      $scope.changeIssueAssignedtoWithUnassignedFromList = function (rowissue, index) {

        var membersSettingschannelTemp = enableMembersWithoutContributors($scope.rowCollectionIssues, index);


        /* metemos de member meanstack */
        var memberMean = {};
        memberMean.id = -1;
        memberMean.username = "meanstack";
        memberMean.mail = "internalUser@localhost";
        membersSettingschannelTemp.push(memberMean);




        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoIssueModal.html',
          controller: 'assignedtoIssueModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                issueid: rowissue.id,
                oldvalue : rowissue.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Task assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };











      /******************************** buscar contributors sin tagUserstory ******************************/
      $scope.changeTaskAssignedtoWithUnassignedFromList = function (rowUS, row, index) {


        console.log("esto vale el index antes de enable members");
        console.log(index);
        var membersSettingschannelTemp = enableMembers(rowUS, index);



        /* metemos de member meanstack */
        var memberMean = {};
        memberMean.id = -1;
        memberMean.username = "meanstack";
        memberMean.mail = "internalUser@localhost";
        membersSettingschannelTemp.push(memberMean);

        console.log("debe salir meanstack, estoy dessasignando");
        console.log("esto vale row");
        console.log(row);


        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoModal.html',
          controller: 'assignedtoModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                userstoryid: rowUS.id,
                taskid: row.id,
                oldvalue : row.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Task assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };










      $scope.changeTaskAssignedtoFromList = function (rowUS, row, index) {

        console.log("no debe salir meanstack, estoy dessasignando");
        console.log("esto vale row");
        console.log(row);


        console.log("esto vale el index antes de enable members");
        console.log(index);
        var membersSettingschannelTemp = enableMembers(rowUS, index);

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoModal.html',
          controller: 'assignedtoModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                userstoryid: rowUS.id,
                taskid: row.id,
                oldvalue : row.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Task assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };







      /*********************** buscar contributors con tagUserstory *****************************************/

      /* hacemos lo mismo xsi hay contributors */
      $scope.changeTaskAssignedtoWithUnassigned = function (row, index) {


        console.log("esto vale el index antes de enable members");
        console.log(index);
        var membersSettingschannelTemp = enableMembers($scope.tagUserstory, index);



        /* metemos de member meanstack */
        var memberMean = {};
        memberMean.id = -1;
        memberMean.username = "meanstack";
        memberMean.mail = "internalUser@localhost";
        membersSettingschannelTemp.push(memberMean);


        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoModal.html',
          controller: 'assignedtoModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                userstoryid: $scope.tagUserstory.id,
                taskid: row.id,
                oldvalue : row.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Task assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };










      $scope.changeTaskAssignedto = function (row, index) {


        console.log("esto vale el index antes de enable members");
        console.log(index);
        var membersSettingschannelTemp = enableMembers($scope.tagUserstory, index);

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/assignedtoModal.html',
          controller: 'assignedtoModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                userstoryid: $scope.tagUserstory.id,
                taskid: row.id,
                oldvalue : row.assignedto,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Task assigned to changed', 'Information', {
            closeButton: true
          });
        });
      };







      /* dentro de row tendrían que estar las tareas
      * seguimos funcionando con $tagUserstory para recoger sus tareas */
      $scope.viewRelatedTasksUserstory = function() {

        /* inicializamos las variables de las tareas */
        /* tag, rowColl y ponemos a vacio $scope.item.viewRelatedTasks = false;
        * esto no va a funcionar
        * este metodo se usa para ver o no las related tasks */
        /*initVarsScrumChannelTasks();*/

        /* NO HACE FALTA INICIALIZAR NADA, ROWCOLLECTION CAMBIA Y CUANDO ELIJAMOS
        * 1 FILA DE TASK MACHACAMOS LA VAR */

        if($scope.tagUserstory.tasks == undefined ||
          $scope.tagUserstory.tasks == null ||
          $scope.tagUserstory.tasks == '' ){
          $scope.tagUserstory.tasks = [];

        }


        console.log("esto vale $scope.tagUserstory.tasks");
        console.log($scope.tagUserstory.tasks);

        if($scope.item.viewRelatedTasks == true){
          $scope.item.viewRelatedTasks = false;

        }
        else{
          $scope.item.viewRelatedTasks = true;

        }

      };


      /* pasarle el objecto de comments */
      function mapUsers(row){

        /* nos recorremos los objectos comments y les metemos el usaername y el mail
         * y miramos si son nuestros  */
        if(row.comments !== undefined &&
          row.comments !== '' &&
          row.comments !== null &&
          row.comments.length >0){



          console.log("hace el mapusers");

          for(var i = 0; i< row.comments.length; i++){

            if(row.comments[i].user !== undefined &&
              row.comments[i].user !== null &&
              row.comments[i].user !== ''){
              if(row.comments[i].user.mail == INTERNAL_USER){
                console.log("este no se toca");
                row.comments[i].isEditable = false;
              }
              /* suponemos que si tiene row.comments[i].user ya esta parseado */

            }
            else {

              for(var j = 0; j< $scope.membersSettingschannel.length; j++){

                if(row.comments[i].user.id == $scope.membersSettingschannel[j].id){
                  row.comments[i].user.username = $scope.membersSettingschannel[j].username;
                  row.comments[i].user.mail = $scope.membersSettingschannel[j].mail;
                  if(row.comments[i].user.id == $localStorage.id){
                    row.comments[i].isEditable = true;

                  }
                }
              }

            }





          }

          /*
          $scope.gotoAnchor(row.comments[($scope.tagUserstory.tasks[$scope.tagTask].comments.length) -1].id);*/
          console.log("esto vale row.comments");
          $scope.gotoAnchor(row.comments[(row.comments.length) -1].id);

        }




      };



      $scope.viewRelatedCommentsTask = function() {

        /* inicializamos las variables de las tareas */
        /* tag, rowColl y ponemos a vacio $scope.item.viewRelatedTasks = false;
         * esto no va a funcionar
         * este metodo se usa para ver o no las related tasks */
        /*initVarsScrumChannelTasks();*/

        /* NO HACE FALTA INICIALIZAR NADA, ROWCOLLECTION CAMBIA Y CUANDO ELIJAMOS
         * 1 FILA DE TASK MACHACAMOS LA VAR */

        if($scope.tagUserstory.tasks[$scope.tagTask].comments == undefined ||
          $scope.tagUserstory.tasks[$scope.tagTask].comments == null ||
          $scope.tagUserstory.tasks[$scope.tagTask].comments == '' ){
          $scope.tagUserstory.tasks[$scope.tagTask].comments = [];

        }

        /*$scope.rowCollectionTasks = $scope.tagUserstory.tasks;*/



        console.log("esto vale $scope.tagUserstory.tasks[$scope.tagTask].comments");
        console.log($scope.tagUserstory.tasks[$scope.tagTask].comments);

        if($scope.item.viewRelatedComments == true){
          $scope.item.viewRelatedComments = false;

        }
        else{
          removeCommentText();

          /* buscamos a los usuarios */
          mapUsers($scope.tagUserstory.tasks[$scope.tagTask]);
          /* damos la vuelta a los comentarios */

          $scope.item.viewRelatedComments = true;

        }

      };



      $scope.viewRelatedCommentsIssue = function() {


        if($scope.rowCollectionIssues[$scope.tagIssue].comments == undefined ||
          $scope.rowCollectionIssues[$scope.tagIssue].comments == null ||
          $scope.rowCollectionIssues[$scope.tagIssue].comments == '' ){
          $scope.rowCollectionIssues[$scope.tagIssue].comments = [];

        }

        if($scope.item.viewRelatedComments == true){
          $scope.item.viewRelatedComments = false;

        }
        else{
          removeCommentText();

          /* buscamos a los usuarios */
          mapUsers($scope.rowCollectionIssues[$scope.tagIssue]);
          /* damos la vuelta a los comentarios */

          $scope.item.viewRelatedComments = true;

        }

      };







      /* primero mirar que coge bien las columnas */
      $scope.removeUSs = function( ) {

        var arrUSRemove = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;




        /* mirar los US seleccionados ************************/
        for( var i = 0; i < $scope.rowCollectionUserStories.length; i++){
          /* mandamos a borrar 1 array de ids ********************/

          console.log("entrooooooo");

          if($scope.rowCollectionUserStories[i].selectedCell){
            console.log("userstory seleccionado");
            console.log($scope.rowCollectionUserStories[i]);
            arrUSRemove.push($scope.rowCollectionUserStories[i].id);

          }
        }



        ScrumService.deleteUSs(groupid, channelid, arrUSRemove)
          .then(function (res) {


            if($scope.rowCollectionUserStories !== undefined &&
              $scope.rowCollectionUserStories !== null &&
              $scope.rowCollectionUserStories !== '' &&
              $scope.rowCollectionUserStories.length > 0){


              uncheckAll($scope.rowCollectionUserStories);

            }



            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];

            console.log("esto vale las responses");
            console.log(res);


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' userstories deleted succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Userstories deleted succesfully', {
                closeButton: true
              });

            }


          });
      };




      $scope.promoteIssuetoUS = function( ) {
        /* vamos a hacerlo como un update */


        var oldvalue;
        var newvalue;
        var field = 'userstories';



        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.rowCollectionIssues[$scope.tagIssue].id, newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Issue generating user story', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });



      }





      $scope.removeIssues = function( ) {

        var arrIssueRemove = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;



        /* mirar las issues seleccionadas ************************/
        for( var i = 0; i < $scope.rowCollectionIssues.length; i++){
          /* mandamos a borrar 1 array de ids ********************/



          if($scope.rowCollectionIssues[i].selectedCell){
            arrIssueRemove.push($scope.rowCollectionIssues[i].id);

          }
        }



        ScrumService.deleteIssues(groupid, channelid, arrIssueRemove)
          .then(function (res) {


            if($scope.rowCollectionIssues !== undefined &&
              $scope.rowCollectionIssues !== null &&
              $scope.rowCollectionIssues !== '' &&
              $scope.rowCollectionIssues.length > 0){


              uncheckAll($scope.rowCollectionIssues);

            }



            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' issues deleted succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Issues deleted succesfully', {
                closeButton: true
              });

            }


          });
      };










      $scope.removeSprints = function( ) {

        var arrSprintsRemove = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;
        var userstoryid = $scope.tagUserstory.id;



        for( var i = 0; i < $scope.rowCollectionSprints.length; i++){
          /* mandamos a borrar 1 array de ids ********************/


          if($scope.rowCollectionSprints[i].selectedCell){

            arrSprintsRemove.push($scope.rowCollectionSprints[i].id);

          }
        }



        ScrumService.deleteSprints(groupid, channelid, arrSprintsRemove)
          .then(function (res) {


            if($scope.rowCollectionSprints !== undefined &&
              $scope.rowCollectionSprints !== null &&
              $scope.rowCollectionSprints !== '' &&
              $scope.rowCollectionSprints.length > 0){


              uncheckAll($scope.rowCollectionSprints);


            }

            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];



            console.log("esto vale las responses");
            console.log(res);


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' sprints deleted succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Sprint deleted succesfully', {
                closeButton: true
              });

            }


          });
      };







      $scope.removeTaskFromSprint = function(rowUSid, rowid) {

        var arrTaskRemove = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;
        var userstoryid = rowUSid;


        /* mete el id */
        arrTaskRemove.push(rowid);

        ScrumService.deleteTasks(groupid, channelid, userstoryid, arrTaskRemove)
          .then(function (res) {
            /* le estoy llamando desde el sprint, no tengo que hacer nada */


            console.log("esto vale las responses");
            console.log(res);


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' tasks deleted succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Tasks deleted succesfully', {
                closeButton: true
              });

            }


          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };





      $scope.removeTasks = function( ) {

        var arrTaskRemove = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;
        var userstoryid = $scope.tagUserstory.id;



         for( var i = 0; i < $scope.tagUserstory.tasks.length; i++){
           if($scope.tagUserstory.tasks[i].selectedCell){

              arrTaskRemove.push($scope.tagUserstory.tasks[i].id);

           }
         }



        ScrumService.deleteTasks(groupid, channelid, userstoryid, arrTaskRemove)
          .then(function (res) {


            if( $scope.tagUserstory !== undefined &&
              $scope.tagUserstory !== null &&
              $scope.tagUserstory !== '' ){


              /* aunque no tenga tareas hay que borrar el array que tiene selected */
              if ($scope.tagUserstory.id == userstoryid &&
                $scope.tagUserstory.tasks !== undefined &&
                $scope.tagUserstory.tasks !== null &&
                $scope.tagUserstory.tasks !== '' &&
                $scope.tagUserstory.tasks.length > 0) {

                uncheckAll($scope.tagUserstory.tasks);

              }

            }

            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];



            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' tasks deleted succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Tasks deleted succesfully', {
                closeButton: true
              });

            }


          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };





      $scope.removeContributorTask = function( contributor) {

        var field = 'uncontributors';
        var newvalue = contributor;


        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, null, field)
          .then(function (res) {

            toastr.info('Remove contributor from task sucessfully', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };




      /* le sacariamos la misma modal de siempre */
      $scope.addContributorTask = function(contributor) {


        var field = 'contributors';
        var ind = -1;
        var membersSettingschannelTemp = enableMembers($scope.tagUserstory, ind);


        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/contributorsModal.html',
          controller: 'contributorsModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.tagGroup.id,
                channelid: $scope.tagChannel.id,
                userstoryid: $scope.tagUserstory.id,
                taskid: $scope.tagUserstory.tasks[$scope.tagTask].id,
                membersSettingschannel: membersSettingschannelTemp
              }
            }
          }
        });


        modalInstance.result.then(function (result) {
          console.log('result: ' + result);
          toastr.info('Contributor added to task', 'Information', {
            closeButton: true
          });
        });




      };







      $scope.unassignedTask = function(task) {
        var field = 'unassignedto';

        var oldvalue = task.assignedto;
        var newvalue = {};

        console.log("esto vale el actual assigned to");
        console.log(task.assignedto);

        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task unassigned sucessfully', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });






      };




      $scope.editSubjectUserstory = function(data, tagUserstory) {
        var field = 'subject';

        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field )
          .then(function (res) {

            toastr.info('Userstory subject changed', 'Information', {
              closeButton: true
            });


          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };



      $scope.editSubjectIssue = function(data, tagIssue) {

        var oldvalue = undefined;
        var newvalue = data;
        var field = 'subject';



        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          tagIssue.id, newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Issue subject changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };






      /******************** unassign US from Sprint *******************************/


      $scope.unsassignedUSfromSprint = function() {



        var arrUSUpdate = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;




        /* mirar los US seleccionados ************************/
        for( var i = 0; i < $scope.rowCollectionUserStories.length; i++){
          /* mandamos a borrar 1 array de ids ********************/

          if($scope.rowCollectionUserStories[i].selectedCell){
            console.log("userstory seleccionado");
            console.log($scope.rowCollectionUserStories[i]);
            arrUSUpdate.push($scope.rowCollectionUserStories[i].id);

          }
        }



        ScrumService.unassignedUSsFromSprint(groupid, channelid,arrUSUpdate)
          .then(function (res) {




            console.log("antes de desseleccionar");
            console.log("esto vale $scope.tagUserstory");
            console.log($scope.tagUserstory);
            console.log("esto vale $scope.rowCollectionUserStories");
            console.log($scope.rowCollectionUserStories);


            if($scope.rowCollectionUserStories !== undefined &&
              $scope.rowCollectionUserStories !== null &&
              $scope.rowCollectionUserStories !== '' &&
              $scope.rowCollectionUserStories.length > 0){


              uncheckAll($scope.rowCollectionUserStories);




            }

            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];


            console.log("esto vale las responses");
            console.log(res);


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' userstories unlinked from sprint succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Userstories unlinked from sprint succesfully', {
                closeButton: true
              });

            }


          });


      };





























      /* ha esto le llama una modal que tenga los Sprints */
      $scope.editSprintUserstory = function(sprintselected) {
        console.log("esto vale es sprint seleted");
        console.log(sprintselected);


        var arrUSUpdate = [];

        var groupid = $scope.tagGroup.id;
        var channelid = $scope.tagChannel.id;




        /* mirar los US seleccionados ************************/
        for( var i = 0; i < $scope.rowCollectionUserStories.length; i++){
          /* mandamos a borrar 1 array de ids ********************/

          if($scope.rowCollectionUserStories[i].selectedCell){
            console.log("userstory seleccionado");
            console.log($scope.rowCollectionUserStories[i]);
            arrUSUpdate.push($scope.rowCollectionUserStories[i].id);

          }
        }



        ScrumService.updateUSsSprint(groupid, channelid, sprintselected.id ,arrUSUpdate)
          .then(function (res) {

            $("#selectSprintToUserStoryModal").modal("hide");
            $("#changeSprintToUserStoryModal").modal("hide");


            console.log("antes de desseleccionar");
            console.log("esto vale $scope.tagUserstory");
            console.log($scope.tagUserstory);
            console.log("esto vale $scope.rowCollectionUserStories");
            console.log($scope.rowCollectionUserStories);


            if($scope.rowCollectionUserStories !== undefined &&
              $scope.rowCollectionUserStories !== null &&
              $scope.rowCollectionUserStories !== '' &&
              $scope.rowCollectionUserStories.length > 0){


              uncheckAll($scope.rowCollectionUserStories);




            }

            $scope.ischeckedAllCells = false;
            $scope.tableCells = {};
            $scope.tableCells.selected = [];


            console.log("esto vale las responses");
            console.log(res);


            /* res puede ser undefined, controlarlo */
            if( res !== undefined && res !== null && res !== '' && res.length >0){

              toastr.success('' + res.length + ' userstories added to sprint succesfully', {
                closeButton: true
              });

            }
            else{
              toastr.success('Userstories added to sprint succesfully', {
                closeButton: true
              });

            }


          });


      };




      $scope.editSubjectTask = function(data, tagTask) {

        var oldvalue = undefined;
        var newvalue = data;
        var field = 'subject';


        /* esta funcion vale para cualquier field */
        /* metemos field y old value y new value aunque aveces vayan vacios */
        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task subject changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });


      };


      $scope.removeComment = function(comment) {

        console.log("esto vale comment");
        var newvalue = comment.id;
        var field = 'uncomment';


        /* esta funcion vale para cualquier field */
        /* metemos field y old value y new value aunque aveces vayan vacios */
        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, null, field)
          .then(function (res) {

            toastr.info('Comment deleted sucessfully', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };


















      $scope.removeCommentIssue = function(comment) {

        console.log("esto vale comment");
        var newvalue = comment.id;
        var field = 'uncomment';


        /* esta funcion vale para cualquier field */
        /* metemos field y old value y new value aunque aveces vayan vacios */
        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.rowCollectionIssues[$scope.tagIssue].id, newvalue, null, field)
          .then(function (res) {

            toastr.info('Comment deleted sucessfully', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };




      $scope.editDescriptionUserstory = function(data, tagUserstory) {

        var field = 'description';
        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field )
          .then(function (res) {
            console.log("esto vale res de update userstories con description");
            console.log(res);

            toastr.info('Userstory description changed', 'Information', {
              closeButton: true
            });

          }, function (err) {

            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };

      $scope.editDescriptionTask = function(data, tagTask) {



        var oldvalue = undefined;
        var newvalue = data;
        var field = 'description';


        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task description changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });



      };



      $scope.editDescriptionIssue = function(data, tagIssue) {



        var oldvalue = undefined;
        var newvalue = data;
        var field = 'description';


        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          tagIssue.id, newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task description changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });



      };







      $scope.onAddedTag = function(tag) {

        var field = 'tags';
        var code = {};
        code.code = 1;
        code.text = tag.text;

        $scope.tagUserstory.tags.push(tag.text);


        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field, code )
          .then(function (res) {

            toastr.info('Userstory tags changed', 'Information', {
              closeButton: true
            });

          }, function (err) {

            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });



      };

      $scope.onRemovedTag = function(tag) {

        var field = 'tags';
        var code = {};
        code.code = 0;
        code.text = tag.text;


        var index = $scope.tagUserstory.tags.indexOf(tag.text);
        if (index > -1) {
          $scope.tagUserstory.tags.splice(index, 1);
        }


        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field, code )
          .then(function (res) {

            toastr.info('Userstory tags changed', 'Information', {
              closeButton: true
            });

          }, function (err) {

            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });



      };




      $scope.editRequirementUserstory = function(num) {

        var field = 'requirement';
        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field, num )
          .then(function (res) {

            toastr.info('Userstory type changed', 'Information', {
              closeButton: true
            });


          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };




      $scope.editRequirementTask = function(num) {

        /* num 0 = blocked num = 1 iocaine */




        /* se puede deducir pasando cual se ha cambiado */
        var oldvalue = "";
        var newvalue = $scope.tagUserstory.tasks[$scope.tagTask].requirement;
        var field = 'requirement';

        if(num == 0){
          oldvalue = "blocked";
        }
        else{
          oldvalue = "iocaine"
        }


        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task type changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };



      $scope.editStatusTaskFromSprint = function(status, rowUS, rowTask) {

        console.log("esto vale status");
        console.log(status);
        console.log("esto vale rowUS");
        console.log(rowUS);
        console.log("esto vale rowtask");
        console.log(rowTask);

        var oldvalue = "";
        var newvalue = status;
        var field = 'status';



        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          rowUS.id, rowTask.id, newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task status changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });


      };







      /* new = 0, in progress = 1, readyfortest = 2, closed =3 */

      $scope.editStatusTask = function() {


        /* el valor anterior lo tenemos en API */

        var oldvalue = "";
        var newvalue = $scope.tagUserstory.tasks[$scope.tagTask].status;
        var field = 'status';



        ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
          newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Task status changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };



      /* type = 0, severity= 1, priority= 2, status= 3 */
      $scope.editCombosIssue = function(num) {


        /* el valor anterior lo tenemos en API */

        var oldvalue = "";
        var newvalue, field;
        var msg = "";

        if(num == 0){
          newvalue = $scope.rowCollectionIssues[$scope.tagIssue].type;
          field = 'type';
          msg = "type";

        }
        else if(num == 1){
          newvalue = $scope.rowCollectionIssues[$scope.tagIssue].severity;
          field = 'severity';
          msg = "severity";
          console.log("esto vale severity en new value");
          console.log(newvalue);

        }
        else if(num == 2){
          newvalue = $scope.rowCollectionIssues[$scope.tagIssue].priority;
          field = 'priority';
          msg = "priority";

        }
        else if(num == 3){
          newvalue = $scope.rowCollectionIssues[$scope.tagIssue].status;
          field = 'status';
          msg = "status";

        }





        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.rowCollectionIssues[$scope.tagIssue].id, newvalue, oldvalue, field)
          .then(function (res) {

            toastr.info('Issue '+msg+' changed', 'Information', {
              closeButton: true
            });

          }, function (err) {
            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });

      };




      $scope.editVoteIssue = function(num) {

        var field = 'voters';

        /* si num es 0 añadimos su id al de voters */
        if(num == 0){
          if($scope.rowCollectionIssues[$scope.tagIssue].voters == null ||
            $scope.rowCollectionIssues[$scope.tagIssue].voters == undefined ||
            $scope.rowCollectionIssues[$scope.tagIssue].voters == ''){
            $scope.rowCollectionIssues[$scope.tagIssue].voters = [];
          }

          $scope.rowCollectionIssues[$scope.tagIssue].voters.push($localStorage.id);
          $scope.tagIssueTemp.disableVote = true;
        }
        else {
          var index = $scope.rowCollectionIssues[$scope.tagIssue].voters.indexOf($localStorage.id);
          if (index > -1) {
            $scope.rowCollectionIssues[$scope.tagIssue].voters.splice(index, 1);
          }
          $scope.tagIssueTemp.disableVote = false;
        }

        console.log("esto vale $scope.tagIssueTemp.disableVote");
        console.log($scope.tagIssueTemp.disableVote);

        ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
          $scope.rowCollectionIssues[$scope.tagIssue].id, $scope.rowCollectionIssues[$scope.tagIssue].voters,
          null, field )
          .then(function (res) {

            toastr.info('Issue votes changed', 'Information', {
              closeButton: true
            });

          }, function (err) {

            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };





















      $scope.editVoteUserstory = function(num) {

        var field = 'voters';

        /* si num es 0 añadimos su id al de voters */
        if(num == 0){
          if($scope.tagUserstory.voters == null ||
            $scope.tagUserstory.voters == undefined ||
            $scope.tagUserstory.voters == ''){
            $scope.tagUserstory.voters = [];
          }
          $scope.tagUserstory.voters.push($localStorage.id);
          $scope.tagUserstoryTemp.disableVote = true;
        }
        else {
          var index = $scope.tagUserstory.voters.indexOf($localStorage.id);
          if (index > -1) {
            $scope.tagUserstory.voters.splice(index, 1);
          }
          $scope.tagUserstoryTemp.disableVote = false;
        }

        ScrumService.updateUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, field )
          .then(function (res) {

            toastr.info('Userstory votes changed', 'Information', {
              closeButton: true
            });

          }, function (err) {

            toastr.error(err.data.message, 'Error', {
              closeButton: true
            });

          });
      };




      $scope.sendCommentTextIssue = function() {
        console.log("esto vale el texto");
        console.log($scope.item.commentText);


        var field = 'comments';
        var newvalue = $scope.item.commentText;

        if(newvalue == ''){

          removeCommentText();

        }
        else {

          ScrumService.updateIssue($scope.tagGroup.id, $scope.tagChannel.id,
            $scope.rowCollectionIssues[$scope.tagIssue].id, newvalue, null, field)
            .then(function (res) {
              console.log("Se termino el envio del mensaje");
              console.log(res.data);
              removeCommentText();





            }, function (err) {
              console.log("hay error");
              console.log(err.data.message);
              removeCommentText();



            });

        }


      };








      $scope.sendCommentText = function() {
        console.log("esto vale el texto");
        console.log($scope.item.commentText);


        var field = 'comments';
        var newvalue = $scope.item.commentText;

        if(newvalue == ''){

          removeCommentText();

        }
        else {

          ScrumService.updateTask($scope.tagGroup.id, $scope.tagChannel.id,
            $scope.tagUserstory.id, $scope.tagUserstory.tasks[$scope.tagTask].id,
            newvalue, null, field)
            .then(function (res) {
              console.log("Se termino el envio del mensaje");
              console.log(res.data);
              removeCommentText();

            }, function (err) {
              console.log("hay error");
              console.log(err.data.message);
              removeCommentText();



            });

        }


      };





      $scope.createNewIssue = function() {

        if($scope.issue.subject == undefined ||
          $scope.issue.subject == null || $scope.issue.subject == ''){

          $scope.modalsError.messageNewIssueRequiredSubModal = "Field subject is required.";

        }
        else {


          ScrumService.createIssue($scope.tagGroup.id, $scope.tagChannel.id, $scope.issue)
            .then(function (res) {

              $("#newIssueModal").modal("hide");

              $scope.initVarsNewIssueModal();

              toastr.success('Issue successfully created', {
                closeButton: true
              });


            }, function (err) {

              $scope.modalsError.messageNewIssueModal = err.data.message;
            });
        }

      };










      $scope.createNewUserstory = function() {

        if($scope.userstory.subject == undefined ||
          $scope.userstory.subject == null || $scope.userstory.subject == ''){

          $scope.modalsError.messageNewUserstoryRequiredSubModal = "Field subject is required.";

        }
        else {

          if($scope.tagSprint !== undefined &&
            $scope.tagSprint !== null &&
            $scope.tagSprint !== '' ){

            if($scope.tagSprint !== undefined &&
              $scope.tagSprint !== null &&
              $scope.tagSprint !== ''){
              $scope.userstory.sprint = $scope.tagSprint.id;

            }

          }


          ScrumService.createUserstory($scope.tagGroup.id, $scope.tagChannel.id, $scope.userstory)
            .then(function (res) {

              $("#newUserStoryModal").modal("hide");
              $("#newUserStorySprintModal").modal("hide");


              $scope.initVarsNewUserstoryModal();

              toastr.success('US successfully created', {
                closeButton: true
              });


            }, function (err) {

              $scope.modalsError.messageNewUserstoryModal = err.data.message;
            });
        }

      };








      $scope.createNewRelatedTaskFromSprint = function() {

        console.log("esto vake $scope.tagSaveUSTemp");
        console.log($scope.tagSaveUSTemp);

        if($scope.task.subject == undefined ||
          $scope.task.subject == null || $scope.task.subject == ''){

          $scope.modalsError.messageNewRelatedTaskRequiredSubModal = "Field subject is required.";

        }
        else {
          ScrumService.createRelatedTask($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagSaveUSTemp, $scope.task)
            .then(function (res) {

              $("#newTaskSprintModal").modal("hide");

              $scope.initVarsNewRelatedTaskModal();

              toastr.success('Task successfully created', {
                closeButton: true
              });


            }, function (err) {

              $scope.modalsError.messageNewUserstoryModal = err.data.message;
            });
        }

      };



















      $scope.createNewRelatedTask = function() {

        console.log("esto vake tagUserstory");
        console.log($scope.tagUserstory);

        if($scope.task.subject == undefined ||
          $scope.task.subject == null || $scope.task.subject == ''){

          $scope.modalsError.messageNewRelatedTaskRequiredSubModal = "Field subject is required.";

        }
        else {
          ScrumService.createRelatedTask($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagUserstory, $scope.task)
            .then(function (res) {

              $("#newTaskModal").modal("hide");
              $("#newTaskPartialModal").modal("hide");


              $scope.initVarsNewRelatedTaskModal();

              toastr.success('Task successfully created', {
                closeButton: true
              });


            }, function (err) {

              $scope.modalsError.messageNewUserstoryModal = err.data.message;
            });
        }

      };




      $scope.editSprint = function() {


        console.log("edit sprint");
        console.log($scope.tagSprintTemp);





        if($scope.tagSprintTemp.name == undefined ||
          $scope.tagSprintTemp.name == null || $scope.tagSprintTemp.name == ''){

          $scope.modalsError.messageEditSprintRequiredNameModal = "Field name is required.";

        }
        else {

          $scope.tagSprintTemp.startdate = $scope.tagSprintTemp.startdate.toISOString();
          $scope.tagSprintTemp.enddate = $scope.tagSprintTemp.enddate.toISOString();



          /* mandamos el sprint */

          ScrumService.editSprint($scope.tagGroup.id, $scope.tagChannel.id, $scope.tagSprintTemp)
            .then(function (res) {

              $("#editSprintModal").modal("hide");

              console.log("esto vale el sprint creado");
              console.log(res.data);

              $scope.initVarsEditSprintModal();

              toastr.success('Sprint successfully updated', {
                closeButton: true
              });


            }, function (err) {

              $scope.modalsError.messageEditSprintModal = err.data.message;
            });


        }



      };





      $scope.createNewSprint = function() {

        /*el modelo es sprint*/

        if($scope.sprint.name == undefined ||
          $scope.sprint.name == null || $scope.sprint.name == ''){

          $scope.modalsError.messageNewSprintRequiredNameModal = "Field name is required.";

        }
        else {

          $scope.sprint.startdate = $scope.sprint.startdate.toISOString();
          $scope.sprint.enddate = $scope.sprint.enddate.toISOString();
          console.log($scope.sprint);

          /* mandamos el sprint */

          ScrumService.createSprint($scope.tagGroup.id, $scope.tagChannel.id, $scope.sprint)
            .then(function (res) {

              $("#newSprintModal").modal("hide");

              console.log("esto vale el sprint creado");
              console.log(res.data);

              $scope.initVarsNewSprintModal();

              toastr.success('Sprint successfully created', {
                closeButton: true
              });




            }, function (err) {

              $scope.modalsError.messageNewSprintModal = err.data.message;
            });



        }


      };



      /*$scope.stad = {};
       $scope.stad.userstories = {};
       $scope.stad.tasks = {};
       $scope.stad.sprints = {};
       $scope.stad.issues = {};*/


      function createStadUsTask (){

        $scope.stad.userstories.projectPoints = 0;
        /* para cada us mirar cuantos puntos tiene */
        $scope.stad.userstories.definedPoints = 0;
        /* para cada us mirar cuantos puntos tiene si esta cerrado */
        $scope.stad.userstories.closedPoints = 0;
        $scope.stad.userstories.chartPercent = 0;
        $scope.stad.userstories.chartPercentDraw = 0;

        $scope.chartdata [0][0] = 0;


        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ){

          $scope.stad.userstories.projectPoints = $scope.rowCollectionUserStories.length;
          $scope.chartdata [0][0] = $scope.rowCollectionUserStories.length;

          for(var i = 0; i< $scope.rowCollectionUserStories.length; i++){

            $scope.stad.userstories.definedPoints += parseFloat($scope.rowCollectionUserStories[i].point.ux) +
              parseFloat($scope.rowCollectionUserStories[i].point.design) +
              parseFloat($scope.rowCollectionUserStories[i].point.front) +
              parseFloat($scope.rowCollectionUserStories[i].point.back);

            if($scope.rowCollectionUserStories[i].status == 'Closed'){
              $scope.stad.userstories.closedPoints += parseFloat($scope.rowCollectionUserStories[i].point.ux) +
                parseFloat($scope.rowCollectionUserStories[i].point.design) +
                parseFloat($scope.rowCollectionUserStories[i].point.front) +
                parseFloat($scope.rowCollectionUserStories[i].point.back);

            }
          }

          if($scope.stad.userstories.closedPoints !== 0){
            $scope.stad.userstories.chartPercent = ($scope.stad.userstories.closedPoints / $scope.stad.userstories.definedPoints) * 100;
            $scope.stad.userstories.chartPercentDraw = (50 / $scope.stad.userstories.definedPoints) * $scope.stad.userstories.closedPoints;
          }

        }
      }

      function createStadSprint (){
        $scope.stad.sprints.totalPoints = 0;
        /* para cada us mirar cuantos puntos tiene */
        $scope.stad.sprints.completedPoints = 0;
        /* para cada us mirar cuantos puntos tiene si esta cerrado */
        $scope.stad.sprints.openTasks = 0;
        $scope.stad.sprints.closedTasks = 0;
        $scope.stad.sprints.bloquedTasks = 0;
        $scope.stad.sprints.powerTasks = 0;

        $scope.stad.sprints.chartPercentDraw = 0;
        $scope.stad.sprints.chartPercent = 0;

        $scope.chartdata [0][0] = 0;




        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ){

          for(var i = 0; i< $scope.rowCollectionUserStories.length; i++){
            if($scope.rowCollectionUserStories[i].sprint !== undefined &&
              $scope.rowCollectionUserStories[i].sprint !== null &&
              $scope.rowCollectionUserStories[i].sprint !== ''){
              $scope.stad.sprints.totalPoints += parseFloat($scope.rowCollectionUserStories[i].point.ux) +
                parseFloat($scope.rowCollectionUserStories[i].point.design) +
                parseFloat($scope.rowCollectionUserStories[i].point.front) +
                parseFloat($scope.rowCollectionUserStories[i].point.back);

              if($scope.rowCollectionUserStories[i].status == 'Closed'){
                $scope.stad.sprints.completedPoints += parseFloat($scope.rowCollectionUserStories[i].point.ux) +
                  parseFloat($scope.rowCollectionUserStories[i].point.design) +
                  parseFloat($scope.rowCollectionUserStories[i].point.front) +
                  parseFloat($scope.rowCollectionUserStories[i].point.back);

              }

              if($scope.rowCollectionUserStories[i].tasks !== undefined &&
                $scope.rowCollectionUserStories[i].tasks !== null &&
                $scope.rowCollectionUserStories[i].tasks !== '' ){
                if($scope.rowCollectionUserStories[i].tasks.length >0){
                  for(var j= 0; j<$scope.rowCollectionUserStories[i].tasks.length; j++){
                    if($scope.rowCollectionUserStories[i].tasks[j].status == 'Closed'){
                      $scope.stad.sprints.closedTasks +=1;
                    }
                    else {
                      $scope.stad.sprints.openTasks +=1;
                    }
                    if($scope.rowCollectionUserStories[i].tasks[j].requirement !== undefined &&
                      $scope.rowCollectionUserStories[i].tasks[j].requirement !== null &&
                      $scope.rowCollectionUserStories[i].tasks[j].requirement !== ''  ){

                      if($scope.rowCollectionUserStories[i].tasks[j].requirement.iocaine == true){
                        $scope.stad.sprints.bloquedTasks +=1;

                      }
                      if($scope.rowCollectionUserStories[i].tasks[j].requirement.blocked == true){
                        $scope.stad.sprints.powerTasks +=1;

                      }
                    }
                  }


                }


              }

            }


          }

          if($scope.stad.sprints.completedPoints !== 0){
            $scope.stad.sprints.chartPercent = ($scope.stad.sprints.completedPoints / $scope.stad.sprints.totalPoints) * 100;
            $scope.stad.sprints.chartPercentDraw = (50 / $scope.stad.sprints.totalPoints) * $scope.stad.sprints.completedPoints;
          }

        }





      }
      function createStadIssue (){
        $scope.stad.issues.openIssues = 0;

        $scope.stad.issues.closedIssues = 0;

        $scope.stad.issues.questionType = 0;
        $scope.stad.issues.enhaType = 0;
        $scope.stad.issues.bugType = 0;


        $scope.stad.issues.chartPercent = 0;
        $scope.stad.issues.chartPercentDraw = 0;

        $scope.chartdata [0][0] = 0;


        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' ){



          for(var i = 0; i< $scope.rowCollectionIssues.length; i++){

            if($scope.rowCollectionIssues[i].status == 'Closed'){
              $scope.stad.issues.closedIssues += 1;

            }
            else {
              $scope.stad.issues.openIssues += 1;
            }


            if($scope.rowCollectionIssues[i].type == 'Bug'){
              $scope.stad.issues.bugType += 1;

            }
            else if($scope.rowCollectionIssues[i].type == 'Enhancement'){
              $scope.stad.issues.enhaType += 1;

            }
            else {
              $scope.stad.issues.questionType += 1;
            }


          }
          if($scope.stad.issues.closedIssues !== 0){
            $scope.stad.issues.chartPercent = ($scope.stad.issues.closedIssues / ($scope.stad.issues.closedIssues + $scope.stad.issues.openIssues)) * 100;
            $scope.stad.sprints.chartPercentDraw = (50 / ($scope.stad.issues.closedIssues + $scope.stad.issues.openIssues)) * $scope.stad.issues.closedIssues;
          }




        }

      }





      /* hacemos funciones que recojan los userstories, issues y sprints
       * cuando seleccionamos 1 canal que sea de tipo scrum */


      function getUserstories () {

        ScrumService.getUserstories($scope.tagGroup.id, $scope.tagChannel.id)
          .then(function (res) {

            $scope.rowCollectionUserStories = res.data;
            console.log("esto valen los userstories *********");



          }, function (err) {
            $scope.modalsError.messageNewUserstoryModal = err.data.message;
          });


      };


      /* los recogemos pero no hacemos nada */
      function getSprints () {
        ScrumService.getSprints($scope.tagGroup.id, $scope.tagChannel.id)
          .then(function (res) {



            console.log("esto vale res de getsprints");
            console.log(res);

            $scope.rowCollectionSprints = res.data;
            /* nos los recorremos poniendo viewTableUs false*/



            if($scope.rowCollectionSprints !== undefined &&
              $scope.rowCollectionSprints !== null &&
              $scope.rowCollectionSprints !== '' &&
              $scope.rowCollectionSprints.length > 0){

              resetSprintTableShow();
            }




          }, function (err) {
            console.log("esto vale err de getsprints");
            console.log(err);
            $scope.modalsError.messageNewUserstoryModal = err.data.message;
          });


      };

      /* los recogemos pero no hacemos nada */
      function getIssues () {
        ScrumService.getIssues($scope.tagGroup.id, $scope.tagChannel.id)
          .then(function (res) {


            /* hay que meterlo en 1 array */
            console.log("esto vale res de getissues");
            console.log(res);

            $scope.rowCollectionIssues = res.data;



          }, function (err) {
            console.log("esto vale err de getissues");
            console.log(err);
            $scope.modalsError.messageNewUserstoryModal = err.data.message;
          });


      };










      /* GROUP */
      $scope.initVarsNewGroup = function(){
        $scope.removeInput();
        //$scope.srumchecked = false;

        /* no se si group entero o solo scrum */
        $scope.group = {};
        removeErrorMessageNewGroupModal();


      };



      /* CHANNEL */
      $scope.initVarsNewChannelModal = function(){
        $scope.removeInputChannelName();
        /*$scope.githubchecked = false;*/


        $scope.channel = {};
        $scope.channel.channelType = "PUBLIC";
        $scope.channel.channelService = 0;


        $scope.githubaccounts = [];
        $scope.githubchannel = {};
        removeErrormessageNewChannelModal();


      };



      $scope.initVarsDeleteGitChannelWebhooksModal = function(){
        $scope.infoDeleteGitChannel = {};
        $scope.infoDeleteGitChannel.arrReposOk = [];
        $scope.infoDeleteGitChannel.arrReposError = [];
      }




      $scope.initVarsReloginGitDeleteChannelModal = function(){
        $scope.modalsError.messageReloginBadCredentialsModal = '';
        $scope.accountDelete = {};
        $scope.accountDelete.password ="";
      }




      $scope.initVarsNewChannelIntegrationModal = function(){
        /* las anteriores y estas */
        $scope.initVarsNewChannelModal();
        removeVarsNewChannelIntegrationModal();


      };


      $scope.initVarsNewChannelReposModal = function(){
        /* las anteriores (initVarsNewChannelIntegrationModal) y estas */
        $scope.initVarsNewChannelIntegrationModal();
        removeVarsNewChannelReposModal();


      };


      $scope.initVarsNewChannelWebhooksModal = function(){
        /* las anteriores (initVarsNewChannelReposModal) y estas */
        $scope.initVarsNewChannelReposModal();
        removeVarsNewChannelWebhooksModal();


      };


      $scope.initVarsNewUserstoryModal = function(){
        removeVarsNewUserstoryModal();

      };


      $scope.initVarsNewRelatedTaskModal = function(){
        removeVarsNewRelatedTaskModal();

      };

      $scope.initVarsNewSprintModal = function(){
        removeVarsNewSprintModal();
      };



      $scope.initVarsNewIssueModal = function(){
        removeVarsNewIssueModal();

      };








      $scope.removeInput = function(){
        $("#groupNameTxt").val('').trigger('input');
      };

      /************************** end  modales inicializar valores *****************************************/




      $scope.createNewGroup = function(group){


        if(group.groupName == '' || group.groupName == null || group.groupName == undefined){
          removeErrorMessageNewGroupModal();
          $scope.modalsError.messageNewGroupModal = "Group Name is required.";


        }
        else{
          var enc = false;
          /* buscamos en los grupos */
          console.log("esto vale scope.groups");
          console.log($scope.groups);
          /* groups[i].groupName */

          /* los recorremos para ver si ya existe */
          for (var i = 0; i < $scope.groups.length; i++) {
            if ($scope.groups[i].groupName == group.groupName) {
              enc = true;
              i = $scope.groups.length;

            }
          }

          if (enc) {
            removeErrorMessageNewGroupModal();
            $scope.modalsError.messageNewGroupModal = "Already exists group with that name.";

          }


          else {
            GroupService.createNewGroup(group).then(
              function(data) {
                $("#newGroupModal").modal("hide");


                $scope.initVarsNewGroup(); /* tiene::
                                            $scope.removeInput();,
                                             $scope.modalsError.messageNewGroupModal = '';
                                              $scope.group = {};*/


                console.log("ha llamado disconnect de grupo");
                Socket.emit('disconnect');
                console.log("ha llamado disconnect de channel");
                Socket.emit('disconnectChannel');


                $scope.tagGroup = '';
                $scope.groupindex = -1;
                $scope.tagChannel = '';



              },function(err){
                // Tratar el error
                console.log("Error on create new group: " + err.data.message);
                //$scope.removeInput();
                removeErrorMessageNewGroupModal();
                $scope.modalsError.messageNewGroupModal = err.data.message;

              }
            );

          }

        }
      };



     $scope.removeGroup = function () {

        GroupService.removeGroup($scope.tagGroup).then(
          function(data) {
            console.log(data);
            $("#deleteGroupModal").modal("hide");
            // Emitimos evento de desconexión al grupo
            console.log("ha llamado disconnect de grupo");
            Socket.emit('disconnect');
            $scope.tagGroup='';
            // Emitimos evento de desconexión a canales
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.tagChannel='';
          },function(err){
            // Tratar el error
            console.log("Error on delete group: " + err.data.message);
            console.log("Hay error");
            $scope.errorG = err.data.message;
            $("#deleteGroupModal").modal("hide");
            // Emitimos evento de desconexión al grupo
            console.log("ha llamado disconnect de grupo");
            Socket.emit('disconnect');
            $scope.tagGroup='';
            $("#errorGroupModal").modal("show");
          }
        );
      };


	   	/* si pincha vuelve a los settings del grupo */
	    $scope.showGrouptoEdit = function(group){
       		$scope.tagGroup = group;
       		$scope.tagChannel = '';

      	};


      /* avisa antes de cambiarlo si es erroneo o no */
      $scope.checkGroupName = function(data, tagGroup) {
    		if (data === '') {
      			return "Group name should be not blank";
        }
        else{
          if (tagGroup.groupName === data){
            return "New group name should be different"
          } else{
            return GroupService.editGroup(tagGroup.id, data).then(
              function(data) {
                return ;
              },function(err){
                // Tratar el error
                console.log("Error on edit group name: " + err.data.message);
                console.log("Hay error: " + err.message);
                return err.message;
              }
            );
          }
        }
  	  };

      $scope.unsuscribeFromGroup = function(){
        GroupService.unsuscribeFromGroup($scope.tagGroup).then(
          function(data) {
             $("#unsuscribeFromGroupModal").modal("hide");
             var ind = $scope.groups.indexOf($scope.tagGroup);
             $scope.groups.splice(ind,1);
            // Emitimos evento de desconexión al grupo
            console.log("ha llamado disconnect de grupo");
            Socket.emit('disconnect');
            // Emitimos evento de desconexión a canales
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
             $scope.tagGroup='';
             $scope.tagChannel='';
          },function(err){
            // Tratar el error
            console.log("Error on unsuscribe from group: " + err.data.message);
            console.log("Hay error");
            $scope.errorG = err.data.message;
            $("#unsuscribeFromGroupModal").modal("hide");
            $("#errorGroupModal").modal("show");
          }
        );
      };

      /* en este no hay modal por en medio y peta igual */
      $scope.inviteUserToGroup = function (user) {

        GroupService.inviteUserToGroup(user, $scope.tagGroup).then(
          function(data) {
            var index = $scope.membersSettings.indexOf(user);
            if(index > -1){
                $scope.membersSettings[index].isinvited = 1;
            }
            /*$scope.searchText= "";*/
          },function(err){
            // Tratar el error
            /*$scope.searchText= "";*/
            console.log("Hay error");
            console.log(err);
            $scope.errorG = err.data.message;
            $("#errorGroupModal").modal("show");
          }
        );

      };


    $scope.removeUserFromGroup = function (user) {
        GroupService.removeUserFromGroup(user, $scope.tagGroup).then(
          function(data) {
            console.log(data);
            /*$scope.searchText= '';*/
            var index2 = $scope.membersSettings.indexOf(user);
            if(index2 > -1){
                $scope.membersSettings.splice(index2,1);
            }
          },function(err){
            // Tratar el error
            console.log("Hay error");
            console.log(err);
            $scope.errorG = err.data.message;
            $("#errorGroupModal").modal("show");
          }
        );
      };

      $scope.acceptGroup = function (invitation, ind) {
      ProfileService.acceptGroup(invitation.groupid).then(
        function (data) {
          $scope.invitations.splice(ind,1);
        }
        ,function (err) {
          // Tratar el error
          console.log("Hay error");
          console.log(err.message);
          $scope.errorG = err.message;
          $("#errorGroupModal").modal("show");
        });
    };

    $scope.refuseGroup = function (invitation, ind) {
      ProfileService.refuseGroup(invitation.groupid).then(
        function (data) {
          $scope.invitations.splice(ind,1);
        },function (err) {
          // Tratar el error
          console.log("Hay error en refuseGroup: " + err.message);
          $scope.errorG = err.message;
          $("#errorGroupModal").modal("show");
        });
    };

    /* activeChannelSettings */
      $scope.changeSettingsChannelVisible = function(){
        if($scope.activeChannelSettings == 0){
          $scope.activeChannelSettings = 1;
          $scope.option="";
        }
        else {
          $scope.activeChannelSettings = 0;
        }
      };



    /* avisa antes de cambiar el nombre del canal actual si es erroneo o no
    * se le llama desde el html */
    $scope.checkChannelName = function(data, tagChannel) {

      if (data === '') {
        return "Channel name should be not blank";
      }else{
        if (tagChannel.channelName === data){
          return "New channel name should be different"
        }else{
          return ChannelService.editChannel($scope.tagGroup.id, tagChannel.id, data).then(
            function(data) {
              return ;
            },function(err){
              // Tratar el error
              console.log("Hay error: " + err);
              console.log(err);
              return err.message;
            });
        }
      }
    };


      function loadInfoDeleteGitChannel (data){
        $scope.initVarsDeleteGitChannelWebhooksModal();

        console.log("***esto vale en loadInfoDeleteGitChannel data*********");
        console.log(data);
        $scope.infoDeleteGitChannel.channelName = data.channelName;
        if(data.resultdeletehooks !== undefined &&
          data.resultdeletehooks !== null &&
          data.resultdeletehooks !== ''){
          if(data.resultdeletehooks.arrReposOk !== undefined &&
            data.resultdeletehooks.arrReposOk !== null &&
            data.resultdeletehooks.arrReposOk !== ''){
            if(data.resultdeletehooks.arrReposOk.length >0){
              $scope.infoDeleteGitChannel.arrReposOk = data.resultdeletehooks.arrReposOk;

              console.log("***esto vale en loadInfoDeleteGitChannel data.resultdeletehooks.arrReposOk*********");
              console.log($scope.infoDeleteGitChannel.arrReposOk);
            }
          }
          if(data.resultdeletehooks.arrReposError !== undefined &&
            data.resultdeletehooks.arrReposError !== null &&
            data.resultdeletehooks.arrReposError !== ''){
            if(data.resultdeletehooks.arrReposError.length >0){
              $scope.infoDeleteGitChannel.arrReposError = data.resultdeletehooks.arrReposError;

              console.log("***esto vale en loadInfoDeleteGitChannel data.resultdeletehooks.arrReposError*********");
              console.log($scope.infoDeleteGitChannel.arrReposError);
            }
          }

        }

      }






      $scope.editChannel = function() {



        if($scope.accountDelete.password == undefined ||
          $scope.accountDelete.password == null ||
          $scope.accountDelete.password == ''){
          $scope.messageReloginBadCredentialsModal = "Field password is required.";
        }
        else {
          ChannelService.editChannel($scope.tagGroup.id, $scope.tagChannel.id, $scope.accountDelete.password, $scope.tagChannel.githubUsername, 1)
            .then(function (res) {


              /* hay que meterlo en 1 array */
              console.log("esto vale res de editchannnel");
              console.log(res);

              $scope.initVarsReloginGitDeleteChannelModal();
              $("#reloginGitDeleteChannelModal").modal("hide");

              loadInfoDeleteGitChannel(res);




              $("#deleteChannelWebhooksModal").modal("show");


            }, function (err) {
              console.log("esto vale err de editchannel");
              console.log(err);
              $scope.initVarsReloginGitDeleteChannelModal();
              $scope.modalsError.messageReloginBadCredentialsModal = err.message;
            });
        }








      };



      /******** new ***********/

/********************** end new ******************/

/* podria cambiarlo para hacerlo mas facil en 1 controller aparte */


      /* vale con mandar el nombre de los repos
      * y el login */


      /* esto puede ser solo decir que se ha hecho correctamente */
      /* importante, en este momento reiniciar las variables del canal */

      $scope.createwebhooks = function(){




        /* aqui tenemos los repositorios elegidos
         * campos no sean nulos
         * luego llamamos a createwebhooks con los repos, al servicio */
        console.log("esto vale repos para crear webhooks");

        /* tengo el objeto entero de los repositorios,
        * con el id en el canal sería suficiente */
        console.log($scope.repositorySelected);
        /* mirar el tipo */


        /* si esta vacio mensaje de error */


        if($scope.repositorySelected == null
          || $scope.repositorySelected == undefined
          || $scope.repositorySelected == ''){

          $scope.modalsError.messageNewChannelModalReposEmpty = "Field repositories is required.";
        }
        else if($scope.repositorySelected.length == 0){
          $scope.modalsError.messageNewChannelModalReposEmpty = "Field repositories is required.";
        }

        else{


          console.log("esto vale channel en create webhhoks");
          /* tengo el tipo channelType 'PUBLIC' y channelName */
          console.log($scope.githubchannel);


          /* podemos pasar el token directamente */
          console.log("esto vale account con token");
          /* token, username */
          console.log($scope.account);

          /* no se que tengo en este momento
           * usar token de bd o el actual?? yo tiraría del mismo */



          spinnerService.show('html5spinnerRepos');


          /******** new ***************/

          if($scope.account.username !== undefined &&
            $scope.account.username !== null &&
            $scope.account.username !== '' ){


            GithubService.createwebhooks($scope.account.username,
              $scope.repositorySelected,
              $scope.githubchannel,
              $scope.tagGroup.id).then(
              function(result) {

                console.log("esto vale result");
                console.log(result);

                spinnerService.hide('html5spinnerRepos');

                /* aqui aun no se han borrado las variables */


                /* si ha ido bien, data no es null, arrReposOk y arrReposError existen
                 * y alguno tiene lenght >0
                 * cerrar ventana y abrir la otra
                 * dentro de arrRepos hay item con nombre e id
                 * y res con la respuesta:: code 201
                 * o code 504 timeout */



                /* result.data.data es 1 objeto si */
                if(result.data !== null &&
                  result.data !== undefined){

                  if((result.data.arrReposOk !== null &&
                    result.data.arrReposOk !== undefined)||
                    (result.data.arrReposError !== null &&
                    result.data.arrReposError !== undefined)){
                    /* entonces rellenamos tabla */
                    $scope.arrReposOk = result.data.arrReposOk;
                    $scope.arrReposError = result.data.arrReposError;

                    /* chapamos esta ventana y metemos la otra */
                    $("#newChannelReposModal").modal("hide");

                    /* este solo tiene:
                     * messageNewChannelModal
                     * $scope.arrReposOk
                     * $scope.arrReposError
                     * */
                    $("#newChannelWebhooksModal").modal("show");

                    /* en el caso de que arrReposOk sea vacio volver a atras */
                    /* falta parseo de que no sea vacio la parte de elegir repos */

                  }



                }
                else{
                  /* esto no debería pasar */
                  $scope.modalsError.messageNewChannelModal= "No repositories added to channel. Try again.";
                  /* para este caso volver a atras */

                }




              },
              function(error) {
                // TODO: mostrar error
                console.log("error createhooks");
                console.log(error);

                spinnerService.hide('html5spinnerRepos');
                $scope.modalsError.messageNewChannelModal= error.data.message;

              }
            );

          }
          else{

            console.log("error createhooks no hay username de account");


            spinnerService.hide('html5spinnerRepos');
            $scope.modalsError.messageNewChannelModal= "Field account username missed. " +
              "Please go back and select account again.";

          }



        }


      };






      $scope.chooseaccount = function(){


        removeErrorMessageNewChannelIntegrationModal();
        console.log("entro en chooseaccount");

        /* tenemos
          $scope.accountSelected (.username) (las cuentas que mandamos desde la bd de meanstack)
          $scope.account (si la opcion es other, tenemos esta var (.username, .password)
          $scope.githubchannel

          devolvemos repos sin webhooks
        */


        if($scope.accountSelected.username == 'Other'){

          if($scope.account.username == null || $scope.account.username == '' || $scope.account.username == undefined){
            $scope.modalsError.messageNewChannelUsernameBadCredentialsModal = "Field username is required.";

          }
          else if($scope.account.password == null || $scope.account.password == '' || $scope.account.password == undefined){
            $scope.modalsError.messageNewChannelPassBadCredentialsModal = "Field password is required.";
          }


        }
        else{

          /* miramos si flag existe, de forma que si es true,
          es porque el token de auth falla */

          /* y tiene que rellenar el campo de password */
          if($scope.flag !== undefined && $scope.flag !== null && $scope.flag !== '' ){
            if(($scope.flag.username !== undefined && $scope.flag.username !== null && $scope.flag.username !== '') &&
              $scope.flag.status == true ){

              if(($scope.account.password == null || $scope.account.password == '' || $scope.account.password == undefined) &&
                $scope.flag.username == $scope.account.username){
                $scope.modalsError.messageNewChannelPassBadCredentialsModal = "Field password is required.";

              }


            }

          }

          /* es como si fuera other, hay que mandar el account.username */
          $scope.account.username = $scope.accountSelected.username;





        }


        /* si no hay errores que haga esto */
        if($scope.modalsError.messageNewChannelPassBadCredentialsModal == '' &&
          $scope.modalsError.messageNewChannelUsernameBadCredentialsModal == '' ){


          spinnerService.show('html5spinnerIntegration');


          GithubService.getAuth($scope.account.username, $scope.account.password, $scope.flag).then(
            function(result) {





              /* data.arrRepos[0].id
               data.arrRepos[0].name
               + githubtoken.username: como estas registrado
               *  */

              spinnerService.hide('html5spinnerIntegration');


              $scope.githubrepositories = result.data.arrRepos;
              $scope.account = result.data.githubtoken;

              if($scope.githubrepositories.length == 0){
                $scope.modalsError.messageNewChannelModal= "There are not repositories to add to the channel which you are owner. ";

              }

              $scope.flag= {};

              $("#newChannelIntegrationModal").modal("hide");
              $("#newChannelReposModal").modal("show");


            },
            function(error) {
              // TODO: mostrar error

              console.log("error getAuth");
              console.log(error);



              spinnerService.hide('html5spinnerIntegration');
              /* si el error.status == 401 quitamos esta ventana y ponemos otra */

              if((error.status == 404 && $scope.accountSelected.username !== 'Other')
                || error.status == 503){
                /* ponemos el flag a 1*/
                $scope.flag = { username : $scope.accountSelected.username,
                  status : true };

              }


              $scope.modalsError.messageNewChannelModal= error.data.message;

            });
        }







      };



      /*******************************/



      /* cuando vuelves hacia atras desde elegir los repos */
      function getGithubAccountsBack () {

        removeVarsNewChannelReposModal();


        spinnerService.show('html5spinnerRepos');


        GithubService.getGithubAccounts().then(
          function(data) {


            $scope.githubaccounts = [];

            if(data.data !== null ){
              $scope.githubaccounts = data.data;

            }

            $scope.githubaccounts.push({username:"Other"});
            $scope.accountSelected = $scope.githubaccounts[0];


            spinnerService.hide('html5spinnerRepos');


            $("#newChannelReposModal").modal("hide");
            $("#newChannelIntegrationModal").modal("show");



          },function(err){
            // Tratar el error
            console.log("hay error");
            console.log(err);
            console.log("Hay error al crear canal: " + err.data.message);


            spinnerService.hide('html5spinnerRepos');
            $scope.modalsError.messageNewChannelModal= err.data.message;

          }
        );

      };



      /*******************************/

      function getGithubAccounts () {


        spinnerService.show('html5spinner');
        removeErrormessageNewChannelModal();

        GithubService.getGithubAccounts().then(
          function(data) {


            $scope.githubaccounts = [];


            /* data es null o 1 array de github tokens */
            if(data.data !== null && data.data !== undefined){
              $scope.githubaccounts = data.data;

            }

            $scope.githubaccounts.push({username:"Other"});
            $scope.accountSelected = $scope.githubaccounts[0];


            spinnerService.hide('html5spinner');

            $("#newChannelModal").modal("hide");
            $("#newChannelIntegrationModal").modal("show");



          },function(err){
            // Tratar el error
            console.log("hay error");
            console.log(err);
            console.log("Hay error al crear canal: " + err.data.message);


            spinnerService.hide('html5spinner');
            $scope.modalsError.messageNewChannelModal= err.data.message;

          }
        );

      }





      $scope.createNewChannelAccountBack = function(){


        /* aqui hay que recoger de nuevo las accounts si es other lo elegido */
        /* inicializamos githubrepositories, repositorySelected y messageNewChannel modal */

        removeVarsNewChannelReposModal();

        /* si la opción es other que coja las cuentas de nuevo
        * porque se habra podido loguear anteriormente y
        * se habra añadido otra cuenta */
        if($scope.accountSelected !== null && $scope.accountSelected !== undefined && $scope.accountSelected !== '' ){
          if($scope.accountSelected.username == "Other"){
            getGithubAccountsBack();

          }
          else{
            $("#newChannelReposModal").modal("hide");
            $("#newChannelIntegrationModal").modal("show");

          }
        }
        else{
          getGithubAccountsBack();

        }



      };






      $scope.createNewChannelBack = function(){


        /* quitar lo de esta */
        removeVarsNewChannelIntegrationModal();

        $("#newChannelIntegrationModal").modal("hide");
        $("#newChannelModal").modal("show");


      };





      $scope.createNewChannel = function(){

        if($scope.channel.channelName == '' || $scope.channel.channelName == null || $scope.channel.channelName == undefined){

          removeErrormessageNewChannelModal();
          $scope.modalsError.messageNewChannelNameModal = "Channel Name is required."



        }
        else {

          var enc = false;

          /* miramos si ya coincide con alguno de los que tenemos */
          if ($scope.channel.channelType == 'PRIVATE') {
            /* recorremos el array de canales privados del grupo */
            for (var i = 0; i < $scope.privateChannels.length; i++) {
              if ($scope.privateChannels[i].channelName == $scope.channel.channelName) {
                enc = true;
                i = $scope.privateChannels.length;

              }
            }

          }
          else {
            /* recorremos el array de canales publicos del grupo */
            for (var i = 0; i < $scope.publicChannels.length; i++) {
              if ($scope.publicChannels[i].channelName == $scope.channel.channelName) {
                enc = true;
                i = $scope.publicChannels.length;

              }
            }


          }
          /* si lo ha encontrado error */
          if (enc) {


            removeErrormessageNewChannelModal();
            $scope.modalsError.messageNewChannelNameModal = "Already exists channel with that name.";

          }
          /* sino buscamos accounts si github checked marcado, sino creamos el canal */
          else {

            /* probamos si funciona el radio */
            /* <!-- 0: no service/ 1:github/ 2:scrum  --> */

            console.log("probamos radio");
            console.log($scope.channel.channelService);



            if($scope.channel.channelService == 1){
              /* para integracion con github */
              $scope.githubchannel = $scope.channel;
              getGithubAccounts();

            }
            else{
              /* para el resto de integraciones */
              ChannelService.createNewChannel($scope.groupid, $scope.channel).then(
                function(data) {
                  $("#newChannelModal").modal("hide");

                  /*$scope.removeInputChannelName();*/
                  /*$scope.modalsError.messageNewChannelModal= '';*/
                  $scope.initVarsNewChannelModal();
                  console.log("se crea el nuevo canal");

                },function(err){
                  // Tratar el error
                  console.log("Hay error al crear canal: " + err.data.message);
                  /*$scope.removeInputChannelName();*/
                  $scope.initVarsNewChannelModal();
                  $scope.modalsError.messageNewChannelModal= err.data.message;

                });


            }

          }


        }/* nombre no es vacio */

      };




      /*************************************************************/




      $scope.deleteChannel = function(){



        ChannelService.deleteChannel($scope.tagGroup.id,$scope.tagChannel.id).then(
          function(data) {
            console.log("Delete channel OK");
            $("#deleteChannelModal").modal("hide");



            // Emitimos evento de desconexión a canales
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.tagChannel='';

            console.log("esto vale data en deletechannel");
            console.log(data);


            if(data.data.resultdeletehooks != undefined &&
              data.data.resultdeletehooks != null &&
              data.data.resultdeletehooks != ''){
              loadInfoDeleteGitChannel(data.data);

              $("#deleteChannelWebhooksModal").modal("show");

            }




          },function(err){
            // Tratar el error
            console.log("Hay error en delete channel: " + err.data.message);

            $("#deleteChannelModal").modal("hide");



            console.log(err);
            /* si es error 401 y el canal es tipo github y url_documentation */

            if(err.status == 401 && err.data.service == "github"){

              console.log("es error de github");

                /*tengo que hacer una modal de logueo, se que esa modal es para borrar */
                $scope.initVarsReloginGitDeleteChannelModal();
                $("#reloginGitDeleteChannelModal").modal("show");






            }
            else{
              $("#reloginGitDeleteChannelModal").modal("hide");
              $scope.errorG = err.data.message;
              $("#errorGroupModal").modal("show");

            }



          });




      };



      $scope.addUserToChannel = function(member, ind){
        ChannelService.addUserToChannel($scope.groupid,$scope.channelid,member.id).then(
          function(data) {

          	/* si añadimos un miembro nuevo y es privado */
          	/* hay que quitarlo de membersettings */
            console.log("Ok add user to channel");
            //$("#addUserToChannelModal").modal("hide");
            console.log(member);

            /* option == 1 add*/
            if($scope.optionchannel == 1){
            	$scope.membersSettingschannel.splice(ind, 1);
            }



            $scope.channelMembers.push(member);
            $scope.tagChannel.users.push(member);


          },function(err){
            console.log("Error en add user to channel: " + err.data.message);
            $scope.errorG = err.data.message;
            $("#errorGroupModal").modal("show");

          }
        );
      };


      $scope.deleteUserFromChannel = function(member, ind){
        ChannelService.deleteUserFromChannel($scope.groupid,$scope.channelid,member.id).then(
          function(data) {

            console.log("Ok delete user from channel");
            console.log(member);
            //$("#deleteUserFromChannelModal").modal("hide");
            if($scope.optionchannel == 2){
            	$scope.membersSettingschannel.splice(ind, 1);

            }


          },function(err){
            console.log("Hay error en delete user from channel: " + err.data.message);
            $scope.errorG = err.data.message;
            $("#errorGroupModal").modal("show");


          }
        );
      };



      $scope.unsuscribeFromChannel = function(){
        ChannelService.unsubscribeFromChannel($scope.tagGroup.id,$scope.tagChannel.id).then(
          function(data) {

          	$("#unsuscribeFromChannelModal").modal("hide");
          	if($scope.tagChannel.type == 'private'){

          		var ind = $scope.privateChannels.indexOf($scope.tagChannel);
	            if(ind > -1){
	            	console.log("unsuscribe ok");
	            	$scope.privateChannels.splice(ind,1);
	            }
          	}

            // Emitimos evento de desconexión a canales
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.tagChannel='';
            $scope.channelSelected = false;

          },function(err){
            // Tratar el error
            console.log("Hay error en unsuscribe from channel: " + err.data.message);
            /*$scope.messageUnsuscribeFromChannelModal = err.data.message;*/
            /**/
            // Emitimos evento de desconexión a canales
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
            $scope.tagChannel='';
            $scope.errorG = err.data.message;
            $("#unsuscribeFromChannelModal").modal("hide");
            $("#errorGroupModal").modal("show");


          }
        );
      };


      /************* new ************/
      $scope.getChannelsForNotification = function (group) {
        ProfileService.getChannels(group.id)
          .then(function (data) {
            console.log("esto vale data en getChannelsForNotification");
            console.log(data);

            group.notificationsCount = 0;

            if(data.privateChannels !== undefined){
              group.privateChannels = data.privateChannels;

            }
            if(data.publicChannels !== undefined){
              group.publicChannels = data.publicChannels;

            }
            if(data.directChannels !== undefined){
              group.directChannels = data.directChannels;

            }



          },function (err) {
            // Tratar el error
            console.log("Hay error");
            console.log(err.message);
            $scope.errorG = err.message;
            $("#errorGroupModal").modal("show");


          });
      };




      $scope.getChannels = function (group) {
        ProfileService.getChannels(group.id)
          .then(function (data) {

            $scope.privateChannels = data.privateChannels;


            console.log("esto vale privatechannels");
            console.log($scope.privateChannels);

            $scope.publicChannels = data.publicChannels;
            console.log("esto vale publicChannels");
            console.log($scope.publicChannels);

            $scope.directChannels = data.directMessageChannels;
            $scope.adminGroup = data.admin;


            updateAllNotificationsWithSelectGroup(group);


          },function (err) {
            // Tratar el error
            console.log("Hay error");
            console.log(err.message);
            $scope.errorG = err.message;
          	$("#errorGroupModal").modal("show");

          });
      };



    $scope.getChannelMembers = function () {

      ProfileService.getChannelMembers($scope.channelid)
        .then(function (data) {

          for (var i = 0; i < data.users.length; i++ ) {
          	data.users[i].hash = $scope.getHash(data.users[i].mail);

          }
          $scope.channelMembers = data.users;

          $scope.adminChannel = data.admin;
          $scope.membersSettingschannel = data.users;


          if($scope.tagChannel !== undefined && $scope.tagChannel !== null && $scope.tagChannel !== '') {
            if ($scope.tagChannel.scrum) {
              initVarsScrumChannelTeamPre();

            }
          }




        }
        , function (err) {
          // Tratar el error
          console.log("Error on getChannelMembers: " + err.message);
          console.log(err.message);
          $scope.error = err.message;

        });
    };

    $scope.getGroupMembers = function (group) {

      ProfileService.getGroupMembers(group.id)
        .then(function (data) {

            $scope.members = data;

            for (var i = 0; i < data.length; i++ ) {
                data[i].hash = $scope.getHash(data[i].mail);

            }
            $scope.membersSettings = data;

        }
        , function (err) {
          // Tratar el error
          console.log("Hay error");
          console.log(err.message);
          $scope.errorG = err.message;
          $("#errorGroupModal").modal("show");

        });
    };



    $scope.getHash = function (str) {
      if (str)
        return md5.createHash(str);
      else
        return "";
      };


    $scope.setSettingsOptions = function (option) {
      /* 0 to search users
         1 to add users
         2 to remove users
      */
      $scope.option = option;

      if(option == 1) {
          getSystemUsers($scope.tagGroup);
          $scope.option = option;
          $scope.searchinputplaceholder = "Search user to add and click on it ...";
      }
      else {

          $scope.membersSettings = $scope.members;

          $scope.option = option;
          if(option == 2){
          	   $scope.searchinputplaceholder = "Search member to remove and click on it ...";
          }
          else {
               $scope.searchinputplaceholder = "Search member ...";
          }
      }
    };

    $scope.setSettingsOptionschannel = function (option) {
      /* 0 to search users
         1 to add users
         2 to remove users
      */
      $scope.optionchannel = option;
      if(option == 1) {
      	  /* search users of group to add */
      	  /* coger los que estan en el grupo y quitar los del canal */
      	  /* scope.members = miembros del grupo */
      	  /* scope.channelmembers = miembros del canal */
      	  var temp = $scope.members.slice();
      	  var indi = -1;
      	  for (var i = 0; i < $scope.members.length; i++ ) {
      	  	//console.log()
      	  	for (var j = 0; j < $scope.channelMembers.length; j++ ) {
              if($scope.members[i].mail == $scope.channelMembers[j].mail){
                indi = temp.indexOf($scope.members[i]);
                if (indi > -1){
                  temp.splice(indi,1);
                }
                j = $scope.channelMembers.length;

              }
            }

      	  }
      	  $scope.membersSettingschannel = temp;
          $scope.option = option;
          $scope.searchinputplaceholder = "Search user to add and click on it ...";


      } else {
          $scope.membersSettingschannel = $scope.channelMembers;

          $scope.option = option;
          if(option == 2){
            $scope.searchinputplaceholder = "Search member to remove and click on it ...";
          } else {
            $scope.searchinputplaceholder = "Search member ...";
          }
      }
    };

    function getSystemUsers(group) {
            ProfileService.getSystemUsers(group.id)
            .then(function (data) {
              /* para coger usuarios que no estan en el grupo y si en el sistema,
                 y marcar los ya invitados
              */
                var temp = data;
                for (var i = 0; i < $scope.members.length; i++ ) {
                  for (var j = 0; j < data.length; j++ ) {
                        if($scope.members[i].mail == data[j].mail){
                            temp.splice(j,1);
                            j = data.length;
                        }
                  }
                }
                for (var k = 0; k < data.length; k++ ) {
                  //temp[i].color = getRandomColor();
                  temp[k].hash = $scope.getHash(temp[k].mail);
                  temp[k].isinvited = 0;
                }
                GroupService.getInvitedUsers(group.id).then(function (data2) {
                    for (var i = 0; i < data2.length; i++ ) {
                      for (var j = 0; j < temp.length; j++ ) {
                            if(data2[i].mail == temp[j].mail){
                                temp[j].isinvited = 1;
                            }
                      }
                    }
                    $scope.membersSettings = temp;
                },function (err) {
                  // Tratar el error
                  console.log("Hay error");
                  console.log(err.message);
                  $scope.errorG = err.message;
                  $("#errorGroupModal").modal("show");
                });
            }
            , function (err) {
              // Tratar el error
              console.log("Hay error");
              console.log(err.message);

              $scope.errorG = err.message;
              $("#errorGroupModal").modal("show");

            });
    }


    $scope.getMessages = function (channel) {
      // Al pintarlos utilizamos $storage.id
      $scope.$storage = $localStorage;
      var data = {
        userid: $localStorage.id,
        groupid: $scope.groupid,
        channelid: channel.id
      };
      ChatService.getMessages(data).then(
        function(result) {

          for(var i = 0; i < result.data.length; i++){
            if(result.data[i].messageType == 'URL'){
              result.data[i].visible = 0;
            }

            if($scope.tagChannel.scrum){
              result.data[i].visible = 0;

            }







          }
          $scope.listaMensajes = result.data;

          console.log("esto vale $scope.listaMensajes");
          console.log($scope.listaMensajes);



        },
        function(error) {
          // TODO: mostrar error
          console.log("error getMessages");
          console.log(error);
        }
      );
    };



      $scope.newAnswer = function (messageid) {
        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/answerModal.html',
          controller: 'answerModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.groupid,
                channelid: $scope.channelid,
                messageid: messageid
              }
            }
          }
        });

      };



      $scope.confirmUploadFile = function () {

        //entra desde aqui para el arrastre de ficheros en la pantalla
        console.log("entro en confirmUploadFile");
        console.log($scope.file);

        if($scope.file == undefined || $scope.file ==''){
          console.log("no existe");

        }

        else{

            var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/uploadModal.html',
            controller: 'uploadModalCtrl',
            resolve: {
              data: function () {
                return {
                  groupid: $scope.groupid,
                  channelid: $scope.channelid,
                  file: $scope.file
                }
              }
            }
          });

          modalInstance.result.then(function () {
              $scope.file="";
            },function () {
              $scope.file="";
            }
          );

        }


      };




      $scope.openFileModal = function () {
        console.log("entro en openFileModal");
        console.log($scope.file);

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/openFileModal.html',
          controller: 'openFileModalCtrl',
          resolve: {
            data: function () {

               return {

               groupid: $scope.groupid,
               channelid: $scope.channelid

               }
            }
          }
        });

        modalInstance.result.then(function () {
            //$scope.file="";
          console.log("salgo por .then de la modal");
          },function () {
          //$scope.file="";

          }
        );
      };



      $scope.$watch('file', function () {

        /* esto es lo primero que hace */

        if($scope.file !== undefined && $scope.file !== null && $scope.file !== ''){

          if($scope.file.length){
            if($scope.file.length > 1){

              var temfilepath = $scope.file[0].path;
              var temfilepath2 = temfilepath.split('/');
              $scope.filepath = temfilepath2[0];

              $("#errorFileIsFolder").modal("show");


            }
            else{
              $scope.upload($scope.file);

            }
          }
          else{
            $scope.upload($scope.file);

          }



        }

      });




      $scope.log = '';
      $scope.upload = function (file) {


        if (file) {
            if (!file.$error) {


              $scope.filename = file.name;
              $scope.uploading = false;
              $scope.errors = false;
              $scope.confirmUploadFile();

            }
          }

      };





      $scope.changeVisible = function (msg,$index) {


        if($scope.listaMensajes[$index].visible == 0){

          $scope.getMetaTags(msg, $index);
          $scope.listaMensajes[$index].visible = 1;



        }
        else{
          $scope.listaMensajes[$index].visible = 0;

        }
        console.log($scope.listaMensajes[$index].visible );

      };


      $scope.changeVisibleDetails = function ($index) {
        if($scope.listaMensajes[$index].visible == 0){

          $scope.listaMensajes[$index].visible = 1;



        }
        else{
          $scope.listaMensajes[$index].visible = 0;

        }
        console.log($scope.listaMensajes[$index].visible );

      }




      $scope.getMetaTags = function (msg, $index) {
        var url = msg.text;

        //si ya lo tiene no hacemos la peticion al servidor, solo el htmlbind
        // de momento que no haga nada

        if ($scope.listaMensajes[$index].response_data_url === undefined) {


          var data = {
            userid: $localStorage.id,
            url: url
          };


          ChatService.getMetaTags(data).then(
            function (result) {


              if (result == null) {
                /* si la url no esta soportada */
                console.log("hay error al coger los metadatos");
                $scope.listaMensajes[$index].response_data_url = $sce.trustAsHtml("<h3> No information available </h3>");
              }
              else {
                /* sino tiene tipo es 1 link */
                if (typeof (result.type) == 'undefined') {
                  /* 1 link puede tener imagen o no */

                  var image = '';
                  var tittle = '';
                  var descrip = '';
                  var author_link = '';
                  var keywords = '';

                  if (typeof (result.title) !== 'undefined') {
                    tittle = "<h3>" + result.title + "</h3>";

                  }

                  if (typeof (result.description) !== 'undefined') {
                    descrip = "<p>" + result.description + "</p>";

                  }

                  if (typeof (result.author) !== 'undefined') {
                    author_link = "<p>From " + result.author + "</p>";

                  }

                  if (result.keywords.length > 0) {
                    for (var i = 0; i < result.keywords.length; i++) {
                      keywords = keywords + "<p><span class='label label-info'>" + result.keywords[i] + "</span></p>";

                    }

                  }


                  if (typeof (result.image) !== 'undefined') {
                    image = "<img src=" + result.image + ">";

                  }

                  $scope.listaMensajes[$index].response_data_url = $sce.trustAsHtml(tittle +
                    descrip +
                    author_link +
                    keywords +
                    image);


                }/* end if typeof (result.type) == 'undefined' */
                /* es 1 video, audio, etc. */
                else {
                  /* si es video = html
                   * si es foto url para src de img
                   * si es rich = html */

                  var author = '';
                  var html_img = '';
                  var title2 = '';
                  var provider = '';

                  if (typeof (result.title) !== 'undefined') {
                    title2 = "<h3>" + result.title + "</h3>";
                  }


                  if (typeof (result.provider_name) !== 'undefined') {
                    provider = "<p>" + result.provider_name + "</p>";
                  }


                  if (typeof (result.author_name) !== 'undefined') {
                    author = "<p> From " + result.author_name + "</p>";
                  }


                  if (result.type == 'video' || result.type == 'rich') {
                    html_img = result.html;
                  }

                  else if (result.type == 'photo') {
                    html_img = "<img src=" + result.url + ">";
                  }

                  $scope.listaMensajes[$index].response_data_url = $sce.trustAsHtml(title2 +
                    provider +
                    author +
                    html_img);


                }
                /* end else typeof (data.type) == 'undefined' */

              }


              $scope.gotoAnchor(msg.id);


            },
            function (error) {
              // TODO: mostrar error
              console.log("error getMetaTags");
              console.log(error);
            }
          );


        } /* end if of $scope.listaMensajes[$index].response_data_url === undefined */


      };





      function findUrls( text )
      {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        // Regular expression to find FTP, HTTP(S) and email URLs.
        var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

        // Iterate through any URLs in the text.
        while( (matchArray = regexToken.exec( source )) !== null )
        {
          var token = matchArray[0];
          urlArray.push( token );
        }

        return urlArray;
      }






      $scope.sendText = function () {
        console.log("enviamos texto");
        console.log($scope.textchat);
        if ($scope.textchat) {
          var data = {
            userid: $localStorage.id,
            groupid: $scope.groupid,
            channelid: $scope.channelid,
            text: $scope.textchat,
            messageType: 'TEXT'
          };


          var tempdata = $scope.textchat.slice();
          var arrayurls = findUrls(tempdata);
          var atempdata = tempdata.split(" ");


          /* si no hay urls se manda el mensaje */
          if (arrayurls.length == 0) {
            ChatService.postMessage(data).then(
              function (result) {
                $scope.textchat = null;
              },
              function (error) {
                // TODO: Mostrar error
                console.log("Error en postMessage");
                console.log(error);
              }
            );

          }
          /* si hay urls pero es lo uniko */
          else {
            if (atempdata.length == 1) {
              //console.log("solo 1 url");
              data.messageType = 'URL';
              ChatService.postMessage(data).then(
                function (result) {
                  $scope.textchat = null;
                },
                function (error) {
                  // TODO: Mostrar error
                  console.log("Error en postMessage");
                  console.log(error);
                }
              );


            }
            /* si hay de tod0: texto y urls  */
            else {

              var sortarrayall = [];
              var texttemp = '';
              var indexsortarrayall = 0;
              var indexurls = 0;

              /* para cada obj mirar si es o no url
               * sino lo es: lo vamos metiendo tod0 en 1 var temporal
               * si lo es, hacemos push de la temporal y luego de la url */


              for (var i = 0; i < atempdata.length; i++) {

                if (atempdata[i] == arrayurls[indexurls]) {
                  /* metemos lo anterior si hay, y sino la url */

                  if (texttemp !== '') {
                    var objdata = {};
                    objdata.text = texttemp;
                    objdata.messageType = 'TEXT';
                    sortarrayall[indexsortarrayall] = objdata;
                    texttemp = '';
                    indexsortarrayall++;

                  }
                  var objdata = {};
                  objdata.text = atempdata[i];
                  objdata.messageType = 'URL';
                  sortarrayall[indexsortarrayall]= objdata;
                  indexsortarrayall++;
                  indexurls++;


                }
                else {
                  //si es la ultima posicion en el for y no es url, meterlo en el array

                  if(i == atempdata.length-1 && atempdata[i] !== ''){
                    var objdata = {};

                    texttemp = texttemp + atempdata[i] + " ";
                    objdata.text = texttemp;
                    objdata.messageType = 'TEXT';
                    sortarrayall[indexsortarrayall] = objdata;
                    texttemp = '';

                    indexsortarrayall++;


                  }
                  texttemp = texttemp + atempdata[i] + " ";

                }

              }

              /* ahora que tenemos los campos a modificar y enteros
               los mandamos*/

              angular.forEach(sortarrayall, function(value, key) {


                var data = {
                  userid: $localStorage.id,
                  groupid: $scope.groupid,
                  channelid: $scope.channelid,
                  text: value.text,
                  messageType: value.messageType
                };

                console.log("esto envio desde el controlador");
                console.log("con index " + key);
                console.log(data.text);
                console.log(data.messageType);
                console.log("********************");

                ChatService.postMessage(data).then(
                  function (result) {
                    $scope.textchat = null;
                  },
                  function (error) {
                    // TODO: Mostrar error
                    console.log("Error en postMessage");
                    console.log(error);
                  }
                );


              });


            } /* end else:hay urls y texto normal */

          } /*end else arrayurls.length == 0 */
        }

      };




      function updateAllNotificationsWithSelectGroup(group){


        for( var i = 0; i < $scope.groups.length; i++){

          /* buscamos en el scope que esta completo, el grupo que hemos seleccionado nuevo */
          if($scope.groups[i].id == group.id) {

            if ($scope.groups[i].notificationsCount !== undefined) {

              /* hay notificaciones asociadas al grupo, luego hay notificaciones de canal */
              if ($scope.groups[i].notificationsCount > 0) {
                /* recorremos todos los canales */


                var sumChannelsNotifications = 0;
                var sumDirectChannelsNotifications = 0;

                /* primero publicos */

                if($scope.groups[i].publicChannels !== undefined){
                  for (var j = 0; j < $scope.groups[i].publicChannels.length; j++) {

                    if ($scope.groups[i].publicChannels[j].notificationsCount !== undefined) {
                      if ($scope.groups[i].publicChannels[j].notificationsCount > 0) {
                        /* hay que buscarlo en el $scope */
                        for (var k = 0; k < $scope.publicChannels.length; k++) {

                          if ($scope.groups[i].publicChannels[j].id == $scope.publicChannels[k].id) {
                            $scope.publicChannels[k].notificationsCount = $scope.groups[i].publicChannels[j].notificationsCount;
                            sumChannelsNotifications = sumChannelsNotifications + $scope.publicChannels[k].notificationsCount;


                          }
                        }
                      }

                    }

                  } /* end for publicos */

                }


                if($scope.groups[i].privateChannels !== undefined){
                  /* privados */
                  for (var j = 0; j < $scope.groups[i].privateChannels.length; j++) {

                    if ($scope.groups[i].privateChannels[j].notificationsCount !== undefined) {

                      if ($scope.groups[i].privateChannels[j].notificationsCount > 0) {
                        /* hay que buscarlo en el $scope */
                        for (var k = 0; k < $scope.privateChannels.length; k++) {

                          if ($scope.groups[i].privateChannels[j].id == $scope.privateChannels[k].id) {
                            $scope.privateChannels[k].notificationsCount = $scope.groups[i].privateChannels[j].notificationsCount;
                            sumChannelsNotifications = sumChannelsNotifications + $scope.privateChannels[k].notificationsCount;


                          }
                        }
                      }

                    }

                  }
                  /* end for privateChannels */

                }


                if($scope.groups[i].directChannels !== undefined){

                  /* directos  */
                  for (var j = 0; j < $scope.groups[i].directChannels.length; j++) {
                    if ($scope.groups[i].directChannels[j].notificationsCount !== undefined) {

                      if ($scope.groups[i].directChannels[j].notificationsCount > 0) {
                        /* hay que buscarlo en el $scope */
                        /* members[x].notificationsCount */
                        /* $scope.groups[i].directMessageChannels[j], esto estaria bien que tuviera el id del usuario */


                        for (var k = 0; k < $scope.members.length; k++) {

                          if ($scope.groups[i].directChannels[j].user.id == $scope.members[k].id && $scope.members[k].id !== $localStorage.id) {


                            $scope.members[k].notificationsCount = $scope.groups[i].directChannels[j].notificationsCount;
                            sumDirectChannelsNotifications = sumDirectChannelsNotifications + $scope.members[k].notificationsCount;


                          }
                        }
                      }

                    }

                  } /* end for directChannels */

                }




                $scope.channelsNotificationsCount = sumChannelsNotifications;
                $scope.directChannelsNotificationsCount = sumDirectChannelsNotifications;


              }/* end if hay notificaciones en el grupo */

              /* si no las hay, hay que actualizar las notificaciones de canal a 0 */
              else{
                $scope.channelsNotificationsCount = 0;
                $scope.directChannelsNotificationsCount = 0;
              }

            } /* end if ($scope.groups[i].notificationsCount !== undefined) */
            else{
              $scope.groups[i].notificationsCount = 0;
              $scope.channelsNotificationsCount = 0;
              $scope.directChannelsNotificationsCount = 0;

            }


          } /* end el grupo que estamos recorriendo coincide con el grupo del mensaje */

        } /* nos recorremos los grupos */

      }



      $scope.selectGroup= function (group, ind) {
        $scope.classResalt= "textitalic";


        $scope.groupid=group.id;
        $scope.groupindex = ind;
        $scope.option="";


        /* aqui dentro llamamos a modificar notificaciones */
        $scope.getChannels(group);
        $scope.getGroupMembers(group);

        $scope.tagGroup=group;

        console.log("ESTO VALE TAGGROUP********");
        console.log($scope.tagGroup);
        $scope.channelSelected = false;


        console.log("ha llamado disconnect de channel");
        Socket.emit('disconnectChannel');
        $scope.tagChannel='';


        Socket.emit('selectGroup', { 'groupid': group.id, 'userid': $localStorage.id } );






      };

      $scope.selectUser= function (user) {
        $scope.selectedUser=user.id;
      };




      function updateAllNotificationsWithSelectChannel( channel, type ){

        /* recorremos los grupos del scope */
        for (var j=0; j<$scope.groups.length; j++){


          /* si el grupo que recorremos es = al que nos encontramos */
          if ($scope.groups[j].id == $scope.tagGroup.id){

            var notificationsCount = 0;

            /* miramos el tipo del canal */
            if(type == "public"){

              /* miramos dentro de los canales, cual coincide con el seleccionado */
              for (var k = 0; k < $scope.groups[j].publicChannels.length; k++){

                if( $scope.groups[j].publicChannels[k].id ==  channel.id){

                  /* miramos si tiene notificaciones */
                  if($scope.groups[j].publicChannels[k].notificationsCount !== undefined){

                    if($scope.groups[j].publicChannels[k].notificationsCount > 0){
                      notificationsCount = $scope.groups[j].publicChannels[k].notificationsCount;


                      /* para notificaciones de canal concreto */
                      $scope.groups[j].publicChannels[k].notificationsCount = 0;


                    }

                  }

                }

              } /* end of for recorrer los canales concretos */


              /* ahora hay que cambiar la del scope */
              for (var l = 0; l < $scope.publicChannels.length; l++){
                if($scope.publicChannels[l].id ==  channel.id){
                  $scope.publicChannels[l].notificationsCount = 0;


                }

              }




            }
            else if(type == "private"){


              /* miramos dentro de los canales, cual coincide con el seleccionado */
              for (var k = 0; k < $scope.groups[j].privateChannels.length; k++){
                if( $scope.groups[j].privateChannels[k].id ==  channel.id){
                  /* miramos si tiene notificaciones */
                  if($scope.groups[j].privateChannels[k].notificationsCount !== undefined){
                    if($scope.groups[j].privateChannels[k].notificationsCount > 0){
                      notificationsCount = $scope.groups[j].privateChannels[k].notificationsCount;


                      /* para notificaciones de canal concreto */
                      $scope.groups[j].privateChannels[k].notificationsCount = 0;


                    }

                  }

                }


              } /* end of for recorrer los canales concretos */

              /* ahora hay que cambiar la del scope */
              for (var l = 0; l < $scope.privateChannels.length; l++){
                if($scope.privateChannels[l].id ==  channel.id){
                  $scope.privateChannels[l].notificationsCount = 0;


                }

              }


            }
            /* es 1 canal directo */
            else {

              /* los canales directos pueden no estar creados */

              if( $scope.groups[j].directChannels !== undefined){


                /* miramos dentro de los canales, cual coincide con el seleccionado */
                for (var k = 0; k < $scope.groups[j].directChannels.length; k++){
                  if( $scope.groups[j].directChannels[k].id ==  channel.id){
                    /* miramos si tiene notificaciones */


                    if($scope.groups[j].directChannels[k].notificationsCount !== undefined){
                      if($scope.groups[j].directChannels[k].notificationsCount > 0){
                        notificationsCount = $scope.groups[j].directChannels[k].notificationsCount;


                        /* para notificaciones de canal concreto */
                        $scope.groups[j].directChannels[k].notificationsCount = 0;



                      }

                    }


                  }


                } /* end of for recorrer los canales concretos */

              }/* los canales directos son undefined */


              if( $scope.members !== undefined){
                /* ahora hay que cambiar la del scope */
                for (var l = 0; l < $scope.members.length; l++){


                  for(var m = 0; m < channel.users.length; m++){
                    if($scope.members[l].id ==  channel.users[m]){
                      $scope.members[l].notificationsCount = 0;

                  }

                  }

                }

              }



            } /* end else: es 1 canal directo */



            /* para notificaciones generales, esto tiene que ser fuera del if del type */
            $scope.groupsNotificationsCount = $scope.groupsNotificationsCount - notificationsCount;


            /* hay que mirar si es directo o no */
            if(type == "DIRECT"){

              $scope.directChannelsNotificationsCount = $scope.directChannelsNotificationsCount - notificationsCount;

            }
            else {
              $scope.channelsNotificationsCount = $scope.channelsNotificationsCount - notificationsCount;

            }

            /* para notificaciones de grupo concreto, se hace fuera de los if, no influye el tipo de canal */
            $scope.groups[j].notificationsCount = $scope.groups[j].notificationsCount - notificationsCount;



          } /* end of if el grupo es el mismo que el del que nos encontramos */

        } /* en for recorrer grupos */

      }



      function changeItalicChannelName (type) {
        if(type == "public"){
          $scope.classResaltChannelPublic = "textitalic";
          $scope.classResaltChannelPrivate = "textnormal";
          $scope.classResaltDirect = "textnormal";

        }
        else if (type == "private"){

          $scope.classResaltChannelPublic = "textnormal";
          $scope.classResaltChannelPrivate = "textitalic";
          $scope.classResaltDirect = "textnormal";

        }
        else {
          $scope.classResaltChannelPublic= "textnormal";
          $scope.classResaltChannelPrivate = "textnormal";
          $scope.classResaltDirect = "textitalic";
        }
      };





      $scope.selectChannel = function (channel, type) {

        /* ponemos a cursiva el canal seleccionado */
        changeItalicChannelName(type);

        /* miramos el tagChannel ANTERIOR, si es scrum == true, inicializamos variables */
        if($scope.tagChannel !== undefined && $scope.tagChannel !== null && $scope.tagChannel !== ''){
          if($scope.tagChannel.scrum){
            initVarsScrumChannel();

          }
        }


        $scope.channelid=channel.id;
        $scope.tagChannel=channel;
        $scope.tagChannel.type = type;


        console.log("esto vale tagChannel despues de selectChannel");
        console.log($scope.tagChannel);


        /* si selecciona un canal por defecto le salga la conversacion, no los settings */
        $scope.activeChannelSettings = 0;
        $scope.channelSelected = true;

        $scope.getChannelMembers();
        $scope.getMessages(channel);


        /* si el canal actual es scrum recogemos userstories, sprints e issues */
        if($scope.tagChannel !== undefined && $scope.tagChannel !== null && $scope.tagChannel !== ''){
          if($scope.tagChannel.scrum){
            getUserstories();
            getSprints();
            getIssues();
          }
        }


        /* Emitimos evento de selecion de canal para recibir nuevos mensajes */
        console.log("ha llamado disconnect de channel");
        Socket.emit('selectChannel', { 'channelid': channel.id , 'userid': $localStorage.id} );


        updateAllNotificationsWithSelectChannel(channel, type);










      };



    $scope.getDownloadLink = function (msg, ev) {

      ev.preventDefault();

      // Datos del fichero que queremos descargar
      var data = {
        userid: msg.user.id,
        groupid: $scope.groupid,
        channelid: $scope.channelid,
        filename: msg.filename
      };

      ChatService.getDownloadUrl(data).then(
        function (result) {
          $window.location.href=result.data.url;


        },
        function (error) {
          // TODO: Mostrar error
          console.log("Error en getDownloadUrl");
          console.log(error);
        }
      );

    };

    $scope.isConnected = function (userid) {
      var ret = false;
      if ($scope.listaUsuariosConectados[userid]) {
        ret = true;
      }
      return ret;
    };

      $scope.getDirectChannelId = function (member) {
        var channel = ChannelService.searchDirectChannel($localStorage.id, member, $scope.directChannels);
        if (channel != null) {
          return channel.id;
        }
        else {
          return 0;
        }
      };

    $scope.searchDirectChannel = function (member) {

      var userid = $localStorage.id;
      var groupid = $scope.groupid;
      var directChannels = $scope.directChannels;

      /*$scope.classResaltDirect = "textitalic";*/
      $scope.tagMember = member;

      var channel = ChannelService.searchDirectChannel(userid, member, directChannels);
      if (channel != null) {
        $scope.selectChannel (channel, 'DIRECT');
      }
      else {
        ChannelService.createDirectChannel(userid, $scope.username, member, groupid)
          .then ( function (channel) {
            $scope.directChannels.push({
              id: channel.id,
              channelName: channel.channelName,

              /* los inicializa */
              channelNotificationsCount: 0,
              //channelNotifications: [],
              users: [channel.users[0].id, channel.users[1].id ]
            });

            $scope.selectChannel (channel, 'DIRECT');
        },
        function (err) {
          // Tratar el error
          console.log("Error al crear el canal para mensajes directos");
          console.log(err.message);
          $scope.error = err.message;
        })
      }



    };



/* no van a salir mensajes xq no tengo serviceType, habria que cambiar bd*/
      /* valdria con mirar que es de tipo github */
    $scope.isGithubMessage = function ($index) {
      if(typeof ($scope.listaMensajes[$index].user) !== undefined){
        //console.log($scope.listaMensajes[$index].text);
        if ($scope.listaMensajes[$index].user.mail == INTERNAL_USER
            && $scope.listaMensajes[$index].messageType == 'TEXT'
            && $scope.listaMensajes[$index].serviceType == 'GITHUB') {

          /* esto de momento para hacer bien los parseos */


          /* lo de arriba descomentar cuando la bd este bien */
          return true;
        }
      }

      return false;
    };





      $scope.isInternalComment = function ($index) {

        var enc = false;

        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' &&
          $scope.tagIssue !== undefined &&
          $scope.tagIssue !== null &&
          $scope.tagIssue !== '' ){
          if($scope.rowCollectionIssues[$scope.tagIssue] !== undefined &&
            $scope.rowCollectionIssues[$scope.tagIssue] !== null &&
            $scope.rowCollectionIssues[$scope.tagIssue] !== '') {

            if ($scope.rowCollectionIssues[$scope.tagIssue].comments !== undefined &&
              $scope.rowCollectionIssues[$scope.tagIssue].comments !== null &&
              $scope.rowCollectionIssues[$scope.tagIssue].comments !== '' &&
              $scope.rowCollectionIssues[$scope.tagIssue].comments.length > 0) {

              if ($scope.rowCollectionIssues[$scope.tagIssue].comments[$index] !== undefined &&
                $scope.rowCollectionIssues[$scope.tagIssue].comments[$index] !== null &&
                $scope.rowCollectionIssues[$scope.tagIssue].comments[$index] !== '') {

              }
              if ($scope.rowCollectionIssues[$scope.tagIssue].comments[$index].user !== undefined &&
                $scope.rowCollectionIssues[$scope.tagIssue].comments[$index].user !== null &&
                $scope.rowCollectionIssues[$scope.tagIssue].comments[$index].user !== '') {

                if($scope.rowCollectionIssues[$scope.tagIssue].comments[$index].user.mail == INTERNAL_USER){


                  enc = true;
                }
              }
            }
          }
        }
        console.log("esto vale si es o no internal user ");
        return enc;
      };







    $scope.isScrumMessage = function ($index) {
      if( $scope.listaMensajes[$index].user.mail == INTERNAL_USER
        && $scope.listaMensajes[$index].messageType == 'TEXT'
        && $scope.listaMensajes[$index].serviceType == 'SCRUM'){

        console.log("esto vale scrum mensaje sin parsear");
        console.log($scope.listaMensajes[$index].text);
        return true;

      }

      return false;
    };

      /* ha estos metodos les llamo desde scrumparseservice */

      $scope.viewUserProfile = function (userid){
        console.log("esto vale user id en viewUserProfile");
        console.log(userid);
      };



      /* esto hay que cambiarlo */
      $scope.viewSprint = function (sprintid){
        console.log("esto vale sprint id en viewSprint");
        console.log(sprintid);

        /* inicializamos variable y metemos sprint.id en tagSprint */

        var sprintTemp;
        for (var i = 0; i < $scope.rowCollectionSprints.length; i++) {

          if ($scope.rowCollectionSprints[i].id == sprintid) {
            sprintTemp = $scope.rowCollectionSprints[i];
            i = $scope.rowCollectionSprints.length;


          }
        }

        if(sprintTemp !== undefined &&
          sprintTemp !== null &&
          sprintTemp !== '') {
          if (sprintTemp.id !== undefined &&
            sprintTemp.id !== null &&
            sprintTemp.id !== '') {

            $scope.initVarsAndSelectOptionsScrumMenu(3);
            $scope.tagSprint = sprintTemp;


            console.log("en elmetodo desde el timeline esto vale sprint");
            console.log($scope.tagSprint);




          }
          else {
            toastr.error('Sprint does not exists', 'Error', {
              closeButton: true
            });

          }
        }
        else {
          toastr.error('Sprint does not exists', 'Error', {
            closeButton: true
          });

        }












          };



      /* **********************************   TIMELINE LINKS ************************************************* */

      $scope.viewTask = function (userstoryid, taskid){
        console.log("esto vale taskid en viewTask");
        console.log(taskid);


        console.log("esto vale userstoryid");
        console.log(userstoryid);



        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ) {

          var indextask = -1;
          var indexus = -1;

          var sprintTemp;


          for (var i = 0; i < $scope.rowCollectionUserStories.length; i++) {

            if($scope.rowCollectionUserStories[i].id == userstoryid){

              /* si lo encuentra, actualizamos $scope.tagUserstory */
              /* primero mirar si tiene sprint */

              if($scope.rowCollectionUserStories[i].sprint !== undefined &&
                $scope.rowCollectionUserStories[i].sprint !== null &&
                $scope.rowCollectionUserStories[i].sprint !== '' ){
                if($scope.rowCollectionUserStories[i].sprint.id !== undefined &&
                  $scope.rowCollectionUserStories[i].sprint.id !== null &&
                  $scope.rowCollectionUserStories[i].sprint.id !== '' ){
                  for (var k = 0; k<$scope.rowCollectionSprints.length; k++){
                    if($scope.rowCollectionUserStories[i].sprint.id == $scope.rowCollectionSprints[k].id){
                      sprintTemp = $scope.rowCollectionSprints[k];

                      k = $scope.rowCollectionSprints.length;
                    }

                  }
                }
              }


              indexus = i;

              if($scope.rowCollectionUserStories[i].tasks !== undefined &&
                $scope.rowCollectionUserStories[i].tasks !== null &&
                $scope.rowCollectionUserStories[i].tasks !== '' ) {


                for (var j = 0; j < $scope.rowCollectionUserStories[i].tasks.length; j++) {

                  if ($scope.rowCollectionUserStories[i].tasks[j].id == taskid) {

                    console.log("encontrado la task viniendo del timeline, cambiamos vars");
                    console.log(j);
                    indextask = j; /* es un indice */

                    j = $scope.rowCollectionUserStories[i].tasks.length;
                    i = $scope.rowCollectionUserStories.length-1;

                  }
                }

              }
            }

          } /* end for */


          if(indextask !== -1 && indexus !== -1){

            /* miramos si tiene sprint */
            if(sprintTemp !== undefined &&
              sprintTemp !== null &&
              sprintTemp !== ''){
              if(sprintTemp.id !== undefined &&
                sprintTemp.id !== null &&
                sprintTemp.id !== ''){

                $scope.initVarsAndSelectOptionsScrumMenu(3);
                $scope.tagSprint = sprintTemp;

                $scope.tagUserstory = $scope.rowCollectionUserStories[indexus];
                $scope.tagTask = indextask;
                $scope.item.viewinDetail = true;
                $scope.item.viewRelatedComments = false;

                console.log("en elmetodo desde el timeline esto vale tarea con sprint");
                console.log($scope.rowCollectionUserStories[indexus].tasks[indextask]);

              }
              else {


                $scope.initVarsAndSelectOptionsScrumMenu(2);

                $scope.tagUserstory = $scope.rowCollectionUserStories[indexus];
                $scope.tagTask = indextask;
                $scope.item.viewinDetail = true;
                $scope.item.viewRelatedComments = false;

                console.log("en elmetodo desde el timeline esto vale tarea");
                console.log($scope.rowCollectionUserStories[indexus].tasks[indextask]);


              }
            }
            else{
              $scope.initVarsAndSelectOptionsScrumMenu(2);

              $scope.tagUserstory = $scope.rowCollectionUserStories[indexus];
              $scope.tagTask = indextask;
              $scope.item.viewinDetail = true;
              $scope.item.viewRelatedComments = false;

              console.log("en elmetodo desde el timeline esto vale tarea");
              console.log($scope.rowCollectionUserStories[indexus].tasks[indextask]);
            }




          }

          else {

            toastr.error('Task does not exists', 'Error', {
              closeButton: true
            });


          }

        }

        else{

          toastr.error('Task does not exists', 'Error', {
            closeButton: true
          });
        }





      };







      $scope.viewCommentFromTask = function (userstoryid, taskid){
        $scope.viewTask(userstoryid, taskid);

        if($scope.tagTask !== -1 && $scope.item.viewinDetail){
          $scope.item.viewRelatedComments = true;

        }

      };






      $scope.viewIssue = function (issueid){


        console.log("esto vale issueid");
        console.log(issueid);



        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' ) {


          var ind = -1;

          for (var i = 0; i < $scope.rowCollectionIssues.length; i++) {

            if ($scope.rowCollectionIssues[i].id == issueid) {
              ind = i;
              i = $scope.rowCollectionIssues.length;
            }

          }
          if(ind !== -1){
            /* ha encontrado la issue, ahora ha ponerla en detalle */


            $scope.initVarsAndSelectOptionsScrumMenu(4);
            $scope.viewDetailsIssue ($scope.rowCollectionIssues[ind], ind);

          }
          else {
            toastr.error('Issue does not exists', 'Error', {
              closeButton: true
            });

          }

        }
        else {
          toastr.error('Issue does not exists', 'Error', {
            closeButton: true
          });

        }


      };



      $scope.viewCommentFromIssue = function (issueid){

        if($scope.tagIssue !== -1 && $scope.item.viewinDetail){

          $scope.viewIssue(issueid);
          $scope.item.viewRelatedComments = true;

        }


      };








      /* esto viene del mensaje del timeline, si pinchan sobre 1 userstory */
      $scope.viewUserstory = function (userstoryid){

        /* buscamos x id el objecto en el row, ponemos item.itemMenuScrumClicked = 2
         * y llamamos a view detailsUserstory(row)
         */



        console.log("esto vale userstory id en viewUserstory");
        console.log(userstoryid);

        var rowTemp;
        var sprintTemp;

        for (var i = 0; i<$scope.rowCollectionUserStories.length; i++){
          if($scope.rowCollectionUserStories[i].id == userstoryid){
            console.log("encontrado el userstory, lo pasamos en view details");
            /* pero hay que mirar si tiene algun US asociado */
            /* si es así lo metemos en tagSprint e inicializamos */


            if($scope.rowCollectionUserStories[i].sprint !== undefined &&
              $scope.rowCollectionUserStories[i].sprint !== null &&
              $scope.rowCollectionUserStories[i].sprint !== '' ){
              if($scope.rowCollectionUserStories[i].sprint.id !== undefined &&
                $scope.rowCollectionUserStories[i].sprint.id !== null &&
                $scope.rowCollectionUserStories[i].sprint.id !== '' ){
                for (var j = 0; j<$scope.rowCollectionSprints.length; j++){
                  if($scope.rowCollectionUserStories[i].sprint.id == $scope.rowCollectionSprints[j].id){
                    sprintTemp = $scope.rowCollectionSprints[j];

                    j = $scope.rowCollectionSprints.length;
                  }


                }
              }


            }




            rowTemp = $scope.rowCollectionUserStories[i];


          }
        }

        /* si no lo encuentra, sacamos sms error */
        if(rowTemp == undefined || rowTemp == null){
          toastr.error('US does not exists', 'Error', {
            closeButton: true
          });


        }
        else{

          if(sprintTemp !== undefined &&
            sprintTemp !== null &&
            sprintTemp !== ''){
            if(sprintTemp.id !== undefined &&
              sprintTemp.id !== null &&
              sprintTemp.id !== ''){

              $scope.initVarsAndSelectOptionsScrumMenu(3);
              $scope.tagSprint = sprintTemp;
              $scope.viewDetailsUserstory(rowTemp);



            }
            else {
              $scope.initVarsAndSelectOptionsScrumMenu(2);
              $scope.viewDetailsUserstory(rowTemp);

            }


          }
          else{
            $scope.initVarsAndSelectOptionsScrumMenu(2);
            $scope.viewDetailsUserstory(rowTemp);
          }



        }


      };






      /********************** new ****************************/
      $scope.getGithubMessage = function ($index, msg) {


        /* hay que mirar si se convierte bien en JSON y podemos coger cosas */
        var githubMessageString = $scope.listaMensajes[$index].text;
        /*console.log("githubMessageString");
        console.log(githubMessageString);*/

        if(githubMessageString !== null && githubMessageString !== undefined && githubMessageString !== ''){
          var githubMessageMiddle = JSON.parse(githubMessageString);
          /*console.log("githubMessageMiddle");
          console.log(githubMessageMiddle);*/


          var githubMessageJSON = JSON.parse(githubMessageMiddle);
          //console.log("githubMessageJSON");
          /*console.log("githubMessageJSON");
          console.log(githubMessageJSON);*/



          var messageText = '';



          /* llamamos al servicio que parsee */
          messageText = GithubService.parseGithubEvents(githubMessageJSON, $index, msg);

          /* mirar que devueleve */

        }
        else {
          messageText = '';


        }


        return messageText;

      };


      $scope.getInternalComment = function ($index, comment) {


        /* hay que mirar si se convierte bien en JSON y podemos coger cosas */

        var scrumCommentString = $scope.rowCollectionIssues[$scope.tagIssue].comments[$index].comment;

        console.log("scrumCommentString");
        console.log(scrumCommentString);

        if(scrumCommentString !== null && scrumCommentString !== undefined && scrumCommentString !== ''){
          var scrumCommentMiddle = JSON.parse(scrumCommentString);

          /* esta vez con esto funciona */
          console.log("scrumMessageMiddle");
          console.log(scrumCommentMiddle);


          /*var scrumMessageJSON = JSON.parse(scrumMessageMiddle);
           //console.log("githubMessageJSON");
           console.log("scrumMessageJSON");
           console.log(scrumMessageJSON);*/



          var messageText = '';

          console.log("******************************");
          console.log("******************************");
          console.log("estovale msg en getscrum controller scrumCommentMiddle");
          console.log(scrumCommentMiddle);
          console.log("******************************");
          console.log("******************************");



          /* llamamos al servicio que parsee */
          messageText = ScrumParseService.parseScrumComments(scrumCommentMiddle, $index, comment);


        }
        else {
          messageText = '';


        }
        console.log(messageText);


        return messageText;

      };



      /********************* new **************************/
      $scope.getScrumMessage = function ($index,msg) {


        /* hay que mirar si se convierte bien en JSON y podemos coger cosas */

        var scrumMessageString = $scope.listaMensajes[$index].text;

        console.log("ScrumMessageString");
        console.log(scrumMessageString);

        if(scrumMessageString !== null && scrumMessageString !== undefined && scrumMessageString !== ''){
          var scrumMessageMiddle = JSON.parse(scrumMessageString);

          /* esta vez con esto funciona */
          console.log("scrumMessageMiddle");
          console.log(scrumMessageMiddle);


          /*var scrumMessageJSON = JSON.parse(scrumMessageMiddle);
          //console.log("githubMessageJSON");
          console.log("scrumMessageJSON");
           console.log(scrumMessageJSON);*/



          var messageText = '';

          console.log("******************************");
          console.log("******************************");
          console.log("estovale msg en getscrum controller");
          console.log(msg);
          console.log("******************************");
          console.log("******************************");



          /* llamamos al servicio que parsee */
          messageText = ScrumParseService.parseScrumEvents(scrumMessageMiddle, $index, msg);


        }
        else {
          messageText = '';


        }
        console.log(messageText);


        return messageText;

      };



















      /********************** end new *********************************/





      /************************* end new ****************************/

    $scope.isInternalMessage = function ($index) {
      if(typeof ($scope.listaMensajes[$index].text) !== "undefined"){
        //console.log($scope.listaMensajes[$index].text);
        if ($scope.listaMensajes[$index].text.indexOf('internalMessage#') == 0) {
          //console.log("es interno el mensaje ");
          //console.log($scope.listaMensajes[$index].text);

          return true;
        }
      }

      return false;
    };

    $scope.getInternalMessage = function ($index) {
      var internalMessage = $scope.listaMensajes[$index].text;
      var re = /internalMessage#(\w+)\./i;
      var matchArr, answerData, temptext;
      var messageType, messageText = "";


      var matchArr = internalMessage.match(re);
      /* vuelve a mirar que es interno */

      //console.log("esto vale getInternalmessage");
      //console.log(matchArr);
      if (matchArr){
        (matchArr.length > 1) ? messageType=matchArr[1] : messageType="";

        if (messageType == 'NEW_ANSWER') {
          answerData = getAnswerData(internalMessage);
          messageText = "<strong>"+answerData.answerUser + "</strong> added new answer for <a class=\"question-link\" ng-click=\"gotoAnchor('" + answerData.questionId + "')\">"+answerData.questionTitle+"</a>";
        }
        else if (messageType == 'NEW_MEMBER_IN_CHANNEL'){

          if(matchArr.input !== null){
            temptext = matchArr.input.split(':');
            if(temptext.length > 1){
              messageText = "<p> New member in channel: <strong>"+temptext[1] + "</strong></p> ";

            }
          }

        }
        else if (messageType == 'DELETE_MEMBER_FROM_CHANNEL'){

          if(matchArr.input !== null){
            temptext = matchArr.input.split(':');
            if(temptext.length > 1){
              messageText = "<p> Delete member from channel: <strong>"+temptext[1] + "</strong></p> ";

            }
          }

        }
        else if (messageType == 'UNSUSCRIBE_MEMBER_FROM_CHANNEL'){

          if(matchArr.input !== null){
            temptext = matchArr.input.split(':');
            if(temptext.length > 1){
              messageText = "<p> Unlinked member from channel: <strong>"+temptext[1] + "</strong></p> ";

            }
          }

        }

      }


      return messageText;

    };




      // Get answer data for a NEW_ANSWER internal message
      function getAnswerData (internalMessage) {
        var re, matchArr;
        var answerData = {};

        re = /QuestionId: \'(\w+)\'/i;
        matchArr = internalMessage.match(re);
        if (matchArr) answerData.questionId=matchArr[1];

        re = /AnswerId: \'(\w+)\'/i;
        matchArr = internalMessage.match(re);
        if (matchArr) answerData.answerId=matchArr[1];

        for (var i = 0; i < $scope.listaMensajes.length; i++) {
          if ($scope.listaMensajes[i].id == answerData.questionId) {
            answerData.questionTitle = $scope.listaMensajes[i].title;
            for (var j=0; j < $scope.listaMensajes[i].answers.length; j++) {
              if ($scope.listaMensajes[i].answers[j].id == answerData.answerId) {
                answerData.answerUser = $scope.listaMensajes[i].answers[j].user.username;
                break;
              }
            }
            break;
          }
        }

        return answerData;

      }

      $scope.gotoAnchor = function (anchor) {
        $anchorScroll(anchor);
      };

    $scope.showUserInfo = function ($index) {
      if ($index < 1) {
        return true;
      }

      var msgactual = $scope.listaMensajes[$index];
      var msganterior = $scope.listaMensajes[$index-1];

      if (msgactual.user.id ==msganterior.user.id) {
        if (moment(msgactual.date).diff(moment(msganterior.date),'minutes') > 10) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }


    };

      $scope.shareInForum = function (index) {

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/publishMessageModal.html',
          controller: 'publishMessageModalCtrl',
          resolve: {
            data: function () {
              return {
                groupid: $scope.groupid,
                channelid: $scope.channelid,
                message: $scope.listaMensajes[index]
              }
            }
          }
        });

        // Al cerra la modal marcamos el mensaje como publicado
        modalInstance.result.then(function () {
          $scope.listaMensajes[index].publish = true;
        });


      };

      $scope.createQuestion = function () {

        var modalInstance = $uibModal.open({
          templateUrl: 'views/modals/questionModal.html',
          controller: 'questionModalCtrl',
          size: 'lg',
          resolve: {
            data: function () {
              return {
                groupid: $scope.groupid,
                channelid: $scope.channelid
              }
            }
          }
        });


      };










    $scope.channelSelected = false;
    $scope.listaMensajes = [];
    $scope.listaUsuariosConectados = {};


	ProfileService
      .getInvitations()
      .then(function (data) {
        $scope.invitations = data;
      }
      , function (err) {
        // Tratar el error
        console.log("Hay error");
        console.log(err.message);

        $scope.errorG = err.message;
        $("#errorGroupModal").modal("show");

      });


    ProfileService
      .getGroups()
      .then(function (data) {
        $scope.groups = data;
        console.log("esto valen los grupos");
        console.log($scope.groups);


        /* cogemos los grupos y los rellenamos con los canales */

        angular.forEach($scope.groups, function(value, key) {

          $scope.getChannelsForNotification(value);


        });


      }
      , function (err) {
        // Tratar el error
        console.log("Hay error");
        console.log(err.message);
        $scope.errorG = err.message;
        $("#errorGroupModal").modal("show");

      });

    ProfileService
      .getUserinfo()
      .then(function (data) {
        $scope.username = data.username;
	    $scope.userid = data.id;
	    $scope.user = data;

		$scope.user.hash = $scope.getHash($scope.user.mail);
	    //console.log("esto vale user");
	    //console.log( $scope.user );
      }
      , function (err) {
        // Tratar el error
        console.log("Hay error");
        console.log(err.message);
        $scope.errorG = err.message;
        $("#errorGroupModal").modal("show");

      });




      /* lo que se muestra en las notificaciones cuando es interno el mensaje */
      $scope.getInternalMessageForNotification = function (text) {
        var internalMessage = text;
        var re = /internalMessage#(\w+)\./i;
        var matchArr, answerData, temptext;
        var messageType, messageText = "";


        var matchArr = internalMessage.match(re);
        /* vuelve a mirar que es interno */

        console.log("esto vale getInternalmessage");
        console.log(matchArr);
        if (matchArr){
          (matchArr.length > 1) ? messageType=matchArr[1] : messageType="";

          if (messageType == 'NEW_ANSWER') {
            answerData = getAnswerData(internalMessage);
            messageText = answerData.answerUser + " add new answer for "+answerData.questionTitle;
          }
          else if (messageType == 'NEW_MEMBER_IN_CHANNEL'){

            if(matchArr.input !== null){
              temptext = matchArr.input.split(':');

              if(temptext.length > 1){
                messageText = "new member: "+temptext[1];
              }

            }

          }
          else if (messageType == 'DELETE_MEMBER_FROM_CHANNEL'){

            if(matchArr.input !== null){
              temptext = matchArr.input.split(':');

              if(temptext.length > 1){
                messageText = "delete member: "+temptext[1];
              }

            }

          }
          else if (messageType == 'UNSUSCRIBE_MEMBER_FROM_CHANNEL'){

            if(matchArr.input !== null){
              temptext = matchArr.input.split(':');

              if(temptext.length > 1){
                messageText = "unlinked member: "+temptext[1] ;
              }

            }

          }

        }


        return messageText;

      };







      /*************** SOCKETS ******************************/
      /* por canal, estoy dentro del canal */
      Socket.on('newUserstory', function (data) {

        $scope.rowCollectionUserStories.push(data.userstory);
        $scope.$apply();
      });



      Socket.on('newSprint', function (data) {

        $scope.rowCollectionSprints.push(data.sprint);
        initVarsScrumChannelSprintsGeneralViewWithUs();
        $scope.$apply();
      });


      Socket.on('newIssue', function (data) {

        $scope.rowCollectionIssues.push(data.issue);
        initVarsScrumChannelTeamUpdate();
        $scope.$apply();
      });




      /* puede estar seleccionado y ahora no lo estaria */
      Socket.on('updateUserstory', function (data) {



        for (var i = 0; i<$scope.rowCollectionUserStories.length; i++){
          if($scope.rowCollectionUserStories[i].id == data.userstory.id){
            console.log("encontrado el userstory, lo cambiamos");
            console.log(data.userstory);
            $scope.rowCollectionUserStories[i] = data.userstory;

            if(data.userstory.tasks !== undefined &&
              data.userstory.tasks !== null &&
              data.userstory.tasks !== '' &&
              data.userstory.tasks.length >0 ){

              initVarsScrumChannelTeamUpdate();

            }


            i = $scope.rowCollectionUserStories.length;


          }
        }
        if($scope.tagUserstory.id == data.userstory.id){
          $scope.tagUserstory = data.userstory;
        }




        $scope.$apply();
      });




      function cleanTableCell (data) {
        var ind = -1;
        if($scope.tableCells !== undefined && $scope.tableCells !== null){
          if($scope.tableCells.selected !== undefined &&
            $scope.tableCells.selected !== null &&
            $scope.tableCells.selected.length >0){

            for(var i = 0; i< $scope.tableCells.selected.length; i++){
              if($scope.tableCells.selected[i].id == data){
                ind = i;

                i= $scope.tableCells.selected.length;

              }
            }

            if(ind !== -1){
              $scope.tableCells.selected.splice(ind, 1);

            }
          }
        }




      }






      /* buscamos si la tiene seleccionada, la quitamos del array */
      Socket.on('deleteTask', function (data) {

        /* buscamos la tarea */
        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ) {

          var indexi= -1;
          var indexj = -1;

          for (var i = 0; i < $scope.rowCollectionUserStories.length; i++) {
            if ($scope.rowCollectionUserStories[i].id == data.userstoryid) {

              if ($scope.rowCollectionUserStories[i].tasks !== undefined &&
                $scope.rowCollectionUserStories[i].tasks !== null &&
                $scope.rowCollectionUserStories[i].tasks !== '') {

                for (var j = 0; j < $scope.rowCollectionUserStories[i].tasks.length; j++) {
                  if ($scope.rowCollectionUserStories[i].tasks[j].id == data.taskid) {


                    /* tenemos el index, nos cargamos la tarea */

                    indexi = i;
                    indexj = j;


                    j = $scope.rowCollectionUserStories[i].tasks.length;
                    i = $scope.rowCollectionUserStories.length - 1;
                  }
                }
              }
            }
          }


          if(indexi > -1 && indexj > -1){
            $scope.rowCollectionUserStories[indexi].tasks.splice(indexj,1);
          }

        }

        if($scope.tagTask !== undefined &&
          $scope.tagTask !== null &&
          $scope.tagTask !== '' &&
          $scope.tagTask !== -1 &&
          $scope.tagUserstory !== undefined &&
          $scope.tagUserstory !== null &&
          $scope.tagUserstory !== '' ){

          if($scope.tagUserstory.tasks !== undefined &&
            $scope.tagUserstory.tasks !== null &&
            $scope.tagUserstory.tasks !== '' &&
            $scope.tagUserstory.tasks.length >0){

            if($scope.tagUserstory.tasks[$scope.tagTask] !== undefined &&
              $scope.tagUserstory.tasks[$scope.tagTask] !== null &&
              $scope.tagUserstory.tasks[$scope.tagTask] !== '' &&
              $scope.tagUserstory.tasks[$scope.tagTask]){
              if($scope.tagUserstory.tasks[$scope.tagTask].id == data.taskid){



                $scope.item.viewinDetail = false;
                initVarsScrumChannelTasks ();


                /* si venimos de dashboard hay que quitar tambien el US */
                if($scope.item.viewTaskboard){
                  $scope.tagUserstory = {};
                  $scope.tagUserstoryTemp = {};

                }


                toastr.info('Task you selected has been deleted.', 'Information', {
                  closeButton: true
                });


              }

            }

          }

        }

        /* se ha borrado la tarea, hay que mirar si estaba dentro del array y sacarla */
        /* nos recorremos el array */

        cleanTableCell(data.taskid);
        initVarsScrumChannelTeamUpdate();






        $scope.$apply();
      });






      /* si la tiene seleccionada la quitamos del array */
      /* en este caso limpiar tareas(search y cells) y de US limpiar cells si esta en el array */
      Socket.on('deleteUserstory', function (data) {


        var index = -1;

        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ) {
          for (var i = 0; i < $scope.rowCollectionUserStories.length; i++) {

            if ($scope.rowCollectionUserStories[i].id == data.userstoryid) {

              index = i;
              i = $scope.rowCollectionUserStories.length - 1;

            }
          }


        }
        if(index > -1){

          var enc = false;
          if($scope.rowCollectionUserStories[index].tasks !== undefined &&
            $scope.rowCollectionUserStories[index].tasks !== null &&
            $scope.rowCollectionUserStories[index].tasks !== '' &&
            $scope.rowCollectionUserStories[index].tasks.length >0 ){
            enc = true;
          }


          $scope.rowCollectionUserStories.splice(index, 1);

          if(enc){
            initVarsScrumChannelTeamUpdate();

          }


        }




        if($scope.tagUserstory !== undefined &&
          $scope.tagUserstory !== null &&
          $scope.tagUserstory !== '' ){

          if($scope.tagUserstory == data.userstoryid){
            toastr.info('Userstory you selected has been deleted.', 'Information', {
              closeButton: true
            });



            removeVarsDetailUserstory();
            $scope.item.viewinDetail = false;



            if($scope.tagTask == -1){
              $scope.ischeckedAllCells = false;
              removeValTableCellTagUS();
              removeVarsSearchTask();
              initVarsScrumChannelTasks ();
              $scope.tableCells = {};
              $scope.tableCells.selected = [];

            }


          }
          else if($scope.tagUserstory.id == undefined ||
            $scope.tagUserstory.id == null ||
            $scope.tagUserstory.id == ''){
            cleanTableCell(data.userstoryid);

          }

        }
        else {
          cleanTableCell(data.userstoryid);

        }



        /*hay que recorrer las issues y quitar ese id de su arr.userstories */
        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' &&
          $scope.rowCollectionIssues.length >0 ){

          var ind = -1;

          for(var i = 0; i <$scope.rowCollectionIssues.length; i++){
            if($scope.rowCollectionIssues[i].userstories !== undefined &&
              $scope.rowCollectionIssues[i].userstories !== null &&
              $scope.rowCollectionIssues[i].userstories !== '' &&
              $scope.rowCollectionIssues[i].userstories.length >0){
              for( var j = 0; j< $scope.rowCollectionIssues[i].userstories.length; j++){

                if($scope.rowCollectionIssues[i].userstories[j].id == data.userstoryid){
                  ind = j;
                  console.log("ha encontrado el userstory en una issue");
                  j = $scope.rowCollectionIssues[i].userstories.length;


                }
              }
              $scope.rowCollectionIssues[i].userstories.splice(ind, 1);
              i = $scope.rowCollectionIssues.length;


            }
          }




        }






        $scope.$apply();

      });







      Socket.on('deleteSprint', function (data) {

        var index = -1;

        if($scope.rowCollectionSprints !== undefined &&
          $scope.rowCollectionSprints !== null &&
          $scope.rowCollectionSprints !== '' ) {
          for (var i = 0; i < $scope.rowCollectionSprints.length; i++) {

            if ($scope.rowCollectionSprints[i].id == data.sprintid) {

              index = i;
              i = $scope.rowCollectionSprints.length;

            }
          }
        }
        if(index > -1){
          $scope.rowCollectionSprints.splice(index, 1);

        }


        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ) {
          for (var i = 0; i < $scope.rowCollectionUserStories.length; i++) {

            if ($scope.rowCollectionUserStories[i].sprint == data.sprintid) {
              $scope.rowCollectionUserStories[i].sprint = undefined;

            }
          }
        }


        /* si borro sprint y stoy anidada en US y en Task */
        if($scope.tagSprint !== undefined &&
          $scope.tagSprint !== null &&
          $scope.tagSprint !== '' ){
          if($scope.tagSprint.id == data.sprintid){

            toastr.info('Sprint you selected has been deleted.', 'Information', {
              closeButton: true
            });

            initVarsScrumChannelSprintsGeneralViewWithUs();
            //removeVarsSearchSprint();


            $scope.ischeckedAllCells = false;
            $scope.item.viewinDetail = false;

            removeVarsDetailUserstory();

            removeValTableCellTagUS();
            removeVarsSearchTask();
            initVarsScrumChannelTasks();

            removeValTableCellRowUS();
            removeVarsSearchUS();


            $scope.tableCells = {};
            $scope.tableCells.selected = [];

          }
          /* si no es el mismo, lo buscamos haber si esta en la tablecell selected y lo borramos */
          else if($scope.tagSprint.id == undefined ||
              $scope.tagSprint.id == null ||
              $scope.tagSprint.id == ''){

            cleanTableCell(data.sprintid);

            }
        }

        else{
          cleanTableCell(data.sprintid);


        }


        $scope.$apply();

      });











      Socket.on('deleteIssue', function (data) {

        var index = -1;

        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' ) {
          for (var i = 0; i < $scope.rowCollectionIssues.length; i++) {

            if ($scope.rowCollectionIssues[i].id == data.issueid) {

              index = i;
              i = $scope.rowCollectionIssues.length ;

            }
          }




        }
        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' ) {
          if ($scope.tagIssue !== -1) {
            if ($scope.rowCollectionIssues[$scope.tagIssue].id == data.issueid) {

              toastr.info('Issue you selected has been deleted.', 'Information', {
                closeButton: true
              });


              initVarsScrumChannelIssues();




            }
          }
        }
        else {
          /* puede que sea la ultima issue */
          if($scope.tagIssue !== -1){
            initVarsScrumChannelIssues();
          }
        }

        if(index > -1){
          $scope.rowCollectionIssues.splice(index, 1);

        }


        else {
          cleanTableCell(data.issueid);

        }
        initVarsScrumChannelTeamUpdate();


        $scope.$apply();

      });














      /* si lo tiene seleccionado le ponemos a true */

      Socket.on('updateSprint', function (data) {



        if($scope.rowCollectionSprints !== undefined &&
          $scope.rowCollectionSprints !== null &&
          $scope.rowCollectionSprints !== '' &&
          data.sprint !== undefined &&
          data.sprint !== null &&
          data.sprint !== '') {

          for (var i = 0; i < $scope.rowCollectionSprints.length; i++) {

            if ($scope.rowCollectionSprints[i].id == data.sprint.id) {

              $scope.rowCollectionSprints[i] = data.sprint;
              $scope.rowCollectionSprints[i].viewTableUs = true;

            }
          }







          if($scope.tagSprint !== undefined &&
            $scope.tagSprint !== null &&
            $scope.tagSprint !== '' ){
            if($scope.tagSprint.id !== undefined &&
              $scope.tagSprint.id !== null &&
              $scope.tagSprint.id !== ''){

              if($scope.tagSprint.id == data.sprint.id){
                $scope.tagSprint = data.sprint;
                $scope.tagSprint.viewTableUs = true;


              }
              else{
                $scope.tagSprint.viewTableUs = false;

              }

            }
            /* si no hay ningun tag */
            else {
              $scope.ischeckedAllCells = false;
              removeValTableCellRowSprint();
              $scope.tableCells = {};
              $scope.tableCells.selected = [];

            }


          }





        }


                /* si borro sprint y stoy anidada en US y en Task */



        $scope.$apply();

      });










      Socket.on('updateIssue', function (data) {

        console.log("esto vale data.issue");
        console.log(data.issue);


        /* actualizar data */
        /* nos recorremos data.task */
        if (data.issue !== undefined &&
          data.issue !== null &&
          data.issue !== '') {

          if (data.issue.comments !== undefined &&
            data.issue.comments !== null &&
            data.issue.comments !== '' &&
            data.issue.comments.length > 0) {
            for (var t = 0; t < data.issue.comments.length; t++) {
              if (data.issue.comments[t].user !== undefined &&
                data.issue.comments[t].user !== null &&
                data.issue.comments[t].user !== '') {

                if (data.issue.comments[t].user.id == $localStorage.id) {
                  data.issue.comments[t].isEditable = true;
                }
              }
            }
          }
        }



        if($scope.rowCollectionIssues !== undefined &&
          $scope.rowCollectionIssues !== null &&
          $scope.rowCollectionIssues !== '' ) {

          for (var i = 0; i < $scope.rowCollectionIssues.length; i++) {
            if ($scope.rowCollectionIssues[i].id == data.issue.id) {

              console.log("encontrado la issue, la cambiamos");
              console.log(data.issue);

              $scope.rowCollectionIssues[i] = data.issue;
              i = $scope.rowCollectionIssues.length - 1;

            }

          } /* end for */

        }
        initVarsScrumChannelTeamUpdate();



        $scope.$apply();
      });

































      Socket.on('updateTask', function (data) {


        /* actualizar data */
        /* nos recorremos data.task */
        if (data.task !== undefined &&
          data.task !== null &&
          data.task !== '') {

          if (data.task.comments !== undefined &&
            data.task.comments !== null &&
            data.task.comments !== '' &&
            data.task.comments.length > 0) {
            for (var t = 0; t < data.task.comments.length; t++) {
              if (data.task.comments[t].user !== undefined &&
                data.task.comments[t].user !== null &&
                data.task.comments[t].user !== '') {

                if (data.task.comments[t].user.id == $localStorage.id) {
                  data.task.comments[t].isEditable = true;
                }
              }
            }
          }
        }



        if($scope.rowCollectionUserStories !== undefined &&
          $scope.rowCollectionUserStories !== null &&
          $scope.rowCollectionUserStories !== '' ) {

            for (var i = 0; i < $scope.rowCollectionUserStories.length; i++) {
              if ($scope.rowCollectionUserStories[i].id == data.userstoryid) {

                if ($scope.rowCollectionUserStories[i].tasks !== undefined &&
                  $scope.rowCollectionUserStories[i].tasks !== null &&
                  $scope.rowCollectionUserStories[i].tasks !== '') {

                  for (var j = 0; j < $scope.rowCollectionUserStories[i].tasks.length; j++) {
                    if ($scope.rowCollectionUserStories[i].tasks[j].id == data.task.id) {

                      console.log("encontrado la task, la cambiamos");
                      console.log(data.task);
                      $scope.rowCollectionUserStories[i].tasks[j] = data.task;
                      $scope.tagUserstory = $scope.rowCollectionUserStories[i];

                      j = $scope.rowCollectionUserStories[i].tasks.length;
                      i = $scope.rowCollectionUserStories.length - 1;

                    }
                  }
                }
              }

            } /* end for */

       }
        if($scope.tagTask !== undefined &&
          $scope.tagTask !== null &&
          $scope.tagTask !== '' &&
          $scope.tagTask !== -1 &&
          $scope.tagUserstory !== undefined &&
          $scope.tagUserstory !== null &&
          $scope.tagUserstory !== '' ){
          if($scope.tagUserstory.tasks !== undefined &&
            $scope.tagUserstory.tasks !== null &&
            $scope.tagUserstory.tasks !== '' &&
            $scope.tagUserstory.tasks.length >0){

            if($scope.tagUserstory.tasks[$scope.tagTask] !== undefined &&
              $scope.tagUserstory.tasks[$scope.tagTask] !== null &&
              $scope.tagUserstory.tasks[$scope.tagTask] !== ''){

              if ($scope.tagUserstory.tasks[$scope.tagTask].id == data.task.id) {
                $scope.tagUserstory.tasks[$scope.tagTask] = data.task;
              }

            }
          }

        }

        initVarsScrumChannelTeamUpdate();


        $scope.$apply();
      });





      /* mirar si es internal user */

      /* hay que cambiar en newMessage, en newMessageEvent y en push directo cuando carga mensajes
      * tambien mirar que funcione en notificaciones, tanto para ver si se crea nuevo canal lo mete para noti*/

     Socket.on('newMessage', function (data) {

       /* parsear de forma diferente */
       /* puede que este en el canal pero no mirando los mensajes, queremos ponerle 1 badge */


     console.log("newMessage from server: " + data.message.id);
     console.log(data.message.text);



     /* Si es el canal actual, añadimos mensaje a la listaMensaje
     y sino esta en la ventana (window de la app, le sacamos 1 notificacion
      */

     if (data.message.channel.id == $scope.tagChannel.id) {

       /* mirar que la opcion sea distinta de 1 poner badge */
       if($scope.tagChannel.scrum) {

         data.message.visible = 0;
         if( $scope.item.itemMenuScrumClicked > 1) {

           $scope.badge.scrummenu = $scope.badge.scrummenu + 1;
         }
       }










       /* mirar si es 1 url y hasta que no este ready no pintar */

       if(data.message.messageType == 'URL'){

           data.message.visible = 0;


       }

       /* aqui parseamos si es github */

       /* no hace falta hacer nada,cambiando solo el ng-bind-html vale
       * para notificacioes de escritorio si haria falta
       * lo dejamos solo para los consoles, luego lo quitamos
       * sobraaaaa
       *
       * */

       /* esto sobraria, no haria falta */
       //if(data.message.user.mail == INTERNAL_USER && data.message.messageType == 'TEXT'){
        /* lo mandamos asi ---> message: result
         * y data.message es
        *
        * { id: 5717ee444763d6341548220f,
         channel:
         { id: 56cb893773da764818ec5df1,
         channelName: 'General',
         channelType: 'PUBLIC' },
         user:
         { id: 56cb8a1c63202f68056c1196,
         username: 'meanstack',
         mail: 'internalUser@localhost' },
         date: Wed Apr 20 2016 23:01:56 GMT+0200 (CEST),
         messageType: 'TEXT',
         text: '"{\\"event\\":\\"push\\",\\"repository\\":{\\"id\\":53012875,\\"name\\":\\"angularProject\\"},\\"ref\\":\\"refs/heads/master\\",\\"commits\\":[{\\"id\\":\\"63dfa554e5e35e08e555fa6450d85df00342a1cf\\",\\"url\\":\\"https://github.com/1izpena/angularProject/commit/63dfa554e5e35e08e555fa6450d85df00342a1cf\\",\\"author\\":\\"1izpena\\"}],\\"sender\\":{\\"login\\":\\"1izpena\\",\\"html_url\\":\\"https://github.com/1izpena\\"}}"' }

         *
        *
        * */
         /* mirar el evento */

         /* cogemos text y lo convertimos */
         /*var textString = data.message.text;
         var textJSON = JSON.parse(textString);
         console.log("esto vale textJSON");
         console.log(textJSON);


         console.log("podre coger el evento de text??");
         console.log(textJSON.event);


       }*/


       $scope.listaMensajes.push(data.message);


       /* mostramos notificaciones cuando no esta en la ventana */
       if($scope.window_focus !== true){

         /* parseos cuando son objetos los mensajes, falta x hacer */

         var datatemp = JSON.parse(JSON.stringify(data));

         datatemp.groupName = $scope.tagGroup.groupName;
         datatemp.channelName = datatemp.message.channel.channelName;



         if(datatemp.message.messageType == 'QUESTION' && datatemp.message.title !== undefined){
           datatemp.message.text = "add new question "+datatemp.message.title;
         }
         else if(datatemp.message.messageType == 'TEXT' || datatemp.message.messageType == 'URL'){
           if(datatemp.message.text !== "undefined"){


             if(datatemp.message.text.indexOf('internalMessage#') == 0){


               datatemp.message.text = $scope.getInternalMessageForNotification(datatemp.message.text);
             }

             else if(datatemp.message.serviceType == 'GITHUB'|| datatemp.message.serviceType == 'SCRUM' ){
               datatemp.message.text = "a new event has occurred";

             }
           }



         }
         else if (datatemp.message.messageType == 'FILE' && datatemp.message.filename !== undefined){
           datatemp.message.text = "attach new file "+datatemp.message.filename;
         }



         ChatService.openNotification(datatemp);
       }


     }
     $scope.$apply();
     });





      /* por grupo */
    Socket.on('newQuestionAnswer', function (data) {
      var message = data;
      for (var i=0; i < $scope.listaMensajes.length; i++) {
        if ($scope.listaMensajes[i].id == message.id) {
          $scope.listaMensajes[i].answers.push(message.answer);
          break;
        }
      }
      $scope.$apply();
    });

    Socket.on('newUserConnect', function (data) {
      $scope.listaUsuariosConectados[data.userid] = true;
      $scope.$apply();
    });

      Socket.on('usersConnected', function (data) {
        if (data.users) {
          for (var i = 0; i < data.users.length; i++) {
            $scope.listaUsuariosConectados[data.users[i]] = true;
          }
          $scope.$apply();
        }
      });

      Socket.on('userDisconnect', function (data) {
      delete $scope.listaUsuariosConectados[data.userid];
      $scope.$apply();
    });



      /* settings de grupo */

      /* recibir evento de nuevo grupo
         por usuario US  ?? */


      /* no haria nada, yo he creado el grupo */
      Socket.on('newGroup', function (data) {
        console.log ("newGroup received from server");
        console.log(data);


        $scope.groups.push(data);

        /* cuando cree el nuevo grupo que le muestre los settings, si el es el que lo crea */
        if(data.users.length == 1){


          $scope.tagGroup = '';
        	$scope.selectGroup(data);
        	$scope.tagChannel = '';



          var user = {username :'meanstack'};
          if(data.message == undefined){
            data.message = {text : ' created new group: '+ data.groupName, user: user };

          }
          ChatService.openNotification(data);

        }
        $scope.$apply();


      });


      /* recibir evento de grupo eliminado
         por usuario US */
      Socket.on('deletedGroup', function (data) {

        console.log ("deletedGroup receive from server");
        console.log(data);

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : ' deleted group: '+ data.groupName, user: user };

        }



        if($scope.tagGroup.id == data.id){
          console.log("ha llamado disconnect de grupo");
          Socket.emit('disconnect');
          console.log("ha llamado disconnect de channel");
          Socket.emit('disconnectChannel');
	        $scope.tagGroup = '';
	        $scope.tagChannel = '';
        }

        for (var i=0;i<$scope.groups.length;i++){
          if ($scope.groups[i].id == data.id){

            ChatService.openNotification(data);
            $scope.groups.splice(i,1);
            i = $scope.groups.length;

          }
        }
        $scope.$apply();
      });


      //recibir evento de nombre de grupo editado
      /* a los usuarios que pertenecen al grupo US */

      /* no cambiaria nada */
      Socket.on('editedGroup', function (data) {
        console.log ("editedGroup received from server");
        console.log(data);



        for (var i=0; i<$scope.groups.length; i++){
          if ($scope.groups[i].id == data.id){

            var user = {username :'meanstack'};

            if(data.message == undefined){
              data.message = {text : 'the group '+$scope.groups[i].groupName +' changed its name to: '+ data.groupName, user: user };

            }

            ChatService.openNotification(data);



            $scope.groups[i].groupName = data.groupName;
            $scope.$apply();
            i = $scope.groups.length;
          }
        }
      });



      //recibir evento de invitación a grupo
      /* socket para el usuario que le compete la invitacion */
      /* no cambiaria nada */

      Socket.on('newGroupInvitation', function (data) {
        console.log ("newGroupInvitation received from server");
        if($scope.invitations == undefined){
          $scope.invitations = [];


        }

        $scope.invitations.push(data);
        $scope.$apply();


      });


      /* no cambiaría nada */
      Socket.on('regretGroupInvitation', function (data) {
        console.log ("regretGroupInvitation received from server");
        /* si es el administrador, poner que pueda de nuevo invitar al usuario a ese grupo */
        if ($scope.adminGroup.id == $scope.userid){
        	if($scope.option == 1) {
        		for (var i = 0; i < $scope.membersSettings.length; i++){
        			if ($scope.membersSettings[i].id == data.userid){
            			$scope.membersSettings[i].isinvited = 0;
            			i = $scope.membersSettings.length;
          			}
        		}
        	}

        }




        /* no estoy segura de si esto esta bien */
        //$scope.invitations.push(data);
        $scope.$apply();


      });



       //recibir evento de nuevo usuario en grupo, es  cuando acepta el grupo
       /* si esta en los settings del grupo hay que actualizar los miembros de los settings */

      Socket.on('newMemberInGroup', function (data) {
        console.log ("newMemberInGroup receive from server");
        console.log(data);
        data.user.hash = $scope.getHash(data.user.mail);
        $scope.members.push(data.user);


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'new member in group: '+ data.user.username, user: user };

        }

        data.groupName = $scope.tagGroup.groupName;

        ChatService.openNotification(data);





        /* si es el administrador, cambiarle los membersettings */
        if ($scope.adminGroup.id == $scope.userid){
        	/* sacamos al usuario añadido en el grupo de membersettings */
        	if($scope.option == 1) {
        		for (var i = 0; i < $scope.membersSettings.length; i++){
        			if ($scope.membersSettings[i].id == data.user.id){
        				$scope.membersSettings.splice(i, 1);
            			i = $scope.membersSettings.length;
          			}
        		}
        	}

        }

        $scope.$apply();

      });




      //recibir evento de nuevo canal publico en grupo
      /* notificacion a todos */
      Socket.on('newPublicChannel', function (data) {
        console.log ("newPublicChannel received from server");
        console.log(data);

        /*
        * data: groupid: data.groupid,channelid: data.channelid, message:data.channelName
        * */


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'new public channel: '+ data.channelName, user: user };

        }

        data.groupName = $scope.tagGroup.groupName;

        ChatService.openNotification(data);






        data.channelNotificationsCount = 0;
        $scope.publicChannels.push(data);


        $scope.$apply();
      });


      //recibir evento de nuevo canal privado en grupo
      /* hacer notificacion */
      Socket.on('newPrivateChannel', function (data) {

        console.log ("newPrivateChannel received from server");
        console.log(data);


        /* si estoy en ese grupo */
        if($scope.tagGroup.id == data.group.groupId){
          console.log ("newPrivateChannel received from server en if: ");
          console.log(data);

          /* haria notificacion para todos */

          var user = {username :'meanstack'};
          if(data.message == undefined){
            data.message = {text : 'new private channel: '+ data.channelName, user: user };

          }

          data.groupName = $scope.tagGroup.groupName;

          ChatService.openNotification(data);




          data.channelNotificationsCount = 0;
          $scope.privateChannels.push(data);

          $scope.$apply();
        }

      });




      //recibir evento de usuario eliminado de grupo
      /* si soy yo no tiene que cambiar nada */
      /* si no estoy metido en el grupo dentro tampoco */
      /* actualizar siempre xaqui, xq se usa el mismo socket cuando un usuario sale */


      Socket.on('deletedMemberInGroup', function (data) {
        console.log ("deletedMemberInGroup receive from server: " + data);


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'deleted member from group: '+ data.user.username, user: user };

        }

        data.groupName = $scope.tagGroup.groupName;

        ChatService.openNotification(data);



        for (var i = 0; i < $scope.members.length; i++){
          if ($scope.members[i].id == data.user.id){
          		$scope.members.splice(i,1);
          		i = $scope.members.length;
          }
        }
        /* si es el administrador, cambiarle los membersettings */
        if ($scope.adminGroup.id == $scope.userid){
        	/* añadimos al usuario borrado del grupo en membersettings (usuarios de sistema) */
        	if($scope.option == 1) {
        		//data.user.color = getRandomColor();
        		data.user.hash = $scope.getHash(data.user.mail);
        		$scope.membersSettings.push(data.user);

        	}
        }
        $scope.$apply();

      });



      //recibir evento de nuevo usuario en canal
      /* esto ahora se envia como 1 mensaje, no hay que hacer nada */
      Socket.on('newMemberInChannel', function (data) {
        console.log ("newMemberInChannel received from server");
        console.log(data);

        /* se supone que estoy dentro del canal */
        /* si soy el administrador no hago nada, xq ya esta modificado,
        	sino, si esta en settings con la opcion 0
        	hay que actualizar los miembros y los miembros de settings que son los mismos */

        if ($scope.adminChannel.id !== $scope.userid){
          if ($scope.tagChannel.id == data.channelid ){
	        	data.user.hash = $scope.getHash(data.user.mail);
	        	$scope.channelMembers.push(data.user);
	        	$scope.tagChannel.users.push(data.user);
        	}
        }

        $scope.$apply();
      });



      //recibir evento de usuario eliminado de canal
      /* se manda como mensaje, no hacer nada */
      Socket.on('deletedUserFromChannel', function (data) {
        console.log ("deletedUserFromChannel received from server");
        console.log(data);

        if (data.user.id == $localStorage.id){
        	if($scope.tagChannel.id == data.channelid){
            console.log("ha llamado disconnect de channel");
            Socket.emit('disconnectChannel');
        		$scope.tagChannel = ''
        	}
        	for (var i = 0; i < $scope.privateChannels.length; i++){
	            if ($scope.privateChannels[i].id == data.channelid){
	              $scope.privateChannels.splice(i,1);
	          }
	        }
        }

        else {
        	if($scope.tagChannel.id == data.channelid){

        		for (var j = 0; j < $scope.channelMembers.length; j++){
	            	if ($scope.channelMembers[j].id == data.user.id){
	              		$scope.channelMembers.splice(j,1);
	              	}

	          	}

		        for (var k = 0; k < $scope.tagChannel.users.length; k++){
		            if ($scope.tagChannel.users[k].id == data.user.id){
		              $scope.tagChannel.users.splice(k,1);

		          }
		        }

		        /* si es el administrador, cambiarle los membersettings */
		        if ($scope.adminChannel.id == $scope.userid){
		        	/* añadimos al usuario borrado del canal en membersettingschannel (usuarios de grupo) */
		        	if($scope.optionchannel == 1) {

		        		data.user.hash = $scope.getHash(data.user.mail);
		        		$scope.membersSettingschannel.push(data.user);

		        	}

		        }
        	}


        }

        $scope.$apply();

      });




      //recibir evento de nombre de canal publico editado
      Socket.on('editedPublicChannel', function (data) {
        console.log ("editedPublicChannel received from server");
        console.log(data);
        for (var i = 0; i< $scope.publicChannels.length; i++){
          if ($scope.publicChannels[i].id == data.id){
            $scope.publicChannels[i].channelName = data.channelName;

            $scope.$apply();
            i = $scope.publicChannels.length;
          }
        }

      });


      //recibir evento de nombre de canal privado editado
      Socket.on('editedPrivateChannel', function (data) {
        console.log ("editedPrivateChannel received from server");
        console.log(data);
        for (var i = 0; i < $scope.privateChannels.length; i++){
          if ($scope.privateChannels[i].id == data.id){
            $scope.privateChannels[i].channelName = data.channelName;

            $scope.$apply();
            i = $scope.publicChannels.length;
          }
        }
      });



      //recibir evento de canal privado eliminado
      Socket.on('deletedPrivateChannel', function (data) {
        console.log ("deletedPrivateChannel received from server");
        console.log(data);


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'deleted PRIVATE channel in group: '+ data.channelName, user: user };

        }

        data.groupName = $scope.tagGroup.groupName;

        ChatService.openNotification(data);




        for (var i=0;i<$scope.privateChannels.length;i++){
          if ($scope.privateChannels[i].id == data.id){
            $scope.privateChannels.splice(i,1);
          }
        }
        if($scope.tagChannel.id == data.id){
          console.log("ha llamado disconnect de channel");
          Socket.emit('disconnectChannel');
          $scope.channelMembers = '';
          $scope.channelSelected = false;
          $scope.tagChannel = '';
        }
        $scope.$apply();
      });



      //recibir evento de canal publico eliminado
      Socket.on('deletedPublicChannel', function (data) {
        console.log ("deletedPublicChannel received from server");
        console.log(data);


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'deleted PUBLIC channel in group: '+ data.channelName, user: user };

        }

        data.groupName = $scope.tagGroup.groupName;

        ChatService.openNotification(data);





        for (var i=0;i<$scope.publicChannels.length;i++){
          if ($scope.publicChannels[i].id == data.id){
            $scope.publicChannels.splice(i,1);
          }
        }
        if($scope.tagChannel.id == data.id){
          console.log("ha llamado disconnect de channel");
          Socket.emit('disconnectChannel');
          $scope.channelMembers = '';
          $scope.channelSelected = false;
          $scope.tagChannel = '';
        }
        $scope.$apply();
      });



      //Eventos de grupos listados y no conectado
      /* nada */
      Socket.on('newGroupEvent', function (data) {
        console.log ("newGroupEvent received from server");

      });


      Socket.on('editedGroupEvent', function (data) {
        console.log ("editedGroupEvent received from server");
        /*
        if ($scope.tagGroup.id!=data.groupid){
          var message = 'Edited Group';
          $scope.addGroupNotification(data,message);
          $scope.$apply();
        }
        */

      });


      /* hacer notificacion */
      Socket.on('deletedMemberInGroupEvent', function (data) {
        console.log ("deletedMemberInGroupEvent received from server");


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'deleted member from group: '+ data.user.username, user: user };

        }


        ChatService.openNotification(data);




      });

      Socket.on('newMemberInGroupEvent', function (data) {
        console.log ("newMemberInGroupEvent received from server");


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'new member in group: '+ data.user.username, user: user };

        }


        ChatService.openNotification(data);


      });

      Socket.on('newChannelEvent', function (data) {
        console.log ("newChannelEvent received from server: ");
        console.log(data);



        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'new ' + data.channelType +' channel in group: '+ data.channelName, user: user };

        }

        ChatService.openNotification(data);


      });

      Socket.on('deletedChannelEvent', function (data) {
        console.log ("deletedChannelEvent received from server: " + data);
        console.log(data);


        /* Object {groupid: "56f8353bd7e719850b587f1a",
        groupName: "G4",
        channelName: "PU14",
        channelid: "56f840b3d7e719850b587f22",
        channelType: "PUBLIC"}*/


        /* haria notificacion para todos */

        var user = {username :'meanstack'};
        if(data.message == undefined){
          data.message = {text : 'deleted '+ data.channelType +' channel from group: '+ data.channelName, user: user };

        }


        ChatService.openNotification(data);




      });

      Socket.on('editedChannelEvent', function (data) {
        console.log ("editedChannelEvent received from server: ");
        console.log(data);
        /*
        var message = '';
        if (data.channelType == "PUBLIC") {
          message = 'Edited public Channel';
        }
        if (data.channelType == "PRIVATE") {
          message = 'Edited private Channel';
        }
        if (data.channelType == "DIRECT") {
          message = 'Edited direct Channel';
        }
        $scope.addGroupNotification(data,message);
        $scope.addChannelNotification(data,message);
        $scope.$apply();
        */
      });



      /* por usuario, notifica para cualquier evento en cualquier grupo o canal */
      Socket.on('newMessageEvent', function (data) {


        console.log ("newMessageEvent received from server: " );
        console.log("esto vale data: ");
        console.log(data);
        /*
         Object { groupid: "56cb893773da764818ec5df0",
         groupName: "Dessi",
         channelName: "PR7",
         channelid: "56f1a4ca23f4c0aa31a707ac",
         channelType: "PRIVATE",
         message: Object }

         */


        /* llega un mensaje para un canal que es del mismo grupo,
        * pero no es su canal, y de momento
        * solo mostramos notificaciones escritorio para los canales del grupo
        * y cuando no esta mirando */
        if(data.groupid === $scope.tagGroup.id && $scope.window_focus !== true){
          console.log("esta en ese grupo y fuera de la window");

          /* esto habra que cambiarlo cuando sean internal y demas */
          /* esto queda parsearlo para internals */

          ChatService.openNotification(data);

        }



        /* estas notificaciones son numericas, no hay que cambiar nada para el newmessagedeGithub*/


        /* si estamos = grupo e = canal,
         * que el del mensaje,
         * no hacemos nada
         * */

        console.log("esto no funciona??");
        console.log("data.groupid");
        console.log(data.groupid);
        console.log("data.channelid");
        console.log($scope.tagChannel.id);
        if(data.groupid === $scope.tagGroup.id && data.channelid === $scope.tagChannel.id){
          console.log("No hay que actualizar nada");

        }
        else {
          /* grupo y canal en general */
          updateGeneralNotifications(data);


          /* grupo y canales concreto */
          /* habria que mirar para mensajes directos, ahora esta con $scope.groups[x].directChannels[y].notificationsCount
          * esto medio falta */
          if($scope.groups !== undefined){
            updateConcreteNotifications(data);

          }

          /* actualizar scope (solo canal cambia) y solo si estamos en el mismo grupo */
          /* $scope.directChannels[y].notificationsCount, para el $scope actual */
          if(data.groupid === $scope.tagGroup.id){
            updateScopeNotifications(data);

          }

        }


        $scope.$apply();
      });



      /********** actualizar notificaciones concretas de grupos y canales *********/
      function updateConcreteNotifications ( data ) {

        console.log("esto vale $scope.groups en newmessageevent");
        console.log($scope.groups);

        for( var i = 0; i < $scope.groups.length; i++){

          /* hemos encontrado el grupo */
          /* le añadimos la notificacion */
          if($scope.groups[i].id == data.groupid){


            if($scope.groups[i].notificationsCount !== undefined){
              $scope.groups[i].notificationsCount = $scope.groups[i].notificationsCount +1;


            }
            else{

              $scope.groups[i].notificationsCount = 1;


            }


            /* miramos el tipo del canal,
             para añadir notificaciones en el canal adecuado */

            if(data.channelType  == 'PRIVATE'){

              if($scope.groups[i].privateChannels !== undefined ){
                if($scope.groups[i].privateChannels.length > 0){
                  for(var j = 0; j< $scope.groups[i].privateChannels.length; j++){

                    /* hemos encontrado el canal, le añadimos la notificacion */
                    if($scope.groups[i].privateChannels[j].id == data.channelid){
                      if($scope.groups[i].privateChannels[j].notificationsCount !== undefined){
                        $scope.groups[i].privateChannels[j].notificationsCount = $scope.groups[i].privateChannels[j].notificationsCount + 1;
                      }
                      else{
                        $scope.groups[i].privateChannels[j].notificationsCount = 1;

                      }


                    } /* end han encontrado el canal */

                  } /* end for recorriendo los canales privados */
                 // $scope.$apply();

                } /* tiene canales privados, no es vacio  */


              } /* tiene canales privados, no es undefined  */

            } /* end if el mensaje es private */
            else if(data.channelType  == 'PUBLIC'){

              if($scope.groups[i].publicChannels !== undefined ){

                if($scope.groups[i].publicChannels.length > 0){

                  for(var k = 0; k< $scope.groups[i].publicChannels.length; k++){

                    /* hemos encontrado el canal, le añadimos la notificacion */
                    if($scope.groups[i].publicChannels[k].id == data.channelid){

                      if($scope.groups[i].publicChannels[k].notificationsCount !== undefined){

                        $scope.groups[i].publicChannels[k].notificationsCount = $scope.groups[i].publicChannels[k].notificationsCount + 1;
                      }
                      else{

                        $scope.groups[i].publicChannels[k].notificationsCount = 1;

                      }


                    } /* end han encontrado el canal */

                  } /* end for recorriendo los canales publicos */
                 // $scope.$apply();

                } /* tiene canales publicos, no es vacio  */


              } /* tiene canales publicos, no es undefined  */

            } /* end if el mensaje es private */
            else if(data.channelType  == 'DIRECT'){

              console.log("no sale");
              console.log("esto vale si es directo");
              console.log($scope.groups[i]);

              if($scope.groups[i].directChannels !== undefined ){

                console.log("esto vale si es directo y noundefined");
                console.log($scope.groups[i].directChannels);
                //esto tiene notificationsCount y channelNotificationsCount


                // pueden no ser undefined, pero no estar


                var enc = false;

                if($scope.groups[i].directChannels.length > 0){
                  for(var l = 0; l< $scope.groups[i].directChannels.length; l++){

                    /* hemos encontrado el canal, le añadimos la notificacion */
                    if($scope.groups[i].directChannels[l].id == data.channelid){
                      if($scope.groups[i].directChannels[l].notificationsCount !== undefined){

                        //esto me meta
                        $scope.groups[i].directChannels[l].notificationsCount = $scope.groups[i].directChannels[l].notificationsCount + 1;
                        console.log("esto vale si es directo y noundefined3 las notificaciones");
                        console.log($scope.groups[i].directChannels[l].notificationsCount);

                      }
                      else{
                        $scope.groups[i].directChannels[l].notificationsCount = 1;
                        console.log("esto vale si es directo y noundefined4 = 1");

                      }

                      enc = true;


                    } /* end han encontrado el canal */
                    //si no lo ha encontrado, se lo añadimos



                  } /* end for recorriendo los canales directos */

                  if(!enc){


                      if(data.message.user.id !== $localStorage.id){
                        $scope.groups[i].directChannels.push({
                          id: data.channelid,
                          channelName: data.channelName,
                          channelType: data.channelType,
                          user: data.message.user,

                          /* los inicializa */
                          notificationsCount: 1
                        });

                      }

                  }



                 // $scope.$apply();

                } /* tiene canales directos, no es vacio  */


              } /* end if tiene canales directos, no es undefined  */
              else {

/*
                Object { groupid: "56cb893773da764818ec5df0",
                  groupName: "Dessi",
                  channelName: "PR7",
                  channelid: "56f1a4ca23f4c0aa31a707ac",
                  channelType: "PRIVATE",
                  message: Object }

              */


                $scope.groups[i].directChannels = [];


                if(data.message.user.id !== $localStorage.id){
                  $scope.groups[i].directChannels.push({
                    id: data.channelid,
                    channelName: data.channelName,
                    channelType: data.channelType,
                    user: data.message.user,

                    /* los inicializa */
                    notificationsCount: 1
                  });

                }

              } /* end else, canales directos son undefined */


            } /* end if el mensaje es direct */


          } /* end el grupo que estamos recorriendo coincide con el grupo del mensaje */

        } /* nos recorremos los grupos */
       // $scope.$apply();

      }





      /********** actualizar notificaciones globales de grupos y canales *************/
      function updateGeneralNotifications (data) {

        /* grupo general */
        if($scope.groupsNotificationsCount !== undefined){
          $scope.groupsNotificationsCount = $scope.groupsNotificationsCount +1;


        }
        else{
          $scope.groupsNotificationsCount = 1;

        }

        /* canales en general, de momento solo publicos y privados */
        /* miramos si es directo, entonces va a parte */


        /*
         Object { groupid: "56cb893773da764818ec5df0",
         groupName: "Dessi",
         channelName: "PR7",
         channelid: "56f1a4ca23f4c0aa31a707ac",
         channelType: "PRIVATE",
         message: Object }

         */

        if(data.channelType == 'DIRECT'){


          if($scope.directChannelsNotificationsCount !== undefined){
            $scope.directChannelsNotificationsCount = $scope.directChannelsNotificationsCount +1;


          }
          else{
            $scope.directChannelsNotificationsCount = 1;

          }


        }
        else {

          if($scope.channelsNotificationsCount !== undefined){
            $scope.channelsNotificationsCount = $scope.channelsNotificationsCount +1;


          }
          else{
            $scope.channelsNotificationsCount = 1;

          }

        }



      }




      /******** actualizar scope de notificaciones ***************/
      function updateScopeNotifications ( data ) {


        if (data.channelType == 'PRIVATE') {
          console.log("data.channelType  == 'PRIVATE'");


          if ($scope.privateChannels !== undefined) {
            if ($scope.privateChannels.length > 0) {


              for (var x = 0; x < $scope.privateChannels.length; x++) {


                /* hemos encontrado el canal, le añadimos la notificacion */
                if ($scope.privateChannels[x].id == data.channelid) {

                  if ($scope.privateChannels[x].notificationsCount !== undefined) {
                    $scope.privateChannels[x].notificationsCount = $scope.privateChannels[x].notificationsCount + 1;
                  }
                  else {
                    $scope.privateChannels[x].notificationsCount = 1;

                  }

                }/* end han encontrado el canal */

              }/* end for recorriendo los canales privados */

             // $scope.$apply();

            }/* tiene canales privados, no es vacio  */

          }/* tiene canales privados, no es undefined  */

        } /* end if el mensaje es private */
        else if (data.channelType == 'PUBLIC') {


          if ($scope.publicChannels !== undefined) {
            if ($scope.publicChannels.length > 0) {
              for (var z = 0; z < $scope.publicChannels.length; z++) {

                /* hemos encontrado el canal, le añadimos la notificacion */
                if ($scope.publicChannels[z].id == data.channelid) {
                  if ($scope.publicChannels[z].notificationsCount !== undefined) {
                    $scope.publicChannels[z].notificationsCount = $scope.publicChannels[z].notificationsCount + 1;
                  }
                  else {
                    $scope.publicChannels[z].notificationsCount = 1;

                  }

                }/* end han encontrado el canal */

              }/* end for recorriendo los canales public */

             // $scope.$apply();

            }/* tiene canales public, no es vacio  */

          }/* tiene canales public, no es undefined  */

        } /* end if el mensaje es public */
        else if (data.channelType == 'DIRECT') {



          if ($scope.members !== undefined) {
            if ($scope.members.length > 0) {

              /* nos lo recorremos por cada usuario */
              for (var y = 0; y < $scope.members.length; y++) {
                /*console.log("entra IZAS3");
                console.log("esto vale data, hay que mirar si tiene users");
                console.log($scope.members);
                console.log(data.message.user);*/

                /* hemos encontrado el canal, le añadimos la notificacion */
                if(data.message.user !== undefined){

                  //for(var w = 0;w < data.message.user.length; w++){
                    console.log("entra IZAS4");
                    if ($scope.members[y].id == data.message.user.id) {
                      if($scope.members[y].notificationsCount !==undefined){
                        $scope.members[y].notificationsCount = $scope.members[y].notificationsCount + 1;


                      }
                      else{
                        console.log("entra IZAS5");
                        $scope.members[y].notificationsCount = 1;
                        console.log($scope.members[y]);

                      }


                    }

                  //}

                }
                /* end han encontrado el canal */

              }
              /* end for recorriendo los canales public */
              //$scope.$apply();

            }/* tiene canales public, no es vacio  */

          }/* tiene canales public, no es undefined  */

        }/* end if el mensaje es direct */

      }

      /********* end updateScopeNotifications **********/


      /* esto esta como 1 mensaje, no hay que notificar */
      Socket.on('newMemberInChannelEvent', function (data) {
        console.log ("newMemberInChannelEvent received from server");

      });


      /* esta como un mensaje, no hay que notificar */
      Socket.on('deletedMemberInChannelEvent', function (data) {
        console.log ("deletedMemberInChannelEvent received from server");

      });


    }]);
