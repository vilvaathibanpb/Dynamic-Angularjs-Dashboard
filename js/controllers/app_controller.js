
var app = angular.module("dashboard_app", ['chart.js']);
app.controller("dashboard_controller", ['$scope','$window','$http', function ($scope,$window,$http) {
  $scope.fetchedData={};
  $scope.generatedLabels=[];
  $scope.modifiedSeries=[];
  $scope.SORT1_xAxis=[];
  $scope.SORT2_xAxis=[];
  $scope.SORT3_xAxis=[];
  $scope.SORT1_yAxis=[];
  $scope.SORT2_yAxis=[];
  $scope.SORT3_yAxis=[];
  $scope.Default_xAxis=[];
  $scope.allDates=[];
  
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  
  $scope.updateStartDate=function($newDate){
    $scope.startDate=$newDate;
  }
  $scope.updateEndDate=function($newDate){
    $scope.endDate=$newDate;
  }
  $scope.$watchGroup(['startDate', 'endDate'], function(newValues, oldValues, scope) {
      //checking callback when these start and end date are modified.
  });

  $http({method: 'GET', url: 'data.json'}).then(function(graphdata) {
        $scope.fetchedData=graphdata.data;
        for(var sortingmethods in $scope.fetchedData){
            for(var sortOptions in $scope.fetchedData[sortingmethods].Sortoption){
              for(var graphdata in $scope.fetchedData[sortingmethods].Sortoption[sortOptions].graphDetails){
                  $scope.single={};
                  $scope.single.date=$scope.fetchedData[sortingmethods].Sortoption[sortOptions].graphDetails[graphdata].date;
                  $scope.single.count=$scope.fetchedData[sortingmethods].Sortoption[sortOptions].graphDetails[graphdata].count;
                  $scope.allDates.push($scope.single);
              }
            }
          }
          
          $scope.allDates=$scope.removeDuplicatesBy(x => x.date, $scope.allDates);
          $scope.allDates.sort(function(a,b){
            var c = new Date(a.date);
            var d = new Date(b.date);
            return c-d;
          });
          $defaultData=[];
          for(var points in $scope.allDates){
              $defaultData.push($scope.allDates[points].count);
              var formatteddate=new Date($scope.allDates[points].date);
              var newDate=monthNames[formatteddate.getMonth()]+" "+formatteddate.getDate();
              $scope.Default_xAxis.push(newDate);
            }

  },function(error){
    console.log(error);
  });

  $scope.changeFirst=function($firstelement){
      $scope.modifiedSeries[0]=$firstelement.name;
      $scope.modifiedSort1=$scope.removeDuplicatesBy(x => x.date, $firstelement.graphDetails);
      $scope.modifiedSort1.sort(function(a,b){
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c-d;
      });
      $tempData=[];
      for(var index in $scope.allDates){
          $tempData[index]=0;
          for( var childindex in $scope.modifiedSort1){
            if($scope.allDates[index].date == $scope.modifiedSort1[childindex].date){
                $tempData[index]=$scope.allDates[index].count;
            } 
          }
      }
      $scope.data[0]=$tempData;
      // $scope.combineDates($scope.modifiedSort1,$scope.modifiedSort2,$scope.modifiedSort3);
  }
  $scope.changeSecond=function($secondelement){
      $scope.modifiedSeries[1]=$secondelement.name;
      $scope.modifiedSort2=$scope.removeDuplicatesBy(x => x.date, $secondelement.graphDetails);
      $scope.modifiedSort2.sort(function(a,b){
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c-d;
      });
      $tempData=[];
      for(var index in $scope.allDates){
          $tempData[index]=0;
          for( var childindex in $scope.modifiedSort2){
            if($scope.allDates[index].date==$scope.modifiedSort2[childindex].date){
                $tempData[index]=$scope.allDates[index].count;
            } 
          }
      }
      console.log($tempData);
      $scope.data[1]=$tempData;
      // $scope.combineDates($scope.modifiedSort1,$scope.modifiedSort2,$scope.modifiedSort3);
  }
  $scope.changeThird=function($thirdelement){
    $scope.modifiedSeries[2]=$thirdelement.name;
    $scope.modifiedSort3=$scope.removeDuplicatesBy(x => x.date, $thirdelement.graphDetails);
    $scope.modifiedSort3.sort(function(a,b){
      var c = new Date(a.date);
      var d = new Date(b.date);
      return c-d;
    });
    $tempData=[];
    for(var index in $scope.allDates){
        $tempData[index]=0;
        for( var childindex in $scope.modifiedSort3){
          if($scope.allDates[index].date==$scope.modifiedSort3[childindex].date){
              $tempData[index]=$scope.allDates[index].count;
          } 
        }
    }
    console.log($tempData);
    $scope.data[2]=$tempData;
    // $scope.combineDates($scope.modifiedSort1,$scope.modifiedSort2,$scope.modifiedSort3);
  }
  $scope.combineDates=function(x,y,z){
      d=[];
      x.concat(y,z).forEach(item =>{
        if (d.indexOf(item) == -1) 
          d.push(item); 
      });
      console.log(d);
      d.sort(function(a,b){
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c-d;
      });
      $scope.Default_xAxis=d;
  }
 
 
  function diff(obj1, obj2) {
    var result = {};
    $.each(obj1, function (key, value) {
        if (!obj2.hasOwnProperty(key) || obj2[key] !== obj1[key]) {
            result[key] = value;
        }
    });

    return result;
}
 
 
  $scope.removeDuplicatesBy=function(keyFn, array) {
    var mySet = new Set();
    return array.filter(function(x) {
      var key = keyFn(x), isNew = !mySet.has(key);
      if (isNew) mySet.add(key);
      return isNew;
    });
  }
//////////////////////////////////////////////////////////////         Charts   //////////////////////////////////////////////////////////
  
  $scope.labels = $scope.Default_xAxis;
  $scope.series = $scope.modifiedSeries;
  $scope.data = [
    $scope.SORT1_yAxis,
    $scope.SORT2_yAxis,
    $scope.SORT3_yAxis
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };



}]);